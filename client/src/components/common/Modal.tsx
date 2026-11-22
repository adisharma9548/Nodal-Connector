import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal dialog positioning trick */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

        <div className={`inline-block w-full ${maxWidthClasses[maxWidth]} p-6 sm:p-7 my-8 text-left align-middle transition-all transform bg-[var(--modal-bg)] shadow-lg rounded-[16px] border border-[var(--modal-border)] relative z-10 animate-in fade-in zoom-in-95 duration-180`}>
          <div className="flex items-start justify-between pb-3.5 mb-4 border-b border-[var(--divider-color)]">
            <div>
              <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-1 font-body">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-[10px] transition-colors cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 text-[var(--text-primary)] font-body text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};
