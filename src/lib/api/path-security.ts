/**
 * Path Security Utilities
 *
 * Shared security functions for file path validation across API routes.
 */

import { normalize } from 'path';

// Files/directories that should not be accessed
// Note: Patterns are matched against the relative path, so /node_modules/ matches "node_modules" directory
export const EXCLUDED_PATTERNS = [
  /^node_modules\//,           // node_modules directory or subdirectory
  /^\.git\//,                  // .git directory or subdirectory
  /^\.env(\..*)?$/i,           // .env files (.env, .env.local, etc.)
  /^\.next\//,                 // .next directory
  /^dist\//,                   // dist directory
  /^build\//,                  // build directory
  /^coverage\//,               // coverage directory
  /\.lock$/,                   // file ending with .lock
];

/**
 * Check if a path is safe (within workspace root)
 *
 * This function ensures that:
 * 1. The target path is within the root directory
 * 2. Path separators are correctly formed
 * 3. The path doesn't match excluded patterns
 *
 * @param targetPath - The path to validate
 * @param root - The root directory to validate against
 * @param options - Optional configuration
 * @param options.allowRoot - Whether to allow the root directory itself (for directory listing)
 */
export function isSafePath(
  targetPath: string,
  root: string,
  options: { allowRoot?: boolean } = {}
): boolean {
  const { allowRoot = false } = options;

  // Normalize both paths to handle variations like trailing slashes
  const normalizedTarget = normalize(targetPath);
  const normalizedRoot = normalize(root);

  // Ensure target path is within root directory by checking prefix
  if (!normalizedTarget.startsWith(normalizedRoot)) {
    console.warn('[Path Security] Target path is outside root:', {
      normalizedRoot,
      normalizedTarget,
    });
    return false;
  }

  // Ensure target is not exactly the root (unless allowRoot is true)
  if (normalizedTarget === normalizedRoot && !allowRoot) {
    return false;
  }

  // Ensure the next character after root prefix is a path separator
  if (normalizedTarget.length > normalizedRoot.length) {
    const nextChar = normalizedTarget[normalizedRoot.length];
    if (nextChar !== '/') {
      console.warn('[Path Security] Invalid path separator:', {
        normalizedRoot,
        normalizedTarget,
        expectedSeparator: '/',
        actual: nextChar,
      });
      return false;
    }
  }

  // Check against excluded patterns
  // If target is the root and allowRoot is true, skip pattern check
  if (normalizedTarget !== normalizedRoot) {
    const relativePath = normalizedTarget.slice(normalizedRoot.length + 1); // +1 to skip the separator
    for (const pattern of EXCLUDED_PATTERNS) {
      if (pattern.test(relativePath)) {
        console.warn('[Path Security] Path matches excluded pattern:', {
          relativePath,
          pattern: pattern.source,
        });
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if an item should be excluded from listings
 */
export function isExcluded(name: string): boolean {
  // Filter items starting with underscore (_) or dot (.)
  if (name.startsWith('_') || name.startsWith('.')) {
    return true;
  }

  // Filter common system files/directories
  const excludedNames = [
    'Thumbs.db',
    '.DS_Store',
    'desktop.ini',
  ];

  return excludedNames.includes(name);
}
