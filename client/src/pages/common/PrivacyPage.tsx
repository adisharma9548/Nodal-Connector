import React from 'react';
import { ShieldCheck, Lock, FileText, UserCheck, AlertCircle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border-default)] pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--green-tint-80)] text-[var(--green-text)] dark:text-[var(--green)] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Act 2023 & GDPR Privacy Compliance Standard</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">
            Privacy Policy
          </h1>
          <p className="text-sm font-ui text-[var(--text-secondary)]">
            Effective Date: November 2026 | Last Updated: November 22, 2026
          </p>
        </div>

        {/* Legal Advisory Banner */}
        <div className="p-4 rounded-[12px] bg-[var(--card-bg)] border border-[var(--border-default)] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--orange)] shrink-0 mt-0.5" />
          <p className="text-xs font-ui text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Compliance Template Notice:</strong> This privacy document outlines real-world data collection, processing, and security practices implemented within the Nodal-Connector platform. It serves as an open compliance baseline and operational disclosure, not formal legal counsel.
          </p>
        </div>

        {/* Section 1: Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--blue)]" />
            1. Overview & Platform Purpose
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            Nodal-Connector connects students, job seekers, academic faculties, and industry employers through competency assessment, verifiable portfolios, and structured recruitment workflows. We operate on the principle of data minimization: we only collect personal information strictly required to facilitate academic collaboration, identity verification, and authentic employment matching.
          </p>
        </section>

        {/* Section 2: Data Collected */}
        <section className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[var(--green)]" />
            2. Categories of Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)] space-y-2">
              <h3 className="text-xs font-heading font-semibold text-[var(--text-primary)]">
                Account & Identity Information
              </h3>
              <p className="text-xs font-ui text-[var(--text-secondary)] leading-relaxed">
                Full name, verified email address, cryptographically hashed passwords (using bcrypt with work factor 12), designated role (Student, Job Seeker, Academician, Industry Partner, or Administrator), and institution/company affiliation.
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)] space-y-2">
              <h3 className="text-xs font-heading font-semibold text-[var(--text-primary)]">
                Credentials & Resumes
              </h3>
              <p className="text-xs font-ui text-[var(--text-secondary)] leading-relaxed">
                Uploaded resumes and proof documents (PDF/DOCX format). Uploaded documents are streamed directly into encrypted cloud storage via temporary memory buffers; zero documents are cached on local disk.
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)] space-y-2">
              <h3 className="text-xs font-heading font-semibold text-[var(--text-primary)]">
                Competency & Assessment Telemetry
              </h3>
              <p className="text-xs font-ui text-[var(--text-secondary)] leading-relaxed">
                Diagnostic skill assessment scores, question response selections, target role gap analyses, radar performance charts, and verifiable digital completion credentials.
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)] space-y-2">
              <h3 className="text-xs font-heading font-semibold text-[var(--text-primary)]">
                Security & Verification Logs
              </h3>
              <p className="text-xs font-ui text-[var(--text-secondary)] leading-relaxed">
                Time-based One-Time Password (OTP) verification records (automatically expired after 10 minutes), authentication session tokens, and security audit logs required to detect brute-force attempts.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Data Security */}
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--orange)]" />
            3. Technical & Organizational Security Measures
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            Nodal-Connector enforces defense-in-depth architectural safeguards:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs font-ui text-[var(--text-secondary)]">
            <li><strong>Transport Encryption:</strong> All client-to-server traffic is strictly encrypted using TLS 1.3.</li>
            <li><strong>Password Storage:</strong> Passwords are one-way hashed with bcrypt and per-user cryptographic salts before persistence.</li>
            <li><strong>Document Access Control:</strong> Private resumes and credential proofs are accessible only via time-bounded, HMAC-signed URLs generated dynamically for authorized recruiters or institution staff.</li>
            <li><strong>No Local File Storage:</strong> File uploads use ephemeral memory streaming directly to secured buckets, eliminating unauthorized local filesystem persistence.</li>
            <li><strong>Two-Factor Authentication:</strong> Sensitive roles support email-based OTP multi-factor challenge verification with brute-force rate limits.</li>
          </ul>
        </section>

        {/* Section 4: User Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">
            4. Your Rights Under India DPDP Act 2023 & International Standards
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            In accordance with the Digital Personal Data Protection Act (DPDP Act 2023) of India and applicable international data privacy standards, you maintain the following rights:
          </p>
          <div className="space-y-2 text-xs font-ui text-[var(--text-secondary)]">
            <p><strong>Right to Access:</strong> You may request a complete summary of your personal data processed by Nodal-Connector.</p>
            <p><strong>Right to Correction & Updating:</strong> You may update outdated biographical or educational details directly in your Profile Settings.</p>
            <p><strong>Right to Erasure:</strong> You may submit an account deletion request. Upon confirmation, your personal data, resumes, and assessment logs are permanently expunged.</p>
            <p><strong>Right to Grievance Redressal:</strong> Inquiries and grievance notices may be directed to our Data Protection Officer at privacy@nodalconnector.in.</p>
          </div>
        </section>

        {/* Section 5: Cookies & Storage */}
        <section className="space-y-3 border-t border-[var(--border-default)] pt-6">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">
            5. Cookies & Local Session Storage
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            We use strictly necessary browser storage (JWT session tokens) solely to authenticate users across pages and maintain UI preferences (such as light/dark mode selection). We do not deploy third-party advertising tracking cookies or behavioral surveillance scripts.
          </p>
        </section>

      </div>
    </div>
  );
};
