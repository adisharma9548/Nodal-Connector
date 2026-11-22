# Production Deployment Runbook: Nodal-Connector

This guide provides end-to-end instructions for deploying the Nodal-Connector application to production hosting environments.

---

## 1. Architecture Overview

Nodal-Connector is structured as a decoupled monorepo:
1. **Frontend Client:** React 18 single-page application built with Vite and Tailwind CSS. Hosted on **Vercel** [a global serverless frontend platform].
2. **Backend API:** Node.js Express server written in TypeScript. Can be hosted serverless on **Vercel** or containerized on **Railway** / **Render** [long-running cloud server environments].
3. **Database:** Managed **MongoDB Atlas** M0/M10 cluster.
4. **Media Storage:** **Cloudinary** private cloud bucket with expiring HMAC [Hash-based Message Authentication Code] signed download URLs.

---

## 2. Pre-Deployment Prerequisites

Ensure you have completed all rotations listed in [ROTATION_CHECKLIST.md](ROTATION_CHECKLIST.md) before deploying.
Verify builds succeed locally:
```bash
# Check zero fake data policy:
npm run check:fake-data

# Compile client & server:
npm run build:client
npm run build:server
```

---

## 3. Step 1: MongoDB Atlas Setup

1. **Deploy Cluster:**
   - In MongoDB Atlas, create a new cluster in an AWS or GCP region close to your primary audience (e.g., `ap-south-1` Mumbai).
2. **Create Database User:**
   - Go to **Database Access** > **Add New Database User**.
   - Select Password authentication, assign the `readWriteAnyDatabase` role (or custom read/write on the `nodalconnector` database).
3. **Configure IP Access List:**
   - Go to **Network Access** > **Add IP Address**.
   - If deploying to serverless platforms with dynamic IPs (like Vercel), add `0.0.0.0/0` with a strict reminder that authentication is enforced via complex 32-character passwords and TLS 1.3 encryption.
4. **Copy Connection String:**
   - Select **Database** > **Connect** > **Drivers** (Node.js).
   - Format: `mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/nodalconnector?retryWrites=true&w=majority`

---

## 4. Step 2: Backend API Deployment (Vercel Serverless — Recommended)

> [!TIP]
> **Why Vercel is Recommended over Railway / Render Free Tiers:**  
> Free tiers of Railway and Render aggressively block outbound SMTP ports (587 and 465) to mitigate spam, which prevents OTP verification emails from delivering. Vercel Serverless Functions allow outbound connections to ports 587 and 465. Additionally, the platform supports the Resend HTTPS API (Port 443) via `RESEND_API_KEY`, which is completely immune to cloud port filtering.

### Option A: Unified Full-Stack Deployment on Vercel (Easiest — 1 Project)
In this architecture, both the React client and Express API are hosted on the **same single Vercel project**.
- **Root Directory:** `./` (Leave as repo root)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `client/dist`
- **Routing:** Handled automatically by `vercel.json`:
  - Any request to `/api/*` is executed by the Express Serverless Function at `api/index.ts`.
  - All web page routes are served by the Vite frontend at `client/dist/index.html`.
- **CORS:** Zero cross-origin configuration needed because frontend and API share the exact same domain!

### Option B: Dedicated Backend Project on Vercel (Separate Projects)
If you prefer separate dashboard projects for frontend and backend:
1. In Vercel, click **Add New Project** and select `Nodal-Connector`.
2. Set **Root Directory** to `server`.
3. In **Environment Variables**, add the variables below.
4. Vercel automatically deploys `server/api/index.ts` and maps all routes through `server/vercel.json`.

### Option C: Railway or Render (Paid / Unblocked SMTP Tier)
If using Railway or Render with a paid tier that unblocks outbound SMTP ports 587 and 465:
- Root Directory: `server`
- Build Command: `npm run build`
- Start Command: `npm start`

---

## 5. Production Environment Variables (for Vercel)

Add the following environment variables to your Vercel Project Settings:

```env
# Serverless & Environment
NODE_ENV=production
VERCEL=1

# MongoDB Atlas Database
MONGODB_URI=your_rotated_mongodb_uri

# JWT Authentication
JWT_SECRET=your_generated_64char_jwt_secret

# Cloudinary Media Storage (Resumes & Proofs)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini AI (Skill Extraction & Roadmaps)
GEMINI_API_KEY=your_gemini_api_key

# Email Option 1: Gmail SMTP (Standard)
GMAIL_USER=your_sender_email@gmail.com
GMAIL_APP_PASSWORD=your_16character_gmail_app_password

# Email Option 2: Resend HTTPS API (Recommended for 100% Port-Free Reliability)
# Optional: Set this to bypass all SMTP port filtering via HTTPS port 443
# RESEND_API_KEY=re_123456789
# RESEND_FROM=noreply@nodalconnector.in
```
- The project includes root `vercel.json` routing API requests to `/server/api/index.ts`.
- Set `VERCEL=1` and all environment variables above in the Vercel Project Settings.

---

## 5. Step 3: Frontend Client Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project** > **Import Git Repository**.
3. Select `Nodal-Connector-clean`.
4. Configure Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. In **Environment Variables**, configure:
   ```env
   VITE_API_URL=https://your-backend-domain.up.railway.app/api
   ```
6. Click **Deploy**. Vercel will build and assign an SSL-protected production URL (e.g., `https://nodalconnector.vercel.app`).

---

## 6. Step 4: Custom Domain & DNS Configuration

If configuring a custom domain (e.g., `nodalconnector.in`):

### A. Web Application DNS Records
| Type | Host | Points To / Value | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (root) | `76.76.21.21` (Vercel Anycast IP) | 3600 | Apex website traffic |
| **CNAME** | `www` | `cname.vercel-dns.com.` | 3600 | Subdomain redirect |
| **CNAME** | `api` | `your-backend.up.railway.app` | 3600 | API routing |

### B. Email Deliverability & Anti-Spoofing Records
To ensure OTP emails reach user inboxes without landing in spam folders:

1. **SPF [Sender Policy Framework] Record:**
   - **Type:** `TXT`
   - **Host:** `@`
   - **Value:** `v=spf1 include:_spf.google.com ~all`
2. **DKIM [DomainKeys Identified Mail] Record:**
   - Follow instructions in Google Workspace Admin Console to generate a 2048-bit DKIM TXT record at `google._domainkey.nodalconnector.in`.
3. **DMARC [Domain-based Message Authentication] Record:**
   - **Type:** `TXT`
   - **Host:** `_dmarc`
   - **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@nodalconnector.in; pct=100; adkim=r; aspf=r`

---

## 7. Step 5: Post-Deployment Verification & Smoke Tests

Verify system health immediately following deployment:

1. **Health Check Endpoint:**
   ```bash
   curl -I https://your-backend-domain.up.railway.app/api/health
   # Expected: HTTP/1.1 200 OK
   ```
2. **Security Headers Verification:**
   Verify that modern defense headers are present:
   - `Content-Security-Policy`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
3. **User Flow Validation:**
   - Visit the public landing page: verify fast load and zero console errors.
   - Register a real user account: verify OTP arrives in email inbox within 10 seconds.
   - Log in and verify dashboard loads with clean zero-state cards.
   - Upload a sample PDF resume: verify upload succeeds and viewing generates a signed Cloudinary URL.
