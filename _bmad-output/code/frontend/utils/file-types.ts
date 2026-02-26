/**
 * File Types Utility
 * Provides functions to determine file types and get appropriate icons/previewers
 */

export type FileType =
  | 'code'
  | 'markdown'
  | 'image'
  | 'pdf'
  | 'ppt'
  | 'video'
  | 'audio'
  | 'archive'
  | 'unknown';

export interface FileTypeInfo {
  type: FileType;
  icon: string;
  extension: string;
  language?: string; // For code editor syntax highlighting
}

// Language mapping for Monaco Editor
const LANGUAGE_MAP: Record<string, string> = {
  // JavaScript/TypeScript
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'mjs': 'javascript',
  'cjs': 'javascript',
  // Style
  'css': 'css',
  'scss': 'scss',
  'less': 'less',
  'sass': 'sass',
  // Markup
  'html': 'html',
  'htm': 'html',
  'xml': 'xml',
  'svg': 'xml',
  // Data/Config
  'json': 'json',
  'jsonc': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'toml': 'toml',
  'ini': 'ini',
  // Backend
  'py': 'python',
  'go': 'go',
  'rs': 'rust',
  'php': 'php',
  'rb': 'ruby',
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  // Server/C
  'c': 'c',
  'cpp': 'cpp',
  'h': 'c',
  'hpp': 'cpp',
  'java': 'java',
  'kotlin': 'kotlin',
  'swift': 'swift',
  'dart': 'dart',
  'sql': 'sql',
  // Other
  'md': 'markdown',
  'markdown': 'markdown',
  'graphql': 'graphql',
  'graphqls': 'graphql',
  'gql': 'graphql',
  'dockerfile': 'dockerfile',
  'makefile': 'makefile',
};

const CODE_EXTENSIONS = [
  'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs',
  'css', 'scss', 'less', 'sass',
  'html', 'htm', 'xml',
  'json', 'jsonc', 'yaml', 'yml', 'toml', 'ini',
  'py', 'go', 'rs', 'php', 'rb',
  'sh', 'bash', 'zsh',
  'c', 'cpp', 'h', 'hpp',
  'java', 'kotlin', 'swift', 'dart', 'sql',
  'graphql', 'graphqls', 'gql',
  'dockerfile', 'makefile',
];

const MARKDOWN_EXTENSIONS = ['md', 'markdown'];

const IMAGE_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico', 'avif',
];

const PDF_EXTENSIONS = ['pdf'];

const PPT_EXTENSIONS = ['ppt', 'pptx'];

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'aac', 'flac'];

const ARCHIVE_EXTENSIONS = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];

// Icon mapping (using Lucide-like icons)
const FILE_ICONS: Record<FileType, string> = {
  code: 'Code',
  markdown: 'FileText',
  image: 'Image',
  pdf: 'File',
  ppt: 'Presentation',
  video: 'Video',
  audio: 'Music',
  archive: 'Archive',
  unknown: 'File',
};

/**
 * Get the extension from a filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts[parts.length - 1]?.toLowerCase() || '';
}

/**
 * Get file type info based on extension
 */
export function getFileInfo(filename: string): FileTypeInfo {
  const ext = getFileExtension(filename);

  // Code files
  if (CODE_EXTENSIONS.includes(ext)) {
    return {
      type: 'code',
      icon: FILE_ICONS.code,
      extension: ext,
      language: LANGUAGE_MAP[ext] || 'plaintext',
    };
  }

  // Markdown files
  if (MARKDOWN_EXTENSIONS.includes(ext) || filename.toLowerCase().endsWith('.md')) {
    return {
      type: 'markdown',
      icon: FILE_ICONS.markdown,
      extension: ext,
      language: 'markdown',
    };
  }

  // Image files
  if (IMAGE_EXTENSIONS.includes(ext)) {
    return {
      type: 'image',
      icon: FILE_ICONS.image,
      extension: ext,
    };
  }

  // PDF files
  if (PDF_EXTENSIONS.includes(ext)) {
    return {
      type: 'pdf',
      icon: FILE_ICONS.pdf,
      extension: ext,
    };
  }

  // PowerPoint files
  if (PPT_EXTENSIONS.includes(ext)) {
    return {
      type: 'ppt',
      icon: FILE_ICONS.ppt,
      extension: ext,
    };
  }

  // Video files
  if (VIDEO_EXTENSIONS.includes(ext)) {
    return {
      type: 'video',
      icon: FILE_ICONS.video,
      extension: ext,
    };
  }

  // Audio files
  if (AUDIO_EXTENSIONS.includes(ext)) {
    return {
      type: 'audio',
      icon: FILE_ICONS.audio,
      extension: ext,
    };
  }

  // Archive files
  if (ARCHIVE_EXTENSIONS.includes(ext)) {
    return {
      type: 'archive',
      icon: FILE_ICONS.archive,
      extension: ext,
    };
  }

  // Unknown file type
  return {
    type: 'unknown',
    icon: FILE_ICONS.unknown,
    extension: ext,
  };
}

/**
 * Check if a file supports preview
 */
export function canPreview(filename: string): boolean {
  const info = getFileInfo(filename);
  return ['code', 'markdown', 'image', 'pdf', 'ppt'].includes(info.type);
}

/**
 * Check if a file supports editing
 */
export function canEdit(filename: string): boolean {
  const info = getFileInfo(filename);
  return ['code', 'markdown'].includes(info.type);
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file icon component path
 */
export function getFileIconPath(type: FileType): string {
  const iconMap: Record<FileType, string> = {
    code: '/icons/code.svg',
    markdown: '/icons/markdown.svg',
    image: '/icons/image.svg',
    pdf: '/icons/pdf.svg',
    ppt: '/icons/ppt.svg',
    video: '/icons/video.svg',
    audio: '/icons/audio.svg',
    archive: '/icons/archive.svg',
    unknown: '/icons/file.svg',
  };
  return iconMap[type];
}

/**
 * Sort files alphabetically with folders first
 */
export function sortFiles(a: { name: string; type: 'file' | 'folder' }, b: { name: string; type: 'file' | 'folder' }): number {
  // Folders always come first
  if (a.type === 'folder' && b.type === 'file') return -1;
  if (a.type === 'file' && b.type === 'folder') return 1;

  // Same type, sort by name
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
}
