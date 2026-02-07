/**
 * Code Diff API Endpoint
 *
 * Accepts POST requests to generate diffs between original and modified code.
 * Provides both structured diff data and formatted HTML for preview.
 *
 * Runtime: Node.js environment (server-side only)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateCodeDiff,
  generateUnifiedDiff,
  formatDiffForDisplay,
  generateDiffHTML,
  calculateSimilarity,
  isSignificantChange,
} from '@/lib/ai/code-diff';

/**
 * Request body structure
 */
interface CodeDiffRequest {
  original: string;
  modified: string;
  fileName?: string;
  format?: 'json' | 'unified' | 'html';
  includeHTML?: boolean;
}

/**
 * POST handler for code diff
 */
export async function POST(request: NextRequest) {
  try {
    const body: CodeDiffRequest = await request.json();
    const { original = '', modified = '', fileName = 'file.js', format = 'json', includeHTML = false } = body;

    // Validate required parameters
    if (!original && !modified) {
      return NextResponse.json(
        { error: 'At least one of original or modified code is required' },
        { status: 400 }
      );
    }

    console.log('[Code Diff] Generating diff:', {
      originalLength: original.length,
      modifiedLength: modified.length,
      fileName,
      format,
    });

    // Generate basic diff
    const diff = generateCodeDiff(original, modified);

    // Calculate similarity
    const similarity = calculateSimilarity(original, modified);
    const isSignificant = isSignificantChange(original, modified);

    // Build response based on format
    let responseData: Record<string, any> = {
      original,
      modified,
      diff: {
        changes: diff.changes,
        additions: diff.additions,
        deletions: diff.deletions,
        summary: diff.summary,
      },
      meta: {
        fileName,
        similarity: Math.round(similarity * 100) / 100,
        isSignificant,
        timestamp: new Date().toISOString(),
      },
    };

    // Add formatted versions if requested
    if (format === 'unified') {
      responseData.unifiedDiff = generateUnifiedDiff(original, modified, fileName);
    }

    if (format === 'json' || includeHTML) {
      // Include formatted data for display
      const formatted = formatDiffForDisplay(diff);
      responseData.formatted = formatted;

      // Include HTML if requested
      if (includeHTML) {
        responseData.html = generateDiffHTML(diff);
      }
    }

    return NextResponse.json({
      success: true,
      ...responseData,
    });

  } catch (error) {
    console.error('[Code Diff] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate code diff',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/ai/code-diff',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    supportedFormats: ['json', 'unified', 'html'],
  });
}
