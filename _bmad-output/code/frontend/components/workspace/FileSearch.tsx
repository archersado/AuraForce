/**
 * File Search Component
 *
 * Implements STORY-14-10, STORY-14-14: File Search and Filter
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, X, Filter, File, Folder } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspace-store';

interface FileSearchProps {
  onResultSelect?: (path: string) => void;
  className?: string;
}

export default function FileSearch({ onResultSelect, className = '' }: FileSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'code' | 'markdown' | 'image' | 'pdf'>('all');
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock file data (in production, would come from search API)
  const mockFiles = [
    { name: 'index.tsx', path: '/src/app/page.tsx', type: 'code' },
    { name: 'layout.tsx', path: '/src/app/layout.tsx', type: 'code' },
    { name: 'README.md', path: '/README.md', type: 'markdown' },
    { name: 'Button.tsx', path: '/src/components/Button.tsx', type: 'code' },
    { name: 'logo.png', path: '/public/logo.png', type: 'image' },
    { name: 'design.pdf', path: '/docs/design.pdf', type: 'pdf' },
    { name: 'utils.ts', path: '/src/lib/utils.ts', type: 'code' },
    { name: 'api.ts', path: '/src/lib/api.ts', type: 'code' },
    { name: 'styles.css', path: '/src/styles.css', type: 'code' },
    { name: 'setup.md', path: '/docs/setup.md', type: 'markdown' },
  ];

  const filteredFiles = React.useMemo(() => {
    return mockFiles.filter((file) => {
      const matchesQuery = file.name.toLowerCase().includes(query.toLowerCase()) ||
                         file.path.toLowerCase().includes(query.toLowerCase());
      const matchesType = filterType === 'all' || file.type === filterType;
      return matchesQuery && matchesType;
    });
  }, [query, filterType]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredFiles.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredFiles[selectedIndex]) {
          handleResultClick(filteredFiles[selectedIndex].path);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, filteredFiles, selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredFiles.length]);

  const handleResultClick = (path: string) => {
    onResultSelect?.(path);
    setIsOpen(false);
    setQuery('');
  };

  const filterOptions = [
    { value: 'all', label: 'All Files' },
    { value: 'code', label: 'Code' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'image', label: 'Images' },
    { value: 'pdf', label: 'PDF' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <File className="w-4 h-4 text-blue-500" />;
      case 'markdown':
        return <File className="w-4 h-4 text-purple-500" />;
      case 'image':
        return <File className="w-4 h-4 text-green-500" />;
      case 'pdf':
        return <File className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search files... (Ctrl+P)"
          className="w-full pl-10 pr-16 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
        />

        {/* Filter Button */}
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          onClick={() => setFilterType(filterType === 'all' ? 'code' : 'all')}
        >
          <Filter className={`w-4 h-4 ${filterType !== 'all' ? 'text-blue-500' : 'text-gray-400'}`} />
        </button>

        {/* Clear Button */}
        {query && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            onClick={() => setQuery('')}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      {isOpen && (
        <div className="mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${
                  filterType === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilterType(option.value as any)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && query && filteredFiles.length > 0 && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredFiles.map((file, index) => (
            <button
              key={file.path}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => handleResultClick(file.path)}
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {file.path}
                </div>
              </div>
              <div className="text-xs text-gray-400 capitalize">{file.type}</div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && filteredFiles.length === 0 && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-center">
          <File className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No files found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
