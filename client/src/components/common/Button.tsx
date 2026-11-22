import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-heading font-semibold transition-all duration-180 select-none outline-none focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-[10px]',
    md: 'h-10 px-4 text-xs font-semibold gap-2 rounded-[12px]',
    lg: 'h-11 px-5 text-sm font-semibold gap-2.5 rounded-[12px]',
  };

  const variantClasses = {
    primary:
      'bg-[var(--btn-primary-bg)] !text-[var(--dark)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] disabled:bg-[var(--btn-primary-disabled-bg)] disabled:!text-[var(--btn-primary-disabled-text)] shadow-xs',
    secondary:
      'bg-[var(--btn-secondary-bg)] border border-[var(--border-default)] hover:border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] shadow-xs',
    outline:
      'bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]',
    ghost:
      'bg-[var(--btn-ghost-bg)] text-[var(--btn-ghost-text)] hover:bg-[var(--btn-ghost-hover-bg)] border-transparent',
    danger:
      'bg-[var(--btn-destructive-bg)] text-white hover:bg-[var(--btn-destructive-hover)] shadow-xs',
    link:
      'bg-transparent text-[var(--text-link)] hover:text-[var(--text-link-hover)] hover:underline p-0 h-auto font-medium active:scale-100',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
