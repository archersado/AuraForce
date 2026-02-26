/**
 * FileSearch Enhanced Component
 *
 * Provides real-time file search with content search capability.
 * Supports:
 * - File name search
 * - Content search in text files
 * - Type filtering (code, markdown, image, other)
 * - Time filtering (today, week, all)
 * - Result highlighting
 *
 * @version 2.0.0 (Enhanced with content search)
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, Clock, FileText, Type } from 'lucide-react';
import {
  listDirectory,
  type FileInfo,
  isImageFile,
  readFile,
  getLanguageFromExtension,
} from '@/lib/workspace/files-service';

export interface FileSearchProps {
  visible: boolean;
  onClose: () => void;
  onResultSelect: (file: FileInfo) => void;
  workspaceRoot?: string;
}

interface SearchResult extends FileInfo {
  matched?: boolean;
  nameMatchRange?: [number, number];
  contentMatches?: ContentMatch[];
}

interface ContentMatch {
  line: number;
  column: number;
  text: string;
  context: string;
}

export function FileSearchEnhanced({
  visible,
  onClose,
  onResultSelect,
  workspaceRoot,
}: FileSearchProps) {
  const [query, setQuery] = useState('');
  const [searchInContent, setSearchInContent] = useState(false);
  const [fileType, setFileType] = useState<'all' | 'code' | 'markdown' | 'image' | 'other'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  const searchAbortController = useRef<AbortController | null>(null);

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

  // Check if file is text file (for content search)
  const isTextFile = (file: FileInfo): boolean => {
    if (file.type === 'directory') return false;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const textExtensions = [
      'js', 'jsx', 'ts', 'tsx', 'mjs', 'mts', 'cjs', 'cts',
      'json', 'xml', 'yaml', 'yml',
      'html', 'htm', 'css', 'scss', 'sass', 'less',
      'md', 'mdx', 'markdown', 'rst', 'txt',
      'py', 'java', 'cpp', 'c', 'h', 'hpp', 'cs', 'go', 'rs', 'php', 'rb',
      'sql', 'sh', 'bash', 'zsh', 'fish',
      'dockerfile', 'env', 'conf', 'ini',
    ];
    return textExtensions.includes(ext);
  };

  // Search content in file
  const searchFileContent = async (
    path: string,
    query: string,
    signal: AbortSignal
  ): Promise<ContentMatch[]> => {
    try {
      const result = await readFile(path, workspaceRoot);

      // Check if file is too large for content search (>1MB)
      if (result.isLarge || result.metadata?.size > 1024 * 1024) {
        return [];
      }

      const content = result.content;
      const lines = content.split('\n');
      const matches: ContentMatch[] = [];
      const lowerQuery = query.toLowerCase();

      lines.forEach((line, lineIndex) => {
        const lowerLine = line.toLowerCase();
        const index = lowerLine.indexOf(lowerQuery);

        if (index !== -1) {
          const start = Math.max(0, index - 20);
          const end = Math.min(line.length, index + query.length + 20);
          const context = line.substring(start, end);

          matches.push({
            line: lineIndex + 1,
            column: index + 1,
            text: line.trim().substring(0, 100),
            context: `${index > 20 ? '...' : ''}${context}${end < line.length ? '...' : ''}`,
          });
        }
      });

      return matches.slice(0, 10); // Limit to 10 matches per file
    } catch (error) {
      console.warn(`Failed to read file for content search: ${path}`, error);
      return [];
    }
  };

  // Search files
  const performSearch = useCallback(async () => {
    if (!workspaceRoot) return;

    // Cancel any ongoing search
    if (searchAbortController.current) {
      searchAbortController.current.abort();
    }

    searchAbortController.current = new AbortController();
    const signal = searchAbortController.current.signal;

    setLoading(true);
    setResults([]);
    setSearchProgress(0);

    try {
      // Get all files recursively
      const allFiles: Map<string, SearchResult> = new Map();

      async function scanDirectory(path: string) {
        if (signal.aborted) return;

        try {
          const result = await listDirectory(path, workspaceRoot);

          for (const file of result.files) {
            if (signal.aborted) return;

            // Check type filter
            if (!matchesTypeFilter(file)) continue;

            // Check time filter
            if (!matchesTimeFilter(file)) continue;

            // Check name match
            const matchQuery = query.toLowerCase();
            const fileName = file.name.toLowerCase();

            const nameMatch = !query || fileName.includes(matchQuery);

            if (nameMatch || (searchInContent && isTextFile(file))) {
              const searchResult: SearchResult = {
                ...file,
                matched: true,
                nameMatchRange: nameMatch ? [fileName.indexOf(matchQuery), fileName.indexOf(matchQuery) + matchQuery.length] : undefined,
                contentMatches: [],
              };

              allFiles.set(file.path, searchResult);

              // Recursively scan directories
              if (file.type === 'directory') {
                await scanDirectory(file.path);
              }
            }
          }
        } catch (error) {
          console.error('Error scanning directory:', error);
        }
      }

      await scanDirectory('/');

      // If content search is enabled, search in file contents
      if (searchInContent && query) {
        const files = Array.from(allFiles.values()).filter(f => isTextFile(f));

        for (let i = 0; i < files.length; i++) {
          if (signal.aborted) return;

          const file = files[i];
          const contentMatches = await searchFileContent(file.path, query, signal);

          if (contentMatches.length > 0) {
            const updatedFile = allFiles.get(file.path);
            if (updatedFile) {
              updatedFile.contentMatches = contentMatches;
            }
          }

          setSearchProgress(Math.round(((i + 1) / files.length) * 100));
        }
      }

      // Convert to array and filter
      const finalResults = Array.from(allFiles.values())
        .filter(file => {
          // Keep files where name matches OR content matches (if content search is on)
          if (!query) return true;
          if (searchInContent && file.contentMatches && file.contentMatches.length > 0) return true;
          return file.nameMatchRange !== undefined;
        })
        .sort((a, b) => {
          // Sort by relevance: files with name matches first, then files with content matches
          const aHasNameMatch = a.nameMatchRange !== undefined;
          const bHasNameMatch = b.nameMatchRange !== undefined;
          const aHasContentMatch = a.contentMatches && a.contentMatches.length > 0;
          const bHasContentMatch = b.contentMatches && b.contentMatches.length > 0;

          if (aHasNameMatch && !bHasNameMatch) return -1;
          if (!aHasNameMatch && bHasNameMatch) return 1;
          if (aHasContentMatch && !bHasContentMatch) return -1;
          if (!aHasContentMatch && bHasContentMatch) return 1;

          return a.name.localeCompare(b.name);
        });

      setResults(finalResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
      setSearchProgress(0);
    }
  }, [workspaceRoot, query, fileType, timeFilter, searchInContent, matchesTypeFilter, matchesTimeFilter]);

  // Trigger search when query or filters change
  useEffect(() => {
    if (visible && (query || fileType !== 'all' || timeFilter !== 'all' || searchInContent)) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }

    if (!query && fileType === 'all' && timeFilter === 'all' && !searchInContent) {
      setResults([]);
    }
  }, [visible, query, fileType, timeFilter, searchInContent, performSearch]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (searchAbortController.current) {
        searchAbortController.current.abort();
      }
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Ctrl+F to toggle expand/collapse
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        // Focus search input if expanded
        if (expanded) {
          const input = document.querySelector('[data-testid="search-input"]') as HTMLInputElement;
          input?.focus();
        }
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
        className={`bg-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col transition-all duration-300 ${
          expanded ? 'h-[700px] max-h-[85vh]' : 'h-[500px] max-h-[70vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files... (Ctrl+F)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="search-input"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-3"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 flex-wrap">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={searchInContent}
                onChange={(e) => setSearchInContent(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Search in content</span>
            </label>
          </div>

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

          <div className="flex-1 text-sm text-gray-600 flex items-center gap-4">
            <span>
              {results.length} {results.length === 1 ? 'file' : 'files'} found
            </span>
            {loading && searchProgress > 0 && (
              <span className="text-blue-600">
                Searching content... {searchProgress}%
              </span>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading && searchProgress === 0 ? (
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
                  {query ? `Try different keywords or filters` : searchInContent ? 'Type to search in file contents' : 'Type to search files'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((file, index) => (
                <div key={file.path || index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* File Header */}
                  <div
                    onClick={() => {
                      onResultSelect(file);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors group bg-white"
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
                          {file.nameMatchRange ? (
                            <>
                              {file.name.substring(0, file.nameMatchRange[0])}
                              <span className="bg-yellow-200 text-gray-900 px-0.5 rounded">
                                {file.name.substring(file.nameMatchRange[0], file.nameMatchRange[1])}
                              </span>
                              {file.name.substring(file.nameMatchRange[1])}
                            </>
                          ) : (
                            file.name
                          )}
                        </button>
                        {isTextFile(file) && searchInContent && file.contentMatches && file.contentMatches.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            {file.contentMatches.length} match{file.contentMatches.length > 1 ? 'es' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="truncate max-w-sm">
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

                  {/* Content Matches */}
                  {expanded && file.contentMatches && file.contentMatches.length > 0 && (
                    <div className="px-3 pb-3 bg-gray-50 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>Content matches:</span>
                      </div>
                      <div className="space-y-1">
                        {file.contentMatches.slice(0, 5).map((match, matchIndex) => (
                          <div
                            key={matchIndex}
                            className="text-xs bg-white border border-gray-200 rounded px-2 py-1.5 font-mono"
                          >
                            <span className="text-gray-400 mr-2">Line {match.line}:</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: match.context.replace(
                                  new RegExp(`(${query})`, 'gi'),
                                  '<span class="bg-yellow-200 px-0.5 rounded font-bold">$1</span>'
                                ),
                              }}
                            />
                          </div>
                        ))}
                        {file.contentMatches.length > 5 && (
                          <div className="text-xs text-gray-500 text-center py-1">
                            +{file.contentMatches.length - 5} more matches
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileSearchEnhanced;
