/**
 * Workspace Search API
 *
 * GET /api/workspace/search - Search files in workspace
 * Implements STORY-14-10 and STORY-14-14
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { existsSync, readFileSync, statSync, readdirSync } from 'fs';
import path from 'path';

const PLATFORM_WORKSPACE_ROOT = path.join(process.cwd(), 'workspaces');

/**
 * Get file extension
 */
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1]?.toLowerCase() || '' : '';
}

/**
 * Determine file type
 */
function getFileType(filename: string): 'code' | 'markdown' | 'image' | 'pdf' | 'ppt' | 'other' {
  const ext = getFileExtension(filename);

  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'yaml', 'yml', 'css', 'scss', 'html', 'py', 'go', 'rs', 'java', 'php', 'sql'];
  const markdownExts = ['md', 'markdown'];
  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  const pdfExts = ['pdf'];
  const pptExts = ['ppt', 'pptx'];

  if (codeExts.includes(ext)) return 'code';
  if (markdownExts.includes(ext)) return 'markdown';
  if (imageExts.includes(ext)) return 'image';
  if (pdfExts.includes(ext)) return 'pdf';
  if (pptExts.includes(ext)) return 'ppt';
  return 'other';
}

/**
 * Search directory recursively
 */
function searchDirectory(
  dirPath: string,
  query: string,
  searchContents: boolean = false,
  fileType?: string,
  maxResults: number = 100,
  results: any[] = []
): any[] {
  if (results.length >= maxResults) return results;

  try {
    const items = readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (results.length >= maxResults) break;

      const fullPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        searchDirectory(fullPath, query, searchContents, fileType, maxResults, results);
      } else {
        const ext = getFileExtension(item.name);
        const type = getFileType(item.name);

        // Filter by type if specified
        if (fileType && type !== fileType) continue;

        const lowerQuery = query.toLowerCase();

        // Check filename match
        const filenameMatch = item.name.toLowerCase().includes(lowerQuery);

        let contentMatches = 0;
        let preview = '';

        if (searchContents && !filenameMatch) {
          try {
            // Only search text files
            const textFileExtensions = [
              'js', 'jsx', 'ts', 'tsx', 'json', 'yaml', 'yml', 'css', 'scss', 'html', 'md', 'txt', 'py', 'go', 'rs', 'java', 'php', 'sql'
            ];

            if (textFileExtensions.includes(ext)) {
              const content = readFileSync(fullPath, 'utf-8');
              const lines = content.toLowerCase().split('\n');

              for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(lowerQuery)) {
                  contentMatches++;
                  if (!preview && i < 10) {
                    preview = lines[i].trim().substring(0, 100);
                  }
                }
              }
            }
          } catch (e) {
            // Skip files that can't be read as text
          }
        }

        if (filenameMatch || contentMatches > 0) {
          const stats = statSync(fullPath);
          const userWorkspacePath = PLATFORM_WORKSPACE_ROOT;
          const relativePath = path.relative(userWorkspacePath, fullPath);

          results.push({
            name: item.name,
            path: '/' + relativePath.replace(/\\/g, '/'),
            type,
            size: stats.size,
            modifiedAt: stats.mtime.toISOString(),
            matches: filenameMatch ? 1 : contentMatches,
            preview: preview || filenameMatch ? item.name : '',
          });
        }
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }

  return results;
}

/**
 * GET /api/workspace/search - Search files
 * Query params:
 *   q - search query
 *   type - filter by file type (code, markdown, image, pdf, ppt, other)
 *   content - whether to search file contents (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const searchContents = searchParams.get('content') === 'true';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const userWorkspacePath = path.join(PLATFORM_WORKSPACE_ROOT, session.user.id);

    if (!existsSync(userWorkspacePath)) {
      return NextResponse.json({
        success: true,
        results: [],
        count: 0,
      });
    }

    const results = searchDirectory(
      userWorkspacePath,
      query,
      searchContents,
      type || undefined
    );

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
      query,
    });
  } catch (error) {
    console.error('[Workspace Search API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
