# Architecture & Audit Decisions Log — Nodal-Connector

This document tracks every major engineering, security, and cleanup decision made during the pre-launch audit. It provides context, justification, risk evaluation, and rollback instructions for each decision.

---

## Decision Index

### [DEC-001] Creation of Safe Backups and Working Branch Isolation
- **Category**: DevSecOps / Safety
- **What**: Created local backup branch `backup/pre-cleanup-2026-11-22`, an external directory clone `../Nodal-Connector-backup-2026-11-22`, and isolated all work on the new branch `prelaunch-cleanup`.
- **Why**: Hard safety rules mandate that work never occurs on `main`, changes must be reversible, and remote history must never be touched directly.
- **Risk Level**: None.
- **Rollback Instructions**: `git checkout main && git branch -D prelaunch-cleanup`. External backup remains available in parent directory.

### [DEC-002] Quarantining Untracked Scratch Files
- **Category**: Repository Hygiene
- **What**: Moved `fake_info_scan.json`, `server/link_dtu.js`, and `server/test_security.js` to `.cleanup-quarantine/` and gitignored the directory.
- **Why**: Prevent temporary test scripts and scan outputs from accidentally being committed to the public open-source repository while preserving them locally if needed.
- **Risk Level**: None.
- **Rollback Instructions**: Move files from `.cleanup-quarantine/` back to their original locations.

### [DEC-003] Clean Repository Publishing Strategy (Option B)
- **Category**: Git History & Exposure Remediation
- **What**: Left the original repository history untouched on local branch `prelaunch-cleanup` and generated an independent, pristine repository in `../Nodal-Connector-clean` containing only current source code and documentation under a single initial commit (`feat: initial release v1.0.0 of NodalConnector`).
- **Why**: The remote repository history contains over 50 commits exposing author email `adisharma9548@gmail.com` and 1.2 MB of competition PDF decks. In-place history rewriting (`git filter-branch` or `filter-repo`) would risk remote branch divergence. Providing a clean copy gives the user complete control to publish cleanly via `git push --force`.
- **Risk Level**: Low.
- **Rollback Instructions**: The user can choose not to push `../Nodal-Connector-clean` and keep the existing remote repository.

### [DEC-004] Zero Fake Data Policy & Automated Verification Guard
- **Category**: Code Quality & Regulatory Authenticity
- **What**: Purged all dummy accounts, lorem ipsum text, test domains, and fictional corporate names from UI components and documentation. Built `scripts/check-no-fake-data.js` and wired it into `package.json` (`npm run check:fake-data`).
- **Why**: Pre-launch requirements prohibit shipping with simulated placeholder data or unverified enterprise claims. The automated script prevents future regressions during CI runs.
- **Risk Level**: None.
- **Rollback Instructions**: Remove `"check:fake-data"` from `package.json` and delete `scripts/check-no-fake-data.js`.

### [DEC-005] Safe Database Cleanup Tooling with Explicit Confirmation
- **Category**: Database Safety
- **What**: Built `scripts/cleanup-fake-data.js` to detect and purge test users, but enforced a strict default DRY-RUN mode. Live execution requires both the `--execute` flag and an explicit `CONFIRM_DB_NAME` environment variable matching the connected database.
- **Why**: Prevents accidental data deletion in shared or production databases.
- **Risk Level**: None.
- **Rollback Instructions**: Delete `scripts/cleanup-fake-data.js`.

### [DEC-006] Statutory Privacy & Terms Routing
- **Category**: Legal & Compliance
- **What**: Implemented `/privacy` (`PrivacyPage.tsx`) and `/terms` (`TermsPage.tsx`) covering India DPDP Act 2023 requirements, user data rights, retention limits, and zero fake data terms.
- **Why**: Publicly facing platforms handling resumes, emails, and student performance data require clear statutory notices and governance disclosures before open-source release.
- **Risk Level**: None.
- **Rollback Instructions**: Remove routes from `App.tsx` and delete `PrivacyPage.tsx` and `TermsPage.tsx`.

### [DEC-007] Node.js Runtime Alignment on LTS v24
- **Category**: Build Stability & Infrastructure
- **What**: Locked `engines` to `>=24.0.0` in root, client, and server manifests, generated `.nvmrc` and `.npmrc` (`save-exact=true`, `engine-strict=true`).
- **Why**: Eliminates subtle environment discrepancies between local developer machines and Vercel/Railway cloud deployment runtimes.
- **Risk Level**: Low.
- **Rollback Instructions**: Revert `package.json` engines and delete `.nvmrc` / `.npmrc`.
