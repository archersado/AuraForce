/**
 * Project File Tree Component
 *
 * Displays the file tree for a project root directory.
 * Works separately from FileEditor to show files when no specific file is selected.
 * Styled consistently with the editor component.
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, Folder as FolderIcon, File, FolderOpen, RefreshCw } from 'lucide-react';
import { listDirectory, type FileInfo } from '@/lib/workspace/files-service';

interface ProjectFileTreeProps {
  projectRoot: string;
  onFileSelect?: (path: string) => void;
  className?: string;
}

interface FileNode extends FileInfo {
  children?: FileNode[];
  isOpen?: boolean;
}

function FileTreeNode({
  nodes,
  selectedPath,
  onNodeClick,
  depth = 0,
}: {
  nodes: FileNode[];
  selectedPath: string | null;
  onNodeClick: (node: FileNode) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <div key={node.path}>
          <button
            onClick={() => onNodeClick(node)}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-left text-xs rounded-md transition-colors ${
              node.path === selectedPath
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
            }`}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
            title={node.path}
          >
            {node.type === 'directory' ? (
              <>
                {node.isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                )}
                {node.isOpen ? (
                  <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-400" />
                ) : (
                  <FolderIcon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                )}
                <span className="truncate flex-1">{node.name}</span>
              </>
            ) : (
              <>
                <span className="w-3.5 h-3.5 flex-shrink-0" />
                <File className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span className="truncate flex-1">{node.name}</span>
              </>
            )}
          </button>
          {/* Show children if folder is open */}
          {node.type === 'directory' && node.isOpen && node.children && (
            <FileTreeNode
              nodes={node.children}
              selectedPath={selectedPath}
              onNodeClick={onNodeClick}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProjectFileTree({ projectRoot, onFileSelect, className = '' }: ProjectFileTreeProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build file tree from files list
  const buildFileTree = async (files: FileInfo[]) => {
    const tree: FileNode[] = [];

    for (const file of files) {
      if (file.type === 'directory') {
        try {
          const subDirPath = file.path.startsWith('/') ? file.path : `/${file.path}`;
          const subResponse = await listDirectory(subDirPath, projectRoot);
          const children: FileNode[] = [];

          for (const child of subResponse.files) {
            if (child.type === 'directory') {
              children.push({ ...child, children: [], isOpen: false });
            } else {
              children.push({ ...child, isOpen: false });
            }
          }

          children.sort((a, b) => {
            if (a.type === 'directory' && b.type !== 'directory') return -1;
            if (a.type !== 'directory' && b.type === 'directory') return 1;
            return a.name.localeCompare(b.name);
          });

          tree.push({ ...file, children, isOpen: false });
        } catch (error) {
          console.error('[ProjectFileTree] Failed to load directory:', file.path);
          // Add directory without children if failed to load
          tree.push({ ...file, children: [], isOpen: false });
        }
      } else {
        tree.push({ ...file, isOpen: false });
      }
    }

    tree.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    setFileTree(tree);
  };

  // Load root directory
  useEffect(() => {
    if (projectRoot) {
      loadRootDirectory();
    }
  }, [projectRoot]);

  const loadRootDirectory = async () => {
    if (!projectRoot) return;

    setLoading(true);
    setError(null);
    setFileTree([]);

    try {
      console.log('[ProjectFileTree] Loading root directory with projectRoot:', projectRoot);
      const response = await listDirectory('/', projectRoot);
      console.log('[ProjectFileTree] API response:', response);

      if (response && response.files) {
        await buildFileTree(response.files);
      } else {
        console.warn('[ProjectFileTree] No files in response:', response);
      }
    } catch (error) {
      console.error('[ProjectFileTree] Failed to load root directory:', error);
      setError(error instanceof Error ? error.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const loadDirectoryContent = async (node: FileNode, forceRefresh = false): Promise<void> => {
    if (node.type !== 'directory' || (node.children && !forceRefresh)) return;

    try {
      const subDirPath = node.path.startsWith('/') ? node.path : `/${node.path}`;
      const subResponse = await listDirectory(subDirPath, projectRoot);
      const children: FileNode[] = [];

      for (const child of subResponse.files) {
        if (child.type === 'directory') {
          children.push({ ...child, children: [], isOpen: false });
        } else {
          children.push({ ...child, isOpen: false });
        }
      }

      children.sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1;
        if (a.type !== 'directory' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });

      // Update the tree node with children
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((item) => {
          if (item.path === node.path) {
            return { ...item, children, isOpen: !node.isOpen };
          }
          if (item.children) {
            return { ...item, children: updateNode(item.children as FileNode[]) };
          }
          return item;
        });
      };

      setFileTree(updateNode(fileTree));
    } catch (error) {
      console.error('[ProjectFileTree] Failed to load directory:', node.path, error);
    }
  };

  const toggleFolder = (node: FileNode): FileNode[] => {
    const toggleNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((item) => {
        if (item.path === node.path) {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.children) {
          return { ...item, children: toggleNode(item.children as FileNode[]) };
        }
        return item;
      });
    };
    return toggleNode(fileTree);
  };

  const handleNodeClick = async (fileNode: FileNode) => {
    if (fileNode.type === 'directory') {
      // Load children if not already loaded
      if (!fileNode.children || fileNode.children.length === 0) {
        await loadDirectoryContent(fileNode);
      } else {
        const newTree = toggleFolder(fileNode);
        setFileTree(newTree);
      }
    } else if (onFileSelect) {
      setSelectedPath(fileNode.path);
      onFileSelect(fileNode.path);
    }
  };

  return (
    <div className={`bg-gray-800 border-t border-gray-700 ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 bg-gray-700/50 border-b border-gray-600">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FolderIcon className="w-4 h-4" />
          <span>Project Files</span>
        </div>
        <button
          onClick={loadRootDirectory}
          disabled={loading}
          className="p-1.5 rounded hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex-shrink-0"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* File Tree - auto-height based on content */}
      <div className="p-1">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-500 text-xs">
            Loading files...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-400 text-xs">
            <span className="text-center">{error}</span>
          </div>
        ) : fileTree.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500 text-xs">
            No files found
          </div>
        ) : (
          <FileTreeNode
            nodes={fileTree}
            selectedPath={selectedPath}
            onNodeClick={handleNodeClick}
            depth={0}
          />
        )}
      </div>
    </div>
  );
}
