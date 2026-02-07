/**
 * Code Diff Utility
 *
 * Generates diff between original and modified code for preview and apply operations.
 * Provides both structured data and formatted display.
 */

/**
 * Diff change type
 */
export enum DiffChangeType {
  ADD = 'add',
  REMOVE = 'remove',
  MODIFY = 'modify',
  EQUAL = 'equal',
}

/**
 * Single diff change
 */
export interface DiffChange {
  type: DiffChangeType;
 lineNumber?: number; // In original code (for REMOVE) or new code (for ADD)
 originalLine?: string;
 newLine?: string;
  content: string;
}

/**
 * Diff result
 */
export interface DiffResult {
  changes: DiffChange[];
  additions: number;
  deletions: number;
  summary: string;
  meta?: {
    fileName?: string;
    similarity?: number;
    isSignificant?: boolean;
    timestamp?: string;
  };
}

/**
 * Simple line-by-line diff algorithm
 *
 * @param original - Original code
 * @param modified - Modified code
 * @returns Diff result with line-by-line changes
 */
export function generateCodeDiff(original: string, modified: string): DiffResult {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');

  const changes: DiffChange[] = [];
  let i = 0;
  let originalLineNumber = 1;
  let modifiedLineNumber = 1;

  const oLength = originalLines.length;
  const mLength = modifiedLines.length;

  // Simple diff algorithm - find longest common subsequences
  // For production, consider using 'diff' package or similar
  while (i < oLength || i < mLength) {
    const originalLine = i < oLength ? originalLines[i] : null;
    const modifiedLine = i < mLength ? modifiedLines[i] : null;

    if (originalLine === modifiedLine) {
      // Lines are equal
      changes.push({
        type: DiffChangeType.EQUAL,
        content: originalLine || '',
      });
      i++;
      originalLineNumber++;
      modifiedLineNumber++;
    } else if (originalLine === null) {
      // Only in modified line (addition)
      changes.push({
        type: DiffChangeType.ADD,
        lineNumber: modifiedLineNumber,
        content: modifiedLine || '',
      });
      i++;
      modifiedLineNumber++;
    } else if (modifiedLine === null) {
      // Only in original line (removal)
      changes.push({
        type: DiffChangeType.REMOVE,
        lineNumber: originalLineNumber,
        content: originalLine || '',
      });
      i++;
      originalLineNumber++;
    } else {
      // Different content - check if it's a modification or completely different lines
      // Look ahead to see if we can match later
      let matchFound = false;

      // Look ahead a few lines to find a match
      const lookahead = Math.min(Math.max(oLength, mLength) - i, 10);
      for (let j = 1; j <= lookahead; j++) {
        if (i + j < oLength && originalLines[i + j] === modifiedLine) {
          // Original line was removed
          changes.push({
            type: DiffChangeType.REMOVE,
            lineNumber: originalLineNumber,
            content: originalLine || '',
          });
          changes.push({
            type: DiffChangeType.ADD,
            lineNumber: modifiedLineNumber,
            content: modifiedLine || '',
          });
          i++;
          originalLineNumber++;
          matchFound = true;
          break;
        }

        if (i + j < mLength && modifiedLines[i + j] === originalLine) {
          // Modified line was added
          changes.push({
            type: DiffChangeType.ADD,
            lineNumber: modifiedLineNumber,
            content: modifiedLine || '',
          });
          changes.push({
            type: DiffChangeType.REMOVE,
            lineNumber: originalLineNumber,
            content: originalLine || '',
          });
          i++;
          modifiedLineNumber++;
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        // Treat as modification
        changes.push({
          type: DiffChangeType.REMOVE,
          lineNumber: originalLineNumber,
          content: originalLine || '',
        });
        changes.push({
          type: DiffChangeType.ADD,
          lineNumber: modifiedLineNumber,
          content: modifiedLine || '',
        });
        i++;
        originalLineNumber++;
        modifiedLineNumber++;
      }
    }
  }

  const additions = changes.filter(c => c.type === DiffChangeType.ADD).length;
  const deletions = changes.filter(c => c.type === DiffChangeType.REMOVE).length;

  return {
    changes,
    additions,
    deletions,
    summary: `+${additions} -${deletions}`,
  };
}

/**
 * Apply diff to generate modified code from original
 *
 * @param original - Original code
 * @param changes - Diff changes
 * @returns Modified code
 */
export function applyDiff(original: string, changes: DiffChange[]): string {
  const originalLines = original.split('\n');
  let result: string[] = [];
  let originalIndex = 0;

  for (const change of changes) {
    switch (change.type) {
      case DiffChangeType.EQUAL:
        // Keep original line
        if (originalIndex < originalLines.length) {
          result.push(originalLines[originalIndex]);
          originalIndex++;
        }
        break;

      case DiffChangeType.REMOVE:
        // Skip original line
        originalIndex++;
        break;

      case DiffChangeType.ADD:
        // Add new line
        result.push(change.content);
        break;

      case DiffChangeType.MODIFY:
        // Skip original and add new
        originalIndex++;
        result.push(change.newLine || change.content);
        break;
    }
  }

  // Add any remaining lines
  while (originalIndex < originalLines.length) {
    result.push(originalLines[originalIndex]);
    originalIndex++;
  }

  return result.join('\n');
}

/**
 * Generate unified diff format (like git diff)
 *
 * @param original - Original code
 * @param modified - Modified code
 * @param fileName - File name (optional)
 * @returns Unified diff string
 */
export function generateUnifiedDiff(original: string, modified: string, fileName = 'file.js'): string {
  const diff = generateCodeDiff(original, modified);
  let output = '';

  output += `--- a/${fileName}\n`;
  output += `+++ b/${fileName}\n`;
  output += `@@ -1,${original.split('\n').length} +1,${modified.split('\n').length} @@\n`;

  for (const change of diff.changes) {
    switch (change.type) {
      case DiffChangeType.EQUAL:
        output += ` ${change.content}\n`;
        break;
      case DiffChangeType.ADD:
        output += `+${change.content}\n`;
        break;
      case DiffChangeType.REMOVE:
        output += `-${change.content}\n`;
        break;
    }
  }

  return output;
}

/**
 * Find inline diff (word-level changes within a line)
 *
 * @param originalLine - Original line
 * @param modifiedLine - Modified line
 * @returns Array of inline changes
 */
export function findInlineDiff(originalLine: string, modifiedLine: string): Array<{
  type: 'add' | 'remove' | 'equal';
  content: string;
}> {
  const result: Array<{ type: 'add' | 'remove' | 'equal'; content: string }> = [];

  // Split into words
  const originalWords = originalLine.split(/(\s+)/);
  const modifiedWords = modifiedLine.split(/(\s+)/);

  let oIndex = 0;
  let mIndex = 0;

  while (oIndex < originalWords.length || mIndex < modifiedWords.length) {
    const oWord = originalWords[oIndex];
    const mWord = modifiedWords[mIndex];

    if (oWord === mWord) {
      result.push({ type: 'equal', content: oWord || '' });
      oIndex++;
      mIndex++;
    } else if (oIndex < originalWords.length && mIndex < modifiedWords.length) {
      // Try to find match ahead
      let inOriginal = -1;
      let inModified = -1;

      // Look ahead for word match
      const lookahead = 5;
      for (let j = 1; j <= lookahead; j++) {
        if (oIndex + j < originalWords.length && originalWords[oIndex + j] === mWord) {
          inOriginal = j;
          break;
        }
        if (mIndex + j < modifiedWords.length && modifiedWords[mIndex + j] === oWord) {
          inModified = j;
          break;
        }
      }

      if (inOriginal > 0 && inModified === -1) {
        // Word was removed
        result.push({ type: 'remove', content: oWord || '' });
        oIndex++;
      } else if (inModified > 0 && inOriginal === -1) {
        // Word was added
        result.push({ type: 'add', content: mWord || '' });
        mIndex++;
      } else {
        // Replace both
        if (oIndex < originalWords.length) {
          result.push({ type: 'remove', content: oWord || '' });
          oIndex++;
        }
        if (mIndex < modifiedWords.length) {
          result.push({ type: 'add', content: mWord || '' });
          mIndex++;
        }
      }
    } else {
      // One of the arrays is exhausted
      if (oIndex < originalWords.length) {
        result.push({ type: 'remove', content: oWord || '' });
        oIndex++;
      }
      if (mIndex < modifiedWords.length) {
        result.push({ type: 'add', content: mWord || '' });
        mIndex++;
      }
    }
  }

  return result;
}

/**
 * Format diff for display with line numbers
 *
 * @param diff - Diff result
 * @returns Formatted lines with change markup
 */
export function formatDiffForDisplay(diff: DiffResult): Array<{
  type: DiffChangeType;
  leftLine?: number;
  rightLine?: number;
  content: string;
  inlineChanges?: Array<{ type: 'add' | 'remove' | 'equal'; content: string }>;
}> {
  let leftLine = 1;
  let rightLine = 1;

  return diff.changes.map((change, index) => {
    const formatted: any = {
      type: change.type,
      content: change.content,
    };

    if (change.type === DiffChangeType.EQUAL) {
      formatted.leftLine = leftLine;
      formatted.rightLine = rightLine;
    } else if (change.type === DiffChangeType.REMOVE) {
      formatted.leftLine = leftLine;
    } else if (change.type === DiffChangeType.ADD) {
      formatted.rightLine = rightLine;
    }

    // Calculate inline changes for modified lines
    if (change.type === DiffChangeType.REMOVE) {
      // Check if next line is ADD (modification)
      if (index + 1 < diff.changes.length && diff.changes[index + 1].type === DiffChangeType.ADD) {
        const nextChange = diff.changes[index + 1];
        if (change.content !== nextChange.content) {
          formatted.inlineChanges = findInlineDiff(change.content, nextChange.content);
        }
      }
      leftLine++;
    } else if (change.type === DiffChangeType.ADD) {
      rightLine++;
    } else {
      leftLine++;
      rightLine++;
    }

    return formatted;
  });
}

/**
 * Generate HTML markup for diff display
 *
 * @param diff - Diff result
 * @returns HTML string with diff highlighting
 */
export function generateDiffHTML(diff: DiffResult): string {
  const formatted = formatDiffForDisplay(diff);
  let html = '<div class="diff-container">';

  for (const line of formatted) {
    switch (line.type) {
      case DiffChangeType.EQUAL:
        html += `<div class="diff-line diff-equal">
          <span class="diff-line-number">${line.leftLine || ''}</span>
          <span class="diff-line-number">${line.rightLine || ''}</span>
          <span class="diff-content">${escapeHTML(line.content)}</span>
        </div>`;
        break;

      case DiffChangeType.REMOVE:
        html += `<div class="diff-line diff-remove">
          <span class="diff-line-number">${line.leftLine || ''}</span>
          <span class="diff-line-number"></span>
          <span class="diff-content">${escapeHTML(line.content)}</span>
        </div>`;
        break;

      case DiffChangeType.ADD:
        html += `<div class="diff-line diff-add">
          <span class="diff-line-number"></span>
          <span class="diff-line-number">${line.rightLine || ''}</span>
          <span class="diff-content">${escapeHTML(line.content)}</span>
        </div>`;
        break;
    }
  }

  html += '</div>';
  return html;
}

/**
 * Escape HTML entities
 */
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Calculate diff ratio (closeness of two code strings)
 *
 * @param original - Original code
 * @param modified - Modified code
 * @returns Similarity ratio (0-1, 1 = identical)
 */
export function calculateSimilarity(original: string, modified: string): number {
  const diff = generateCodeDiff(original, modified);
  const totalChanges = diff.additions + diff.deletions;
  const totalLines = Math.max(original.split('\n').length, modified.split('\n').length);

  if (totalLines === 0) return 1;

  return Math.max(0, 1 - totalChanges / totalLines);
}

/**
 * Check if diff is significant (based on thresholds)
 *
 * @param original - Original code
 * @param modified - Modified code
 * @param threshold - Minimum change ratio (default: 0.1 = 10%)
 * @returns True if changes are significant
 */
export function isSignificantChange(original: string, modified: string, threshold = 0.1): boolean {
  const similarity = calculateSimilarity(original, modified);
  return similarity < (1 - threshold);
}
