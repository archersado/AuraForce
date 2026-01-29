/**
 * Workspace Files Service
 *
 * API client for workspace file operations.
 *
 * This module provides functions for:
 * - Listing directory contents
 * - Reading file contents
 * - Writing file contents
 * - Deleting files
 */

import { apiFetch, buildApiUrl } from '@/lib/api-client';

export interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified?: Date | string;
  icon: string;
}

export interface DirectoryListingResponse {
  path: string;
  isRoot: boolean;
  files: FileInfo[];
}

export interface FileMetadata {
  path: string;
  size: number;
  lastModified: Date | string;
  mimeType: string;
  filename: string;
}

export interface FileReadResponse {
  content: string;
  metadata: FileMetadata;
  isBinary?: boolean;
  isLarge?: boolean;
  warning?: string;
}

export interface FileWriteResponse {
  success: boolean;
  message: string;
  metadata: FileMetadata;
}

export interface FileDeleteResponse {
  success: boolean;
  message: string;
  deletedPath: string;
  requiresConfirmation?: boolean;
}

/**
 * List directory contents
 */
export async function listDirectory(path?: string, root?: string): Promise<DirectoryListingResponse> {
  const url = new URL(buildApiUrl('/api/files/list'), window.location.origin);

  if (path) {
    url.searchParams.set('path', path);
  }

  if (root) {
    url.searchParams.set('root', root);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list directory');
  }

  return response.json();
}

/**
 * Read file content
 */
export async function readFile(path: string, root?: string): Promise<FileReadResponse> {
  const url = new URL(buildApiUrl('/api/files/read'), window.location.origin);
  url.searchParams.set('path', path);

  if (root) {
    url.searchParams.set('root', root);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to read file');
  }

  return response.json();
}

/**
 * Write file content
 */
export async function writeFile(path: string, content: string, root?: string): Promise<FileWriteResponse> {
  const response = await apiFetch('/api/files/write', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, content, root }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to write file');
  }

  return response.json();
}

/**
 * Delete file (with optional confirmation)
 */
export async function deleteFile(path: string, confirmed = false): Promise<FileDeleteResponse> {
  const url = new URL(buildApiUrl('/api/files/delete'), window.location.origin);
  url.searchParams.set('path', path);

  if (confirmed) {
    url.searchParams.set('confirmed', 'true');
  }

  const response = await fetch(url.toString(), {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 202) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete file');
  }

  return response.json();
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get language from file extension
 */
export function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const name = filename.toLowerCase();

  // Language extensions mapping
  const langMap: Record<string, string> = {
    // JavaScript/TypeScript
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    mts: 'typescript',
    cjs: 'javascript',
    cts: 'typescript',
    // Markup & Data
    json: 'json',
    jsonc: 'json',
    md: 'markdown',
    mdx: 'markdown',
    markdown: 'markdown',
    rst: 'markdown',
    txt: 'text',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    xml: 'xml',
    svg: 'xml',
    html: 'html',
    htm: 'html',
    xhtml: 'html',
    xht: 'html',
    // Styles
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',
    styl: 'css',
    // Python
    py: 'python',
    pyi: 'python',
    pyw: 'python',
    // Java
    java: 'java',
    jar: 'java',
    // C/C++
    c: 'cpp',
    h: 'cpp',
    cc: 'cpp',
    cpp: 'cpp',
    hpp: 'cpp',
    cxx: 'cpp',
    hxx: 'cpp',
    // PHP
    php: 'php',
    phtml: 'php',
    php3: 'php',
    php4: 'php',
    php5: 'php',
    // Rust
    rs: 'rust',
    // Go
    go: 'go',
    // Database
    sql: 'sql',
    sqlite: 'sql',
    db: 'sql',
    // Shell/Bash
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    fish: 'bash',
    // Configuration files
    conf: 'text',
    ini: 'text',
    cfg: 'text',
    env: 'text',
    dotenv: 'text',
    gitignore: 'text',
    gitattributes: 'text',
    // Scripts
    rb: 'ruby',
    pl: 'perl',
    pm: 'perl',
    tcl: 'tcl',
    vue: 'vue',
    svelte: 'svelte',
  };

  // Check full filename for special cases
  if (name === 'makefile' || name === 'gnumakefile') {
    return 'make';
  }
  if (name === 'dockerfile') {
    return 'dockerfile';
  }
  if (name === 'docker-compose.yml' || name === 'docker-compose.yaml') {
    return 'yaml';
  }
  if (name === 'requirements.txt') {
    return 'python';
  }
  if (name === 'package.json' || name === 'package-lock.json') {
    return 'json';
  }
  if (name === 'tsconfig.json') {
    return 'json';
  }

  // Match exact extension first
  if (name.endsWith('.d.ts') || name.endsWith('.d.tsx')) {
    return 'typescript';
  }
  if (name.endsWith('.test.ts') || name.endsWith('.test.tsx')) {
    return 'typescript';
  }
  if (name.endsWith('.spec.ts') || name.endsWith('.spec.tsx')) {
    return 'typescript';
  }

  return langMap[ext] || 'text';
}
