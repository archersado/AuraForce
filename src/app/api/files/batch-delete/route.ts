/**
 * Batch Delete Files API Endpoint
 *
 * Deletes multiple files in a single request.
 * Supports:
 * - Batch file deletion
 * - Confirmation requirement
 * - Protected file filtering
 * - Error handling for partial failures
 *
 * Security: Validates all paths to prevent directory traversal attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { workspace } from '@/lib/config';
import { unlink, stat } from 'fs/promises';
import { relative, resolve } from 'path';

// Workspace root directory
const WORKSPACE_ROOT = process.cwd();

// Platform workspaces root (for user project workspaces)
const PLATFORM_WORKSPACE_ROOT = workspace.root ||
  (() => {
    // Determine platform workspace root relative to project root
    const platformRoot = join(WORKSPACE_ROOT, 'workspaces');
    return platformRoot;
  })();

// Maximum files per batch deletion
const MAX_BATCH_SIZE = 100;

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

// Files/directories that should not be deleted
const EXCLUDED_PATTERNS = [
  /node_modules/,
  /.git/,
  /.env/,
  /.next/,
  /dist/,
  /build/,
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

  // Check against excluded patterns
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(relativePath)) {
      return false;
    }
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

import { join } from 'path';

/**
 * DELETE /api/files/batch - Delete multiple files
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

    const body = await request.json();
    let { paths, root: rootParam, confirmed = false } = body;

    // Validate paths array
    if (!Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'Paths must be an array' },
        { status: 400 }
      );
    }

    if (paths.length === 0) {
      return NextResponse.json(
        { error: 'No files to delete' },
        { status: 400 }
      );
    }

    // Normalize paths: remove leading slash to treat as relative to root directory
    paths = paths.map((path: string) => {
      if (path.startsWith('/')) {
        return path.substring(1) || '';
      }
      return path;
    });

    if (paths.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        {
          error: `Too many files (max ${MAX_BATCH_SIZE} per request)`,
          maxSize: MAX_BATCH_SIZE,
          actualSize: paths.length,
        },
        { status: 413 }
      );
    }

    // Determine the root directory
    let rootDirectory = WORKSPACE_ROOT;
    if (rootParam) {
      // Validate that root is within allowed workspace directories
      const resolvedRoot = resolve(rootParam);

      // Security: In development, allow any valid root path for flexibility
      // In production, only allow roots within platform workspace or main workspace
      const isDev = process.env.NODE_ENV === 'development';

      if (!isDev) {
        // Production: Strict validation
        const relativeToPlatform = relative(PLATFORM_WORKSPACE_ROOT, resolvedRoot);
        const isWithinPlatform = !relativeToPlatform.startsWith('..');

        const relativeToWorkspace = relative(WORKSPACE_ROOT, resolvedRoot);
        const isWithinWorkspace = !relativeToWorkspace.startsWith('..');

        if (!isWithinPlatform && !isWithinWorkspace) {
          console.warn('[Files API] Invalid root directory attempted:', rootParam);
          return NextResponse.json(
            { error: 'Invalid root directory' },
            { status: 403 }
          );
        }
      } else {
        // Development: Allow any valid root path (for testing flexibility)
        console.log('[Files API] Development mode: allowing custom root path:', rootParam);
      }

      rootDirectory = resolvedRoot;
    }

    // Require confirmation for batch deletion
    if (!confirmed) {
      // Pre-validate all paths before asking for confirmation
      const validPaths = [];
      const validationErrors = [];

      for (const pathParam of paths) {
        try {
          const targetPath = resolve(rootDirectory, pathParam);

          // Security check
          if (!isSafePath(targetPath, rootDirectory)) {
            validationErrors.push({
              path: pathParam,
              error: 'Path traversal not allowed',
            });
            continue;
          }

          const fileStat = await stat(targetPath);

          if (!fileStat.isFile()) {
            validationErrors.push({
              path: pathParam,
              error: 'Not a file',
            });
            continue;
          }

          const protectedReason = isProtectedPath(targetPath);
          if (protectedReason) {
            validationErrors.push({
              path: pathParam,
              error: protectedReason,
            });
            continue;
          }

          validPaths.push(pathParam);
        } catch (error) {
          validationErrors.push({
            path: pathParam,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      if (validPaths.length === 0) {
        return NextResponse.json(
          {
            error: 'No valid files to delete',
            validationErrors,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        requiresConfirmation: true,
        message: `Please confirm deletion of ${validPaths.length} file(s) by setting confirmed=true`,
        validPaths,
        validationErrors,
        count: validPaths.length,
        total: paths.length,
      }, { status: 202 }); // Accepted, deletion pending confirmation
    }

    // Process batch deletion
    const results = {
      successful: [] as string[],
      failed: [] as { path: string; error: string }[],
      skipped: [] as { path: string; reason: string }[],
    };

    for (const pathParam of paths) {
      try {
        const targetPath = resolve(rootDirectory, pathParam);

        // Security check
        if (!isSafePath(targetPath, rootDirectory)) {
          results.skipped.push({
            path: pathParam,
            reason: 'Path traversal not allowed',
          });
          continue;
        }

        const fileStat = await stat(targetPath);

        // Ensure path is a file
        if (!fileStat.isFile()) {
          results.skipped.push({
            path: pathParam,
            reason: 'Not a file',
          });
          continue;
        }

        // Check if path is protected
        const protectedReason = isProtectedPath(targetPath);
        if (protectedReason) {
          results.skipped.push({
            path: pathParam,
            reason: protectedReason,
          });
          continue;
        }

        // Delete the file
        await unlink(targetPath);

        results.successful.push(relative(rootDirectory, targetPath));
      } catch (error) {
        console.error('[Files API] Error deleting file:', pathParam, error);
        results.failed.push({
          path: pathParam,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed deletion of ${paths.length} file(s)`,
      results,
      summary: {
        total: paths.length,
        successful: results.successful.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
      },
    });

  } catch (error) {
    console.error('[Files API] Error in batch delete:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
