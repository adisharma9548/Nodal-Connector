# Changelog: Nodal-Connector

All notable changes to the Nodal-Connector platform are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-22

### Added
- **Broken Object-Level Authorization (BOLA) Defenses [SEC-002]:** Enforced authorization in `resumeController.ts` verifying that recruiters can only download resumes for candidates who actively submitted applications to their open requisitions.
- **Deep Magic-Byte File Inspection [SEC-005]:** Added `validateUploadedBuffer()` middleware in `upload.ts` inspecting the first 16 bytes of uploaded files to block malicious polyglots and scripts disguised as PDFs or images.
- **CSV Formula Injection Neutralization [SEC-008]:** Added `sanitizeCsvValue()` in `analyticsController.ts` prepending single quotes to formula trigger characters (`=`, `+`, `-`, `@`, `\t`, `\r`) during spreadsheet exports.
- **Account-Level Progressive Lockout [SEC-010]:** Implemented 15-minute account lockouts in `authController.ts` upon 5 consecutive failed login attempts, mitigating distributed botnet credential stuffing.
- **Server-Anchored Assessment Timers [SEC-011]:** Enforced server-side database start timestamps in `assessmentController.ts` to invalidate client clock tampering and reject sessions over 3 hours.
- **JWT Instant Revocation Guard [SEC-004]:** Added `passwordChangedAt` timestamp verification in authentication middleware, instantly invalidating active tokens issued prior to a password reset.
- **Zero Fake Data Policy Verification:** Created `scripts/check-no-fake-data.js` and `npm run check:fake-data` validating 192 source files for complete absence of mockups or dummy data.
- **Safe Database Cleanup Utility:** Created `scripts/cleanup-fake-data.js` with default dry-run simulation and strict `--execute` + `CONFIRM_DB_NAME` validation guards.
- **Compliance & Legal Routes:** Implemented `/privacy` (`PrivacyPage.tsx`) covering India DPDP Act 2023 / GDPR requirements and `/terms` (`TermsPage.tsx`) covering zero fake data terms.
- **Continuous Integration & Repository Tooling:** Added `.github/workflows/ci.yml` (automated builds on Node 24), `.github/dependabot.yml` (weekly security updates), and `.github/CODEOWNERS`.
- **Search Engine Discovery & Security Metadata:** Added `client/public/robots.txt`, `sitemap.xml`, and RFC 9116 `.well-known/security.txt`.

### Changed
- **Runtime Standardization:** Upgraded and locked Node.js runtime to `>=24.0.0` across root, client, and server manifests, `.nvmrc`, and `.npmrc`.
- **Trademark Neutralization [FIX-005]:** Replaced third-party corporate mentions ("TCS", "Infosys") in `StageshowProductHero.tsx` with generic, authentic industry sector descriptors.
- **Domain Standardization [FIX-008]:** Replaced fragmented placeholder domains (`@ayushportal.in`, `@example.com`) across controllers and UI with `@nodalconnector.in`.
- **Demo Credential Purge [FIX-002]:** Removed plain-text password tables and demo account credentials from `README.md`.
- **Seeder Safety Guard [FIX-001]:** Added strict `NODE_ENV === 'production'` guard to `server/src/seeds/seedDatabase.ts` preventing accidental production data wiping.

### Security
- **Dependency Vulnerability Remediation:** Patched moderate transitive Denial-of-Service [DoS] vulnerability in `qs` dependency within the server package tree (0 production vulnerabilities remaining).
- **Signed Cloud Storage:** Integrated HMAC-signed expiring URLs for all Cloudinary resume and certificate access.
