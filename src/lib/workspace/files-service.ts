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
 * - Renaming files
 * - Creating directories
 * - Moving files/directories
 * - Uploading multiple files
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

export interface FileRenameResponse {
  success: boolean;
  message: string;
  oldPath: string;
  newPath: string;
  filename: string;
}

export interface DirectoryCreateResponse {
  success: boolean;
  message: string;
  path: string;
  dirname: string;
  directoryName: string;
}

export interface FileMoveResponse {
  success: boolean;
  message: string;
  oldPath: string;
  newPath: string;
  filename: string;
}

export interface FileUploadResponse {
  success: boolean;
  uploaded: number;
  results: any[];
  errors: any[];
  targetPath: string;
}

/**
   * Get file preview URL for a file
   */
export function getFilePreviewUrl(path: string, root?: string): string {
  const url = new URL(buildApiUrl('/api/files/read'), window.location.origin);
  url.searchParams.set('path', path);
  if (root) {
    url.searchParams.set('root', root);
  }
  return url.toString();
}

/**
 * List directory contents
 */
export async function listDirectory(
  path?: string,
  root?: string
): Promise<DirectoryListingResponse> {
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
export async function readFile(
  path: string,
  root?: string
): Promise<FileReadResponse> {
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
export async function writeFile(
  path: string,
  content: string,
  root?: string
): Promise<FileWriteResponse> {
  const response = await apiFetch('/api/files/write', {
    method: 'POST',
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
export async function deleteFile(
  path: string,
  confirmed = false
): Promise<FileDeleteResponse> {
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
 * Rename a file or directory
 */
export async function renameFile(
  currentPath: string,
  newName: string,
  workspaceRoot?: string
): Promise<FileRenameResponse> {
  const response = await apiFetch('/api/files/rename', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPath, newName, workspaceRoot }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to rename file');
  }

  return response.json();
}

/**
 * Create a new directory
 */
export async function createDirectory(
  directoryName: string,
  parentPath: string = '/',
  workspaceRoot?: string
): Promise<DirectoryCreateResponse> {
  const response = await apiFetch('/api/files/mkdir', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ directoryName, parentPath, root: workspaceRoot }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create directory');
  }

  return response.json();
}

/**
 * Move a file or directory
 */
export async function moveFile(
  sourcePath: string,
  destinationPath: string,
  workspaceRoot?: string
): Promise<FileMoveResponse> {
  const response = await apiFetch('/api/files/move', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sourcePath, destinationPath, root: workspaceRoot }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to move file');
  }

  return response.json();
}

/**
 * Upload files
 */
export async function uploadFiles(
  files: File[],
  targetPath: string
): Promise<FileUploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  formData.append('path', targetPath);

  const response = await apiFetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload files');
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
    yaml: 'yaml',
    xml: 'xml',
    html: 'html',
    htm: 'html',
    xhtml: 'html',
    md: 'markdown',
    markdown: 'markdown',
    mdx: 'markdown',
    // CSS
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    styl: 'css',
    // Python
    py: 'python',
    pyi: 'python',
    pyw: 'python',
    // Java
    java: 'java',
    // C/C++
    c: 'cpp',
    h: 'cpp',
    cc: 'cpp',
    cpp: 'cpp',
    hpp: 'cpp',
    cxx: 'cpp',
    hxx: 'cpp',
    cxx: 'cpp',
    // PHP
    php: 'php',
    // Rust
    rs: 'rust',
    // Go
    go: 'go',
    // Database
    sql: 'sqlite',
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
    dotenv: 'text',
    gitignore: 'text',
    gitattributes: 'gitattr',
  };

  // Check full filename for special cases
  if (name === 'package.json' || name === 'package-lock.json') {
    return 'json';
  }
  if (name === 'tsconfig.json') {
    return 'json';
  }

  return langMap[ext] || 'text';
}

/**
 * Check if a file is an image
 */
export function isImageFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const imageExtensions = [
    'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico',
    'tiff', 'tif', 'avif', 'heic', 'heif'
  ];
  return imageExtensions.includes(ext);
}

/**
 * Check if a file is a presentation (PPT/PPTX)
 */
export function isPresentationFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const presentationExtensions = ['ppt', 'pptx', 'odp'];
  return presentationExtensions.includes(ext);
}
