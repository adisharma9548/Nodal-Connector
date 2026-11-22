# Data Privacy & Governance Notes: Nodal-Connector

---

## 1. Compliance Framework & Scope

Nodal-Connector is designed to comply with the statutory provisions of the **Digital Personal Data Protection Act, 2023 (DPDP Act 2023)** of India and the baseline privacy principles of the **General Data Protection Regulation (GDPR)**.

> **Legal Disclaimer:** This document provides the engineering and operational architecture of data handling practices implemented within Nodal-Connector. It serves as a technical privacy specification and compliance template, not formal legal advice.

---

## 2. Roles & Governance Terminology

- **Data Fiduciary:** The Nodal-Connector platform administration, which determines the purpose and means of processing personal data.
- **Data Principal:** The individual user whose personal data is collected and processed (Students, Job Seekers, Academic Faculty, and Industry Recruiters).
- **Consent Manager / Mechanism:** Transparent electronic notice presented upon registration requiring affirmative user acceptance of data terms.

---

## 3. Data Processing Purpose Specification

In accordance with Section 4 of the DPDP Act 2023, personal data is processed strictly for lawful, explicit purposes:

1. **Identity & Authentication:** Verification of email addresses via one-way hashed OTP codes to prevent spam registration and account takeover.
2. **Competency Evaluation:** Recording diagnostic assessment responses to generate personalized skill gap radar metrics and career roadmaps.
3. **Talent Matchmaking:** Facilitating verified job, internship, and faculty sabbatical applications between candidates and vetted industry employers.
4. **Academic Credential Verification:** Confirming institutional affiliations and digital portfolio credentials.

---

## 4. Data Minimization & Zero Fabrication Standard

Nodal-Connector strictly adheres to data minimization:
- **No Unnecessary Telemetry:** The platform does NOT collect financial payment card details, government identification numbers (such as Aadhaar or PAN), or invasive biometric trackers.
- **No Local Document Persistence:** Resumes and credential proofs are streamed directly into encrypted cloud storage via ephemeral memory buffers. Zero files touch local server disks.
- **Zero Fake Data Policy:** All synthetic records, dummy accounts, and fictitious company claims have been expunged from production source code and seed files.

---

## 5. Data Retention & Lifecycle Matrix

| Data Category | Retention Period | Deletion Mechanism |
| :--- | :--- | :--- |
| **User Account & Profile** | Active account lifespan | Instant hard-deletion upon user account cancellation request |
| **Uploaded Resumes & Proofs** | Until candidate updates or deletes resume | Deleted from Cloudinary storage bucket upon profile removal |
| **One-Time Passwords (OTPs)** | Exactly 10 minutes from generation | Automatic MongoDB TTL [Time-To-Live] index expiration + instant deletion on use |
| **Assessment Attempts & Logs** | Associated with user profile history | Purged upon account deletion |
| **College Discovery Cache** | 24 hours | Automatic MongoDB document TTL index invalidation |

---

## 6. International Data Transfers & Third-Party Processors

Personal data is processed using reputable cloud infrastructure:
1. **MongoDB Atlas (AWS / GCP ap-south-1):** Primary database storage hosted in Indian or regional cloud datacenters.
2. **Cloudinary Media Cloud:** Secure media storage for resume documents. Document access is restricted using time-bounded HMAC signed URLs.
3. **Google Gemini API:** AI-assisted skill parsing and roadmap generation. Text extracted from resumes is processed ephemerally without being used to train generalized foundation models.

---

## 7. Data Principal Rights & Operational Fulfillment

Under India DPDP Act 2023, users maintain statutory rights:

1. **Right to Access Information:** Users can review all personal data stored in their profile via the **Profile Settings** page.
2. **Right to Correction & Updating:** Users can edit biographical details, academic milestones, and skills at any time.
3. **Right to Erasure (Right to be Forgotten):** Users may submit an account deletion request. Upon receipt, all associated database records (User, Resume, Applications, SkillProfile) are permanently purged.
4. **Right of Grievance Redressal:** A designated Data Protection Officer (DPO) oversees privacy inquiries:
   - **Contact Email:** `privacy@nodalconnector.in`
   - **Response Timeline:** Within 7 business days of inquiry submission.
