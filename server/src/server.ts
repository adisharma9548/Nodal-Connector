import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

// Enforce IPv4 in nodemailer shared module so resolveHostname only queries and returns IPv4 addresses
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const shared = require('nodemailer/lib/shared');
  if (shared && shared.networkInterfaces) {
    for (const key of Object.keys(shared.networkInterfaces)) {
      if (Array.isArray(shared.networkInterfaces[key])) {
        shared.networkInterfaces[key] = shared.networkInterfaces[key].filter(
          (i: any) => i.family === 'IPv4' || i.family === 4
        );
      }
    }
  }
} catch {}

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('[CONFIGURATION NOTICE] JWT_SECRET environment variable is missing.');
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    console.error('[FATAL CONFIGURATION ERROR] JWT_SECRET is mandatory in standalone production mode.');
    process.exit(1);
  }
}
if (!process.env.MONGODB_URI) {
  console.warn('[CONFIGURATION NOTICE] MONGODB_URI environment variable is missing.');
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    console.error('[FATAL CONFIGURATION ERROR] MONGODB_URI is mandatory in standalone production mode.');
    process.exit(1);
  }
}

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { initRedis } from './config/redis';
import { initSocketIO } from './services/socketService';
import apiRouter from './routes';
import { errorHandler } from './middleware/error';
import { mongoSanitize } from './middleware/sanitize';
import rateLimit from 'express-rate-limit';

const app = express();
const server = http.createServer(app);

// Trust Railway/Render/Vercel reverse proxies so express-rate-limit can identify real client IPs
// via X-Forwarded-For header. Trust immediate 1 hop proxy to prevent ERR_ERL_PERMISSIVE_TRUST_PROXY.
app.set('trust proxy', 1);

// 1. Security & Logging Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "https:", "wss:", "ws:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    xContentTypeOptions: true,
    xFrameOptions: { action: 'sameorigin' },
    // OWASP A05: Enforce HTTPS via HSTS, hide Express fingerprinting, strict referrer policy
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    dnsPrefetchControl: { allow: false },
  })
);
app.disable('x-powered-by');

// Permissions-Policy header to restrict high-risk hardware and browser features (OWASP A05)
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(), interest-cohort=()');
  next();
});

const defaultOrigins = [
  'https://app.nodalconnector.com',
  'https://nodalconnector.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://api.nodalconnector.com',
];

const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim().replace(/\/+$/, ''))
  : [];

const frontendUrlOrigin = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL.trim().replace(/\/+$/, '')]
  : [];

const allowedOrigins = Array.from(
  new Set([...defaultOrigins, ...envOrigins, ...frontendUrlOrigin])
).filter(Boolean);

const isProd = process.env.NODE_ENV === 'production';

export const isOriginAllowed = (origin: string): boolean => {
  if (!origin) return true;
  const normalizedOrigin = origin.replace(/\/+$/, '');
  const isOfficialVercel =
    normalizedOrigin === 'https://app.nodalconnector.com' ||
    /^https:\/\/([a-zA-Z0-9_-]+)\.vercel\.app$/.test(normalizedOrigin);
  const isOfficialRailway =
    normalizedOrigin === 'https://api.nodalconnector.com' ||
    /^https:\/\/nodal-connector(-[a-zA-Z0-9_-]+)?\.up\.railway\.app$/.test(normalizedOrigin);

  return (
    allowedOrigins.includes(normalizedOrigin) ||
    isOfficialVercel ||
    isOfficialRailway ||
    !isProd
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (mobile, server-to-server, health check probes)
      if (!origin) return callback(null, true);
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'x-demo-access-code'],
  })
);

// 2. Production Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || req.path.includes('health'),
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
  },
});

// Stricter limiter for login endpoints to defeat credential stuffing and brute force (OWASP A07)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 10 : 25,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    error: {
      code: 'LOGIN_RATE_LIMIT_EXCEEDED',
      message: 'Too many failed login attempts from this IP. Please wait 15 minutes before trying again.',
    },
  },
});

// Stricter limiter for OTP generation endpoints to prevent email/notification flooding (OWASP A04)
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProd ? 5 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    error: {
      code: 'OTP_RATE_LIMIT_EXCEEDED',
      message: 'Too many verification code requests. Please wait an hour before requesting a new code.',
    },
  },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    error: {
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: 'Too many AI generation requests. Please wait a few moments before trying again.',
    },
  },
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth/send-registration-otp', otpLimiter);
app.use('/api/auth/2fa', otpLimiter);
app.use('/api/ai', aiLimiter);
app.use('/api', globalLimiter);

app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize);

// 3. Initialize Real-Time WebSockets
initSocketIO(server);

// 4. Health Check & Root Endpoints (Handles GET & HEAD for Render health checks and uptime probes)
const handleHealthCheck = (_req: express.Request, res: express.Response) => {
  const appName = process.env.APP_NAME?.trim() || 'NodalConnector';
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' :
    dbState === 2 ? 'connecting' :
    dbState === 3 ? 'disconnecting' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    service: `${appName} Backend API`,
    message: `${appName} Backend API is running.`,
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      emailHealth: '/api/health/email',
      apiBase: '/api',
    },
  });
};

app.get(['/', '/health'], handleHealthCheck);
app.head(['/', '/health'], (_req: express.Request, res: express.Response) => {
  res.status(200).end();
});
app.get('/health/email', async (_req: express.Request, res: express.Response) => {
  try {
    const { checkEmailConfig } = await import('./services/emailService');
    const result = await checkEmailConfig();
    const statusCode = result.configured && result.verified ? 200 : result.configured ? 502 : 503;
    res.status(statusCode).json(result);
  } catch (err: any) {
    res.status(500).json({ configured: false, error: err?.message || 'Failed to check email configuration' });
  }
});

// Ensure MongoDB connection is established for serverless/cold-start environments (e.g. Vercel)
app.use(async (_req, _res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (e: any) {
      console.error('[Serverless] DB connection error:', e.message);
    }
  }
  next();
});

// Anti-CSRF Origin Defense for state-changing requests hitting /api (OWASP A01 / A05)
app.use('/api', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const rawOrigin = req.headers.origin || (req.headers.referer ? (() => {
      try {
        return new URL(req.headers.referer).origin;
      } catch {
        return undefined;
      }
    })() : undefined);
    if (rawOrigin && !isOriginAllowed(rawOrigin)) {
      return res.status(403).json({
        error: {
          code: 'CSRF_ORIGIN_DENIED',
          message: 'Cross-origin state-changing request denied by origin policy.',
        },
      });
    }
  }
  next();
});

// Cache-Control defense: Prevent caching of sensitive API responses (OWASP A05)
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// 5. Mount Master API Routes
app.use('/api', apiRouter);

// 6. 404 Handler for undefined routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// 7. Centralized Error Handler
app.use(errorHandler);

// 8. Connect Database & Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await initRedis();

    const appName = process.env.APP_NAME?.trim() || 'NodalConnector';
    // Use the real public URL in production if available (Railway sets RAILWAY_PUBLIC_DOMAIN, Render sets RENDER_EXTERNAL_URL)
    const railwayUrl = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN.trim().replace(/^https?:\/\//, '')}`
      : null;
    const vercelUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.trim().replace(/^https?:\/\//, '')}`
      : null;
    const defaultPublicUrl = isProd
      ? 'https://api.nodalconnector.com'
      : `http://localhost:${PORT}`;
    const publicUrl =
      vercelUrl ||
      process.env.BACKEND_URL?.trim() ||
      railwayUrl ||
      process.env.RENDER_EXTERNAL_URL?.trim() ||
      defaultPublicUrl;
    const wsUrl = publicUrl.replace(/^https?:\/\//, 'wss://').replace(/^http:\/\//, 'ws://');
    server.listen(Number(PORT) || 5000, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`🚀 ${appName} Backend Server running on port ${PORT}`);
      console.log(`📡 Health Check: ${publicUrl}/api/health`);
      console.log(`📧 Email Diagnostics: ${publicUrl}/api/health/email`);
      console.log(`🔗 REST API Base: ${publicUrl}/api`);
      console.log(`🔌 WebSockets: ${wsUrl}`);
      console.log(`=======================================================`);
    });
  } catch (err: any) {
    console.error('Critical server bootstrap error:', err.message);
  }
};

// Start listening only in standalone/container mode (Railway, Docker, Local)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

export default app;
export { app, server };
