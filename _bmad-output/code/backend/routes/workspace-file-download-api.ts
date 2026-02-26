/**
 * Workspace File Download API
 *
 * GET /api/workspace/files/download - Download raw file content
 * Supports binary files (PDF, PPTX, images, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { existsSync, readFileSync, statSync } from 'fs';
import * as path from 'path';

const PLATFORM_WORKSPACE_ROOT = path.join(process.cwd(), 'workspaces');

/**
 * GET /api/workspace/files/download?path=/filename - Download file (supports binary)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pathParam = searchParams.get('path');

    if (!pathParam) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Validate path to prevent directory traversal
    const userWorkspacePath = path.join(PLATFORM_WORKSPACE_ROOT, session.user.id);
    const normalizedInput = path.normalize(pathParam).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(userWorkspacePath, normalizedInput);

    const relativePath = path.relative(userWorkspacePath, fullPath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      return NextResponse.json({ error: 'Cannot download directory' }, { status: 400 });
    }

    // Read file as buffer (supports binary files)
    const buffer = readFileSync(fullPath);

    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = getContentType(ext);

    // Get filename
    const filename = path.basename(fullPath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[Workspace File Download API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    // Documents
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    '.avif': 'image/avif',

    // Videos
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',

    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',

    // Archives
    '.zip': 'application/zip',
    '.rar': 'application/vnd.rar',
    '.7z': 'application/x-7z-compressed',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',

    // Text files
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.ts': 'text/typescript',

    // Code files
    '.py': 'text/x-python',
    '.java': 'text/x-java-source',
    '.c': 'text/x-c',
    '.cpp': 'text/x-c++',
    '.sh': 'text/x-shellscript',
  };

  return contentTypes[ext] || 'application/octet-stream';
}
