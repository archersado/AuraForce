/**
 * Delete File API Endpoint
 *
 * Deletes a file from the workspace.
 * Requires confirmation for safety.
 *
 * Security: Validates path to prevent directory traversal attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { unlink, stat } from 'fs/promises';
import { relative, resolve } from 'path';

// Workspace root directory
const WORKSPACE_ROOT = process.cwd();

// Essential files that should never be deleted
const PROTECTED_FILES = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'next.config.js',
  'next.config.mjs',
  '.gitignore',
  'README.md',
  'src/app/layout.tsx',
  'src/app/page.tsx',
];

// Directory patterns that should not be deleted
const PROTECTED_PATTERNS = [
  /^src\/app$/,
  /^src\/components$/,
  /^src\/lib$/,
  /^prisma$/,
];

/**
 * Check if a path is safe (within workspace root)
 */
function isSafePath(path: string, root: string): boolean {
  const resolvedPath = resolve(path);
  const resolvedRoot = resolve(root);

  // Check if resolved path is within root
  const relativePath = relative(resolvedRoot, resolvedPath);

  // Path should not start with '..' and should not be absolute
  if (relativePath.startsWith('..') || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
    return false;
  }

  return true;
}

/**
 * Check if a path is protected (should not be deleted)
 */
function isProtectedPath(resolvedPath: string): string | null {
  const relativePath = relative(WORKSPACE_ROOT, resolvedPath);

  // Check protected files
  if (PROTECTED_FILES.includes(relativePath)) {
    return `File "${relativePath}" is protected and cannot be deleted`;
  }

  // Check protected directory patterns
  for (const pattern of PROTECTED_PATTERNS) {
    if (pattern.test(relativePath)) {
      return `${relativePath} is a protected directory and cannot be deleted`;
    }
  }

  return null;
}

/**
 * DELETE /api/files/delete - Delete a file
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication using custom session system
    // Skip authentication in development mode for easier testing
    const isDev = process.env.NODE_ENV === 'development';
    const session = await getSession({ skipInDev: isDev });
    if (!session?.userId && !isDev) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    let pathParam = searchParams.get('path');
    const confirmed = searchParams.get('confirmed') === 'true';

    if (!pathParam) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Normalize path: remove leading slash to treat as relative to workspace root
    if (pathParam.startsWith('/')) {
      pathParam = pathParam.substring(1) || '';
    }

    // Resolve the target path relative to workspace root
    const targetPath = resolve(WORKSPACE_ROOT, pathParam);

    // Security check: ensure path is within workspace root
    if (!isSafePath(targetPath, WORKSPACE_ROOT)) {
      console.warn('[Files API] Path traversal attempt:', targetPath);
      return NextResponse.json(
        { error: 'Path traversal not allowed' },
        { status: 403 }
      );
    }

    // Get file stats to ensure it exists and is a file
    const fileStat = await stat(targetPath);

    // Ensure path is a file (not a directory)
    if (fileStat.isDirectory()) {
      return NextResponse.json(
        { error: 'Cannot delete directories - use file deletion only' },
        { status: 400 }
      );
    }

    // Check if path is protected
    const protectedReason = isProtectedPath(targetPath);
    if (protectedReason) {
      return NextResponse.json(
        { error: protectedReason },
        { status: 403 }
      );
    }

    // Require confirmation for better safety
    if (!confirmed) {
      return NextResponse.json({
        requiresConfirmation: true,
        message: 'Please confirm deletion by adding ?confirmed=true to the request',
        path: relative(WORKSPACE_ROOT, targetPath),
      }, { status: 202 }); // Accepted, deletion pending confirmation
    }

    // Delete the file
    await unlink(targetPath);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      deletedPath: relative(WORKSPACE_ROOT, targetPath),
    });

  } catch (error) {
    console.error('[Files API] Error deleting file:', error);

    if (error instanceof Error) {
      if (error.message.includes('no such file') || error.message.includes('ENOENT')) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('permission') || error.message.includes('EACCES')) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        );
      }
      if (error.message.includes('EISDIR')) {
        return NextResponse.json(
          { error: 'Cannot delete directories through this endpoint' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
