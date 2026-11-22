import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, ShieldAlert, Award } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border-default)] pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--orange-tint-80)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] text-xs font-semibold">
            <Scale className="w-4 h-4" />
            <span>Operational Service Guidelines</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">
            Terms of Service
          </h1>
          <p className="text-sm font-ui text-[var(--text-secondary)]">
            Effective Date: November 2026 | Last Updated: November 22, 2026
          </p>
        </div>

        {/* Legal Advisory Banner */}
        <div className="p-4 rounded-[12px] bg-[var(--card-bg)] border border-[var(--border-default)] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--orange)] shrink-0 mt-0.5" />
          <p className="text-xs font-ui text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Notice:</strong> These terms govern your authorized use of the Nodal-Connector web platform and related application services. This document represents a standard operational framework and does not constitute formal legal counsel.
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />
            1. Agreement to Terms
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            By creating an account, browsing public pages, or utilizing the Nodal-Connector platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must discontinue using the platform immediately.
          </p>
        </section>

        {/* Section 2: Account Responsibilities & Zero Fake Data */}
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--blue)]" />
            2. Authentic Representation & Zero Fake Data Policy
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            Nodal-Connector is dedicated to authentic talent matching and credible academic collaboration. All users must agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs font-ui text-[var(--text-secondary)]">
            <li>Provide truthful, verifiable identity information during registration and role verification.</li>
            <li>Upload genuine educational records, portfolios, and professional resumes without fabrication.</li>
            <li>Maintain confidentiality of login credentials and immediately report any unauthorized access.</li>
            <li>Accept that synthetic, falsified, or deceptive credentials will lead to immediate account suspension and credential revocation.</li>
          </ul>
        </section>

        {/* Section 3: Prohibited Use */}
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[var(--color-error)]" />
            3. Prohibited Conduct & Platform Integrity
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            Users agree not to engage in any activity that compromises the operational security or stability of Nodal-Connector, including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-ui text-[var(--text-secondary)]">
            <div className="p-3 rounded-[8px] bg-[var(--card-bg)] border border-[var(--border-default)]">
              <strong>Automated Scraping:</strong> Deploying bots, crawlers, or scrapers without express written authorization.
            </div>
            <div className="p-3 rounded-[8px] bg-[var(--card-bg)] border border-[var(--border-default)]">
              <strong>Security Interference:</strong> Attempting to probe, scan, or breach system vulnerabilities or bypass rate limits.
            </div>
            <div className="p-3 rounded-[8px] bg-[var(--card-bg)] border border-[var(--border-default)]">
              <strong>Malicious Uploads:</strong> Submitting files containing viruses, Trojan scripts, or malicious macro-enabled payloads.
            </div>
            <div className="p-3 rounded-[8px] bg-[var(--card-bg)] border border-[var(--border-default)]">
              <strong>Impersonation:</strong> Falsely representing affiliation with any university, corporate recruiter, or governmental body.
            </div>
          </div>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">
            4. Service Availability & Limitation of Liability
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            The platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While Nodal-Connector employs industry-standard uptime practices and security safeguards, we make no warranties that service will be uninterrupted or error-free. In no event shall Nodal-Connector or its maintainers be liable for indirect, incidental, or consequential damages arising from service interruption or third-party recruitment outcomes.
          </p>
        </section>

        {/* Section 5: Governing Law */}
        <section className="space-y-3 border-t border-[var(--border-default)] pt-6">
          <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">
            5. Governing Law & Jurisdiction
          </h2>
          <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
            These Terms are governed by and construed under the laws of the Republic of India. Inquiries regarding terms enforcement may be directed to terms@nodalconnector.in.
          </p>
        </section>

      </div>
    </div>
  );
};
