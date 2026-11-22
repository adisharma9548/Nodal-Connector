import app from '../src/server';
import { connectDB } from '../src/config/db';
import mongoose from 'mongoose';

let isConnecting = false;

export default async function handler(req: any, res: any) {
  // Normalize internal Vercel function path if rewritten
  if (req.url && req.url.startsWith('/api/index')) {
    req.url = req.url.replace('/api/index', '/api');
    if (!req.url || req.url === '/api') {
      req.url = '/api/health';
    }
  }

  // Connect to MongoDB Atlas in warm/cold serverless containers if URI is configured
  if (mongoose.connection.readyState === 0 && process.env.MONGODB_URI && !isConnecting) {
    isConnecting = true;
    try {
      await connectDB(2, 500);
    } catch (err: any) {
      console.warn('[Vercel Serverless DB notice]:', err.message);
    } finally {
      isConnecting = false;
    }
  }

  return app(req, res);
}

// Ensure compatibility with both ES Module and CommonJS Vercel runtimes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = handler;
  module.exports.default = handler;
}
