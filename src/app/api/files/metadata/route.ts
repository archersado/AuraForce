/**
 * File Metadata API Endpoint
 *
 * Provides detailed file metadata including:
 * - File size and type
 * - Last modified timestamp
 * - Creation time
 * - MIME type
 * - File permissions
 *
 * Security: Validates path to prevent directory traversal attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { workspace } from '@/lib/config';
import { stat, readdir } from 'fs/promises';
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

// Files/directories that should not be accessed
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
 * Map file extensions to MIME types
 */
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const mimeMap: Record<string, string> = {
    // Text files
    txt: 'text/plain',
    md: 'text/markdown',
    markdown: 'text/markdown',
    json: 'application/json',
    jsonc: 'application/json',
    xml: 'application/xml',
    yaml: 'application/x-yaml',
    yml: 'application/x-yaml',
    toml: 'application/toml',
    csv: 'text/csv',
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    scss: 'text/x-scss',
    sass: 'text/x-sass',
    js: 'text/javascript',
    jsx: 'text/javascript',
    mjs: 'text/javascript',
    cjs: 'text/javascript',
    ts: 'text/typescript',
    tsx: 'text/typescript',
    // Config files
    conf: 'text/plain',
    ini: 'text/plain',
    cfg: 'text/plain',
    env: 'text/plain',
    dockerfile: 'text/plain',
    makefile: 'text/plain',
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    ico: 'image/x-icon',
    bmp: 'image/bmp',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Archives
    zip: 'application/zip',
    rar: 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
    wma: 'audio/x-ms-wma',
    // Video
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    wmv: 'video/x-ms-wmv',
    // Code
    py: 'text/x-python',
    pyi: 'text/x-python',
    rs: 'text/x-rust',
    go: 'text/x-go',
    java: 'text/x-java-source',
    php: 'text/x-php',
    rb: 'text/x-ruby',
    sh: 'text/x-shellscript',
    bash: 'text/x-shellscript',
    zsh: 'text/x-shellscript',
    sql: 'text/x-sql',
    c: 'text/x-c',
    h: 'text/x-c',
    cpp: 'text/x-c++',
    hpp: 'text/x-c++',
    cs: 'text/x-csharp',
    swift: 'text/x-swift',
    kt: 'text/x-kotlin',
    dart: 'text/x-dart',
    // Database
    sqlite: 'application/x-sqlite3',
    db: 'application/octet-stream',
  };

  return mimeMap[ext] || 'application/octet-stream';
}

/**
 * Get file category based on MIME type
 */
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('text/')) {
    return 'text';
  }
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.startsWith('audio/')) {
    return 'audio';
  }
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType.startsWith('application/pdf')) {
    return 'document';
  }
  if (mimeType.includes('document') || mimeType.includes('spreadsheet') || mimeType.includes('presentation')) {
    return 'document';
  }
  if (mimeType === 'application/zip' || mimeType === 'application/gzip' || mimeType.includes('tar') || mimeType.includes('archive')) {
    return 'archive';
  }
  if (mimeType.startsWith('application/')) {
    return 'binary';
  }
  return 'unknown';
}

/**
 * Format file size to human readable format
 */
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * GET /api/files/metadata - Get file/directory metadata
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
    let pathParam = searchParams.get('path');
    const rootParam = searchParams.get('root') || '';
    const includeChildren = searchParams.get('includeChildren') === 'true';

    if (!pathParam) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

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
    if (pathParam && pathParam !== '/') {
      targetPath = resolve(rootDirectory, pathParam);
    } else {
      targetPath = rootDirectory;
    }

    // Security check: ensure path is within root directory
    if (!isSafePath(targetPath, rootDirectory)) {
      console.warn('[Files API] Path traversal attempt:', targetPath);
      return NextResponse.json(
        { error: 'Path traversal not allowed' },
        { status: 403 }
      );
    }

    // Get file/directory stats
    const fileStat = await stat(targetPath);
    const filename = targetPath.split('/').pop() || 'file';
    const relativePath = relative(rootDirectory, targetPath);

    // Build metadata object
    const metadata: any = {
      name: filename,
      path: relativePath === '' ? '/' : `/${relativePath}`,
      type: fileStat.isDirectory() ? 'directory' : 'file',
      size: fileStat.isFile() ? fileStat.size : undefined,
      sizeFormatted: fileStat.isFile() ? formatFileSize(fileStat.size) : undefined,
      lastModified: fileStat.mtime,
      createdAt: fileStat.birthtime,
      permissions: {
        mode: fileStat.mode,
        readable: !!(fileStat.mode & parseInt('0o444', 8)),
        writable: !!(fileStat.mode & parseInt('0o222', 8)),
        executable: !!(fileStat.mode & parseInt('0o111', 8)),
      },
    };

    // Add MIME type and category for files
    if (fileStat.isFile()) {
      const mimeType = getMimeType(filename);
      metadata.mimeType = mimeType;
      metadata.category = getFileCategory(mimeType);
    }

    // Include children for directories (if requested)
    if (fileStat.isDirectory() && includeChildren) {
      const entries = await readdir(targetPath, { withFileTypes: true });
      const children = [];

      for (const entry of entries) {
        if (entry.name.startsWith('.') && entry.name !== '.gitkeep') {
          continue; // Skip hidden files/directories
        }

        try {
          const entryPath = join(targetPath, entry.name);
          const entryStat = await stat(entryPath);

          const entryMetadata: any = {
            name: entry.name,
            path: relative(rootDirectory, entryPath),
            type: entry.isDirectory() ? 'directory' : 'file',
          };

          if (entry.isFile()) {
            const entryMimeType = getMimeType(entry.name);
            entryMetadata.size = entryStat.size;
            entryMetadata.sizeFormatted = formatFileSize(entryStat.size);
            entryMetadata.mimeType = entryMimeType;
            entryMetadata.category = getFileCategory(entryMimeType);
          }

          entryMetadata.lastModified = entryStat.mtime;

          children.push(entryMetadata);
        } catch (error) {
          // Skip inaccessible entries
          console.warn('[Files API] Failed to stat entry:', entry.name, error);
        }
      }

      // Sort children: directories first, then alphabetically
      children.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'directory' ? -1 : 1;
      });

      metadata.children = children;
      metadata.childCount = children.length;
      metadata.isDirectoryEmpty = children.length === 0;
    }

    return NextResponse.json({
      success: true,
      metadata,
      root: rootDirectory,
    });

  } catch (error) {
    console.error('[Files API] Error getting metadata:', error);

    if (error instanceof Error) {
      if (error.message.includes('no such file')) {
        return NextResponse.json(
          { error: 'File or directory not found' },
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
