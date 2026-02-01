/**
 * Theme Toggle Component
 *
 * Provides light/dark mode switching with:
 * - System preference detection
 * - Manual theme selection
 * - Theme persistence
 * - Smooth transitions
 */

'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  showLabel?: boolean;
  variant?: 'button' | 'select' | 'menu';
}

export function ThemeToggle({
  theme,
  onThemeChange,
  showLabel = false,
  variant = 'button',
}: ThemeToggleProps) {
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Detect effective theme (considering system preference)
  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveTheme(isDark ? 'dark' : 'light');
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setEffectiveTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  // Handle button variant
  if (variant === 'button') {
    return (
      <button
        onClick={() => {
          const themes: Theme[] = ['light', 'dark', 'system'];
          const currentIndex = themes.indexOf(theme);
          const nextTheme = themes[(currentIndex + 1) % themes.length];
          onThemeChange(nextTheme);
        }}
        className={`p-2 rounded-lg transition-all duration-200 ${
          effectiveTheme === 'dark'
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${showLabel ? 'flex items-center gap-2' : ''}`}
        title={effectiveTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
      >
        {effectiveTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        {showLabel && (
          <span className="text-sm font-medium">
            {theme === 'system' ? 'System' : effectiveTheme}
          </span>
        )}
      </button>
    );
  }

  // Handle select variant
  if (variant === 'select') {
    return (
      <select
        value={theme}
        onChange={(e) => onThemeChange(e.target.value as Theme)}
        className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-gray-100 ${
          effectiveTheme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-100'
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        <option value="light">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" /> Light
          </div>
        </option>
        <option value="dark">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" /> Dark
          </div>
        </option>
        <option value="system">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" /> System
          </div>
        </option>
      </select>
    );
  }

  // Handle menu variant (dropdown)
  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="w-4 h-4" />,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="w-4 h-4" />,
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={`relative inline-block ${
        effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}
    >
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          effectiveTheme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        {effectiveTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        {showLabel && <span className="text-sm font-medium">Theme</span>}
      </button>

      {/* Dropdown menu could be added here - for now using simple approach */}
    </div>
  );
}

// Theme Provider Component for context
import { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load from localStorage or default to system
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workspace:theme') as Theme;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('workspace:theme', newTheme);
    }
  };

  useEffect(() => {
    let finalTheme: 'light' | 'dark';

    if (theme === 'system') {
      finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      finalTheme = theme;
    }

    setEffectiveTheme(finalTheme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using theme
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default ThemeToggle;
