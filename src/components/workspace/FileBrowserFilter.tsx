/**
 * Enhanced File Browser with Filter - STORY-14-6 Implementation
 *
 * Extends FileBrowser with file type filtering
 *
 * Features:
 * - File tree navigation ✅ (already in FileBrowser)
 * - Folder expand/collapse ✅ (already in FileBrowser)
 * - File icons (100+ extensions) ✅ (already in FileBrowser)
 * - Multi-file selection (checkbox) ✅ (can be added)
 * - Drag and drop file moving ✅ (already in FileBrowser)
 * - File type filter (NEW)
 * - Breadcrumb navigation (NEW)
 */

'use client';

import { useState } from 'react';
import { File, Code, Image as ImageIcon, FileText, Folder, ChevronRight, X } from 'lucide-react';

export interface FileFilter {
  type: 'all' | 'code' | 'markdown' | 'image' | 'document' | 'other';
  label: string;
  extensions: string[];
}

const FILE_FILTERS: FileFilter[] = [
  {
    type: 'all',
    label: 'All Files',
    extensions: [],
  },
  {
    type: 'code',
    label: 'Code',
    extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'mts', 'c', 'cpp', 'h', 'hpp', 'java', 'py', 'go', 'rs', 'php', 'rb', 'cs', 'swift', 'kt', 'dart', 'scala', 'sh', 'bash', 'zsh', 'fish', 'dockerfile', 'sql'],
  },
  {
    type: 'markdown',
    label: 'Markdown',
    extensions: ['md', 'markdown', 'mdx'],
  },
  {
    type: 'image',
    label: 'Images',
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'webp', 'ico'],
  },
  {
    type: 'document',
    label: 'Documents',
    extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv'],
  },
  {
    type: 'other',
    label: 'Other',
    extensions: [],
  },
];

interface FileBrowserFilterProps {
  activeFilter: FileFilter['type'];
  onFilterChange: (filter: FileFilter['type']) => void;
  fileCount?: number;
}

export function FileBrowserFilter({ activeFilter, onFilterChange, fileCount = 0 }: FileBrowserFilterProps) {
  const activeFilterObj = FILE_FILTERS.find((f) => f.type === activeFilter) || FILE_FILTERS[0];

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1">
        {FILE_FILTERS.map((filter) => (
          <button
            key={filter.type}
            onClick={() => onFilterChange(filter.type)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter.type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FilterIcon type={filter.type} />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {fileCount > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </div>
      )}
    </div>
  );
}

function FilterIcon({ type }: { type: FileFilter['type'] }) {
  switch (type) {
    case 'code':
      return <Code className="w-4 h-4" />;
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    case 'markdown':
      return <FileText className="w-4 h-4" />;
    case 'document':
      return <File className="w-4 h-4" />;
    case 'folder':
      return <Folder className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
}

export function getFileFilter(filterType: FileFilter['type']): FileFilter {
  return FILE_FILTERS.find((f) => f.type === filterType) || FILE_FILTERS[0];
}

export function shouldShowFile(fileName: string, filterType: FileFilter['type']): boolean {
  if (filterType === 'all') return true;

  const filter = getFileFilter(filterType);

  // For 'other', show files that don't match any category
  if (filterType === 'other') {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    for (const f of FILE_FILTERS.slice(1, -1)) { // Skip 'all' and 'other'
      if (f.extensions.includes(extension)) {
        return false;
      }
    }
    return true;
  }

  // Check if file extension matches the filter
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return filter.extensions.includes(extension);
}

export function getFileCategory(fileName: string): FileFilter['type'] {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  for (const filter of FILE_FILTERS.slice(1)) { // Skip 'all'
    if (filter.type !== 'other' && filter.extensions.includes(extension)) {
      return filter.type;
    }
  }

  return 'other';
}

interface FileBreadcrumbProps {
  path: string;
  rootPath?: string;
  onNavigate: (path: string) => void;
}

export function FileBreadcrumb({ path, rootPath = '/', onNavigate }: FileBreadcrumbProps) {
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
        <Folder className="w-4 h-4" />
        <span>Home</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm overflow-x-auto">
      {/* Root */}
      <button
        onClick={() => onNavigate(rootPath)}
        className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors max-w-[150px]"
      >
        <Folder className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">Home</span>
      </button>

      {/* Segments */}
      {segments.map((segment, index) => {
        const segmentPath = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;

        return (
          <div key={segmentPath} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => onNavigate(segmentPath)}
              disabled={isLast}
              className={`truncate max-w-[150px] transition-colors ${
                isLast
                  ? 'text-gray-900 dark:text-gray-100 font-medium cursor-default'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {segment}
            </button>
          </div>
        );
      })}
    </div>
  );
}

interface MultiSelectCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function MultiSelectCheckbox({ checked, onChange, disabled }: MultiSelectCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
      className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}
