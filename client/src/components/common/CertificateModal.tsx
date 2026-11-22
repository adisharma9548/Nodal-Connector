import React, { useState } from 'react';
import { Award, CheckCircle2, Copy, ExternalLink, Printer, ShieldCheck, X } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    certificateId: string;
    studentName: string;
    courseTitle: string;
    completedAt?: string | Date;
    institution?: string;
  };
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dateStr = certificate.completedAt
    ? new Date(certificate.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const verifyUrl = `${window.location.origin}/verify/${certificate.certificateId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    verifyUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl bg-[var(--modal-bg)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--modal-border)] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-[var(--dark)] px-6 py-4 flex items-center justify-between text-[var(--light)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--green)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--green)]">
              Enterprise Verified Credential
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--mid)] hover:text-[var(--light)] hover:bg-[var(--border-default)] transition-colors outline-none focus-visible:outline-[var(--focus-ring)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card Preview (Printable Area) */}
        <div className="p-8 sm:p-10 bg-[var(--bg-subtle)]">
          <div className="relative p-6 sm:p-8 rounded-2xl border-2 border-[var(--orange)] bg-[var(--card-bg)] shadow-inner text-center space-y-6">
            {/* Outer Decorative Border Ring */}
            <div className="absolute inset-1.5 border border-dashed border-[var(--border-strong)] rounded-xl pointer-events-none" />

            {/* Emblem / Header */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[var(--orange)] shadow-md flex items-center justify-center text-[var(--dark)]">
                <Award className="w-8 h-8" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--orange-text)] dark:text-[var(--orange-lighter)]">
                NodalConnector Certification Authority
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-serif uppercase">
                Certificate of Competency
              </h2>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                This verified digital credential certifies active mastery and practical defense in the industry course
              </p>
            </div>

            {/* Recipient Details */}
            <div className="space-y-1 py-2">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Proudly Presented To
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-serif border-b-2 border-[var(--orange)] inline-block px-8 pb-1">
                {certificate.studentName}
              </h3>
              {certificate.institution && (
                <p className="text-xs text-[var(--text-secondary)] font-medium pt-1">
                  {certificate.institution}
                </p>
              )}
            </div>

            {/* Course Title */}
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-secondary)] uppercase font-semibold">
                For successfully fulfilling all milestones & technical assessments in
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] rounded-xl py-2 px-4 border border-[var(--border-default)] max-w-xl mx-auto">
                {certificate.courseTitle}
              </h4>
            </div>

            {/* Certificate Footer / QR / Meta */}
            <div className="pt-4 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              {/* QR Code */}
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[var(--card-bg)] rounded-xl border border-[var(--border-default)] shadow-xs">
                  <img
                    src={qrCodeUrl}
                    alt="Certificate QR Verification"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="text-[11px] space-y-0.5">
                  <div className="flex items-center gap-1 text-[var(--green)] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cryptographically Verified</span>
                  </div>
                  <p className="text-[var(--text-secondary)] font-mono text-[10px]">
                    ID: {certificate.certificateId}
                  </p>
                  <p className="text-[var(--text-disabled)] text-[10px]">Issued on {dateStr}</p>
                </div>
              </div>

              {/* Digital Seal */}
              <div className="text-center sm:text-right">
                <div className="inline-block px-3 py-1 rounded-full bg-[var(--green-tint-80)] dark:bg-[rgba(120,140,93,0.2)] border border-[var(--border-default)] text-[var(--green-text-strong)] dark:text-[var(--green-tint-60)] text-[10px] font-bold">
                  NODALCONNECTOR OFFICIAL RECORD
                </div>
                <p className="text-[9px] text-[var(--text-secondary)] mt-1">
                  Tamper-Evident Ledger Entry • Publicly Auditable
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-[var(--bg-subtle)] px-6 py-4 border-t border-[var(--border-default)] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl border border-[var(--btn-secondary-border)] bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover-bg)] text-[var(--btn-secondary-text)] font-bold text-xs flex items-center gap-2 transition-colors outline-none focus-visible:outline-[var(--focus-ring)]"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Verification Link Copied!' : 'Copy Verification URL'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--card-bg)] border border-[var(--border-default)] text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5 transition-colors outline-none focus-visible:outline-[var(--focus-ring)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--btn-primary-text)] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs outline-none focus-visible:outline-[var(--focus-ring)]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify Public Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
