/**
 * File Icon System Component
 *
 * Provides file type-specific icons with:
 * - Category-based icons (code, image, document, etc.)
- Extension-specific icons
- SVG icon assets
- Hover indicators
 */

'use client';

import { ReactElement } from 'react';
import {
  File,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileText,
  FileSpreadsheet,
  FileJson,
  FilePlus,
  FileDown,
  Folder,
  FolderOpen,
  FileKey,
  FileCog,
  FileLock,
  FileQuestion,
  FileSearch,
  Presentation,
  Code2,
  Braces,
  Database,
  GitCommit,
  Type,
  Layout,
  Palette,
  FileTerminal,
  Aperture,
  Terminal,
} from 'lucide-react';

// Icon categories
export type FileIconCategory =
  | 'code'
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'spreadsheet'
  | 'presentation'
  | 'database'
  | 'config'
  | 'executable'
  | 'unknown';

// File icon configuration
interface FileIconConfig {
  extension: string | string[];
  icon: React.ElementType;
  color: string;
  category: FileIconCategory;
  description?: string;
}

// File type color palette
const ICON_COLORS = {
  code: '#3B82F6', // Blue
  document: '#8B5CF6', // Purple
  image: '#10B981', // Green
  video: '#F59E0B', // Orange
  audio: '#EF4444', // Red
  archive: '#6B7280', // Gray
  spreadsheet: '#059669', // Emerald
  presentation: '#DC2626', // Red-600
  database: '#0891B2', // Cyan-600
  config: '#7C3AED', // Violet
  executable: '#F59E0B', // Orange
  unknown: '#6B7280', // Gray-500
} as const;

// File icon mappings (extensions -> icons)
const FILE_ICONS: FileIconConfig[] = [
  // Code files
  { extension: ['js', 'jsx', 'mjs', 'cjs'], icon: Code2, color: ICON_COLORS.code, category: 'code', description: 'JavaScript' },
  { extension: ['ts', 'tsx', 'mts', 'cts'], icon: Type, color: ICON_COLORS.code, category: 'code', description: 'TypeScript' },
  { extension: ['py', 'pyw', 'pyi'], icon: FileCode, color: '#3776AB', category: 'code', description: 'Python' },
  { extension: ['java', 'class', 'jar'], icon: FileCode, color: '#F59E0B', category: 'code', description: 'Java' },
  { extension: ['c', 'h', 'cpp', 'hpp', 'cc', 'cxx'], icon: FileCode, color: '#3B82F6', category: 'code', description: 'C/C++' },
  { extension: ['cs', 'vb'], icon: FileCode, color: '#9B59B6', category: 'code', description: 'C#' },
  { extension: ['go', 'golang'], icon: FileCode, color: '#00ADD8', category: 'code', description: 'Go' },
  { extension: ['rs', 'rust'], icon: FileCode, color: '#DEA584', category: 'code', description: 'Rust' },
  { extension: ['php', 'phtml', 'php3', 'php4', 'php5'], icon: FileCode, color: '#777BB4', category: 'code', description: 'PHP' },
  { extension: ['rb', 'rbw'], icon: FileCode, color: '#CC342D', category: 'code', description: 'Ruby' },
  { extension: ['swift'], icon: FileCode, color: '#FA7343', category: 'code', description: 'Swift' },
  { extension: ['kt', 'kts'], icon: FileCode, color: '#7F52FF', category: 'code', description: 'Kotlin' },
  { extension: ['dart'], icon: FileCode, color: '#0175C2', category: 'code', description: 'Dart' },
  { extension: ['pl', 'pm'], icon: FileCode, color: '#39457E', category: 'code', description: 'Perl' },
  { extension: ['sh', 'bash', 'zsh', 'fish', 'csh', 'tcsh'], icon: Terminal, color: ICON_COLORS.code, category: 'code', description: 'Shell Script' },
  { extension: ['ps1', 'psm1', 'psd1'], icon: Terminal, color: '#5391FE', category: 'code', description: 'PowerShell' },

  // Web technologies
  { extension: ['html', 'htm', 'xhtm'], icon: Layout, color: '#E34F26', category: 'code', description: 'HTML' },
  { extension: ['css', 'scss', 'sass', 'less'], icon: Palette, color: '#2965F1', category: 'code', description: 'CSS' },
  { extension: ['vue', 'vuex'], icon: Layout, color: '#42B883', category: 'code', description: 'Vue' },
  { extension: ['svelte'], icon: Layout, color: '#FF3E00', category: 'code', description: 'Svelte' },
  { extension: ['xml', 'rss'], icon: FileCode, color: ICON_COLORS.code, category: 'code', description: 'XML' },
  { extension: ['svg', 'svgz'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'SVG' },

  // Data formats
  { extension: ['json', 'jsonc'], icon: FileJson, color: '#F7DF1E', category: 'document', description: 'JSON' },
  { extension: ['yaml', 'yml', 'toml'], icon: FileCode, color: '#CB171E', category: 'document', description: 'YAML' },
  { extension: ['csv', 'tsv'], icon: FileSpreadsheet, color: '#21A366', category: 'spreadsheet', description: 'CSV' },
  { extension: ['sql', 'sqlite', 'db', 'mdb'], icon: Database, color: '#003B57', category: 'database', description: 'Database' },

  // Documents
  { extension: ['pdf'], icon: FileText, color: ICON_COLORS.document, category: 'document', description: 'PDF' },
  { extension: ['tex', 'bib', 'sty'], icon: FileText, color: '#008080', category: 'document', description: 'LaTeX' },
  { extension: ['md', 'markdown', 'mdx', 'rmd'], icon: FileText, color: ICON_COLORS.code, category: 'document', description: 'Markdown' },
  { extension: ['txt', 'text'], icon: FileText, color: '#6B7280', category: 'document', description: 'Plain Text' },
  { extension: ['rtf', 'doc', 'docx', 'odt', 'pages'], icon: FileText, color: ICON_COLORS.document, category: 'document', description: 'Word Document' },
  { extension: ['xls', 'xlsx', 'xlsb', 'xlsm', 'numbers', 'ods', 'fods'], icon: FileSpreadsheet, color: '#217346', category: 'spreadsheet', description: 'Spreadsheet' },
  { extension: ['ppt', 'pptx', 'ppsx', 'pps', 'keynote', 'odp', 'sxi'], icon: Presentation, color: '#C43E1C', category: 'presentation', description: 'Presentation' },

  // Images
  { extension: ['jpg', 'jpeg', 'jpe', 'pjpeg', 'pjp', 'jfif'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'JPEG' },
  { extension: ['png', 'apng'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'PNG' },
  { extension: ['gif'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'GIF' },
  { extension: ['ico', 'icns'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'Icon' },
  { extension: ['webp'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'WebP' },
  { extension: ['bmp', 'dib'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'Bitmap' },
  { extension: ['tiff', 'tif', 'heic', 'heif', 'avif'], icon: FileImage, color: ICON_COLORS.image, category: 'image', description: 'Image' },

  // Video
  { extension: ['mp4', 'mp4v', 'mpg4'], icon: FileVideo, color: ICON_COLORS.video, category: 'video', description: 'MP4 Video' },
  { extension: ['mov', 'qt'], icon: FileVideo, color: ICON_COLORS.video, category: 'video', description: 'QuickTime' },
  { extension: ['avi'], icon: FileVideo, color: ICON_COLORS.video, category: 'video', description: 'AVI' },
  { extension: ['mkv', 'mka'], icon: FileVideo, color: ICON_COLORS.video, category: 'video', description: 'Matroska' },
  { extension: ['webm', 'webmv'], icon: FileVideo, color: ICON_COLORS.video, category: 'video', description: 'WebM' },
  { extension: ['flv', 'f4v', 'f4p', 'f4a'], icon: FileVideo, color: ICON_COLORS.video, category: 'video', description: 'Flash Video' },
  { extension: ['wmv', 'wm', 'asf'], icon: FileVideo, color: ICON_COLORS.video, category: 'video', description: 'Windows Media' },

  // Audio
  { extension: ['mp3', 'mp2', 'm2a', 'mpga'], icon: FileAudio, color: ICON_COLORS.audio, category: 'audio', description: 'MP3 Audio' },
  { extension: ['wav', 'wave', 'bwf'], icon: FileAudio, color: ICON_COLORS.audio, category: 'audio', description: 'WAV Audio' },
  { extension: ['ogg', 'oga', 'spx'], icon: FileAudio, color: ICON_COLORS.audio, category: 'audio', description: 'OGG Audio' },
  { extension: ['flac'], icon: FileAudio, color: ICON_COLORS.audio, category: 'audio', description: 'FLAC' },
  { extension: ['aac', 'm4a'], icon: FileAudio, color: ICON_COLORS.audio, category: 'audio', description: 'AAC' },
  { extension: ['wma', 'wm', 'wmx'], icon: FileAudio, color: ICON_COLORS.audio, category: 'audio', description: 'Windows Media Audio' },
  { extension: ['mid', 'midi'], icon: FileAudio, color: ICON_COLORS.audio, category: 'audio', description: 'MIDI' },

  // Archives
  { extension: ['zip', 'zipx'], icon: FileArchive, color: ICON_COLORS.archive, category: 'archive', description: 'ZIP' },
  { extension: ['rar', 'r00', 'r01'], icon: FileArchive, color: ICON_COLORS.archive, category: 'archive', description: 'RAR' },
  { extension: ['7z', 'gz', 'tgz', 'bz2', 'tbz2', 'xz', 'txz'], icon: FileArchive, color: ICON_COLORS.archive, category: 'archive', description: 'Archive' },
  { extension: ['tar', 'tbz', 'tgz'], icon: FileArchive, color: ICON_COLORS.archive, category: 'archive', description: 'TAR' },
  { extension: ['iso', 'img', 'dmg', 'toast'], icon: FileArchive, color: ICON_COLORS.archive, category: 'archive', description: 'Disk Image' },

  // Config files
  { extension: ['env', '.env'], icon: FileKey, color: ICON_COLORS.config, category: 'config', description: 'Environment' },
  { extension: ['ini', 'cfg', 'conf', 'config'], icon: FileCog, color: ICON_COLORS.config, category: 'config', description: 'Configuration' },
  { extension: ['toml'], icon: FileCog, color: ICON_COLORS.config, category: 'config', description: 'TOML' },
  { extension: ['lock'], icon: FileLock, color: ICON_COLORS.config, category: 'config', description: 'Lock File' },
  { extension: ['gitignore', 'gitattributes', 'gitkeep'], icon: GitCommit, color: '#F05032', category: 'config', description: 'Git' },
  { extension: ['dockerfile', 'docker-compose.yml', 'docker-compose.yaml'], icon: Aperture, color: '#2496ED', category: 'config', description: 'Docker' },
  { extension: ['package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'], icon: FileJson, color: '#CB3837', category: 'config', description: 'NPM' },
  { extension: ['tsconfig.json', 'jsconfig.json'], icon: FileJson, color: '#3178C6', category: 'config', description: 'TypeScript Config' },
  { extension: ['eslint.json', '.eslintrc', '.eslintrc.json'], icon: FileLock, color: '#4B32C3', category: 'config', description: 'ESLint' },
  { extension: ['prettierrc', '.prettierrc', 'prettier.config.js'], icon: FileLock, color: '#C596C7', category: 'config', description: 'Prettier' },
];

interface FileIconProps {
  filename: string;
  size?: number;
  className?: string;
  showExtension?: boolean;
  color?: string;
}

export function FileIcon({
  filename,
  size = 20,
  className = '',
  showExtension = false,
  color,
}: FileIconProps) {
  const normalizedFilename = filename.toLowerCase();
  const extensionDotIndex = normalizedFilename.lastIndexOf('.');
  const extension = extensionDotIndex !== -1
    ? normalizedFilename.substring(extensionDotIndex + 1)
    : '';

  // Find matching icon config
  const iconConfig = FILE_ICONS.find(
    (config) =>
      Array.isArray(config.extension)
        ? config.extension.includes(extension)
        : config.extension === extension
  );

  const IconComponent = iconConfig?.icon || FileQuestion;
  const iconColor = color || iconConfig?.color || ICON_COLORS.unknown;
  const iconCategory = iconConfig?.category || 'unknown';

  return (
    <div className={`inline-flex items-center ${className}`}>
      <IconComponent
        size={size}
        style={{ color: iconColor }}
        className="transition-transform hover:scale-110"
      />
      {showExtension && extension && (
        <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
          .{extension}
        </span>
      )}
    </div>
  );
}

// Folder icon component
interface FolderIconProps {
  isOpen?: boolean;
  size?: number;
  className?: string;
  color?: string;
}

export function FolderIcon({
  isOpen = false,
  size = 20,
  className = '',
  color = '#3B82F6',
}: FolderIconProps) {
  return (
    <div className={`inline-flex ${className}`}>
      {isOpen ? (
        <FolderOpen
          size={size}
          style={{ color }}
          className="transition-transform hover:scale-110"
        />
      ) : (
        <Folder
          size={size}
          style={{ color }}
          className="transition-transform hover:scale-110"
        />
      )}
    </div>
  );
}

// File type badge component
interface FileTypeBadgeProps {
  filename: string;
  showCategory?: boolean;
  showColor?: boolean;
}

export function FileTypeBadge({
  filename,
  showCategory = false,
  showColor = true,
}: FileTypeBadgeProps) {
  const normalizedFilename = filename.toLowerCase();
  const extensionDotIndex = normalizedFilename.lastIndexOf('.');
  const extension = extensionDotIndex !== -1
    ? normalizedFilename.substring(extensionDotIndex + 1)
    : '';

  const iconConfig = FILE_ICONS.find(
    (config) =>
      Array.isArray(config.extension)
        ? config.extension.includes(extension)
        : config.extension === extension
  );

  return (
    <div className="inline-flex items-center gap-2">
      {/* Color indicator */}
      {showColor && iconConfig && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: iconConfig.color }}
        />
      )}

      {/* Extension label */}
      {extension && (
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          .{extension}
        </span>
      )}

      {/* Category label */}
      {showCategory && iconConfig && (
        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {iconConfig.category}
        </span>
      )}
    </div>
  );
}

// File type filter component
interface FileTypeFilterProps {
  selectedCategory: FileIconCategory | 'all';
  onCategoryChange: (category: FileIconCategory | 'all') => void;
  showCount?: boolean;
}

export function FileTypeFilter({
  selectedCategory,
  onCategoryChange,
  showCount = false,
}: FileTypeFilterProps) {
  const categories: (FileIconCategory | 'all')[] = [
    'all',
    'code',
    'document',
    'image',
    'video',
    'audio',
    'archive',
    'spreadsheet',
    'presentation',
    'database',
    'config',
  ];

  // Count files per category
  const categoryCounts: Record<string, number> = {
    all: FILE_ICONS.length,
    code: FILE_ICONS.filter((i) => i.category === 'code').length,
    document: FILE_ICONS.filter((i) => i.category === 'document').length,
    image: FILE_ICONS.filter((i) => i.category === 'image').length,
    video: FILE_ICONS.filter((i) => i.category === 'video').length,
    audio: FILE_ICONS.filter((i) => i.category === 'audio').length,
    archive: FILE_ICONS.filter((i) => i.category === 'archive').length,
    spreadsheet: FILE_ICONS.filter((i) => i.category === 'spreadsheet').length,
    presentation: FILE_ICONS.filter((i) => i.category === 'presentation').length,
    database: FILE_ICONS.filter((i) => i.category === 'database').length,
    config: FILE_ICONS.filter((i) => i.category === 'config').length,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const categoryName = category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
        const count = showCount ? categoryCounts[category] || 0 : undefined;
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {categoryName}
            {showCount && count !== undefined && (
              <span className="ml-2 text-xs opacity-75">
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Utility functions
export function getFileCategory(filename: string): FileIconCategory {
  const normalizedFilename = filename.toLowerCase();
  const extensionDotIndex = normalizedFilename.lastIndexOf('.');
  const extension = extensionDotIndex !== -1
    ? normalizedFilename.substring(extensionDotIndex + 1)
    : '';

  const iconConfig = FILE_ICONS.find(
    (config) =>
      Array.isArray(config.extension)
        ? config.extension.includes(extension)
        : config.extension === extension
  );

  return iconConfig?.category || 'unknown';
}

export function getFileColor(filename: string): string {
  const normalizedFilename = filename.toLowerCase();
  const extensionDotIndex = normalizedFilename.lastIndexOf('.');
  const extension = extensionDotIndex !== -1
    ? normalizedFilename.substring(extensionDotIndex + 1)
    : '';

  const iconConfig = FILE_ICONS.find(
    (config) =>
      Array.isArray(config.extension)
        ? config.extension.includes(extension)
        : config.extension === extension
  );

  return iconConfig?.color || ICON_COLORS.unknown;
}

export function getFileDescription(filename: string): string | null {
  const normalizedFilename = filename.toLowerCase();
  const extensionDotIndex = normalizedFilename.lastIndexOf('.');
  const extension = extensionDotIndex !== -1
    ? normalizedFilename.substring(extensionDotIndex + 1)
    : '';

  const iconConfig = FILE_ICONS.find(
    (config) =>
      Array.isArray(config.extension)
        ? config.extension.includes(extension)
        : config.extension === extension
  );

  return iconConfig?.description || null;
}

// Export all icon colors
export { ICON_COLORS };

// Export file icon configs
export { FILE_ICONS };
