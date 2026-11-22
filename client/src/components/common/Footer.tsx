import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Mail, School, Sparkle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Overview */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[var(--orange)] flex items-center justify-center text-[var(--dark)] shadow-xs">
                <Sparkles className="w-4 h-4 text-[var(--dark)]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-base text-[var(--text-primary)] tracking-tight">
                    NodalConnector
                  </span>
                  <span className="text-[10px] font-heading font-semibold bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.18)] text-[var(--orange-text)] dark:text-[var(--orange-lighter)] border border-[var(--border-default)] px-1.5 py-0.2 rounded-full">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] font-ui">
                  Talent & Industry Platform
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed max-w-sm">
              Connecting emerging talent with enterprise opportunities through continuous competency evaluation, verified portfolios, and industry mentorship.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-default)] text-[11px] font-heading font-medium text-[var(--text-primary)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)] shrink-0" />
              <span>Verified Enterprise Skill & Placement Network</span>
            </div>
          </div>

          {/* Column 2: Candidate Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Scholars & Talent
            </h4>
            <ul className="space-y-2 text-xs font-ui">
              <li>
                <Link to="/student/assessment" className="hover:text-[var(--text-link)] transition-colors">
                  Diagnostic Skill Testing
                </Link>
              </li>
              <li>
                <Link to="/student/internships" className="hover:text-[var(--text-link)] transition-colors">
                  Stipendiary Internships
                </Link>
              </li>
              <li>
                <Link to="/student/jobs" className="hover:text-[var(--text-link)] transition-colors">
                  Placement Jobs
                </Link>
              </li>
              <li>
                <Link to="/student/target-role" className="hover:text-[var(--text-link)] transition-colors">
                  Career Role Gap Analysis
                </Link>
              </li>
              <li>
                <Link to="/student/resume" className="hover:text-[var(--text-link)] transition-colors">
                  Resume Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate & Institutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Institutions & Enterprise
            </h4>
            <ul className="space-y-2 text-xs font-ui">
              <li>
                <Link to="/college" className="hover:text-[var(--text-link)] transition-colors flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-[var(--green)]" />
                  <span>College Directory</span>
                </Link>
              </li>
              <li>
                <Link to="/industry/post" className="hover:text-[var(--text-link)] transition-colors">
                  Recruiter Opportunity Desk
                </Link>
              </li>
              <li>
                <Link to="/academician/opportunities" className="hover:text-[var(--text-link)] transition-colors">
                  Faculty Sabbatical & FDP
                </Link>
              </li>
              <li>
                <Link to="/institution/dashboard" className="hover:text-[var(--text-link)] transition-colors">
                  Placement Readiness Index
                </Link>
              </li>
              <li>
                <Link to="/verify/NC-REG-2026" className="hover:text-[var(--text-link)] transition-colors">
                  Credential Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Standards & Security
            </h4>
            <div className="space-y-2 text-xs font-ui">
              <p className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Mail className="w-3.5 h-3.5 text-[var(--orange)]" />
                <span>support@nodalconnector.in</span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] font-body leading-normal">
                Strict adherence to transparent data integrity standards and OWASP Top 10 security protocols.
              </p>
              <div className="pt-2 flex flex-col gap-1.5">
                <Link
                  to="/privacy"
                  className="text-[11px] font-ui text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                >
                  Privacy Policy (DPDP / GDPR)
                </Link>
                <Link
                  to="/terms"
                  className="text-[11px] font-ui text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/style-guide"
                  className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-[var(--text-link)] hover:text-[var(--text-link-hover)] mt-1"
                >
                  <Sparkle className="w-3 h-3" />
                  <span>Interactive Design System</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-default)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-secondary)] gap-3 font-ui">
          <p>© 2026 NodalConnector. All rights reserved. Talent & Industry Collaboration Platform.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[var(--text-link)] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[var(--text-link)] transition-colors">Terms</Link>
            <span className="text-[var(--green-text)] dark:text-[var(--green)] font-medium">● WCAG 2.2 AA Compliant</span>
            <span>Zero Data Fabrication</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
