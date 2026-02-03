'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
  debounceMs?: number; // 防抖时间，默认300ms
  disabled?: boolean;
}

export function SearchBox({
  value,
  onChange,
  placeholder = '搜索...',
  className,
  onClear,
  debounceMs = 300,
  disabled = false,
}: SearchBoxProps) {
  const [localValue, setLocalValue] = React.useState(value);

  // 防抖更新
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  // 外部值变化时同步本地值
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onClear?.();
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

      {/* Input */}
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full pl-10 pr-4 py-2.5',
          'rounded-lg border-2 border-gray-200',
          'text-sm placeholder:text-gray-400',
          'focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-purple-400'
        )}
      />

      {/* Clear Button */}
      {localValue && !disabled && (
        <button
          onClick={handleClear}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            'transition-colors'
          )}
          aria-label="清除搜索"
          type="button"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
