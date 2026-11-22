# Manual Actions & Setup Guide: Nodal-Connector

> [!IMPORTANT]
> This guide is written in plain, beginner-friendly language. It explains every step requiring your personal account, dashboard access, or credentials that an automated system cannot perform on your behalf.
> **Follow each section in order before making the repository public.**

---

## 1. Step-by-Step Secret Rotation Guide

Because credentials were committed in previous git commits on GitHub, you must rotate [generate brand-new versions of] these keys before releasing publicly:

### A. MongoDB Atlas (5 minutes)
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Click **Database Access** under the **Security** section on the left sidebar.
3. Find your user (e.g., `sih26044`) and click **Edit**.
4. Click **Autogenerate a Secure Password**, copy it to a secure location, and click **Update User**.
5. Update `MONGODB_URI` in your hosting dashboard with the new password.

### B. Generate a Fresh JWT Secret (1 minute)
1. Run this command in any terminal to generate a strong random 64-character signing secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Copy the resulting string and set it as `JWT_SECRET` in your hosting dashboard.

### C. Cloudinary Storage Keys (3 minutes)
1. Log in to [Cloudinary Console](https://cloudinary.com/console).
2. Click the gear icon (**Settings**) in the top right.
3. Select the **Access Keys** tab.
4. Click **Generate New Key**.
5. Copy the new **API Key** and **API Secret** into your hosting dashboard.
6. Once verified, delete the old API key in Cloudinary.

### D. Google Gemini API Key (2 minutes)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Copy the key and set it as `GEMINI_API_KEY` in your hosting dashboard.
4. Revoke the old API key in Google AI Studio.

### E. Gmail App Password (3 minutes)
1. Go to [Google Account Security](https://myaccount.google.com/security).
2. Under *How you sign in to Google*, click on **2-Step Verification**, scroll down and click **App Passwords**.
3. Delete the old password named `NodalConnector`.
4. Create a new one named `NodalConnector-Production`.
5. Copy the 16-letter code (without spaces) and set it as `GMAIL_APP_PASSWORD`.

---

## 2. GitHub Repository Hardening & Safe Publishing (Option B)

Because your remote repository on GitHub contains past commits with your email address and old files, we generated a clean copy in `../Nodal-Connector-clean`.

### How to Publish the Clean Repository
Open your terminal and run these exact commands:
```bash
# Navigate to the clean repository directory:
cd C:\Users\adish\.gemini\antigravity\scratch\Nodal-Connector-clean

# Link to your GitHub remote:
git remote add origin https://github.com/adisharma9548/Nodal-Connector.git

# Ensure the main branch is active:
git branch -M main

# Force-push the clean history to GitHub (this overwrites past history cleanly):
git push -u origin main --force
```

### GitHub Security Settings (2 minutes)
After pushing the clean code:
1. Go to your repository on GitHub: `https://github.com/adisharma9548/Nodal-Connector`.
2. Click **Settings** > **Code security and analysis**:
   - Enable **Dependabot alerts** (Automatically notifies you if an npm library has a security bug).
   - Enable **Dependabot security updates** (Automatically opens pull requests to fix bugs).
   - Enable **Secret scanning** (Alerts you if an API key is accidentally pushed).
3. Click **Settings** > **Branches** > **Add classic branch protection rule**:
   - Branch name pattern: `main`
   - Check **Require a pull request before merging**.
   - Check **Require status checks to pass before merging** (select `build` from GitHub Actions).

---

## 3. Hosting Deployment (Vercel — Recommended for Frontend + Backend)

> [!TIP]
> **Why Vercel is Recommended:**  
> Free tiers of Railway and Render block outbound SMTP ports (587 and 465), preventing OTP verification emails from delivering. Vercel allows outbound SMTP connections and supports both full-stack unified deployment and separate backend deployment.

### Recommended: Unified Full-Stack Vercel Deployment (Frontend + API in 1 Project)
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project** and select your clean GitHub repository (`Nodal-Connector`).
3. Leave **Root Directory** as `./` (the root).
4. **Framework Preset:** Vite
5. In **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `VERCEL` = `1`
   - `MONGODB_URI` = *(your rotated Atlas connection string)*
   - `JWT_SECRET` = *(your generated 64-char string)*
   - `CLOUDINARY_CLOUD_NAME` = *(your Cloudinary name)*
   - `CLOUDINARY_API_KEY` = *(your Cloudinary API key)*
   - `CLOUDINARY_API_SECRET` = *(your Cloudinary API secret)*
   - `GEMINI_API_KEY` = *(your Google AI key)*
   - `GMAIL_USER` = *(your sender email)*
   - `GMAIL_APP_PASSWORD` = *(your 16-letter Gmail app password)*
   - *(Optional for 100% port-free email)* `RESEND_API_KEY` = *(your Resend key)*
6. Click **Deploy**.
   - Your frontend will load on your Vercel URL.
   - Your backend will automatically handle all API requests on `/api/*` on the exact same domain!

### Alternative: Separate Backend Project on Vercel
If you prefer two separate projects:
1. In Vercel, import `Nodal-Connector` and set Root Directory to `server`.
2. Add the environment variables above and deploy to get your backend URL (e.g. `https://nodal-api.vercel.app`).
3. Create a second Vercel project with Root Directory `client` and set `VITE_API_URL=https://nodal-api.vercel.app/api`.

---

## 4. DNS Configuration & Email Authentication

If using a custom domain (such as `nodalconnector.in`), add these DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

### Web Application Records
| Type | Name / Host | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Points your root domain to Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Directs www traffic to Vercel |
| **CNAME** | `api` | `your-backend.up.railway.app` | Points your API subdomain to Railway |

### Email Authentication Records (Prevents OTPs from going to Spam)
| Type | Name / Host | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | Authorizes Google servers to deliver emails on your domain's behalf |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:admin@nodalconnector.in` | Instructs receiving mail servers to quarantine spoofed emails |

---

## 5. Verification Checklist

After completing the steps above:
- [ ] Visit your production website URL.
- [ ] Sign up with a new personal email and confirm you receive the 6-digit OTP code in your inbox.
- [ ] Upload a resume and confirm it displays without errors.
- [ ] Run `npm run check:fake-data` locally to verify 0 fake data remains.
