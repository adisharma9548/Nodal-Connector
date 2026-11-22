import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className = '',
      containerClassName = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-heading font-semibold text-[var(--text-secondary)]"
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-secondary)]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full h-10 py-2 text-xs font-ui font-medium rounded-[10px] border bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--input-disabled-bg)] disabled:text-[var(--input-disabled-text)] hover:border-[var(--input-hover-border)] focus:border-[var(--input-focus-border)] focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)] ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-[var(--input-error-border)] focus:border-[var(--input-error-border)]'
                : 'border-[var(--input-border)]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[var(--text-secondary)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] font-medium text-[var(--color-error)] mt-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
