import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[var(--bg-page)]">
          <div className="max-w-lg w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[var(--orange-tint-80)] dark:bg-[rgba(217,119,87,0.2)] border border-[var(--border-default)] flex items-center justify-center text-[var(--orange-text)] dark:text-[var(--orange-lighter)] mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                An unexpected interface error occurred. You can try recovering or return to the main dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[var(--code-bg)] p-3.5 rounded-xl border border-[var(--border-default)] overflow-x-auto text-[11px] font-mono text-[var(--color-error)] max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--btn-primary-text)] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-2.5 px-4 rounded-xl bg-[var(--btn-secondary-bg)] border border-[var(--btn-secondary-border)] text-[var(--btn-secondary-text)] hover:bg-[var(--btn-secondary-hover-bg)] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)]"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
