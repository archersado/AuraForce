/**
 * Code Diff Viewer Component
 *
 * Displays code differences between original and modified code with syntax highlighting.
 * Supports side-by-side and unified diff views.
 */

'use client';

import React, { useMemo } from 'react';
import {
  DiffChangeType,
  type DiffChange,
  type DiffResult,
  formatDiffForDisplay,
} from '@/lib/ai/code-diff';

interface CodeDiffViewerProps {
  diff: DiffResult;
  fileName?: string;
  viewMode?: 'unified' | 'split';
  language?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
  onLineClick?: (lineNumber: number, side: 'left' | 'right') => void;
}

export function CodeDiffViewer({
  diff,
  fileName = 'file.js',
  viewMode = 'unified',
  language = 'javascript',
  maxHeight = '500px',
  showLineNumbers = true,
  onLineClick,
}: CodeDiffViewerProps) {
  const formattedLines = useMemo(() => {
    return formatDiffForDisplay(diff);
  }, [diff]);

  const getChangeTypeClass = (type: DiffChangeType): string => {
    switch (type) {
      case DiffChangeType.ADD:
        return 'diff-add';
      case DiffChangeType.REMOVE:
        return 'diff-remove';
      case DiffChangeType.EQUAL:
        return 'diff-equal';
      default:
        return '';
    }
  };

  const getChangeIcon = (type: DiffChangeType): string => {
    switch (type) {
      case DiffChangeType.ADD:
        return '+';
      case DiffChangeType.REMOVE:
        return '-';
      case DiffChangeType.EQUAL:
        return ' ';
      default:
        return ' ';
    }
  };

  const renderChangeIcon = (type: DiffChangeType): React.ReactNode => {
    const icon = getChangeIcon(type);
    return (
      <span className={`diff-icon ${getChangeTypeClass(type)}`}>
        {icon}
      </span>
    );
  };

  const renderInlineHighlight = (text: string, inlineChanges?: Array<{ type: 'add' | 'remove' | 'equal'; content: string }>): React.ReactNode => {
    if (!inlineChanges || inlineChanges.length === 0) {
      return <span>{text}</span>;
    }

    return (
      <span className="inline-highlight">
        {inlineChanges.map((change, idx) => (
          <span key={idx} className={`inline-${change.type}`}>
            {change.content}
          </span>
        ))}
      </span>
    );
  };

  const renderUnifiedLine = (line: any, index: number): React.ReactNode => {
    const handleClick = () => {
      if (onLineClick) {
        if (line.type === DiffChangeType.REMOVE || line.type === DiffChangeType.EQUAL) {
          onLineClick(line.leftLine || index + 1, 'left');
        }
        if (line.type === DiffChangeType.ADD || line.type === DiffChangeType.EQUAL) {
          onLineClick(line.rightLine || index + 1, 'right');
        }
      }
    };

    return (
      <div
        key={index}
        className={`diff-line ${getChangeTypeClass(line.type)} ${onLineClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
        onClick={handleClick}
      >
        {showLineNumbers && (
          <>
            <span className="diff-line-number diff-left-num">{line.leftLine || ''}</span>
            <span className="diff-line-number diff-right-num">{line.rightLine || ''}</span>
          </>
        )}
        {renderChangeIcon(line.type)}
        <span className="diff-content">
          {line.inlineChanges
            ? renderInlineHighlight(line.content, line.inlineChanges)
            : line.content || '\u00A0'}
        </span>
      </div>
    );
  };

  const renderSplitLine = (leftLine: any, rightLine: any, index: number): React.ReactNode => {
    const handleLeftClick = () => {
      if (onLineClick && leftLine) {
        onLineClick(leftLine.leftLine || index + 1, 'left');
      }
    };

    const handleRightClick = () => {
      if (onLineClick && rightLine) {
        onLineClick(rightLine.rightLine || index + 1, 'right');
      }
    };

    return (
      <div key={index} className="diff-row split-view">
        {leftLine ? (
          <div
            className={`diff-cell ${getChangeTypeClass(leftLine.type)} ${onLineClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
            onClick={handleLeftClick}
          >
            {showLineNumbers && (
              <span className="diff-line-number">{leftLine.leftLine || ''}</span>
            )}
            {renderChangeIcon(leftLine.type)}
            <span className="diff-content">
              {leftLine.content || '\u00A0'}
            </span>
          </div>
        ) : (
          <div className="diff-cell diff-empty"></div>
        )}

        {rightLine ? (
          <div
            className={`diff-cell ${getChangeTypeClass(rightLine.type)} ${onLineClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
            onClick={handleRightClick}
          >
            {showLineNumbers && (
              <span className="diff-line-number">{rightLine.rightLine || ''}</span>
            )}
            {renderChangeIcon(rightLine.type)}
            <span className="diff-content">
              {rightLine.content || '\u00A0'}
            </span>
          </div>
        ) : (
          <div className="diff-cell diff-empty"></div>
        )}
      </div>
    );
  };

  if (!diff || diff.changes.length === 0) {
    return (
      <div className="diff-viewer">
        <div className="diff-header">
          <span className="diff-filename">{fileName}</span>
          <span className="diff-summary">No changes</span>
        </div>
        <div className="diff-content py-8 text-center text-gray-500">
          No changes to display
        </div>
      </div>
    );
  }

  return (
    <div className="diff-viewer">
      {/* Header */}
      <div className="diff-header">
        <div className="flex items-center gap-4">
          <span className="diff-filename">{fileName}</span>
        </div>
        <div className="diff-summary">
          <span className="diff-add-count">+{diff.additions}</span>
          <span className="diff-remove-count">-{diff.deletions}</span>
        </div>
      </div>

      {/* Content */}
      <div className="diff-content" style={{ maxHeight }}>
        {viewMode === 'unified' ? (
          <div className="diff-lines">
            {formattedLines.map((line, index) => renderUnifiedLine(line, index))}
          </div>
        ) : (
          <div className="diff-lines split-view">
            {(() => {
              const leftLines: any[] = [];
              const rightLines: any[] = [];

              for (const line of formattedLines) {
                if (line.type === DiffChangeType.REMOVE || line.type === DiffChangeType.EQUAL) {
                  leftLines.push(line);
                  rightLines.push(null);
                } else if (line.type === DiffChangeType.ADD) {
                  leftLines.push(null);
                  rightLines.push(line);
                }
              }

              const maxLines = Math.max(leftLines.length, rightLines.length);
              const rows = [];

              for (let i = 0; i < maxLines; i++) {
                rows.push(renderSplitLine(leftLines[i], rightLines[i], i));
              }

              return rows;
            })()}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="diff-footer">
        <div className="diff-stats">
          <span>{formattedLines.length} lines</span>
          <span>{diff.meta?.similarity ? `${Math.round(diff.meta.similarity * 100)}% similar` : ''}</span>
        </div>
      </div>
    </div>
  );
}

export default CodeDiffViewer;
