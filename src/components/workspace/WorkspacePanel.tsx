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
import { FileBrowser, type FileBrowserHandle } from './FileBrowser';
import { FileEditor } from './FileEditor';
import { TabBarEnhanced } from './TabBar.enhanced';
import { FileUpload } from './FileUpload';
import { FileSearchEnhanced } from './FileSearch.enhanced';
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState(workspaceRoot || '');

  // Store FileBrowser ref for refreshing
  const fileBrowserRef = useRef<FileBrowserHandle>(null);
  const refreshTriggerRef = useRef<number>(0);

  // Use tabs store
  const { openTab, setActiveTab, closeTab, activeTabId, tabs, markTabAsSaved, markTabAsUnsaved, getActiveTab } = useTabsStore();

  // Get active tab
  const activeTab = getActiveTab();

  // Load file content and open as a tab
  const loadFileAndOpenTab = useCallback(async (path: string) => {
    try {
      const result = await readFile(path);
      
      // Open or activate tab
      openTab({
        id: btoa(path).replace(/[^a-zA-Z0-9]/g, ''),
        path,
        name: path.split('/').pop() || path,
        content: result.content,
        hasUnsavedChanges: false,
        language: result.metadata?.filename?.split('.').pop() || 'text',
        isActive: true,
        isModified: false,
      });
      setSelectedPath(path);
      setDeleteSuccess(null);
      setError(null);
    } catch (err) {
      console.error('Failed to load file:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load file';
      setError(errorMsg);
      alert(errorMsg);
    }
  }, [openTab]);

  // Load file (alias for loadFileAndOpenTab)
  const loadFile = useCallback(async (path: string) => {
    await loadFileAndOpenTab(path);
  }, [loadFileAndOpenTab]);

  // Handle file selection from browser
  const handleFileSelect = useCallback(
    (path: string) => {
      if (activeTab?.path === path) {
        // If clicking on the already active file, don't reload
        setActiveTab(activeTab.id);
        return;
      }
      loadFileAndOpenTab(path);
    },
    [activeTab?.path, loadFileAndOpenTab, setActiveTab]
  );

  // Save file
  const handleSave = useCallback(async (path: string, content: string) => {
    try {
      await writeFile(path, content);
      
      // Update tab content and mark as saved
      const tab = tabs.find((t) => t.path === path);
      if (tab) {
        markTabAsSaved(tab.id);
      }
    } catch (err) {
      throw err;
    }
  }, [tabs, markTabAsSaved]);

  // Copy file path
  const handleCopyPath = useCallback(async () => {
    if (!activeTab?.path) return;

    try {
      await navigator.clipboard.writeText(activeTab.path);
      alert('Path copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy path:', err);
      alert('Failed to copy path');
    }
  }, [activeTab?.path]);

  // Download file
  const handleDownload = useCallback(() => {
    if (!activeTab?.path || !activeTab.content) return;

    const blob = new Blob([activeTab.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab.name || 'file.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [activeTab]);

  // Delete file
  const handleDelete = useCallback(async () => {
    if (!activeTab?.path) {
      alert('No file selected');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${activeTab.name || activeTab.path}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await deleteFile(activeTab.path, true);

      if (result.requiresConfirmation) {
        alert('Please confirm deletion');
        return;
      }

      if (result.success) {
        setDeleteSuccess(`File "${activeTab.name}" deleted successfully`);
        closeTab(activeTab.id);

        // Force refresh the file browser
        refreshTriggerRef.current += 1;

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess(null);
        }, 3000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete file';
      setError?.(errorMsg);
      alert(`Failed to delete file: ${errorMsg}`);
    }
  }, [activeTab, closeTab]);

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
      // Ctrl+F to open search dialog
      if (e.ctrlKey && e.key === 'f') {
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

  // Handle tab close
  const handleTabClose = useCallback((tabId: string) => {
    closeTab(tabId);
  }, [closeTab]);

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
              selectedPath={activeTab?.path}
              onFileSelect={handleFileSelect}
              refreshTrigger={refreshTriggerRef.current}
            />
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Tab Bar */}
            {tabs.length > 0 && (
              <TabBarEnhanced onTabClose={handleTabClose} />
            )}

            {/* File Editor */}
            <div className={`flex-1 overflow-hidden flex flex-col h-full min-h-0 ${activeTab?.path ? 'flex' : 'hidden'}`}>
              {activeTab ? (
                <FileEditor
                  path={activeTab.path}
                  content={activeTab.content}
                  metadata={{
                    path: activeTab.path,
                    size: activeTab.content.length,
                    filename: activeTab.name,
                  }}
                  isBinary={false}
                  isLarge={false}
                  warning={undefined}
                  onSave={handleSave}
                  workspaceRoot={workspaceRoot}
                />
              ) : activeTabId ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Loading...
                </div>
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
        </div>

        {/* Search Dialog */}
        <FileSearchEnhanced
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
