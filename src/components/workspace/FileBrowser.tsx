/**
 * File Tree Browser Component
 *
 * Displays a collapsible directory tree for workspace navigation.
 * Supports folder expansion/collapse, file selection, and folder creation.
 */

'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  FolderPlus,
  RefreshCw,
  AlertCircle,
  FolderOpen,
  X,
  MoreHorizontal,
  Move,
} from 'lucide-react';
import { listDirectory, createDirectory, moveFile, type FileInfo } from '@/lib/workspace/files-service';
import { FileMoveDialog } from './FileMoveDialog';

interface FileBrowserProps {
  workspaceRoot?: string;
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
  onDirectorySelect?: (path: string) => void;
  onRefresh?: () => void;
  disabled?: boolean;
  refreshTrigger?: number;
  onFileMove?: (sourcePath: string, destinationPath: string) => void;
}

export interface FileBrowserHandle {
  refresh: () => void;
  forceRefresh: () => void;
  openCreateFolder: () => void;
  openCreateFolderAtPath: (path: string) => void;
}

// Tree node interface with children and expansion state
interface TreeNode extends FileInfo {
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  depth?: number;
}

const FileBrowserImpl = forwardRef<FileBrowserHandle, FileBrowserProps>(
  (
    {
      workspaceRoot,
      selectedPath,
      onFileSelect,
      onDirectorySelect,
      onRefresh,
      disabled = false,
      refreshTrigger,
    },
    ref
  ) => {
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const loadedPathsRef = useRef<Set<string>>(new Set());
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [createFolderTargetPath, setCreateFolderTargetPath] = useState<string>('/');
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [moveSource, setMoveSource] = useState<{
      path: string;
      name: string;
      type: 'file' | 'directory';
    } | null>(null);
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
      item: TreeNode | null;
    } | null>(null);

    // Expose functions via ref
    useImperativeHandle(ref, () => ({
      refresh: () => {
        loadRootDirectory();
      },
      forceRefresh: () => {
        loadedPathsRef.current.clear();
        loadRootDirectory();
      },
      openCreateFolder: () => {
        setIsCreateFolderOpen(true);
        setCreateFolderTargetPath(selectedPath && selectedPath.includes('/')
          ? selectedPath.substring(0, selectedPath.lastIndexOf('/')) || '/'
          : '/');
      },
      openCreateFolderAtPath: (path: string) => {
        setIsCreateFolderOpen(true);
        setCreateFolderTargetPath(path);
      },
    }));

    // Close context menu on click outside
    useEffect(() => {
      const handleClickOutside = () => {
        setContextMenu(null);
      };

      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // Load directory contents recursively
    const loadDirectory = async (node: TreeNode): Promise<void> => {
      if (!workspaceRoot) return;

      try {
        node.isLoading = true;
        setTree([...tree]);

        const result = await listDirectory(node.path, workspaceRoot);

        // Convert files to tree nodes
        const childNodes: TreeNode[] = result.files.map((file) => ({
          ...file,
          children: file.type === 'directory' ? [] : undefined,
          isExpanded: false,
          isLoading: false,
          depth: (node.depth || 0) + 1,
        }));

        // Sort: directories first, then files, alphabetically
        childNodes.sort((a, b) => {
          if (a.type === 'directory' && b.type !== 'directory') return -1;
          if (a.type !== 'directory' && b.type === 'directory') return 1;
          return a.name.localeCompare(b.name);
        });

        node.children = childNodes;
        node.isExpanded = true;
        node.isLoading = false;

        loadedPathsRef.current.add(node.path);

        setTree([...tree]);

        if (onDirectorySelect) {
          onDirectorySelect(node.path);
        }
      } catch (err) {
        node.isLoading = false;
        setTree([...tree]);

        setError(err instanceof Error ? err.message : 'Failed to load directory');
      }
    };

    // Recursively reload tree
    const reloadTree = async (nodes: TreeNode[]): Promise<void> => {
      for (const node of nodes) {
        if (node.type === 'directory' && loadedPathsRef.current.has(node.path)) {
          await loadDirectory(node);

          if (node.children && node.children.length > 0) {
            await reloadTree(node.children);
          }
        }
      }
    };

    // Load root directory
    const loadRootDirectory = async (): Promise<void> => {
      if (!workspaceRoot) return;

      setLoading(true);
      setError(null);

      try {
        const result = await listDirectory('/', workspaceRoot);

        const rootNodes: TreeNode[] = result.files.map((file) => ({
          ...file,
          children: file.type === 'directory' ? [] : undefined,
          isExpanded: false,
          isLoading: false,
          depth: 0,
        }));

        // Sort: directories first, then files, alphabetically
        rootNodes.sort((a, b) => {
          if (a.type === 'directory' && b.type !== 'directory') return -1;
          if (a.type !== 'directory' && b.type === 'directory') return 1;
          return a.name.localeCompare(b.name);
        });

        setTree(rootNodes);
        loadedPathsRef.current.add('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load directory');
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    useEffect(() => {
      loadRootDirectory();
    }, [workspaceRoot]);

    // Handle refresh trigger
    useEffect(() => {
      if (refreshTrigger) {
        loadedPathsRef.current.clear();
        loadRootDirectory();
      }
    }, [refreshTrigger, workspaceRoot]);

    // Handle folder click (expand/collapse)
    const handleFolderClick = async (node: TreeNode) => {
      if (disabled || node.type !== 'directory') return;

      // If already loaded and expanded, just collapse/expand
      if (loadedPathsRef.current.has(node.path)) {
        // Toggle expansion state
        const toggleRecursive = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map((item) => {
            if (item.path === node.path) {
              return { ...item, isExpanded: !item.isExpanded };
            }

            if (item.children) {
              return {
                ...item,
                children: toggleRecursive(item.children),
              };
            }

            return item;
          });
        };

        setTree(toggleRecursive(tree));
      } else {
        // Load children and expand
        await loadDirectory(node);
      }
    };

    // Handle file click
    const handleFileClick = (path: string) => {
      if (disabled) return;

      onFileSelect(path);
    };

    // Handle create folder
    const handleCreateFolder = async (folderName: string): Promise<void> => {
      if (!workspaceRoot) {
        setError('No workspace root configured');
        return;
      }

      try {
        await createDirectory(folderName, createFolderTargetPath || '/', workspaceRoot);

        // Refresh the tree
        setIsCreateFolderOpen(false);

        // Reload the parent directory
        loadedPathsRef.current.delete(createFolderTargetPath || '/');
        if (createFolderTargetPath === '/' || !createFolderTargetPath) {
          await loadRootDirectory();
        } else {
          // Find and reload the parent directory
          const findParentDirectory = async (
            nodes: TreeNode[]
          ): Promise<void> => {
            for (const node of nodes) {
              if (node.path === createFolderTargetPath && node.type === 'directory') {
                loadedPathsRef.current.delete(node.path);
                await loadDirectory(node);
                break;
              }

              if (node.children) {
                await findParentDirectory(node.children);
              }
            }
          };

          await findParentDirectory(tree);
        }

        if (onRefresh) {
          onRefresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create folder');
      }
    };

    // Handle file/directory move
    const handleMove = async (destinationPath: string): Promise<void> => {
      if (!moveSource || !workspaceRoot) return;

      try {
        await moveFile(moveSource.path, destinationPath, workspaceRoot);

        setIsMoveDialogOpen(false);
        setMoveSource(null);

        // Refresh the file browser
        loadedPathsRef.current.clear();
        await loadRootDirectory();

        if (onRefresh) {
          onRefresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to move');
      }
    };

    // Handle context menu
    const handleContextMenu = (e: React.MouseEvent, item: TreeNode) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        item,
      });
    };

    // Handle move from context menu
    const handleMoveFromContextMenu = (item: TreeNode) => {
      setMoveSource({
        path: item.path,
        name: item.name,
        type: item.type,
      });
      setIsMoveDialogOpen(true);
      setContextMenu(null);
    };

    // Note: Error state is used for notifications

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Files
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadRootDirectory}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Refresh"
              disabled={disabled || loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setIsCreateFolderOpen(true);
                setCreateFolderTargetPath(selectedPath && selectedPath.includes('/')
                  ? selectedPath.substring(0, selectedPath.lastIndexOf('/')) || '/'
                  : '/');
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={disabled}
              title="New Folder"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="text-sm font-medium">新建文件夹</span>
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* File Tree */}
        <div className="space-y-0.5">
          {tree.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No files found
            </div>
          ) : (
            tree.map((node, index) => (
              <FileTreeNode
                key={node.path || index}
                node={node}
                selectedPath={selectedPath}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
                onCreateFolder={(path) => {
                  setIsCreateFolderOpen(true);
                  setCreateFolderTargetPath(path);
                }}
                onContextMenu={(e, item) => setContextMenu({ x: e.clientX, y: e.clientY, item })}
                disabled={disabled}
              />
            ))
          )}
        </div>

        {/* Create Folder Modal */}
        {isCreateFolderOpen && (
          <CreateFolderDialog
            visible={isCreateFolderOpen}
            onClose={() => setIsCreateFolderOpen(false)}
            onSubmit={handleCreateFolder}
            parentPath={createFolderTargetPath || '/'}
            workspaceRoot={workspaceRoot}
          />
        )}

        {/* Move Dialog */}
        {isMoveDialogOpen && moveSource && (
          <FileMoveDialog
            visible={isMoveDialogOpen}
            onClose={() => {
              setIsMoveDialogOpen(false);
              setMoveSource(null);
            }}
            onSubmit={handleMove}
            sourcePath={moveSource.path}
            sourceName={moveSource.name}
            sourceType={moveSource.type}
            workspaceRoot={workspaceRoot}
          />
        )}

        {/* Context Menu */}
        {contextMenu && (
          <FileContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            item={contextMenu.item}
            onMove={() => handleMoveFromContextMenu(contextMenu.item!)}
            onCreateFolder={() => {
              setIsCreateFolderOpen(true);
              setCreateFolderTargetPath(contextMenu.item!.path);
            }}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    );
  }
);

FileBrowserImpl.displayName = 'FileBrowserImpl';

export const FileBrowser = FileBrowserImpl;

// Tree Node Component
interface FileTreeNodeProps {
  node: TreeNode;
  selectedPath: string | null;
  onFolderClick: (node: TreeNode) => void;
  onFileClick: (path: string) => void;
  onCreateFolder?: (path: string) => void;
  onContextMenu?: (e: React.MouseEvent, node: TreeNode) => void;
  disabled?: boolean;
}

function FileTreeNode({
  node,
  selectedPath,
  onFolderClick,
  onFileClick,
  onCreateFolder,
  onContextMenu,
  disabled = false,
}: FileTreeNodeProps) {
  const depth = node.depth || 0;

  return (
    <div>
      {/* Folder */}
      {node.type === 'directory' && (
        <div>
          <button
            onClick={() => onFolderClick(node)}
            onContextMenu={(e) => onContextMenu?.(e, node)}
            className="flex items-center gap-2 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group w-full"
            style={{ paddingLeft: `${depth * 20 + 8}px` }}
            disabled={disabled}
          >
            {node.isLoading ? (
              <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
            ) : node.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
            {node.isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            )}
            <span className="flex-1 font-medium text-gray-700 dark:text-gray-300 text-left">
              {node.name}
            </span>
            {onCreateFolder && !disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFolder(node.path);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Create subfolder"
              >
                <FolderPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </button>

          {/* Children */}
          {node.isExpanded && node.children && (
            <div>
              {node.children.map((child, index) => (
                <FileTreeNode
                  key={child.path || index}
                  node={child}
                  selectedPath={selectedPath}
                  onFolderClick={onFolderClick}
                  onFileClick={onFileClick}
                  onCreateFolder={onCreateFolder}
                  onContextMenu={onContextMenu}
                  disabled={disabled}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* File */}
      {node.type === 'file' && (
        <button
          onClick={() => onFileClick(node.path)}
          onContextMenu={(e) => onContextMenu?.(e, node)}
          className={`flex items-center gap-2 py-2 rounded-lg transition-colors group w-full ${
            selectedPath === node.path
              ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
              : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
          }`}
          style={{ paddingLeft: `${depth * 20 + 28}px` }}
          disabled={disabled}
        >
          <File className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <span className="flex-1 font-medium text-gray-700 dark:text-gray-300 text-left truncate">
            {node.name}
          </span>
        </button>
      )}
    </div>
  );
}

// Create Folder Dialog Component
interface CreateFolderDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
  parentPath?: string;
  workspaceRoot?: string;
}

function CreateFolderDialog({
  visible,
  onClose,
  onSubmit,
  parentPath = '/',
  workspaceRoot,
}: CreateFolderDialogProps) {
  if (!visible) return null;

  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError('Please enter a folder name');
      return;
    }

    // Validate folder name
    const invalidChars = /[<>:"|?*\/\\]/;
    if (invalidChars.test(folderName)) {
      setError('Folder name contains invalid characters');
      return;
    }

    if (folderName.includes('..')) {
      setError('Folder name cannot contain ".."');
      return;
    }

    setError('');

    try {
      await onSubmit(folderName);
      setFolderName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    }
  };

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
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                新建文件夹
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                位置: {parentPath}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文件夹名称
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  onClose();
                }
              }}
              className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border ${
                error
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-500'
              } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent dark:text-gray-100`}
              placeholder="例如：my-folder"
              autoFocus
              maxLength={255}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {folderName.length} / 255 字符
            </p>
          </div>

          <button
            type="submit"
            disabled={!folderName.trim()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            创建
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
        </form>
      </div>
    </div>
  );
}

// Context Menu Component
function FileContextMenu({
  x,
  y,
  item,
  onMove,
  onCreateFolder,
  onClose,
}: {
  x: number;
  y: number;
  item: TreeNode | null;
  onMove: () => void;
  onCreateFolder: () => void;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[200px]"
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      {/* Move */}
      <button
        onClick={() => {
          onMove();
          onClose();
        }}
        className="w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Move className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="text-gray-800 dark:text-gray-200">移动</span>
      </button>

      {/* Create Folder (only for directories) */}
      {item.type === 'directory' && onCreateFolder && (
        <button
          onClick={() => {
            onCreateFolder();
            onClose();
          }}
          className="w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FolderPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-gray-800 dark:text-gray-200">新建子文件夹</span>
        </button>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

      {/* Info */}
      <div className="px-4 py-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {item.type === 'directory' ? '文件夹' : '文件'}
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
          {item.name}
        </div>
      </div>
    </div>
  );
}
