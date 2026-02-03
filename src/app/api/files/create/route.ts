/**
 * Create Empty File API Endpoint
 *
 * Creates a new empty file in the workspace.
 * Validates path to prevent directory traversal attacks.
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

// Maximum file name length
const MAX_FILENAME_LENGTH = 255;

// Invalid filename characters
const INVALID_FILENAME_CHARS = /[<>:"|?*]/g;

// Files/directories that should not be created
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
 * Validate filename
 */
function validateFilename(filename: string): { valid: boolean; error?: string } {
  // Check length
  if (filename.length === 0) {
    return { valid: false, error: 'Filename cannot be empty' };
  }

  if (filename.length > MAX_FILENAME_LENGTH) {
    return { valid: false, error: `Filename too long (max ${MAX_FILENAME_LENGTH} characters)` };
  }

  // Check for invalid characters
  if (INVALID_FILENAME_CHARS.test(filename)) {
    return { valid: false, error: 'Filename contains invalid characters' };
  }

  // Check for reserved names (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL'];
  const reservedWithExtensions = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
                                 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const baseName = filename.split('.')[0].toUpperCase();

  if (reservedNames.includes(baseName) || reservedWithExtensions.includes(baseName)) {
    return { valid: false, error: 'Filename is reserved' };
  }

  // Check if it starts or ends with space or dot
  if (filename.startsWith(' ') || filename.endsWith(' ') || filename.startsWith('.') || filename.endsWith('.')) {
    return { valid: false, error: 'Filename cannot start or end with space or dot' };
  }

  return { valid: true };
}

/**
 * POST /api/files/create - Create an empty file
 */
export async function POST(request: NextRequest) {
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
    let { path: filePath, content = '', root: rootParam } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Normalize path: remove leading slash to treat as relative to root directory
    if (filePath.startsWith('/')) {
      filePath = filePath.substring(1) || '';
    }

    // Validate filename
    const filename = filePath.split('/').pop() || '';
    const filenameValidation = validateFilename(filename);
    if (!filenameValidation.valid) {
      return NextResponse.json(
        { error: filenameValidation.error },
        { status: 400 }
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

    // Check if parent directory exists
    const parentDir = join(targetPath, '..');
    try {
      await stat(parentDir);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return NextResponse.json(
          { error: 'Parent directory does not exist' },
          { status: 400 }
        );
      }
      throw error;
    }

    // Check if file already exists
    try {
      await stat(targetPath);
      return NextResponse.json(
        { error: 'File already exists' },
        { status: 409 }
      );
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist, proceed with creation
    }

    // Create empty file (with optional content)
    await writeFile(targetPath, content, 'utf-8');

    // Get the created file's stats
    const fileStat = await stat(targetPath);

    return NextResponse.json({
      success: true,
      message: 'File created successfully',
      metadata: {
        path: relative(rootDirectory, targetPath),
        size: fileStat.size,
        lastModified: fileStat.mtime,
        filename,
      },
    });

  } catch (error) {
    console.error('[Files API] Error creating file:', error);

    if (error instanceof Error) {
      if (error.message.includes('permission') || error.message.includes('EACCES')) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
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
