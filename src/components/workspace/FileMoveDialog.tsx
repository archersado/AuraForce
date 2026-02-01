/**
 * File Move Dialog Component
 *
 * Provides UI for moving files/directories.
 * Features:
 * - Destination path selection
 * - Current path display
 * - Conflict detection
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Folder, File, Move, AlertCircle, CheckCircle } from 'lucide-react';
import { listDirectory, type FileInfo } from '@/lib/workspace/files-service';

export interface FileMoveDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (destinationPath: string) => void;
  sourcePath: string;
  sourceName: string;
  sourceType: 'file' | 'directory';
  workspaceRoot?: string;
}

export function FileMoveDialog({
  visible,
  onClose,
  onSubmit,
  sourcePath,
  sourceName,
  sourceType,
  workspaceRoot,
}: FileMoveDialogProps) {
  const [directories, setDirectories] = useState<FileInfo[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load directories when dialog opens
  useEffect(() => {
    if (visible && workspaceRoot) {
      loadDirectories('');
    }
  }, [visible, workspaceRoot]);

  // Load directories at given path
  const loadDirectories = async (path: string) => {
    if (!workspaceRoot) return;

    setLoading(true);
    try {
      const result = await listDirectory(path || '/', workspaceRoot);

      // Filter only directories
      const dirs = result.files.filter((file) => file.type === 'directory');

      setDirectories(dirs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load directories');
    } finally {
      setLoading(false);
    }
  };

  // Handle directory selection
  const handleDirectoryClick = async (dir: FileInfo) => {
    setSelectedPath(dir.path);
    setExpandedDirs(new Set([...expandedDirs, dir.path]));
    loadDirectories(dir.path);
  };

  // Handle back button
  const handleBack = async () => {
    const parentPath = selectedPath.substring(0, selectedPath.lastIndexOf('/'));
    setSelectedPath(parentPath || '/');
    loadDirectories(parentPath);
  };

  // Validate destination
  const validateDestination = (): string => {
    // Cannot move into itself
    if (selectedPath === sourcePath) {
      return 'Cannot move into itself';
    }

    // Cannot move into its own child directory
    if (selectedPath.startsWith(sourcePath + '/') || selectedPath.startsWith(sourcePath + '\\')) {
      return 'Cannot move to a subdirectory of itself';
    }

    return '';
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateDestination();
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit(selectedPath);
  };

  if (!visible) return null;

  // Filter directories by search query
  const filteredDirectories = directories.filter((dir) =>
    dir.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Move className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                移动 {sourceType === 'directory' ? '文件夹' : '文件'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">
                {sourceName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Current location */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  当前位置:
                </span>
                <code className="text-sm text-gray-900 dark:text-gray-100">
                  {sourcePath}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  目标位置:
                </span>
                <code className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedPath}
                </code>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文件夹..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
            />
          </div>

          {/* Directory tree */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mr-3"></div>
                <span>加载中...</span>
              </div>
            ) : filteredDirectories.length > 0 ? (
              <div className="space-y-1">
                {filteredDirectories.map((dir) => (
                  <button
                    key={dir.path}
                    onClick={() => handleDirectoryClick(dir)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      selectedPath === dir.path
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Folder className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <span className="flex-1 text-left truncate text-gray-900 dark:text-gray-100">
                      {dir.name}
                    </span>
                    {selectedPath === dir.path && (
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                没有找到文件夹
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between rounded-b-lg">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              返回
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                移动
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
