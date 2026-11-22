import React from 'react';
import { getStatusBadgeColor } from '../../utils/formatters';

interface BadgeProps {
  status?: string;
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'clay' | 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'slate';
  children?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, children, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  if (status) {
    const config = getStatusBadgeColor(status);
    return (
      <span className={`inline-flex items-center font-semibold rounded-full border border-[var(--border-default)] ${config.bg} ${sizeClass}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80"></span>
        {children || config.text}
      </span>
    );
  }

  const variantMap: Record<string, string> = {
    neutral: 'bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)] border-[var(--border-default)]',
    info: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border-transparent',
    success: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-transparent',
    warning: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-transparent',
    error: 'bg-[var(--badge-error-bg)] text-[var(--badge-error-text)] border-transparent',
    // Aliases mapped strictly to CSS variables
    clay: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-transparent',
    emerald: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-transparent',
    blue: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border-transparent',
    purple: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border-transparent',
    amber: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-transparent',
    rose: 'bg-[var(--badge-error-bg)] text-[var(--badge-error-text)] border-transparent',
    slate: 'bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)] border-[var(--border-default)]',
  };

  const selectedClass = variant ? (variantMap[variant] || variantMap.neutral) : variantMap.neutral;

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${selectedClass} ${sizeClass}`}>
      {children}
    </span>
  );
};
