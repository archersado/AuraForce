/**
 * Keyboard Shortcuts Panel Component
 *
 * Displays all available keyboard shortcuts for the workspace editor.
 * Features:
 * - Grouped shortcuts by category
- Search shortcuts
- Customizable shortcuts (future)
- Keyboard hint display
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Keyboard, Command, Search } from 'lucide-react';

// Shortcut types
interface Shortcut {
  id: string;
  category: string;
  label: string;
  description: string;
  keys: string[];
  platform?: 'all' | 'mac' | 'windows' | 'linux';
}

// All workspace shortcuts
const shortcuts: Shortcut[] = [
  // File operations
  {
    id: 'save',
    category: 'File Operations',
    label: 'Save File',
    description: 'Save the current file',
    keys: ['Ctrl', 'S'],
  },
  {
    id: 'save-all',
    category: 'File Operations',
    label: 'Save All',
    description: 'Save all open files',
    keys: ['Ctrl', 'Shift', 'S'],
  },
  {
    id: 'open-file',
    category: 'File Operations',
    label: 'Open File',
    description: 'Open file dialog',
    keys: ['Ctrl', 'O'],
  },
  {
    id: 'close-tab',
    category: 'File Operations',
    label: 'Close Tab',
    description: 'Close current tab',
    keys: ['Ctrl', 'W'],
  },
  {
    id: 'close-all',
    category: 'File Operations',
    label: 'Close All Tabs',
    description: 'Close all tabs',
    keys: ['Ctrl', 'Shift', 'W'],
  },
  {
    id: 'new-file',
    category: 'File Operations',
    label: 'New File',
    description: 'Create new file',
    keys: ['Ctrl', 'N'],
  },

  // Editing
  {
    id: 'undo',
    category: 'Editing',
    label: 'Undo',
    description: 'Undo last action',
    keys: ['Ctrl', 'Z'],
  },
  {
    id: 'redo',
    category: 'Editing',
    label: 'Redo',
    description: 'Redo last undone action',
    keys: ['Ctrl', 'Y'], // Windows/Linux
    'platform': 'windows',
  },
  {
    id: 'redo-mac',
    category: 'Editing',
    label: 'Redo',
    description: 'Redo last undone action',
    keys: ['Cmd', 'Shift', 'Z'],
    'platform': 'mac',
  },
  {
    id: 'cut',
    category: 'Editing',
    label: 'Cut',
    description: 'Cut selected text',
    keys: ['Ctrl', 'X'],
  },
  {
    id: 'copy',
    category: 'Editing',
    label: 'Copy',
    description: 'Copy selected text',
    keys: ['Ctrl', 'C'],
  },
  {
    id: 'paste',
    category: 'Editing',
    label: 'Paste',
    description: 'Paste from clipboard',
    keys: ['Ctrl', 'V'],
  },
  {
    id: 'find',
    category: 'Editing',
    label: 'Find',
    description: 'Find in file',
    keys: ['Ctrl', 'F'],
  },
  {
    id: 'replace',
    category: 'Editing',
    label: 'Replace',
    description: 'Find and replace',
    keys: ['Ctrl', 'H'],
  },
  {
    id: 'comment',
    category: 'Editing',
    label: 'Toggle Comment',
    description: 'Comment or uncomment line(s)',
    keys: ['Ctrl', '/'],
  },

  // Navigation
  {
    id: 'go-to-line',
    category: 'Navigation',
    label: 'Go to Line',
    description: 'Jump to specific line',
    keys: ['Ctrl', 'G'],
  },
  {
    id: 'go-to-file',
    category: 'Navigation',
    label: 'Go to File',
    description: 'Quick file switcher',
    keys: ['Ctrl', 'P'],
  },
  {
    id: 'back',
    category: 'Navigation',
    label: 'Navigate Back',
    description: 'Go back to previous position',
    keys: ['Alt', '←'],
  },
  {
    id: 'forward',
    category: 'Navigation',
    label: 'Navigate Forward',
    description: 'Go forward in navigation history',
    keys: ['Alt', '→'],
  },

  // Workspace
  {
    id: 'toggle-sidebar',
    category: 'Workspace',
    label: 'Toggle Sidebar',
    description: 'Show or hide sidebar',
    keys: ['Ctrl', 'B'],
  },
  {
    id: 'toggle-terminal',
    category: 'Workspace',
    label: 'Toggle Terminal',
    description: 'Show or hide terminal',
    keys: ['Ctrl', '`'],
  },
  {
    id: 'command-palette',
    category: 'Workspace',
    label: 'Command Palette',
    description: 'Open command palette',
    keys: ['Ctrl', 'Shift', 'P'],
  },
  {
    id: 'search-files',
    category: 'Workspace',
    label: 'Search Files',
    description: 'Search all files in workspace',
    keys: ['Ctrl', 'Shift', 'F'],
  },

  // Tabs
  {
    id: 'next-tab',
    category: 'Tabs',
    label: 'Next Tab',
    description: 'Switch to next tab',
    keys: ['Ctrl', 'Tab'],
  },
  {
    id: 'prev-tab',
    category: 'Tabs',
    label: 'Previous Tab',
    description: 'Switch to previous tab',
    keys: ['Ctrl', 'Shift', 'Tab'],
  },
  {
    id: 'switch-tab-1',
    category: 'Tabs',
    label: 'Switch to Tab 1',
    description: 'Switch to first tab',
    keys: ['Alt', '1'],
  },
  {
    id: 'switch-tab-2',
    category: 'Tabs',
    label: 'Switch to Tab 2',
    description: 'Switch to second tab',
    keys: ['Alt', '2'],
  },
  {
    id: 'switch-tab-3',
    category: 'Tabs',
    label: 'Switch to Tab 3',
    description: 'Switch to third tab',
    keys: ['Alt', '3'],
  },
  {
    id: 'switch-tab-4',
    category: 'Tabs',
    label: 'Switch to Tab 4',
    description: 'Switch to fourth tab',
    keys: ['Alt', '4'],
  },
  {
    id: 'switch-tab-5',
    category: 'Tabs',
    label: 'Switch to Tab 5',
    description: 'Switch to fifth tab',
    keys: ['Alt', '5'],
  },
  {
    id: 'switch-tab-6',
    category: 'Tabs',
    label: 'Switch to Tab 6',
    description: 'Switch to sixth tab',
    keys: ['Alt', '6'],
  },
  {
    id: 'switch-tab-7',
    category: 'Tabs',
    label: 'Switch to Tab 7',
    description: 'Switch to seventh tab',
    keys: ['Alt', '7'],
  },
  {
    id: 'switch-tab-8',
    category: 'Tabs',
    label: 'Switch to Tab 8',
    description: 'Switch to eighth tab',
    keys: ['Alt', '8'],
  },
  {
    id: 'switch-tab-9',
    category: 'Tabs',
    label: 'Switch to Tab 9',
    description: 'Switch to ninth tab',
    keys: ['Alt', '9'],
  },

  // View
  {
    id: 'zoom-in',
    category: 'View',
    label: 'Zoom In',
    description: 'Increase font size',
    keys: ['Ctrl', '+'],
  },
  {
    id: 'zoom-out',
    category: 'View',
    label: 'Zoom Out',
    description: 'Decrease font size',
    keys: ['Ctrl', '-'],
  },
  {
    id: 'zoom-reset',
    category: 'View',
    label: 'Reset Zoom',
    description: 'Reset font size to default',
    keys: ['Ctrl', '0'],
  },
  {
    id: 'toggle-word-wrap',
    category: 'View',
    label: 'Toggle Word Wrap',
    description: 'Toggle word wrapping',
    keys: ['Alt', 'Z'],
  },

  // Close dialog
  {
    id: 'close-dialog',
    category: 'Dialogs',
    label: 'Close Dialog',
    description: 'Close any dialog or modal',
    keys: ['Escape'],
  },
];

interface KeyboardShortcutsPanelProps {
  visible: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsPanel({
  visible,
  onClose,
}: KeyboardShortcutsPanelProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(shortcuts.map((s) => s.category)))];

  // Filter shortcuts
  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesSearch =
      searchQuery === '' ||
      shortcut.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.keys.some((key) => key.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || shortcut.category === selectedCategory;

    const matchesPlatform =
      !shortcut.platform ||
      shortcut.platform === 'all' ||
      (shortcut.platform === 'mac' && typeof navigator !== 'undefined' && navigator.platform.includes('Mac')) ||
      ((shortcut.platform === 'windows' || shortcut.platform === 'linux') &&
        typeof navigator !== 'undefined' &&
        !navigator.platform.includes('Mac'));

    return matchesSearch && matchesCategory && matchesPlatform;
  });

  // Handle keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // This would be handled by parent component
      }

      // Escape to close
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                快捷键面板
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredShortcuts.length} 快捷键
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索快捷键..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 min-w-[150px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredShortcuts.length > 0 ? (
            <div className="space-y-6">
              {categories.slice(1).map((category) => {
                const categoryShortcuts = filteredShortcuts.filter(
                  (s) => s.category === category
                );

                if (categoryShortcuts.length === 0) return null;

                return (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {categoryShortcuts.map((shortcut) => (
                        <ShortcutItem key={shortcut.id} shortcut={shortcut} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              没有找到匹配的快捷键
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg text-sm text-gray-600 dark:text-gray-400">
          按 <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl</kbd> +{' '}
          <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd> 打开快捷键面板
        </div>
      </div>
    </div>
  );
}

// Keyboard Item Component
function ShortcutItem({ shortcut }: { shortcut: Shortcut }) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-gray-100 mb-0.5">
          {shortcut.label}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {shortcut.description}
        </div>
      </div>
      <div className="flex items-center gap-1 ml-4">
        {shortcut.keys.map((key, index) => (
          <span key={index} className="flex gap-0.5">
            {index > 0 && <span className="text-gray-400 text-sm">+</span>}
            <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono dark:text-gray-200">
              {key === 'Cmd' ? (
                <Command className="w-3 h-3" />
              ) : key === 'Ctrl' ? (
                '⌃'
              ) : key === 'Shift' ? (
                '⇧'
              ) : key === 'Alt' ? (
                '⌥'
              ) : key === '↑' ? (
                '↑'
              ) : key === '↓' ? (
                '↓'
              ) : key === '←' ? (
                '←'
              ) : key === '→' ? (
                '→'
              ) : (
                key
              )}
            </kbd>
          </span>
        ))}
      </div>
    </div>
  );
}

export default KeyboardShortcutsPanel;
