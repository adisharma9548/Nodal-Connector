# What Changed: Pre-Launch Remediation Summary

This document explains every modification made to the Nodal-Connector codebase during the pre-launch audit and cleanup process.

---

## 1. Security & Protection Enhancements

| Feature / Area | Before Pre-Launch Audit | After Pre-Launch Remediation | Impact & Protection |
| :--- | :--- | :--- | :--- |
| **Resume Access Control [SEC-002]** | Any authenticated user could download any candidate's resume by guessing the ID. | Strict validation: only the candidate themselves, platform admins, or recruiters with active applications can view. | Eliminates Broken Object-Level Authorization (BOLA). |
| **File Upload Validation [SEC-005]** | System relied solely on user-provided file extension and MIME header. | Two-stage check: file extension plus deep magic-byte inspection of file header (%PDF, \xFF\xD8\xFF, \x89PNG). | Blocks malicious polyglot scripts disguised as documents. |
| **CSV Applicant Exports [SEC-008]** | Candidate names and skills were exported directly into CSV without escaping. | All formula triggers (`=`, `+`, `-`, `@`, `\t`, `\r`) are prepended with a single quote (`'`). | Neutralizes Excel / spreadsheet CSV formula injection attacks. |
| **Login Brute-Force [SEC-010]** | Basic IP rate limits were present, but individual accounts could be attacked across multiple IPs. | Progressive account-level lockout: account locks for 15 minutes after 5 consecutive failed logins. | Thwarts distributed credential stuffing botnets. |
| **Assessment Timers [SEC-011]** | Test completion times were calculated client-side in the browser. | Completion duration is anchored strictly to server-side database start timestamps; impossible durations rejected. | Prevents exam clock tampering and score falsification. |
| **Token Invalidation [SEC-004]** | JWT tokens remained valid for full 24 hours even if the user changed their password. | Passwords track `passwordChangedAt`; tokens issued before a password reset are instantly rejected. | Protects against session hijacking after account recovery. |

---

## 2. Data Authenticity & Zero Fake Data Policy

| Area | Before Pre-Launch Audit | After Pre-Launch Remediation |
| :--- | :--- | :--- |
| **Database Seeding [FIX-001]** | `seedDatabase.ts` could be run in any environment, creating synthetic applicants and risking data wipes. | Guarded with strict `NODE_ENV === 'production'` check; halts immediately if run in production. |
| **README Documentation [FIX-002]** | README contained a table of demo accounts, plain text passwords, and sample login credentials. | All demo credentials purged; replaced with production architecture and environment setup instructions. |
| **Corporate Claims [FIX-005]** | Homepage hero section referenced trademarked third-party corporations ("TCS", "Infosys"). | Neutralized to generic, authentic industry categories ("Enterprise IT & Consulting", "Global Technology Services"). |
| **Placeholder Domains [FIX-008]** | Inconsistent fallback domains (`@ayushportal.in`, `@example.com`) across controllers and UI. | Standardized across all controllers and UI inputs to `@nodalconnector.in`. |
| **Automated Verification** | No verification existed to prevent engineers from committing mock data. | Added `scripts/check-no-fake-data.js` and `npm run check:fake-data`, auditing 192 source files for 0 violations. |

---

## 3. Infrastructure & Dependencies

| Layer | Before Pre-Launch Audit | After Pre-Launch Remediation |
| :--- | :--- | :--- |
| **Node.js Runtime** | Unpinned or flexible runtime specifications across packages. | Standardized on modern LTS Node 24 (`>=24.0.0`) across `.nvmrc`, `.npmrc`, and all `package.json` manifests. |
| **Dependency Vulnerabilities** | Transitive Denial-of-Service [DoS] vulnerability present in server `qs` dependency. | Patched via clean audit resolution; server now reports 0 production vulnerabilities. |
| **Build Stability** | TypeScript compile errors in email service when running in headless dev environments. | Resolved transporter caching and safe development logging; both client and server build cleanly with zero errors. |

---

## 4. Repository Health, SEO & CI/CD

| Feature | Implementation | Purpose |
| :--- | :--- | :--- |
| **Continuous Integration** | `.github/workflows/ci.yml` | Automatically installs dependencies, runs zero fake data checks, and builds client/server on every pull request. |
| **Automated Dependency Updates** | `.github/dependabot.yml` | Weekly automated vulnerability scanning and security pull requests for npm packages and GitHub Actions. |
| **Code Ownership** | `.github/CODEOWNERS` | Designates project maintainer (`@adisharma9548`) for all repository code reviews. |
| **Search Engine Directives** | `client/public/robots.txt` & `sitemap.xml` | Guides search engine crawlers to public discovery pages while disallowing indexing of private dashboard panels. |
| **Vulnerability Reporting** | `client/public/.well-known/security.txt` | Standardized RFC 9116 security contact file for white-hat security researchers. |

---

## 5. Legal Compliance & User Privacy

| Feature | Details | Purpose |
| :--- | :--- | :--- |
| **Privacy Policy Page** | Added `/privacy` route & `PrivacyPage.tsx` | Details data collection, DPDP Act 2023 compliance, retention schedules, and user rights. |
| **Terms of Service Page** | Added `/terms` route & `TermsPage.tsx` | Establishes service terms, prohibited conduct, zero fake data policy, and liability boundaries. |
| **Navigation Links** | Updated `Footer.tsx` | Surfaces direct links to Privacy Policy and Terms of Service on every public page. |

---

## 6. Git History & Clean Publishing Copy

- **Problem:** Earlier commits in the repository history exposed personal email addresses (`adisharma9548@gmail.com`) and two SIH competition presentation PDFs (1.2 MB total).
- **Solution:** Created a pristine, isolated repository in `../Nodal-Connector-clean` with all current source code, documentation, and enhancements under a single clean initial commit (`feat: initial release v1.0.0 of NodalConnector`). The user can safely force-push this clean repository to GitHub without exposing past history.
