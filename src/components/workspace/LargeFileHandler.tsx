/**
 * Large File Handler Component
 *
 * Optimized for handling large files (>1MB).
 * Features:
 * - Chunked loading
- Virtual scrolling
- Loading progress indicator
- Warning messages for large files
- Memory-efficient rendering
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, Download, Search, ChevronDown, FileCode } from 'lucide-react';

interface LargeFileHandlerProps {
  content: string;
  onLoadChunk?: (start: number, end: number) => string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  fileName?: string;
  language?: string;
}

// Chunk size for virtual scrolling
const CHUNK_SIZE = 100 * 1024; // 100KB chunks
const VISIBLE_BUFFER = 2000; // Number of lines to keep in memory

export function LargeFileHandler({
  content,
  onLoadChunk,
  onChange,
  readOnly = false,
  fileName = 'file',
  language = 'text',
}: LargeFileHandlerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visibleContent, setVisibleContent] = useState<string>('');
  const [totalLines, setTotalLines] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [isLarge, setIsLarge] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentLinesRef = useRef<string[]>([]);
  const currentScrollPosRef = useRef<number>(0);

  // Check if file is large
  const fileSize = new Blob([content]).size;
  const isOver1MB = fileSize > 1 * 1024 * 1024;
  const isOver10MB = fileSize > 10 * 1024 * 1024;

  // Initialize large file detection
  useEffect(() => {
    if (isOver1MB) {
      setIsLarge(true);
    }

    if (isOver10MB) {
      setTotalSize(fileSize);

      // Count lines without loading all content
      const lines = content.split('\n').length;
      setTotalLines(lines);
    }

    setIsLoading(false);
  }, [content, fileSize, isOver1MB, isOver10MB]);

  // Handle scroll events for virtual scrolling
  const handleScroll = useCallback(() => {
    if (!isOver10MB || !scrollContainerRef.current) return;

    const scrollTop = scrollContainerRef.current.scrollTop;
    const scrollHeight = scrollContainerRef.current.scrollHeight;
    const viewportHeight = scrollContainerRef.current.clientHeight;

    // Calculate visible line range
    const lineHeight = 20; // Approximate line height in pixels
    const startLine = Math.floor(scrollTop / lineHeight) - VISIBLE_BUFFER / 2;
    const endLine = Math.ceil((scrollTop + viewportHeight) / lineHeight) + VISIBLE_BUFFER / 2;

    // Load visible chunk
    const clampedStart = Math.max(0, startLine);
    const clampedEnd = Math.min(totalLines, endLine);

    if (clampedStart !== clampedEnd) {
      // Use onLoadChunk if provided, otherwise slice content
      const chunkContent = onLoadChunk
        ? onLoadChunk(clampedStart, clampedEnd)
        : content.split('\n').slice(clampedStart, clampedEnd).join('\n');

      setVisibleContent(chunkContent);
      setProgress((clampedStart / totalLines) * 100);

      currentScrollPosRef.current = scrollTop;
    }
  }, [isOver10MB, totalLines, onLoadChunk, content]);

  // Debounce scroll handler
  const debouncedHandleScroll = useCallback(
    debounce(handleScroll, 100),
    [handleScroll]
  );

  useEffect(() => {
    if (!isOver10MB) {
      setVisibleContent(content);
      return;
    }

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', debouncedHandleScroll);
      return () => {
        container.removeEventListener('scroll', debouncedHandleScroll);
      };
    }
  }, [isOver10MB, debouncedHandleScroll, content]);

  // Render content
  const renderContent = () => {
    if (isLoading) {
      return <LoadingProgress progress={progress} />;
    }

    if (isLarge) {
      if (isOver10MB) {
        // Virtual scrolling for very large files
        return <VirtualScrollingEditor visibleContent={visibleContent} />;
      } else {
        // Simple textarea for moderately large files
        return (
          <textarea
            value={visibleContent}
            onChange={(e) => onChange?.(e.target.value)}
            readOnly={readOnly}
            className="w-full h-[calc(100vh-200px)] p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
            style={{
              fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            }}
          />
        );
      }
    }

    // Normal editor for small files
    return (
      <pre className="w-full h-[calc(100vh-200px)] overflow-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm">
        {visibleContent || content}
      </pre>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Warning Banner for Large Files */}
      {isLarge && (
        <LargeFileWarning
          fileSize={fileSize}
          isOver10MB={isOver10MB}
          fileName={fileName}
        />
      )}

      {/* Editor Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-white dark:bg-gray-900"
      >
        {renderContent()}
      </div>

      {/* File Info Footer */}
      <FileStats
        totalLines={totalLines}
        totalSize={totalSize}
        language={language}
      />
    </div>
  );
}

// Loading Progress Component
function LoadingProgress({ progress }: { progress: number }) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Loading file...
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

// Large File Warning Component
function LargeFileWarning({
  fileSize,
  isOver10MB,
  fileName,
}: {
  fileSize: number;
  isOver10MB: boolean;
  fileName: string;
}) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className={`p-3 ${
      isOver10MB
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    } border rounded-lg mb-3`}>
      <div className="flex items-start gap-3">
        <AlertCircle
          className={`w-5 h-5 flex-shrink-0 ${
            isOver10MB
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-blue-600 dark:text-blue-400'
          }`}
        />
        <div className="flex-1">
          <div className={`font-medium mb-1 ${
            isOver10MB
              ? 'text-yellow-900 dark:text-yellow-100'
              : 'text-blue-900 dark:text-blue-100'
          }`}>
            {isOver10MB ? 'Large File Detected' : 'Large File'}
          </div>
          <div className={`text-sm ${
            isOver10MB
              ? 'text-yellow-800 dark:text-yellow-200'
              : 'text-blue-800 dark:text-blue-200'
          }`}>
            <p className="mb-1">
              <strong>{fileName}</strong> is {formatSize(fileSize)}.
              {isOver10MB
                ? ' This may impact performance.'
                : ' Rendering is optimized.'}
            </p>
            {isOver10MB && (
              <ul className="list-disc list-inside space-y-1">
                <li>Using virtual scrolling for memory efficiency</li>
                <li>Loading only visible content</li>
                <li>Consider splitting into smaller files</li>
              </ul>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            // Handle download
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }}
          className={`p-2 rounded-lg transition-colors ${
            isOver10MB
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          title="Download file"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Virtual Scrolling Editor Component
function VirtualScrollingEditor({ visibleContent }: { visibleContent: string }) {
  const lines = visibleContent.split('\n');

  return (
    <div className="font-mono text-sm h-full">
      {lines.map((line, index) => (
        <div
          key={index}
          className="flex hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-1"
          style={{ minHeight: '20px' }}
        >
          <span className="w-12 text-gray-400 dark:text-gray-600 flex-shrink-0 select-none">
            {index + 1}
          </span>
          <span className="flex-1 whitespace-pre-wrap text-gray-900 dark:text-gray-100">
            {line || ' '}
          </span>
        </div>
      ))}
    </div>
  );
}

// File Stats Footer Component
function FileStats({
  totalLines,
  totalSize,
  language,
}: {
  totalLines: number;
  totalSize: number;
  language: string;
}) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <FileCode className="w-3 h-3" />
          <span>{language}</span>
        </div>
        {totalLines > 0 && (
          <div>
            {totalLines.toLocaleString()} lines
          </div>
        )}
        {totalSize > 0 && (
          <div>
            {formatSize(totalSize)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>Large file mode</span>
        <AlertCircle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
      </div>
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default LargeFileHandler;
