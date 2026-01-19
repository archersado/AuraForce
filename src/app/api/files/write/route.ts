/**
 * Write File Content API Endpoint
 *
 * Writes content to a file in the workspace.
 * Creates parent directories if they don't exist.
 *
 * Security: Validates path to prevent directory traversal attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { workspace } from '@/lib/config';
import { writeFile, mkdir, stat } from 'fs/promises';
import { join, relative, resolve } from 'path';

// Workspace root directory
const WORKSPACE_ROOT = process.cwd();

// Platform workspaces root (for user project workspaces)
const PLATFORM_WORKSPACE_ROOT = workspace.root ||
  (() => {
    // Determine platform workspace root relative to project root
    const platformRoot = join(WORKSPACE_ROOT, 'workspaces');
    return platformRoot;
  })();

// Maximum file size for writing (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Files/directories that should not be written to
const EXCLUDED_PATTERNS = [
  /node_modules/,
  /.git/,
  /.env/,
  /.env\.local/,
  /next-env\.d\.ts/,
  /tsconfig\.tsbuildinfo/,
];

/**
 * Check if a path is safe (within workspace root)
 */
function isSafePath(pathParam: string, root: string): boolean {
  const resolvedPath = resolve(pathParam);
  const resolvedRoot = resolve(root);

  // Check if resolved path is within root
  const relativePath = relative(resolvedRoot, resolvedPath);

  // Path should not start with '..' and should not be absolute
  if (relativePath.startsWith('..') || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
    return false;
  }

  // Check against excluded patterns
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(relativePath)) {
      return false;
    }
  }

  return true;
}

/**
 * PUT /api/files/write - Write file content
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication using custom session system
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { path: filePath, content, root: rootParam, createIfMissing = true } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string' },
        { status: 400 }
      );
    }

    // Check content size
    const contentBuffer = Buffer.from(content, 'utf-8');
    if (contentBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'Content too large',
          maxSize: MAX_FILE_SIZE,
          actualSize: contentBuffer.length,
        },
        { status: 413 }
      );
    }

    // Determine the root directory
    let rootDirectory = WORKSPACE_ROOT;
    if (rootParam) {
      // Validate that root is within allowed workspace directories
      const resolvedRoot = resolve(rootParam);

      // Security: Only allow roots within platform workspace or main workspace
      const relativeToPlatform = relative(PLATFORM_WORKSPACE_ROOT, resolvedRoot);
      const isWithinPlatform = !relativeToPlatform.startsWith('..') && !resolve(relativeToPlatform).startsWith(resolve('/'));

      const relativeToWorkspace = relative(WORKSPACE_ROOT, resolvedRoot);
      const isWithinWorkspace = !relativeToWorkspace.startsWith('..') && !resolve(relativeToWorkspace).startsWith(resolve('/'));

      if (!isWithinPlatform && !isWithinWorkspace) {
        console.warn('[Files API] Invalid root directory attempted:', rootParam);
        return NextResponse.json(
          { error: 'Invalid root directory' },
          { status: 403 }
        );
      }

      rootDirectory = resolvedRoot;
    }

    // Resolve the target path relative to root directory
    const targetPath = resolve(rootDirectory, filePath);

    // Security check: ensure path is within root directory
    if (!isSafePath(targetPath, rootDirectory)) {
      console.warn('[Files API] Path traversal attempt:', targetPath);
      return NextResponse.json(
        { error: 'Path traversal not allowed' },
        { status: 403 }
      );
    }

    // Check if parent directory exists, create if needed
    const parentDir = join(targetPath, '..');
    try {
      await stat(parentDir);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        if (createIfMissing) {
          await mkdir(parentDir, { recursive: true });
        } else {
          return NextResponse.json(
            { error: 'Parent directory does not exist' },
            { status: 400 }
          );
        }
      } else {
        throw error;
      }
    }

    // Write file content
    await writeFile(targetPath, content, 'utf-8');

    // Get the written file's stats
    const fileStat = await stat(targetPath);
    const filename = targetPath.split('/').pop() || 'file';

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
      metadata: {
        path: relative(rootDirectory, targetPath),
        size: fileStat.size,
        lastModified: fileStat.mtime,
        filename,
      },
    });

  } catch (error) {
    console.error('[Files API] Error writing file:', error);

    if (error instanceof Error) {
      if (error.message.includes('permission') || error.message.includes('EACCES')) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        );
      }
      if (error.message.includes('EISDIR')) {
        return NextResponse.json(
          { error: 'Path is a directory, not a file' },
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
