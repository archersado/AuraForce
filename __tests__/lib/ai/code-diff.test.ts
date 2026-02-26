/**
 * Code Diff Utility Tests
 *
 * Tests for code diff generation and formatting
 */

import {
  generateCodeDiff,
  applyDiff,
  generateUnifiedDiff,
  formatDiffForDisplay,
  generateDiffHTML,
  calculateSimilarity,
  isSignificantChange,
  findInlineDiff,
  DiffChangeType,
  type DiffResult,
} from '@/lib/ai/code-diff';

describe('Code Diff Utility', () => {
  describe('generateCodeDiff', () => {
    it('should generate correct diff for simple addition', () => {
      const original = 'line 1\nline 2';
      const modified = 'line 1\nline 2\nline 3';

      const diff = generateCodeDiff(original, modified);

      expect(diff.additions).toBe(1);
      expect(diff.deletions).toBe(0);
      expect(diff.changes.length).toBeGreaterThan(0);

      const addedChange = diff.changes.find(c => c.type === DiffChangeType.ADD);
      expect(addedChange).toBeDefined();
      expect(addedChange?.content).toBe('line 3');
    });

    it('should generate correct diff for simple removal', () => {
      const original = 'line 1\nline 2\nline 3';
      const modified = 'line 1\nline 2';

      const diff = generateCodeDiff(original, modified);

      expect(diff.additions).toBe(0);
      expect(diff.deletions).toBe(1);

      const removedChange = diff.changes.find(c => c.type === DiffChangeType.REMOVE);
      expect(removedChange).toBeDefined();
      expect(removedChange?.content).toBe('line 3');
    });

    it('should generate correct diff for modification', () => {
      const original = 'line 1\nline 2\nline 3';
      const modified = 'line 1\nline 2 modified\nline 3';

      const diff = generateCodeDiff(original, modified);

      expect(diff.additions).toBe(1);
      expect(diff.deletions).toBe(1);
    });

    it('should handle empty strings', () => {
      const diff = generateCodeDiff('', '');

      expect(diff.additions).toBe(0);
      expect(diff.deletions).toBe(0);
      expect(diff.changes.length).toBe(0);
    });

    it('should handle adding to empty code', () => {
      const diff = generateCodeDiff('', 'line 1\nline 2');

      expect(diff.additions).toBe(2);
      expect(diff.deletions).toBe(0);
    });

    it('should handle complete removal', () => {
      const diff = generateCodeDiff('line 1\nline 2', '');

      expect(diff.additions).toBe(0);
      expect(diff.deletions).toBe(2);
    });

    it('should generate correct summary', () => {
      const original = 'line 1\nline 2';
      const modified = 'line 1\nline 2\nline 3\nline 4';

      const diff = generateCodeDiff(original, modified);

      expect(diff.summary).toBe('+2 -0');
    });
  });

  describe('applyDiff', () => {
    it('should apply diff correctly to original code', () => {
      const original = 'line 1\nline 2';
      const diff = generateCodeDiff(original, 'line 1\nline 2\nline 3');

      const result = applyDiff(original, diff.changes);

      expect(result).toBe('line 1\nline 2\nline 3');
    });

    it('should apply removal diff correctly', () => {
      const original = 'line 1\nline 2\nline 3';
      const diff = generateCodeDiff(original, 'line 1\nline 3');

      const result = applyDiff(original, diff.changes);

      expect(result).toBe('line 1\nline 3');
    });

    it('should apply modification diff correctly', () => {
      const original = 'line 1\nline 2\nline 3';
      const diff = generateCodeDiff(original, 'line 1\nline 2 modified\nline 3');

      const result = applyDiff(original, diff.changes);

      expect(result).toBe('line 1\nline 2 modified\nline 3');
    });

    it('should handle no changes', () => {
      const original = 'line 1\nline 2';
      const diff = generateCodeDiff(original, original);

      const result = applyDiff(original, diff.changes);

      expect(result).toBe(original);
    });
  });

  describe('generateUnifiedDiff', () => {
    it('should generate unified diff format', () => {
      const original = 'line 1\nline 2';
      const modified = 'line 1\nline 2\nline 3';

      const unified = generateUnifiedDiff(original, modified, 'test.js');

      expect(unified).toContain('--- a/test.js');
      expect(unified).toContain('+++ b/test.js');
      expect(unified).toContain('@@ -1,2 +1,3 @@');
      expect(unified).toContain('+line 3');
    });

    it('should include both additions and removals', () => {
      const original = 'line 1\nline 2\nline 3';
      const modified = 'line 1\nline 2 modified\nline 4';

      const unified = generateUnifiedDiff(original, modified, 'test.js');

      expect(unified).toContain('-line 3');
      expect(unified).toContain('+line 2 modified');
      expect(unified).toContain('+line 4');
    });
  });

  describe('formatDiffForDisplay', () => {
    it('should format diff for display with line numbers', () => {
      const original = 'line 1\nline 2';
      const modified = 'line 1\nline 2\nline 3';
      const diff = generateCodeDiff(original, modified);

      const formatted = formatDiffForDisplay(diff);

      expect(formatted).toHaveLength(3);

      // Check line numbers are assigned correctly
      const addLine = formatted.find(f => f.type === DiffChangeType.ADD);
      expect(addLine?.rightLine).toBeDefined();
    });

    it('should handle remove changes', () => {
      const original = 'line 1\nline 2\nline 3';
      const modified = 'line 1\nline 2';
      const diff = generateCodeDiff(original, modified);

      const formatted = formatDiffForDisplay(diff);

      const removeLine = formatted.find(f => f.type === DiffChangeType.REMOVE);
      expect(removeLine).toBeDefined();
      expect(removeLine?.leftLine).toBeDefined();
    });

    it('should handle equal changes', () => {
      const original = 'line 1\nline 2';
      const modified = 'line 1\nline 2';
      const diff = generateCodeDiff(original, modified);

      const formatted = formatDiffForDisplay(diff);

      expect(formatted.every(f => f.type === DiffChangeType.EQUAL)).toBe(true);
      expect(formatted.every(f => f.leftLine !== undefined && f.rightLine !== undefined)).toBe(true);
    });
  });

  describe('generateDiffHTML', () => {
    it('should generate HTML for diff display', () => {
      const original = 'line 1\nline 2';
      const modified = 'line 1\nline 2\nline 3';
      const diff = generateCodeDiff(original, modified);

      const html = generateDiffHTML(diff);

      expect(html).toContain('<div class="diff-container">');
      expect(html).toContain('class="diff-line"');
      expect(html).toContain('diff-add');
    });

    it('should escape HTML entities', () => {
      const original = '<div id="test">hello</div>';
      const modified = '<div id="test">hello world</div>';
      const diff = generateCodeDiff(original, modified);

      const html = generateDiffHTML(diff);

      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');
      expect(html).not.toContain('<div id="test">');
    });
  });

  describe('calculateSimilarity', () => {
    it('should calculate 100% similarity for identical code', () => {
      const code = 'line 1\nline 2\nline 3';

      const similarity = calculateSimilarity(code, code);

      expect(similarity).toBe(1);
    });

    it('should calculate high similarity for minor changes', () => {
      const original = 'line 1\nline 2\nline 3\nline 4';
      const modified = 'line 1\nline 2 modified\nline 3\nline 4';

      const similarity = calculateSimilarity(original, modified);

      expect(similarity).toBeGreaterThan(0.5);
      expect(similarity).toBeLessThan(1);
    });

    it('should calculate low similarity for major changes', () => {
      const original = 'line 1\nline 2\nline 3';
      const modified = 'completely different\nline 1\nline 2';

      const similarity = calculateSimilarity(original, modified);

      expect(similarity).toBeLessThan(0.5);
    });

    it('should calculate 0% similarity for completely different code', () => {
      const similarity = calculateSimilarity('line 1\nline 2', 'completely different');

      expect(similarity).toBeCloseTo(0, 1);
    });
  });

  describe('isSignificantChange', () => {
    it('should detect significant changes (>10%)', () => {
      const original = 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nline 7\nline 8\nline 9\nline 10';
      const modified = 'line 1\nline 2\nline 3\ncompletely different\nline 5\nline 6\nline 7\nline 8\nline 9\nline 10';

      const isSignificant = isSignificantChange(original, modified, 0.1);

      expect(isSignificant).toBe(true);
    });

    it('should not flag minor changes (<10%)', () => {
      const original = 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nline 7\nline 8\nline 9\nline 10';
      const modified = 'line 1\nline 2\nline 3\nline 4 modified\nline 5\nline 6\nline 7\nline 8\nline 9\nline 10';

      const isSignificant = isSignificantChange(original, modified, 0.1);

      expect(isSignificant).toBe(false);
    });

    it('should support custom threshold', () => {
      const original = 'line 1\nline 2\nline 3\nline 4\nline 5';
      const modified = 'line 1\nline 2 modified\nline 3\nline 4\nline 5';

      // With 5% threshold, single line change is significant
      const isSignificantLow = isSignificantChange(original, modified, 0.05);
      expect(isSignificantLow).toBe(true);

      // With 50% threshold, single line change is not significant
      const isSignificantHigh = isSignificantChange(original, modified, 0.5);
      expect(isSignificantHigh).toBe(false);
    });
  });

  describe('findInlineDiff', () => {
    it('should detect word-level changes', () => {
      const original = 'const x = 5;';
      const modified = 'const result = 5;';

      const inline = findInlineDiff(original, modified);

      expect(inline.length).toBeGreaterThan(0);
      expect(inline.some(c => c.type === 'remove')).toBe(true);
      expect(inline.some(c => c.type === 'add')).toBe(true);
    });

    it('should detect word removal', () => {
      const original = 'const x = 5;';
      const modified = 'x = 5;';

      const inline = findInlineDiff(original, modified);

      expect(inline.some(c => c.type === 'remove' && c.content.includes('const'))).toBe(true);
    });

    it('should detect word addition', () => {
      const original = 'x = 5;';
      const modified = 'const x = 5;';

      const inline = findInlineDiff(original, modified);

      expect(inline.some(c => c.type === 'add' && c.content.includes('const'))).toBe(true);
    });

    it('should treat identical lines as equal', () => {
      const line = 'const x = 5;';

      const inline = findInlineDiff(line, line);

      expect(inline.every(c => c.type === 'equal')).toBe(true);
    });

    it('should preserve whitespace', () => {
      const original = 'x  =  5;';
      const modified = 'x = 5;';

      const inline = findInlineDiff(original, modified);

      // All parts should be present (some as remove, some as add, some as equal)
      expect(inline.length).toBeGreaterThan(0);
    });
  });
});
