/**
 * Workspace File Tree API Endpoint
 *
 * Returns recursive file tree for browsing workspace files.
 * Supports path parameter to specify starting directory.
 * Supports arbitrary depth recursion.
 *
 * Security: Validates path to prevent directory traversal attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { workspace } from '@/lib/config';
import { readdir, stat } from 'fs/promises';
import { join, relative, resolve } from 'path';

// Workspace root directory (project root for development)
const WORKSPACE_ROOT = process.cwd();

// Platform workspaces root (for user project workspaces)
const PLATFORM_WORKSPACE_ROOT = workspace.root ||
  (() => {
    // Determine platform workspace root relative to project root
    const platformRoot = join(WORKSPACE_ROOT, 'workspaces');
    return platformRoot;
  })();

// Maximum directory depth for security (prevent infinite recursion)
const MAX_DEPTH = 50;

// Files/directories to exclude from tree
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
 * Check if an item should be excluded from tree
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
 * Build file tree recursively
 */
async function buildTree(
  dirPath: string,
  relativeTo: string,
  depth: number = 0
): Promise<any> {
  // Security: prevent excessive recursion depth
  if (depth > MAX_DEPTH) {
    console.warn('[Files Tree API] Maximum depth exceeded:', dirPath);
    return null;
  }

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    const children = [];

    for (const entry of entries) {
      // Skip excluded items
      if (isExcluded(entry.name)) {
        continue;
      }

      const entryPath = join(dirPath, entry.name);

      // Additional security check for each entry
      if (!isSafePath(entryPath, relativeTo)) {
        continue;
      }

      try {
        const stats = await stat(entryPath);

        const relativePath = relative(relativeTo, entryPath);
        const node: any = {
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : 'file',
          path: relativePath,
        };

        // Recursively process directories
        if (entry.isDirectory()) {
          node.children = await buildTree(entryPath, relativeTo, depth + 1);
        }

        children.push(node);
      } catch (error) {
        // Skip entries that can't be accessed (permission issues, etc.)
        console.warn('[Files Tree API] Failed to stat entry:', entryPath, error);
        continue;
      }
    }

    // Sort: directories first, then files alphabetically
    children.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });

    return children;

  } catch (error) {
    console.warn('[Files Tree API] Failed to read directory:', dirPath, error);
    return [];
  }
}

/**
 * GET /api/files/tree - Get recursive file tree
 */
export async function GET(request: NextRequest) {
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
    let pathParam = searchParams.get('path') || '';
    const rootParam = searchParams.get('root') || '';

    // Normalize path: remove leading slash to treat as relative to root directory
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
          console.warn('[Files Tree API] Invalid root directory attempted:', rootParam);
          return NextResponse.json(
            { error: 'Invalid root directory' },
            { status: 403 }
          );
        }
      } else {
        // Development: Allow any valid root path (for testing flexibility)
        console.log('[Files Tree API] Development mode: allowing custom root path:', rootParam);
      }

      rootDirectory = resolvedRoot;
    }

    // Resolve the target path relative to the root directory
    let targetPath: string;
    if (pathParam && pathParam !== '/') {
      targetPath = resolve(rootDirectory, pathParam);
    } else {
      targetPath = rootDirectory;
    }

    // Security check: ensure path is within workspace root
    if (!isSafePath(targetPath, rootDirectory)) {
      console.warn('[Files Tree API] Path traversal attempt:', targetPath);
      return NextResponse.json(
        { error: 'Path traversal not allowed' },
        { status: 403 }
      );
    }

    // Get directory stats
    const fileStat = await stat(targetPath);

    // Ensure path is a directory
    if (!fileStat.isDirectory()) {
      return NextResponse.json(
        { error: 'Path is not a directory' },
        { status: 400 }
      );
    }

    // Build the tree starting from target path
    const children = await buildTree(targetPath, rootDirectory);

    // Get the relative path from root
    const relativePath = relative(rootDirectory, targetPath);

    // Build response object
    const tree = {
      name: relativePath === '' ? 'root' : relativePath.split(/[\\/]/).pop() || 'root',
      type: 'directory',
      path: relativePath === '' ? '' : relativePath,
      children,
    };

    return NextResponse.json({
      root: rootDirectory,
      path: relativePath === '' ? '/' : `/${relativePath}`,
      isRoot: targetPath === rootDirectory,
      tree,
    });

  } catch (error) {
    console.error('[Files Tree API] Error building file tree:', error);

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
