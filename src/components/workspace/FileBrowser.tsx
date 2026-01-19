/**
 * File Tree Browser Component
 *
 * Displays a collapsible directory tree for workspace navigation.
 * Supports folder expansion/collapse and file selection.
 */

'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  RefreshCw,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { listDirectory, type FileInfo } from '@/lib/workspace/files-service';

interface FileBrowserProps {
  workspaceRoot?: string;
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
  onDirectorySelect?: (path: string) => void;
  disabled?: boolean;
  refreshTrigger?: number;
}

export interface FileBrowserHandle {
  refresh: () => void;
  forceRefresh: () => void;
}

// Tree node interface with children and expansion state
interface TreeNode extends FileInfo {
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
}

const FileBrowserImpl = forwardRef<FileBrowserHandle, FileBrowserProps>(
  (
    {
      workspaceRoot,
      selectedPath,
      onFileSelect,
      onDirectorySelect,
      disabled = false,
      refreshTrigger,
    },
    ref
  ) => {
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const loadedPathsRef = useRef<Set<string>>(new Set());

    // Expose refresh functions via ref
    useImperativeHandle(ref, () => ({
      refresh: () => {
        loadRootDirectory();
      },
      forceRefresh: () => {
        loadedPathsRef.current.clear();
        loadRootDirectory();
      },
    }));

    // Load directory contents recursively
    const loadDirectory = async (node: TreeNode) => {
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

    // Load root directory
    const loadRootDirectory = async () => {
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

    // Refresh when refreshTrigger changes
    useEffect(() => {
      if (refreshTrigger !== undefined && refreshTrigger > 0) {
        loadedPathsRef.current.clear();
        loadRootDirectory();
      }
    }, [refreshTrigger]);

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
    const handleItemClick = (node: TreeNode) => {
      if (disabled) return;

      if (node.type === 'directory') {
        handleFolderClick(node);
      } else {
        onFileSelect(node.path);
      }
    };

    // Recursive render of tree nodes
    const renderTreeNodes = (nodes: TreeNode[], depth = 0): JSX.Element[] => {
      return nodes.map((node) => (
        <div key={node.path}>
          {/* Folder/File row */}
          <button
            onClick={() => handleItemClick(node)}
            disabled={disabled}
            className={`
              w-full flex items-center gap-1 px-2 py-1.5 text-left text-xs rounded-md transition-colors
              ${selectedPath === node.path
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
            title={node.path}
          >
            {/* Expand/collapse icon for folders */}
            {node.type === 'directory' ? (
              <>
                {node.isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 animate-spin" />
                ) : node.isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                )}
                {node.isExpanded ? (
                  <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 flex-shrink-0 text-blue-500" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5 h-3.5 flex-shrink-0" />
                <File className="w-4 h-4 flex-shrink-0 text-gray-400" />
              </>
            )}
            <span className="truncate flex-1">{node.name}</span>
          </button>

          {/* Render children if folder is expanded */}
          {node.type === 'directory' &&
            node.isExpanded &&
            node.children &&
            node.children.length > 0 && (
            <div className="mt-0.5">
              {renderTreeNodes(node.children, depth + 1)}
            </div>
          )}
        </div>
      ));
    };

    // Refresh current tree
    const refreshTree = () => {
      loadedPathsRef.current.clear();
      loadRootDirectory();
    };

    return (
      <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Folder className="w-4 h-4" />
            <span>Files</span>
          </div>
          <button
            onClick={refreshTree}
            disabled={disabled || loading}
            className="p-1 rounded hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3 h-3 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 mx-2 mt-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* File Tree */}
        <div className="flex-1 overflow-auto p-1">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : tree.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-xs">
              No files
            </div>
          ) : (
            <div className="space-y-0.5">{renderTreeNodes(tree)}</div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-3 py-1 bg-white border-t border-gray-200 text-xs text-gray-500">
          {tree.length} item{tree.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
);

// Display name for better stack traces
FileBrowserImpl.displayName = 'FileBrowser';

// Export the forward-ref component
export const FileBrowser = FileBrowserImpl;
