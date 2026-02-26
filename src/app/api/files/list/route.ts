/**
 * List Workspace Files API Endpoint
 *
 * Returns directory contents for browsing workspace files.
 * Supports path parameter to list specific directories.
 *
 * Security: Validates path to prevent directory traversal attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/custom-session';
import { workspace } from '@/lib/config';
import { existsSync } from 'fs';
import { mkdir, readdir, stat } from 'fs/promises';
import { join, relative, resolve } from 'path';
import { isSafePath } from '@/lib/api/path-security';

// Workspace root directory (project root for development)
const WORKSPACE_ROOT = process.cwd();

// Platform workspaces root (for user project workspaces)
const PLATFORM_WORKSPACE_ROOT = workspace.root ||
  (() => {
    // Determine platform workspace root relative to project root
    const platformRoot = join(WORKSPACE_ROOT, 'workspaces');
    return platformRoot;
  })();

// Maximum directory depth for security
const MAX_DEPTH = 10;

// Files/directories to exclude from listings
const EXCLUDED_ITEMS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.env',
  '.env.local',
  '.env.*.local',
  'coverage',
  '.nyc_output',
];

/**
 * Check if an item should be excluded from listings
 */
function isExcluded(name: string): boolean {
  // Filter items starting with underscore (_) or dot (.)
  if (name.startsWith('_') || name.startsWith('.')) {
    return true;
  }

  return EXCLUDED_ITEMS.some(pattern => {
    // Handle wildcards
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(name);
    }
    return name === pattern;
  });
}

/**
 * Get file icon based on extension
 */
function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const iconMap: Record<string, string> = {
    // Source code
    ts: '📘',
    tsx: '⚛️',
    js: '📜',
    jsx: '⚛️',
    // Style
    css: '🎨',
    scss: '🎨',
    less: '🎨',
    json: '📋',
    // Config
    md: '📝',
    txt: '📄',
    yaml: '⚙️',
    yml: '⚙️',
    toml: '⚙️',
    // Assets
    png: '🖼️',
    jpg: '🖼️',
    jpeg: '🖼️',
    gif: '🖼️',
    svg: '🎨',
    ico: '🖼️',
    // Build
    html: '🌐',
    xml: '📜',
    // Database
    sql: '🗄️',
    sqlite: '🗄️',
    db: '🗄️',
    // Other
    lock: '🔒',
    gitignore: '🔒',
    env: '⚠️',
  };

  return iconMap[ext] || '📄';
}

/**
 * GET /api/files/list - List directory contents
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication using custom session system
    // Skip authentication in development mode for easier testing
    const isDev = process.env.NODE_ENV === 'development';
    const session = await getSession();
    if (!session?.user?.id && !isDev) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    let pathParam = searchParams.get('path') || '';
    const rootParam = searchParams.get('root') || '';

    // Normalize path: remove leading slash to treat as relative to root directory
    // This ensures "/src" and "src" are treated the same way
    if (pathParam.startsWith('/')) {
      pathParam = pathParam.substring(1) || '';
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

    // Resolve the target path relative to the root directory
    let targetPath: string;
    let isListingRoot = false;

    if (pathParam && pathParam !== '/') {
      targetPath = resolve(rootDirectory, pathParam);
    } else {
      targetPath = rootDirectory;
      isListingRoot = true;
    }

    // Security check: ensure path is within workspace root
    // Allow root directory when listing
    if (!isSafePath(targetPath, rootDirectory, { allowRoot: isListingRoot })) {
      console.warn('[Files API] Path traversal attempt:', targetPath);
      return NextResponse.json(
        { error: 'Path traversal not allowed' },
        { status: 403 }
      );
    }

    // Get directory stats
    let fileStat;
    try {
      fileStat = await stat(targetPath);
    } catch (error) {
      // Handle missing directories gracefully - create directory if it doesn't exist
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        console.log('[Files API] Directory does not exist, creating:', targetPath);
        try {
          // Only create if it's within a valid workspace path
          await mkdir(targetPath, { recursive: true });
          fileStat = await stat(targetPath);
        } catch (createError) {
          console.error('[Files API] Failed to create directory:', createError);
          return NextResponse.json(
            { error: 'Failed to create directory' },
            { status: 500 }
          );
        }
      } else {
        throw error;
      }
    }

    // Ensure path is a directory
    if (!fileStat.isDirectory()) {
      return NextResponse.json(
        { error: 'Path is not a directory' },
        { status: 400 }
      );
    }

    // Read directory contents
    const entries = await readdir(targetPath, { withFileTypes: true });

    // Process entries and collect metadata
    const files = [];
    for (const entry of entries) {
      // Skip excluded items
      if (isExcluded(entry.name)) {
        continue;
      }

      const entryPath = join(targetPath, entry.name);

      // Additional security check for each entry
      if (!isSafePath(entryPath, rootDirectory)) {
        continue;
      }

      try {
        const stats = await stat(entryPath);

        files.push({
          name: entry.name,
          path: relative(rootDirectory, entryPath),
          type: entry.isDirectory() ? 'directory' : 'file',
          size: entry.isFile() ? stats.size : undefined,
          lastModified: stats.mtime,
          icon: entry.isDirectory() ? '📁' : getFileIcon(entry.name),
        });
      } catch (error) {
        // Skip entries that can't be accessed (permission issues, etc.)
        console.warn('[Files API] Failed to stat entry:', entryPath, error);
        continue;
      }
    }

    // Sort: directories first, then files alphabetically
    files.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });

    // Return relative path from root
    const relativePath = relative(rootDirectory, targetPath);

    return NextResponse.json({
      root: rootDirectory,
      path: relativePath === '' ? '/' : `/${relativePath}`,
      isRoot: targetPath === rootDirectory,
      files,
    });

  } catch (error) {
    console.error('[Files API] Error listing directory:', error);

    if (error instanceof Error) {
      if (error.message.includes('no such file')) {
        return NextResponse.json(
          { error: 'Directory not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('permission')) {
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
