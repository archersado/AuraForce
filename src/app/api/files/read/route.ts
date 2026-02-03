/**
 * Read File Content API Endpoint
 *
 * Returns file content with metadata.
 * Supports text files and provides warnings for large files.
 *
 * Security: Validates path to prevent directory traversal attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { workspace } from '@/lib/config';
import { readFile, stat } from 'fs/promises';
import { join, relative, resolve, join as pathJoin } from 'path';

// Workspace root directory
const WORKSPACE_ROOT = process.cwd();

// Platform workspaces root (for user project workspaces)
const PLATFORM_WORKSPACE_ROOT = workspace.root ||
  (() => {
    // Determine platform workspace root relative to project root
    const platformRoot = join(WORKSPACE_ROOT, 'workspaces');
    return platformRoot;
  })();

// Maximum file size for reading (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Threshold for warning (1MB)
const LARGE_FILE_THRESHOLD = 1 * 1024 * 1024;

// Files/directories that should not be read
const EXCLUDED_PATTERNS = [
  /node_modules/,
  /.git/,
  /.env/,
  /.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.lock$/,
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

// Text file extensions that should always be treated as text (even if they have unusual characters)
const TEXT_FILE_EXTENSIONS = [
  'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'mts', 'cts',
  'md', 'mdx', 'markdown', 'txt', 'rst',
  'json', 'jsonc', 'yaml', 'yml', 'toml', 'xml',
  'html', 'htm', 'xhtml', 'css', 'scss', 'sass', 'less',
  'py', 'pyi', 'java', 'c', 'h', 'cc', 'cpp', 'hpp', 'cxx', 'hxx',
  'php', 'rs', 'go', 'sh', 'bash', 'zsh', 'fish',
  'sql', 'conf', 'ini', 'cfg', 'env', 'dotenv',
  'gitignore', 'gitattributes', 'editorconfig',
  'dockerfile', 'makefile', 'cmake',
];

/**
 * Detect if file is likely binary
 */
function isBinaryFile(content: Buffer, filename?: string): boolean {
  // First check file extension against known text file types
  const ext = filename?.split('.').pop()?.toLowerCase() || '';
  if (TEXT_FILE_EXTENSIONS.includes(ext)) {
    return false; // Always treat known text file extensions as text
  }

  // Check for null bytes (common in binary files)
  if (content.includes('\0')) {
    return true;
  }

  // Check if more than 30% of bytes are non-printable (increased threshold)
  const sampleSize = Math.min(content.length, 2000);
  if (sampleSize === 0) return false;

  let nonPrintableCount = 0;

  for (let i = 0; i < sampleSize; i++) {
    const byte = content[i];
    // Consider bytes 9-13 (tab, newline, carriage return, etc.) as printable
    // Consider bytes 32-126 (printable ASCII) as printable
    // Consider bytes > 127 (UTF-8 continuation bytes) as potentially printable
    if ((byte < 9 || byte > 13) && (byte < 32 || byte > 126)) {
      // Allow UTF-8 bytes (>127) as they're common in text files
      if (byte > 127 && byte < 256) {
        continue;
      }
      nonPrintableCount++;
    }
  }

  // Increase threshold to 30% to avoid false positives
  return (nonPrintableCount / sampleSize) > 0.3;
}

/**
 * Detect MIME type based on file extension
 */
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const mimeMap: Record<string, string> = {
    // JavaScript/TypeScript
    ts: 'text/typescript',
    tsx: 'text/typescript',
    js: 'text/javascript',
    jsx: 'text/javascript',
    mjs: 'text/javascript',
    cjs: 'text/javascript',
    mts: 'text/typescript',
    cts: 'text/typescript',
    // Markup & Data
    json: 'application/json',
    jsonc: 'application/json',
    md: 'text/markdown',
    mdx: 'text/markdown',
    markdown: 'text/markdown',
    rst: 'text/plain',
    txt: 'text/plain',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    toml: 'text/toml',
    xml: 'text/xml',
    html: 'text/html',
    htm: 'text/html',
    xhtml: 'text/html',
    // Styles
    css: 'text/css',
    scss: 'text/x-scss',
    sass: 'text/x-sass',
    less: 'text/x-less',
    // Scripts
    py: 'text/x-python',
    pyi: 'text/x-python',
    sh: 'text/x-shellscript',
    bash: 'text/x-shellscript',
    zsh: 'text/x-shellscript',
    // Config files
    conf: 'text/plain',
    ini: 'text/plain',
    cfg: 'text/plain',
    env: 'text/plain',
    dockerfile: 'text/plain',
    makefile: 'text/plain',
  };

  return mimeMap[ext] || 'text/plain';
}

/**
 * GET /api/files/read - Read file content
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
    const targetPath = resolve(rootDirectory, pathParam);

    // Security check: ensure path is within root directory
    if (!isSafePath(targetPath, rootDirectory)) {
      console.warn('[Files API] Path traversal attempt:', targetPath);
      return NextResponse.json(
        { error: 'Path traversal not allowed' },
        { status: 403 }
      );
    }

    // Get file stats
    const fileStat = await stat(targetPath);

    // Ensure path is a file
    if (!fileStat.isFile()) {
      return NextResponse.json(
        { error: 'Path is not a file' },
        { status: 400 }
      );
    }

    // Check file size
    if (fileStat.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          maxSize: MAX_FILE_SIZE,
          actualSize: fileStat.size,
        },
        { status: 413 }
      );
    }

    // Detect large file warning
    const isLarge = fileStat.size > LARGE_FILE_THRESHOLD;
    const filename = targetPath.split('/').pop() || 'file';

    // Read file content
    const content = await readFile(targetPath);

    // Check if file is binary (pass filename for extension-based detection)
    if (isBinaryFile(content, filename)) {
      return NextResponse.json({
        content: '',
        metadata: {
          path: relative(rootDirectory, targetPath),
          size: fileStat.size,
          lastModified: fileStat.mtime,
          mimeType: 'application/octet-stream',
          filename,
        },
        isBinary: true,
        warning: 'Binary file - content not available for viewing',
      });
    }

    const textContent = content.toString('utf-8');

    return NextResponse.json({
      content: textContent,
      metadata: {
        path: relative(rootDirectory, targetPath),
        size: fileStat.size,
        lastModified: fileStat.mtime,
        mimeType: getMimeType(filename),
        filename,
      },
      isLarge,
      warning: isLarge
        ? 'Large file - may impact editor performance'
        : undefined,
    });

  } catch (error) {
    console.error('[Files API] Error reading file:', error);

    if (error instanceof Error) {
      if (error.message.includes('no such file')) {
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
