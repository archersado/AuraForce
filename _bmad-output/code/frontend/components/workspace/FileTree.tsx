/**
 * File Tree Component
 *
 * Implements STORY-14-7: Workspace File Tree and Navigation
 */

'use client';

import React, { useCallback } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { getFileInfo, sortFiles } from '@/utils/file-types';
import type { FileNode } from '@/stores/workspace-store';

interface FileTreeProps {
  tree?: FileNode[];
  onFileSelect?: (path: string) => void;
  onFolderToggle?: (folderId: string) => void;
  className?: string;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const {
    expandedFolders,
    toggleFolder,
    setSelectedFile,
    activeTabId,
    openTab,
  } = useWorkspaceStore();

  const isExpanded = expandedFolders.has(node.id);
  const isActive = openTab.find((t) => t.path === node.path)?.id === activeTabId;
  const fileInfo = getFileInfo(node.name);

  const handleClick = useCallback(() => {
    if (node.type === 'folder') {
      toggleFolder(node.id);
    } else {
      setSelectedFile(node.path);
      // Open file in tab
      openTab({
        id: node.id,
        path: node.path,
        name: node.name,
        type: fileInfo.type,
        isModified: false,
      });
    }
  }, [node, toggleFolder, setSelectedFile, openTab, fileInfo.type, node.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight' && node.type === 'folder' && !isExpanded) {
        toggleFolder(node.id);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' && node.type === 'folder' && isExpanded) {
        toggleFolder(node.id);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        handleClick();
        e.preventDefault();
      }
    },
    [node, isExpanded, toggleFolder, handleClick]
  );

  const paddingLeft = level * 16 + 8;

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-colors select-none
          ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}
          ${node.type === 'file' && node.name.startsWith('.') ? 'opacity-60' : ''}
        `}
        style={{ paddingLeft }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="treeitem"
        aria-expanded={node.type === 'folder' ? isExpanded : undefined}
        aria-level={level + 1}
      >
        {/* Expand/Collapse indicator for folders */}
        {node.type === 'folder' && (
          <button
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              toggleFolder(node.id);
            }}
            tabIndex={-1}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        {/* File/Folder icon */}
        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          )
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}

        {/* File name */}
        <span
          className={`
            text-sm truncate
            ${node.type === 'folder' ? 'font-medium' : 'font-normal'}
            ${isActive ? 'font-semibold' : ''}
          `}
        >
          {node.name}
        </span>

        {/* File size for files */}
        {node.type === 'file' && node.size && (
          <span className="ml-auto text-xs text-gray-400">
            {formatFileSize(node.size)}
          </span>
        )}
      </div>

      {/* Child items */}
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children
            .sort(sortFiles)
            .map((child) => (
              <FileTreeItem key={child.id} node={child} level={level + 1} />
            ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function FileTree({
  tree,
  onFileSelect,
  onFolderToggle,
  className = '',
}: FileTreeProps) {
  const { fileTree } = useWorkspaceStore();

  const treeData = tree || fileTree;

  if (!treeData || treeData.length === 0) {
    return (
      <div className={className}>
        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
          <Folder className="w-12 h-12 mb-2 opacity-50" />
          <p className="text-sm">Empty workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-auto ${className}`}
      role="tree"
      aria-label="File Browser"
    >
      {treeData
        .sort(sortFiles)
        .map((node) => (
          <FileTreeItem key={node.id} node={node} level={0} />
        ))}
    </div>
  );
}

/**
 * File Tree with search and filtering
 */
interface FileTreeWithSearchProps extends FileTreeProps {
  searchQuery?: string;
}

export function FileTreeWithSearch({
  searchQuery = '',
  ...props
}: FileTreeWithSearchProps) {
  // Filter tree based on search query
  const filterTree = useCallback(
    (nodes: FileNode[], query: string): FileNode[] => {
      if (!query) return nodes;

      const lowerQuery = query.toLowerCase();

      function matchesNode(node: FileNode): boolean {
        // Check if current node matches
        if (node.name.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        // Check if any child matches (for folders)
        if (node.children) {
          const matchingChildren = node.children.filter(matchesNode);
          return matchingChildren.length > 0;
        }

        return false;
      }

      function processNode(node: FileNode): FileNode | null {
        if (!matchesNode(node)) {
          return null;
        }

        // If it's a folder, filter children but keep folder if any match
        if (node.type === 'folder' && node.children) {
          const processedChildren = node.children
            .map(processNode)
            .filter((n): n is FileNode => n !== null);

          if (processedChildren.length === 0) {
            // Only parent matches, show just the folder
            return { ...node };
          }

          return {
            ...node,
            children: processedChildren,
          };
        }

        return node;
      }

      return nodes
        .map(processNode)
        .filter((n): n is FileNode => n !== null);
    },
    []
  );

  const filteredTree = filterTree(props.tree || [], searchQuery);

  return <FileTree {...props} tree={filteredTree} />;
}
