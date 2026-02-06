/**
 * Diff Viewer Component
 *
 * Displays code diffs with side-by-side and unified views.
 * Features:
 * - Side-by-side diff view
 * - Unified diff view
 * - Syntax highlighted code
 * - Line numbers
 * - Diff stats (added/removed lines)
 * - Apply all / Apply selected functionality
 * - Copy original or modified code
 */

'use client';

import { useState, useMemo } from 'react';
import { Check, X, Copy, ChevronDown, ChevronRight, Plus, Minus, FileCode, Wand2 } from 'lucide-react';

export interface DiffChange {
  type: 'add' | 'remove' | 'context' | 'header';
  oldLineNumber?: number;
  newLineNumber?: number;
  original: string;
  modified: string;
  description?: string;
}

export interface DiffViewerProps {
  title?: string;
  description?: string;
  oldCode: string;
  newCode: string;
  language?: string;
  view?: 'unified' | 'side-by-side';
  onApplyChange?: (change: DiffChange, index: number) => void;
  onApplyAll?: () => void;
  onDiscard?: (index: number) => void;
  readOnly?: boolean;
}

interface DiffLineProps {
  type: 'add' | 'remove' | 'context' | 'header';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
  isSideBySide?: boolean;
  oldContent?: string;
  newContent?: string;
}

/**
 * Diff Line Component
 */
function DiffLine({ type, oldLineNumber, newLineNumber, content, isSideBySide, oldContent, newContent }: DiffLineProps) {
  const getLineClass = () => {
    switch (type) {
      case 'add':
        return 'bg-green-50 dark:bg-green-900/20 dark:hover:bg-green-900/30';
      case 'remove':
        return 'bg-red-50 dark:bg-red-900/20 dark:hover:bg-red-900/30';
      case 'context':
        return '';
      case 'header':
        return 'bg-gray-100 dark:bg-gray-800';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'add':
        return <Plus className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />;
      case 'remove':
        return <Minus className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const LineNumber = ({ num, highlight }: { num?: number; highlight?: boolean }) => (
    <div className={`w-10 text-right pr-2 text-xs font-mono ${
      highlight
        ? 'bg-yellow-200 dark:bg-yellow-800 font-semibold'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
    } font-mono`}>
      {num ?? ''}
    </div>
  );

  if (isSideBySide) {
    return (
      <div className={`flex ${getLineClass()}`}>
        {/* Left side (original) */}
        <div className="flex border-r border-gray-200 dark:border-gray-700 w-1/2">
          <LineNumber num={oldLineNumber} highlight={type === 'remove'} />
          <div className="flex items-center gap-2 px-2 py-0.5 text-sm font-mono">
            {type === 'remove' && getIcon()}
            <code className="flex-1 truncate text-gray-900 dark:text-gray-100">
              {type === 'header' ? content : (oldContent || content)}
            </code>
          </div>
        </div>

        {/* Right side (modified) */}
        <div className="flex w-1/2">
          <LineNumber num={newLineNumber} highlight={type === 'add'} />
          <div className="flex items-center gap-2 px-2 py-0.5 text-sm font-mono">
            {type !== 'remove' && getIcon()}
            <code className="flex-1 truncate text-gray-900 dark:text-gray-100">
              {type === 'header' ? content : (newContent || content)}
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2 py-0.5 px-2 ${getLineClass()}`}>
      <div className="flex gap-1.5">
        <LineNumber num={oldLineNumber} highlight={type === 'remove'} />
        <LineNumber num={newLineNumber} highlight={type === 'add'} />
      </div>
      <div className="flex items-center gap-2 flex-1 py-0.5">
        {getIcon()}
        <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
          {type === 'header' ? (
            <span className="font-semibold text-gray-600 dark:text-gray-300">{content}</span>
          ) : (
            content
          )}
        </code>
      </div>
    </div>
  );
}

/**
 * Diff Header Component
 */
function DiffHeader({
  title,
  language,
  stats,
  view,
  onViewChange,
  onCopyOriginal,
  onCopyModified,
  onApplyAll,
  onDiscardAll,
  readOnly,
}: {
  title?: string;
  language?: string;
  stats?: { added: number; removed: number };
  view: 'unified' | 'side-by-side';
  onViewChange: (view: 'unified' | 'side-by-side') => void;
  onCopyOriginal?: () => void;
  onCopyModified?: () => void;
  onApplyAll?: () => void;
  onDiscardAll?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {title || 'Code Diff'}
          </h3>
          {language && (
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
              {language}
            </span>
          )}
        </div>

        {stats && (
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Plus className="w-3 h-3" />
              {stats.added} added
            </span>
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <Minus className="w-3 h-3" />
              {stats.removed} removed
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* View Toggle */}
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
          <button
            onClick={() => onViewChange('unified')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              view === 'unified'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Unified
          </button>
          <button
            onClick={() => onViewChange('side-by-side')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              view === 'side-by-side'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Split
          </button>
        </div>

        {/* Action Buttons */}
        {!readOnly && (
          <>
            <button
              onClick={onApplyAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
              title="Apply all changes"
            >
              <Check className="w-3.5 h-3.5" />
              Apply All
            </button>
            <button
              onClick={onDiscardAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
              title="Discard all changes"
            >
              <X className="w-3.5 h-3.5" />
              Discard
            </button>
          </>
        )}

        {onCopyOriginal && (
          <button
            onClick={onCopyOriginal}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy original code"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}

        {onCopyModified && (
          <button
            onClick={onCopyModified}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy modified code"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Main Diff Viewer Component
 */
export function DiffViewer({
  title,
  description,
  oldCode,
  newCode,
  language,
  view = 'unified',
  onApplyChange,
  onApplyAll,
  onDiscard,
  readOnly = false,
}: DiffViewerProps) {
  const [selectedView, setSelectedView] = useState<'unified' | 'side-by-side'>(view);
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set());

  // Parse diff (simple implementation - in production, use a proper diff library)
  const changes = useMemo(() => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const diff: DiffChange[] = [];

    // Header
    diff.push({
      type: 'header',
      original: `@@ -${1},${oldLines.length} +${1},${newLines.length} @@`,
      modified: '',
    });

    // Simple line-by-line comparison
    const maxLines = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === newLine) {
        diff.push({
          type: 'context',
          oldLineNumber: i + 1,
          newLineNumber: i + 1,
          original: oldLine || '',
          modified: newLine || '',
        });
      } else {
        // Line changed
        if (oldLine !== (oldLines[i + 1] || '') && newLine !== (newLines[i + 1] || '')) {
          // Both present - modified
          diff.push({
            type: 'remove',
            oldLineNumber: i + 1,
            original: oldLine || '',
            modified: '',
            description: 'Modified',
          });
          diff.push({
            type: 'add',
            newLineNumber: i + 1,
            original: '',
            modified: newLine || '',
            description: 'Modified',
          });
        } else {
          // Only one side changed
          if (oldLine && !newLine) {
            diff.push({
              type: 'remove',
              oldLineNumber: i + 1,
              original: oldLine,
              modified: '',
            });
          } else if (!oldLine && newLine) {
            diff.push({
              type: 'add',
              newLineNumber: i + 1,
              original: '',
              modified: newLine,
            });
          }
        }
      }
    }

    return diff;
  }, [oldCode, newCode]);

  // Calculate diff stats
  const stats = useMemo(() => {
    return {
      added: changes.filter((c) => c.type === 'add').length,
      removed: changes.filter((c) => c.type === 'remove').length,
    };
  }, [changes]);

  // Toggle change expansion
  const toggleChange = (index: number) => {
    const newExpanded = new Set(expandedChanges);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChanges(newExpanded);
  };

  // Handler functions
  const handleViewChange = (newView: 'unified' | 'side-by-side') => {
    setSelectedView(newView);
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(oldCode);
  };

  const handleCopyModified = () => {
    navigator.clipboard.writeText(newCode);
  };

  const handleApplyChange = (change: DiffChange, index: number) => {
    if (onApplyChange) {
      onApplyChange(change, index);
    }
  };

  const handleDiscard = (index: number) => {
    if (onDiscard) {
      onDiscard(index);
    }
  };

  // Group changes into chunks
  const changeChunks = useMemo(() => {
    const chunks: DiffChange[][] = [];
    let currentChunk: DiffChange[] = [];

    for (const change of changes) {
      if (change.type === 'header' && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
      currentChunk.push(change);
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }, [changes]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <DiffHeader
        title={title}
        language={language}
        stats={stats}
        view={selectedView}
        onViewChange={handleViewChange}
        onCopyOriginal={handleCopyOriginal}
        onCopyModified={handleCopyModified}
        onApplyAll={onApplyAll}
        onDiscardAll={() => changes.forEach((_, i) => handleDiscard(i))}
        readOnly={readOnly}
      />

      {/* Description */}
      {description && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </div>
      )}

      {/* Diff Content */}
      <div className="overflow-auto max-h-[500px]">
        {changeChunks.map((chunk, chunkIndex) => {
          const firstChange = chunk[0];
          const chunkNumber = chunkIndex;
          const isExpanded = expandedChanges.has(chunkNumber);
          const hasHeader = firstChange?.type === 'header';

          return (
            <div key={chunkIndex} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              {/* Chunk Toggle */}
              {hasHeader && (
                <button
                  onClick={() => toggleChange(chunkNumber)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span>{firstChange.description || 'Change block'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {chunk.filter((c) => c.type === 'add').length > 0 && (
                      <span className="text-green-600">+{chunk.filter((c) => c.type === 'add').length}</span>
                    )}
                    {chunk.filter((c) => c.type === 'remove').length > 0 && (
                      <span className="text-red-600">-{chunk.filter((c) => c.type === 'remove').length}</span>
                    )}
                  </div>
                </button>
              )}

              {/* Chunk Content */}
              {isExpanded && (
                <div className={`font-mono text-sm ${selectedView === 'side-by-side' ? 'border-x border-gray-200 dark:border-gray-700' : ''}`}>
                  {chunk.map((change, lineIndex) => (
                    <DiffLine
                      key={`${chunkNumber}-${lineIndex}`}
                      type={change.type}
                      oldLineNumber={change.oldLineNumber}
                      newLineNumber={change.newLineNumber}
                      content={change.original}
                      oldContent={change.original}
                      newContent={change.modified}
                      isSideBySide={selectedView === 'side-by-side'}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with AI suggestion */}
      {!readOnly && changes.some((c) => c.type === 'add' || c.type === 'remove') && (
        <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Wand2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>AI suggested these changes to improve code quality.</span>
            </div>
            <button
              onClick={onApplyAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
            >
              Apply All
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {changes.length <= 1 && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <FileCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No changes detected - the files are identical.</p>
        </div>
      )}
    </div>
  );
}

export default DiffViewer;
