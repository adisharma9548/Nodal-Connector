# Security Policy: NodalConnector

## 1. Overview & Commitment
Security is paramount to the **NodalConnector** platform. As a multi-role educational and workforce-readiness ecosystem connecting Students, Job Seekers, Academicians, Industry Employers, and Institutional Leaders, we treat the confidentiality, integrity, and availability of our users' academic records, credentials, assessment outcomes, and corporate hiring workflows with the highest priority.

This policy outlines how security researchers, contributors, and users can responsibly report vulnerabilities and how our engineering team remediates identified security issues.

---

## 2. Supported Versions

Security updates and patches are actively maintained and backported for the following releases:

| Version / Branch | Supported          | Security Status                                 |
| :--------------- | :----------------: | :---------------------------------------------- |
| `main`           | :white_check_mark: | Active Production Release Track                 |
| `security-hardening` | :white_check_mark: | Hardening & Pre-launch Verification Candidate   |
| `< 1.0.0`        | :x:                | Deprecated / End-of-Life                        |

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability or suspect an exposure within NodalConnector, please report it privately. **Do not create public GitHub issues or discuss suspected vulnerabilities on public message boards.**

### Designated Reporting Channels
- **Direct Security Email**: `security@nodalconnector.in`
- **Fallback Engineering Contact**: `support@nodalconnector.in` (Subject: `[URGENT-SECURITY-REPORT]`)
- **Vulnerability Disclosure Channel**: Use GitHub Private Vulnerability Reporting on this repository if enabled.

### Information to Include in Your Report
To accelerate validation and triage, please include:
1. **Description**: Clear summary of the vulnerability and its potential impact.
2. **Category / CWE**: e.g., OWASP Top 10 category (A01: Broken Access Control, A03: Injection, A07: Identification and Authentication Failures).
3. **Reproduction Steps**: Step-by-step instructions or non-destructive Proof of Concept (PoC) script demonstrating the issue on a local or sandboxed environment.
4. **Affected Endpoints / Files**: Relevant route, API path, or source file references.
5. **Remediation Suggestions**: Any proposed code fix or configuration change (optional).

---

## 4. Response Timeframes & SLAs

Our engineering and security incident response teams commit to the following turnaround times:

- **Initial Acknowledgment**: Within **24 hours** of submission.
- **Triage & Severity Classification**: Within **72 hours**.
- **Remediation & Patch Deployment**:
  - **Critical (CVSS 9.0–10.0)**: Within **48–72 hours**.
  - **High (CVSS 7.0–8.9)**: Within **7 calendar days**.
  - **Medium / Low (CVSS < 7.0)**: Within **14–30 calendar days** or the subsequent scheduled release sprint.
- **Coordinated Disclosure**: We request a **90-day embargo** from the date of initial report before public disclosure, allowing sufficient time to deploy fixes to all production instances.

---

## 5. Scope & Safe Harbor Guidelines

We consider activities conducted under this policy protected under **Safe Harbor** when performed in good faith:

### Permitted Research
- Localized security testing against self-hosted developer instances of NodalConnector.
- Identifying and reporting authentication bypasses, IDOR / BOLA flaws, rate-limiting deficits, injection vulnerabilities, and CORS/CSP misconfigurations.

### Strictly Prohibited Actions
- Denying service (DoS/DDoS) to production or staging infrastructure.
- Accessing, modifying, exfiltrating, or destroying real user data or corporate partner records.
- Executing social engineering, phishing, or physical attacks against employees, partners, or users.
- Introducing malicious supply-chain packages, malware, backdoors, or cryptominers.

---

## 6. Defensive Architecture Baseline

NodalConnector implements comprehensive multi-layer defenses:
- **Authentication**: Bcrypt password hashing, minimum 8-character complexity, server-side JWT revocation on password rotation, and account-level progressive lockout after 5 consecutive failed attempts.
- **Access Control**: Role-based access control (RBAC), multi-tenant candidate/recruiter isolation, and BOLA-protected resume and applicant downloads.
- **Injection Defenses**: NoSQL query sanitization, parameterized MongoDB ODM queries, context-aware URL protocol validation (`javascript:` / `data:` URI blocking), and CSV formula injection neutralization (`'`).
- **File Upload Security**: Magic-byte binary signature inspection validating PDF, PNG, JPEG, WebP, and DOCX files before cloud persistence.
- **Transport & Headers**: HSTS, strict Content-Security-Policy (CSP), `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: cross-origin`, and `Permissions-Policy`.
