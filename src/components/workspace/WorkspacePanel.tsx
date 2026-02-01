/**
 * Workspace Panel Component
 *
 * Container component that manages the split view between
 * FileBrowser and FileEditor components.
 *
 * Provides file management operations and state coordination.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Download, Copy, Trash2, Upload, Search } from 'lucide-react';
import { FileBrowser } from './FileBrowser';
import { FileEditor } from './FileEditor';
import { TabBar } from './TabBar';
import { FileUpload } from './FileUpload';
import { FileSearch } from './FileSearch';
import {
  readFile,
  writeFile,
  deleteFile,
  type FileMetadata,
} from '@/lib/workspace/files-service';
import { useTabsStore } from '@/stores/workspace-tabs-store';

interface WorkspacePanelProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceRoot?: string;
}

export function WorkspacePanel({
  isOpen,
  onClose,
  workspaceRoot,
}: WorkspacePanelProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | undefined>();
  const [isBinary, setIsBinary] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [warning, setWarning] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // Store FileBrowser ref for refreshing
  const fileBrowserRef = useRef<{ refresh: () => void; forceRefresh: () => void }>(null);
  const refreshTriggerRef = useRef<number>(0);

  // Load file when selected
  const loadFile = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await readFile(path);
      setFileContent(result.content);
      setFileMetadata(result.metadata);
      setIsBinary(result.isBinary ?? false);
      setIsLarge(result.isLarge ?? false);
      setWarning(result.warning);
      setSelectedPath(path);
      setDeleteSuccess(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle file selection from browser
  const handleFileSelect = useCallback(
    (path: string) => {
      if (selectedPath === path) return;
      loadFile(path);
    },
    [loadFile, selectedPath]
  );

  // Save file
  const handleSave = useCallback(async (path: string, content: string) => {
    try {
      await writeFile(path, content);
      setFileContent(content);
    } catch (err) {
      throw err;
    }
  }, []);

  // Copy file path
  const handleCopyPath = useCallback(async () => {
    if (!selectedPath) return;

    try {
      await navigator.clipboard.writeText(selectedPath);
      alert('Path copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy path:', err);
      alert('Failed to copy path');
    }
  }, [selectedPath]);

  // Download file
  const handleDownload = useCallback(() => {
    if (!selectedPath || !fileContent) return;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileMetadata?.filename || selectedPath.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [selectedPath, fileContent, fileMetadata]);

  // Delete file
  const handleDelete = useCallback(async () => {
    if (!selectedPath) {
      alert('No file selected');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${fileMetadata?.filename || selectedPath}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await deleteFile(selectedPath, true);

      if (result.requiresConfirmation) {
        alert('Please confirm deletion');
        return;
      }

      if (result.success) {
        setDeleteSuccess(`File "${fileMetadata?.filename || selectedPath}" deleted successfully`);
        setSelectedPath(null);
        setFileContent('');
        setFileMetadata(undefined);

        // Force refresh the file browser by incrementing refresh trigger
        refreshTriggerRef.current += 1;

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess(null);
        }, 3000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMsg);
      alert(`Failed to delete file: ${errorMsg}`);
    }
  }, [selectedPath, fileMetadata]);

  // Handle search result selection
  const handleSearchResultSelect = useCallback((file: any) => {
    if (file.type === 'directory') {
      // For directories, just select the path (could open in browser)
      setSelectedPath(file.path);
    } else {
      // For files, load and display in editor
      loadFile(file.path);
    }
    // Close search dialog
    setIsSearchDialogOpen(false);
  }, [loadFile]);

  // Handle drag resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      setSidebarWidth(Math.max(200, Math.min(500, newWidth)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        onClose();
      }
      // Ctrl+Shift+U to open upload dialog
      if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        setIsUploadDialogOpen(!isUploadDialogOpen);
      }
      // Ctrl+K to open search dialog
      if (e.ctrlKey && e.key === 'k') {
        setIsSearchDialogOpen((prev) => !prev);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isUploadDialogOpen]);

  // Handle file upload complete
  const handleUploadComplete = useCallback(async (files: any[]) => {
    if (files.length > 0 && fileBrowserRef.current) {
      // Refresh file browser to show uploaded files
      fileBrowserRef.current.forceRefresh();

      // Show success message
      setDeleteSuccess(`Successfully uploaded ${files.length} file${files.length === 1 ? '' : 's'}`);

      // Dismiss success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);

      setIsUploadDialogOpen(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-6xl h-[80vh]"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Workspace Files
            </h2>
            {selectedPath && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-gray-600 truncate max-w-md">
                  {selectedPath}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadDialogOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Upload Files (Ctrl+Shift+U)"
            >
              <Upload className="w-4 h-4" />
            </button>
            {selectedPath && (
              <>
                <button
                  onClick={handleCopyPath}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                  title="Copy path"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {(deleteSuccess || error) && (
          <div className={`px-4 py-2 mx-4 mt-2 border rounded text-sm ${
            error
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-green-50 border-green-200 text-green-600'
          }`}>
            {deleteSuccess || error}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Resizer */}
          <div
            className={`flex-shrink-0 border-r border-gray-200`}
            style={{ width: `${sidebarWidth}px` }}
          />
          <div
            className="flex-shrink-0 w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize z-10"
            onMouseDown={handleMouseDown}
          />

          {/* File Browser */}
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ width: `${sidebarWidth}px` }}
          >
            <FileBrowser
              ref={fileBrowserRef}
              workspaceRoot={workspaceRoot}
              selectedPath={selectedPath}
              onFileSelect={handleFileSelect}
              refreshTrigger={refreshTriggerRef.current}
            />
          </div>

          {/* File Editor */}
          <div className="flex-1 overflow-hidden flex flex-col h-full min-h-0">
            {selectedPath ? (
              loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Loading...
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-red-600">
                  <p className="mb-4">{error}</p>
                  <button
                    onClick={() => selectedPath && loadFile(selectedPath)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <FileEditor
                  path={selectedPath}
                  content={fileContent}
                  metadata={fileMetadata}
                  isBinary={isBinary}
                  isLarge={isLarge}
                  warning={warning}
                  onSave={handleSave}
                  projectRoot={workspaceRoot}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-full bg-gray-50 text-gray-400">
                <svg
                  className="w-12 h-12 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm">Select a file to edit</p>
                <p className="text-xs mt-2">
                  Files are loaded from the workspace directory
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search Dialog */}
        <FileSearch
          visible={isSearchDialogOpen}
          onClose={() => setIsSearchDialogOpen(false)}
          onResultSelect={handleSearchResultSelect}
          workspaceRoot={workspaceRoot}
        />

        {/* File Upload Dialog */}
        <FileUpload
          visible={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onUploadComplete={handleUploadComplete}
          targetPath={workspaceRoot || '/'}
        />
      </div>
    </div>
  );
}
