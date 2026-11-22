import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
  debounceMs = 0,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (debounceMs <= 0) return;
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [localValue, debounceMs, onChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (debounceMs <= 0) {
      onChange(val);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-9 text-xs font-medium rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] hover:border-[var(--input-hover-border)] focus:border-[var(--input-focus-border)] focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)] outline-none transition-all"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute right-3 p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
