# Glossary of Technical & Security Terms: Nodal-Connector

This glossary explains technical terms and security concepts used across the Nodal-Connector audit, codebase, and documentation in plain, simple language.

---

### BOLA (Broken Object-Level Authorization)
A security vulnerability where an application allows a user to access or modify someone else's data simply by changing the ID in the website address or API request. *Example:* A recruiter modifying a resume URL to view a candidate who never applied to their company.

### BCRYPT & Salt
A cryptographic algorithm used to securely store passwords. Instead of storing passwords in plain text, bcrypt converts them into a scrambled string [hash]. A "salt" is a unique random string added to each password before scrambling, ensuring that two users with the same password have completely different scrambled strings.

### CSP (Content Security Policy)
A set of browser security instructions that tells the web browser which scripts, styles, fonts, and images are permitted to load. CSP prevents attackers from injecting malicious scripts into web pages.

### CORS (Cross-Origin Resource Sharing)
A browser security rule that restricts a frontend website hosted on one domain (e.g., `nodalconnector.in`) from interacting with an API hosted on a different domain (e.g., `api.railway.app`) unless explicitly permitted by the backend.

### CSV Formula Injection
A security vulnerability that occurs when user input (such as names or job titles) starts with special characters like `=`, `+`, `-`, or `@`. When exported to a CSV spreadsheet and opened in Microsoft Excel or Google Sheets, the spreadsheet may execute the input as a formula, potentially running unauthorized programs on the user's computer.

### DoS (Denial of Service)
An attack where malicious actors flood a web server with requests to exhaust its memory, CPU, or network capacity, causing the service to become unavailable to legitimate users.

### DPDP Act 2023 (Digital Personal Data Protection Act)
India's comprehensive data privacy legislation enacted in 2023, governing how companies collect, store, process, and protect personal digital data belonging to Indian citizens.

### Environment Variable (.env)
A secure configuration value stored outside the source code on the computer or server running the application. Used for private secrets such as database passwords and API keys so they are never hardcoded into files tracked by git.

### HMAC (Hash-based Message Authentication Code)
A cryptographic signature created using a secret key and a message. In Nodal-Connector, Cloudinary uses HMAC signatures to generate private, expiring download links for resumes so that only authorized users can view them.

### JWT (JSON Web Token)
A compact, cryptographically signed digital passport issued by the backend after a user logs in. The browser includes this token in subsequent requests to prove user identity without requiring a database password lookup every time.

### Magic Bytes
The unique first few bytes at the very beginning of a computer file that definitively identify its true format (e.g., `%PDF` for PDF files, or `\xFF\xD8\xFF` for JPEG images), regardless of what file extension is shown in the filename.

### Monorepo
A software development strategy where code for multiple related projects (such as the frontend `client`, backend `server`, and documentation) is kept in a single unified git repository.

### OTP (One-Time Password)
A temporary 6-digit numeric verification code sent via email or SMS that expires after a short duration (e.g., 10 minutes) and can only be used once.

### Rate Limiting
A defensive mechanism that caps the number of requests a single user or IP address can make to an API within a given timeframe (e.g., limiting login attempts to 5 per 15 minutes to prevent automated password guessing).

### Secret Rotation
The security practice of replacing existing passwords, cryptographic keys, and API tokens with newly generated ones, and invalidating the old ones to prevent unauthorized access if keys were accidentally exposed.

### TTL (Time-To-Live)
A timer attached to a piece of data (such as an OTP verification code or cached college search result) that automatically deletes or invalidates the data once the timer expires.

### Zero Fake Data Policy
An engineering policy guaranteeing that production source code, UI components, and database seed scripts contain zero synthetic mockups, dummy accounts, or fake company claims. The platform shows authentic user data or clean, professional empty states.
