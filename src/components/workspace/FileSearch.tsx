/**
 * File Search Component
 *
 * Provides real-time file search with filters.
 * Supports:
 * - File name search
 * - Type filtering (code, markdown, image, other)
 * - Time filtering (today, week, all)
 * - Result highlighting
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Clock } from 'lucide-react';
import {
  listDirectory,
  type FileInfo,
  isImageFile,
} from '@/lib/workspace/files-service';

export interface FileSearchProps {
  visible: boolean;
  onClose: () => void;
  onResultSelect: (file: FileInfo) => void;
  workspaceRoot?: string;
}

interface SearchResult extends FileInfo {
  matched?: boolean;
  matchRange?: [number, number];
}

export function FileSearch({
  visible,
  onClose,
  onResultSelect,
  workspaceRoot,
}: FileSearchProps) {
  const [query, setQuery] = useState('');
  const [fileType, setFileType] = useState<'all' | 'code' | 'markdown' | 'image' | 'other'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // File type filter function
  const matchesTypeFilter = (file: FileInfo): boolean => {
    if (fileType === 'all') return true;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    switch (fileType) {
      case 'code':
        return ['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html', 'py', 'go'].includes(ext);
      case 'markdown':
        return ['md', 'mdx', 'markdown', 'rst'].includes(ext);
      case 'image':
        return isImageFile(file.name);
      case 'other':
        return !isImageFile(file.name) &&
               !['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html', 'py', 'go', 'md', 'mdx'].includes(ext);
      default:
        return true;
    }
  };

  // Time filter function
  const matchesTimeFilter = (file: FileInfo): boolean => {
    if (timeFilter === 'all') return true;

    if (!file.lastModified) return false;

    const fileDate = typeof file.lastModified === 'string'
      ? new Date(file.lastModified)
      : file.lastModified;

    const now = new Date();
    const diffMs = now.getTime() - fileDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    switch (timeFilter) {
      case 'today':
        return diffDays < 1;
      case 'week':
        return diffDays < 7;
      default:
        return true;
    }
  };

  // Search files
  const performSearch = useCallback(async () => {
    if (!workspaceRoot) return;

    setLoading(true);

    try {
      // Get all files recursively
      const allFiles: SearchResult[] = [];

      async function scanDirectory(path: string) {
        const result = await listDirectory(path, workspaceRoot);

        for (const file of result.files) {
          // Check type filter
          if (!matchesTypeFilter(file)) continue;

          // Check time filter
          if (!matchesTimeFilter(file)) continue;

          // Check name match
          const matchQuery = query.toLowerCase();
          const fileName = file.name.toLowerCase();

          if (matchQuery && !fileName.includes(matchQuery)) {
            continue;
          }

          // Calculate match range
          const matchRange: [number, number] | undefined = matchQuery
            ? [fileName.indexOf(matchQuery), fileName.indexOf(matchQuery) + matchQuery.length]
            : undefined;

          allFiles.push({
            ...file,
            matched: !!matchQuery || matchQuery === '',
            matchRange,
          });

          // Recursively scan directories
          if (file.type === 'directory') {
            await scanDirectory(file.path);
          }
        }
      }

      await scanDirectory('/');
      setResults(allFiles);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceRoot, query, fileType, timeFilter]);

  // Trigger search when query or filters change
  useEffect(() => {
    if (visible && (query || fileType !== 'all' || timeFilter !== 'all')) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }

    if (!query && fileType === 'all' && timeFilter === 'all') {
      setResults([]);
    }
  }, [visible, query, fileType, timeFilter, performSearch]);

  // Close on ESC
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Ctrl+K to toggle expand/collapse
      if (e.ctrlKey && e.key === 'k') {
        setExpanded(!expanded);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose, expanded]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '-';
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-4">
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col transition-all duration-300 ${
          expanded ? 'h-[600px] max-h-[80vh]' : 'h-[400px] max-h-[60vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files... (Ctrl+K to toggle)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="code">Code Files</option>
              <option value="markdown">Markdown</option>
              <option value="image">Images</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>

          <div className="flex-1 text-sm text-gray-600">
            {results.length} {results.length === 1 ? 'file' : 'files'} found
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No files found</p>
                <p className="text-sm">
                  {query ? `Try different keywords or filters` : 'Type to search files'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((file, index) => (
                <div
                  key={file.path || index}
                  onClick={() => {
                    onResultSelect(file);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group"
                >
                  {/* File Icon */}
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {file.type === 'directory' ? (
                      <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                        <span className="text-yellow-600">📁</span>
                      </div>
                    ) : isImageFile(file.name) ? (
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-green-600">🖼️</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600">📄</span>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate">
                        {file.matched && file.matchRange ? (
                          <>
                            {file.name.substring(0, file.matchRange[0])}
                            <span className="bg-yellow-200 text-gray-900 px-0.5 rounded">
                              {file.name.substring(file.matchRange[0], file.matchRange[1])}
                            </span>
                            {file.name.substring(file.matchRange[1])}
                          </>
                        ) : (
                          file.name
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="truncate max-w-xs">
                        {file.path}
                      </span>
                      {file.size && (
                        <span>{formatFileSize(file.size)}</span>
                      )}
                      {file.lastModified && (
                        <span>
                          {typeof file.lastModified === 'string'
                            ? new Date(file.lastModified).toLocaleDateString()
                            : file.lastModified.toLocaleDateString()
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
