/**
 * Backend Utilities
 *
 * File system operations, validation helpers, logging utilities
 */

import { existsSync, statSync } from 'fs';
import path from 'path';

/**
 * File System Utilities
 */

/**
 * Check if path is within a base directory (security check)
 */
export function isPathWithin(basePath: string, targetPath: string): boolean {
  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(targetPath);
  const relative = path.relative(resolvedBase, resolvedTarget);
  return !relative.startsWith('..') && !path.isAbsolute(relative);
}

/**
 * Get file stats safely
 */
export function getFileStats(filePath: string): null | {
  size: number;
  modifiedAt: Date;
  createdAt: Date;
  isFile: boolean;
  isDirectory: boolean;
} {
  try {
    const stats = statSync(filePath);
    return {
      size: stats.size,
      modifiedAt: stats.mtime,
      createdAt: stats.birthtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
    };
  } catch {
    return null;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate filename to prevent security issues
 */
export function validateFilename(filename: string): { valid: boolean; error?: string } {
  if (!filename || filename.length === 0) {
    return { valid: false, error: 'Filename is required' };
  }

  if (filename.length > 255) {
    return { valid: false, error: 'Filename is too long (max 255 characters)' };
  }

  // Check for invalid characters (Windows + Unix)
  const invalidChars = /[<>:"|?*\x00-\x1F]/;
  if (invalidChars.test(filename)) {
    return { valid: false, error: 'Filename contains invalid characters' };
  }

  // Check for reserved names (Windows)
  const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
  if (reservedNames.test(filename)) {
    return { valid: false, error: 'Filename is reserved' };
  }

  // Check for dot files
  if (filename === '.' || filename === '..') {
    return { valid: false, error: 'Filename is invalid' };
  }

  return { valid: true };
}

/**
 * Sanitize filename for safe file system storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove invalid characters
  let sanitized = filename.replace(/[<>:"|?*\x00-\x1F]/g, '');

  // Replace spaces and other problematic characters
  sanitized = sanitized.replace(/\s+/g, '_');

  // Ensure filename is not empty
  if (sanitized === '') {
    sanitized = 'unnamed_file';
  }

  // Limit length
  if (sanitized.length > 200) {
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    sanitized = name.substring(0, 200 - ext.length) + ext;
  }

  return sanitized;
}

/**
 * Get file MIME type based on extension
 */
export function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',

    // Documents
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Text
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.yaml': 'application/x-yaml',
    '.yml': 'application/x-yaml',

    // Code
    '.js': 'text/javascript',
    '.jsx': 'text/jsx',
    '.ts': 'text/typescript',
    '.tsx': 'text/tsx',
    '.css': 'text/css',
    '.scss': 'text/x-scss',
    '.html': 'text/html',
    '.py': 'text/x-python',
    '.java': 'text/x-java-source',
    '.go': 'text/x-go',
    '.rs': 'text/x-rust',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Log formatted error message
 */
export function logError(context: string, error: unknown): void {
  const timestamp = new Date().toISOString();
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[${timestamp}] [ERROR] ${context}`);
  console.error(`  Message: ${message}`);
  if (stack) {
    console.error(`  Stack: ${stack}`);
  }
}

/**
 * Log formatted info message
 */
export function logInfo(context: string, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  console.info(`[${timestamp}] [INFO] ${context}: ${message}`);
  if (data !== undefined) {
    console.info(`  Data:`, data);
  }
}

/**
 * Log formatted warning message
 */
export function logWarning(context: string, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] [WARN] ${context}: ${message}`);
  if (data !== undefined) {
    console.warn(`  Data:`, data);
  }
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Parse and validate JSON safely
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML (basic)
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Get current environment
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  if (process.env.NODE_ENV === 'test') return 'test';
  if (process.env.NODE_ENV === 'production') return 'production';
  return 'development';
}

/**
 * Check if in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Check if in production mode
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}
