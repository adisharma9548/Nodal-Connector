# Secret & Credential Rotation Checklist

> **CRITICAL SECURITY REQUIREMENT**  
> Prior to switching the GitHub repository to **Public**, every credential below must be rotated [replaced with newly generated keys]. Because the repository was previously pushed to a remote git server, any keys committed in past commits must be treated as permanently exposed.

---

## 1. Credentials Requiring Immediate Rotation

| Service / System | Environment Variable | Location to Rotate | Purpose | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MongoDB Atlas** | `MONGODB_URI` | Atlas Dashboard > Database Access > Users > Edit Password | Primary database authentication string | [ ] Pending Rotation |
| **JWT Signing Key** | `JWT_SECRET` | Backend Hosting Environment Variables (Vercel / Railway) | Cryptographic signature for user authentication tokens | [ ] Pending Rotation |
| **Cloudinary Media** | `CLOUDINARY_API_KEY` | Cloudinary Console > Settings > API Keys | File upload API key | [ ] Pending Rotation |
| **Cloudinary Media** | `CLOUDINARY_API_SECRET` | Cloudinary Console > Settings > API Keys > Generate New Secret | Private key for generating authenticated resume download links | [ ] Pending Rotation |
| **Cloudinary Media** | `CLOUDINARY_CLOUD_NAME` | Cloudinary Console > Dashboard | Cloudinary account identifier | [ ] Pending Rotation |
| **Google Gemini API** | `GEMINI_API_KEY` | Google AI Studio > Get API key > Create New API Key | AI skill extraction & career recommendation engine | [ ] Pending Rotation |
| **Groq AI (Optional)** | `GROQ_API_KEY` | Groq Console > Keys > Create API Key | Accelerated AI inference fallback | [ ] Pending Rotation |
| **Gmail SMTP** | `GMAIL_APP_PASSWORD` | Google Account > Security > 2-Step Verification > App Passwords | Outbound 6-digit OTP email delivery | [ ] Pending Rotation |
| **Gmail Sender** | `GMAIL_USER` | Google Account Profile | Outbound notification sender mailbox | [ ] Verified Masked |
| **Default Admin** | `ADMIN_INITIAL_PASSWORD` | First-time seed script or database admin account | Super-administrator dashboard initial login | [ ] Pending Rotation |

---

## 2. Step-by-Step Rotation Instructions

### A. MongoDB Atlas Database User Password
1. Log into your **MongoDB Atlas** dashboard: [https://cloud.mongodb.com](https://cloud.mongodb.com).
2. Under the left navigation menu, select **Security** > **Database Access**.
3. Locate your database user (e.g., `sih26044` or application user) and click **Edit**.
4. Click **Autogenerate a Secure Password** or enter a new 32-character random string.
5. Click **Copy** and then **Update User**.
6. Update your new connection string in your deployment environment variables:
   ```env
   MONGODB_URI="mongodb+srv://<USERNAME>:<NEW_PASSWORD>@cluster0.xxxx.mongodb.net/nodalconnector?retryWrites=true&w=majority"
   ```
7. *(Recommended)* Navigate to **Security** > **Network Access** and verify that access is restricted to your hosting provider's static IPs or restricted ranges rather than unrestricted 0.0.0.0/0 where feasible.

---

### B. JSON Web Token (JWT) Secret
Generate a cryptographically secure 64-character random hexadecimal key on your machine:
```bash
# Run this command in any terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the generated string and save it into your hosting dashboard as `JWT_SECRET`. Rotating this will automatically log out any active sessions, ensuring zero session hijacking from compromised tokens.

---

### C. Cloudinary Credentials
1. Log into the **Cloudinary Console**: [https://cloudinary.com/console](https://cloudinary.com/console).
2. Click the gear icon (**Settings**) in the top right.
3. Select the **Access Keys** tab.
4. Click **Generate New Key** next to your active API key.
5. In your production hosting environment, update:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. After verifying that resume upload and downloads work, revoke [delete] the old API key in the Cloudinary Console.

---

### D. Google Gemini AI API Key
1. Visit **Google AI Studio**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Click **Create API Key** in a new or existing Google Cloud project.
3. Restrict key usage in Google Cloud Console to the Gemini Developer API.
4. Replace `GEMINI_API_KEY` in your production hosting dashboard.
5. Delete the previously exposed API key from Google AI Studio.

---

### E. Gmail App Password (SMTP Outbound Mail)
1. Go to your **Google Account**: [https://myaccount.google.com](https://myaccount.google.com).
2. Select **Security** from the left panel.
3. Under *How you sign in to Google*, ensure **2-Step Verification** is turned on.
4. Search for or select **App Passwords**.
5. Delete the old App Password previously created for NodalConnector.
6. Create a new App Password named `NodalConnector-Production`.
7. Copy the 16-character code (without spaces) and paste it into `GMAIL_APP_PASSWORD` in your production environment.
8. Test by requesting an OTP on the login or signup page.

---

## 3. Verification Protocol

After rotating all keys:
- [ ] Attempt a new user registration to verify MongoDB write access.
- [ ] Request a login OTP to verify Gmail SMTP dispatch.
- [ ] Upload a test resume in PDF format to verify Cloudinary signed upload and viewing.
- [ ] Perform a diagnostic skill evaluation to verify Gemini API connectivity.
- [ ] Ensure that `server/.env` is NOT tracked by git (`git status` must show no `.env` files).
