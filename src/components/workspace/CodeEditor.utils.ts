/**
 * Language Utilities for Code Editor
 *
 * Helper functions for language detection and management
 */

import type { CodeEditorLanguage, LanguageSupport, LANGUAGE_CONFIGS } from './CodeEditor.types';

// File extension to language mapping
export const EXTENSION_MAP: Record<string, string> = {
  // JavaScript/TypeScript
  'js': 'javascript',
  'jsx': 'javascript',
  'mjs': 'javascript',
  'cjs': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'mts': 'typescript',
  'cts': 'typescript',

  // Python
  'py': 'python',
  'pyw': 'python',
  'pyi': 'python',

  // Java
  'java': 'java',

  // C/C++
  'c': 'c',
  'h': 'c',
  'cpp': 'cpp',
  'cc': 'cpp',
  'cxx': 'cpp',
  'hpp': 'cpp',
  'hxx': 'cpp',

  // Go
  'go': 'go',

  // Rust
  'rs': 'rust',

  // PHP
  'php': 'php',
  'phtml': 'php',

  // HTML/CSS
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'css',
  'sass': 'css',
  'less': 'css',

  // Data formats
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',

  // Markdown
  'md': 'markdown',
  'markdown': 'markdown',
  'mdx': 'markdown',

  // SQL
  'sql': 'sql',

  // Shell
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  'fish': 'shell',
  'ps1': 'powershell',

  // Other
  'txt': 'text',
  'gitignore': 'text',
  'gitattributes': 'text',
  'dockerfile': 'dockerfile',
};

/**
 * Detect language from file name or extension
 */
export function detectLanguageFromFileName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // Check for specific names first
  const lowerName = fileName.toLowerCase();
  if (lowerName === 'dockerfile' || lowerName.startsWith('dockerfile.')) {
    return 'dockerfile';
  }
  if (['.gitignore', '.gitattributes', '.gitmodules'].includes(lowerName)) {
    return 'git';
  }

  // Then check extension
  return EXTENSION_MAP[ext] || 'text';
}

/**
 * Detect language from file path
 */
export function detectLanguageFromPath(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';
  return detectLanguageFromFileName(fileName);
}

/**
 * Detect language from content (heuristic)
 */
export function detectLanguageFromContent(content: string): string {
  const trimmed = content.trim();

  // Quick checks for common patterns
  if (trimmed.startsWith('#!')) {
    const shebang = trimmed.split('\n')[0];
    if (shebang.includes('python')) return 'python';
    if (shebang.includes('node')) return 'javascript';
    if (shebang.includes('bash') || shebang.includes('sh')) return 'shell';
    if (shebang.includes('python3')) return 'python';
  }

  if (trimmed.startsWith('<?php')) return 'php';
  if (trimmed.startsWith('<?xml')) return 'xml';

  // Check for language-specific declarations
  if (/^\s*<\?php/.test(trimmed)) return 'php';
  if (/^\s*<!DOCTYPE\s+html/i.test(trimmed)) return 'html';
  if (/^\s*{\s*"/.test(trimmed) && /"\s*:\s*{/.test(trimmed)) return 'json';

  // Check for TypeScript-specific syntax
  if (/\binterface\b/.test(trimmed) && /\btype\b/.test(trimmed)) {
    return 'typescript';
  }

  // Check for Python patterns
  if (/^\s*(def|class|import)\s+/.test(trimmed)) return 'python';

  // Default to JavaScript (most common)
  return 'javascript';
}

/**
 * Get file icon based on extension
 */
export function getFileIcon(extension: string): {
  name: string;
  color: string;
  icon: string;
} {
  const ext = extension.toLowerCase();

  const iconMap: Record<string, { name: string; color: string; icon: string }> = {
    // Languages
    'js': { name: 'JavaScript', color: '#f7df1e', icon: '⚡' },
    'jsx': { name: 'React', color: '#61dafb', icon: '⚛️' },
    'ts': { name: 'TypeScript', color: '#3178c6', icon: '📘' },
    'tsx': { name: 'React', color: '#61dafb', icon: '⚛️' },
    'py': { name: 'Python', color: '#3776ab', icon: '🐍' },
    'java': { name: 'Java', color: '#007396', icon: '☕' },
    'go': { name: 'Go', color: '#00add8', icon: '🐹' },
    'rs': { name: 'Rust', color: '#dea584', icon: '🦀' },
    'php': { name: 'PHP', color: '#777bb4', icon: '🐘' },

    // Web
    'html': { name: 'HTML', color: '#e34c26', icon: '🌐' },
    'css': { name: 'CSS', color: '#264de4', icon: '🎨' },
    'scss': { name: 'SCSS', color: '#c6538c', icon: '🎨' },

    // Data
    'json': { name: 'JSON', color: '#f5a623', icon: '📋' },
    'xml': { name: 'XML', color: '#0060ac', icon: '📄' },
    'yaml': { name: 'YAML', color: '#cb171e', icon: '📋' },
    'yml': { name: 'YAML', color: '#cb171e', icon: '📋' },

    // Documentation
    'md': { name: 'Markdown', color: '#083fa1', icon: '📝' },

    // Config
    'dockerfile': { name: 'Docker', color: '#2496ed', icon: '🐳' },
    'git': { name: 'Git', color: '#f05032', icon: '📦' },
  };

  return iconMap[ext] || { name: 'File', color: '#999', icon: '📄' };
}

/**
 * Normalize language name
 */
export function normalizeLanguage(lang: string): string {
  const normalized = lang.toLowerCase();

  const aliases: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'mjs': 'javascript',
    'cjs': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'mts': 'typescript',
    'cts': 'typescript',
    'py': 'python',
    'pyw': 'python',
    'pyi': 'python',
    'rs': 'rust',
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'yml': 'yaml',
  };

  return aliases[normalized] || normalized;
}

/**
 * Get supported languages list
 */
export function getSupportedLanguages(): Array<{
  name: string;
  value: string;
  extensions: string[];
}> {
  return [
    { name: 'JavaScript', value: 'javascript', extensions: ['js', 'jsx', 'mjs', 'cjs'] },
    { name: 'TypeScript', value: 'typescript', extensions: ['ts', 'tsx', 'mts', 'cts'] },
    { name: 'Python', value: 'python', extensions: ['py', 'pyw', 'pyi'] },
    { name: 'Java', value: 'java', extensions: ['java'] },
    { name: 'C', value: 'c', extensions: ['c', 'h'] },
    { name: 'C++', value: 'cpp', extensions: ['cpp', 'cc', 'cxx', 'hpp', 'hxx'] },
    { name: 'Go', value: 'go', extensions: ['go'] },
    { name: 'Rust', value: 'rust', extensions: ['rs'] },
    { name: 'PHP', value: 'php', extensions: ['php', 'phtml'] },
    { name: 'HTML', value: 'html', extensions: ['html', 'htm'] },
    { name: 'CSS', value: 'css', extensions: ['css', 'scss', 'sass', 'less'] },
    { name: 'JSON', value: 'json', extensions: ['json'] },
    { name: 'Markdown', value: 'markdown', extensions: ['md', 'markdown', 'mdx'] },
    { name: 'SQL', value: 'sql', extensions: ['sql'] },
    { name: 'XML', value: 'xml', extensions: ['xml'] },
    { name: 'YAML', value: 'yaml', extensions: ['yaml', 'yml'] },
    { name: 'Shell', value: 'shell', extensions: ['sh', 'bash', 'zsh', 'fish'] },
    { name: 'Text', value: 'text', extensions: ['txt'] },
  ];
}

/**
 * Validate if language is supported
 */
export function isLanguageSupported(lang: string): boolean {
  const languages = getSupportedLanguages();
  return languages.some(l => l.value === lang.toLowerCase());
}

export default {
  detectLanguageFromFileName,
  detectLanguageFromPath,
  detectLanguageFromContent,
  getFileIcon,
  normalizeLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  EXTENSION_MAP,
};
