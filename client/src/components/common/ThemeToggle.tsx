import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeToggle: React.FC<{
  compact?: boolean;
}> = ({ compact = false }) => {
  const { resolvedTheme, toggleTheme, setTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        aria-label="Toggle visual theme"
        className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--orange)] bg-[var(--bg-subtle)] hover:bg-[var(--border-default)] border border-[var(--border-default)] flex items-center justify-center transition-all cursor-pointer shadow-xs outline-none focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)]"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-[var(--orange)] transition-transform duration-200 rotate-0" />
        ) : (
          <Sun className="w-4 h-4 text-[var(--orange)] transition-transform duration-200 rotate-0" />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center p-0.5 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-default)] shadow-xs select-none">
      <button
        onClick={() => setTheme('light')}
        title="Light Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)] ${
          !isDark
            ? 'bg-[var(--card-bg)] text-[var(--orange-text)] shadow-xs border border-[var(--border-default)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-[var(--orange)]" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        title="Dark Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)] ${
          isDark
            ? 'bg-[var(--card-bg)] text-[var(--orange-lighter)] shadow-xs border border-[var(--border-default)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-[var(--orange)]" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
};
