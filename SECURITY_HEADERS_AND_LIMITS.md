# Security Headers, Limits & Boundary Configurations: Nodal-Connector

This reference document outlines all platform defensive headers, rate limits, size boundaries, and timeout configurations enforced across the Nodal-Connector stack.

---

## 1. HTTP Security Headers

Security headers are injected across all API and page responses via **Helmet** [a security middleware package for Express] and reverse-proxy configurations:

| Header Name | Configured Value | Purpose & Protection |
| :--- | :--- | :--- |
| **Strict-Transport-Security (HSTS)** | `max-age=31536000; includeSubDomains; preload` | Forces browsers to communicate strictly over encrypted HTTPS connections for at least 1 year. |
| **Content-Security-Policy (CSP)** | `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://res.cloudinary.com; connect-src 'self' https: wss:; font-src 'self' https://fonts.gstatic.com; object-src 'none'; frame-ancestors 'none';` | Mitigates Cross-Site Scripting [XSS] and clickjacking by restricting allowed origins for scripts, styles, images, and fonts. |
| **X-Frame-Options** | `DENY` | Prevents the application from being rendered inside an `<iframe>`, neutralizing clickjacking attacks. |
| **X-Content-Type-Options** | `nosniff` | Disables MIME-type sniffing, preventing browsers from executing non-executable files as scripts. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects privacy by stripping query parameters and sensitive URL tokens when navigating to external origins. |
| **Cross-Origin-Opener-Policy (COOP)** | `same-origin` | Isolates the browsing context, preventing external tabs from accessing window properties. |
| **Cross-Origin-Resource-Policy (CORP)** | `same-site` | Restricts resources from being read by unauthorized cross-origin sites. |
| **Permissions-Policy** | `geolocation=(), camera=(), microphone=(), payment=()` | Disables access to sensitive browser hardware APIs unless explicitly requested. |

---

## 2. API Rate Limiting Boundaries

Rate limiting prevents Denial-of-Service [DoS] attacks, credential stuffing, and bot scraping using **express-rate-limit**:

| Endpoint Scope | Request Limit | Time Window | Action on Limit Exceeded |
| :--- | :---: | :---: | :--- |
| **Authentication (/api/auth/login)** | 5 requests | 15 minutes | Returns `HTTP 429 Too Many Requests`; triggers progressive account lockout after 5 failures. |
| **Registration (/api/auth/signup)** | 10 requests | 1 hour | Prevents automated mass-account creation. |
| **OTP Request (/api/auth/send-otp)** | 3 requests | 10 minutes | Mitigates SMS/email flooding and brute-force token generation. |
| **Global API (/api/*)** | 100 requests | 15 minutes | General throttle protecting backend from high-concurrency scraping. |
| **Assessment Submission (/api/assessments/*)** | 10 submissions | 1 hour | Prevents automated submission script spam. |

---

## 3. Payload & Buffer Size Boundaries

Strict input limits prevent memory exhaustion and buffer overflow vulnerabilities:

| Layer / Mechanism | Enforced Limit | Implementation | Protection |
| :--- | :---: | :--- | :--- |
| **JSON Body Parser** | `2 MB` | `express.json({ limit: '2mb' })` | Prevents oversized JSON parsing attacks and memory bloat. |
| **URL-Encoded Body** | `2 MB` | `express.urlencoded({ limit: '2mb', extended: true })` | Protects against nested form payload attacks. |
| **Document File Upload** | `5 MB` | `multer({ limits: { fileSize: 5 * 1024 * 1024 } })` | Restricts resumes and verification PDFs to 5 megabytes. |
| **Magic-Byte Header Check** | First 16 bytes | `validateUploadedBuffer(buffer)` | Inspects binary file header to verify true file type (`%PDF`, `\xFF\xD8\xFF`, `\x89PNG`). |

---

## 4. Timeout & Lifecycle Thresholds

| Operation | Timeout Threshold | Behavior on Timeout |
| :--- | :---: | :--- |
| **Express Request Timeout** | 30 seconds | Closes connection to prevent hung serverless workers. |
| **MongoDB Atlas Connection** | 5,000 ms (5 seconds) | Fails fast with descriptive connection error rather than hanging. |
| **SMTP Handshake (Port 587)** | 6,000 ms (6 seconds) | Attempts automatic port 465 SSL fallback if port 587 is blocked. |
| **Assessment Session Max Time** | 3 hours (180 minutes) | Rejects submission if duration from test start exceeds 3 hours [SEC-011]. |
| **OTP Expiration** | 10 minutes | Database document marked expired and rejected upon verification. |
| **JWT Access Token Expiration** | 24 hours | Requires user to log in again upon token expiration. |
