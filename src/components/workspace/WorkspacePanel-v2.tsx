/**
 * Workspace Panel Component
 *
 * Enhanced with multi-tab support.
 * Manages split view between FileBrowser and multiple FileEditor instances.
 *
 * Provides file management operations and state coordination.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Download, Copy, Trash2, Upload, Search, MoreVertical, FileText } from 'lucide-react';
import { FileBrowser, type FileBrowserHandle } from './FileBrowser';
import { TabBar } from './TabBar';
import { FileEditor } from './FileEditor';
import { FileUpload } from './FileUpload';
import { FileSearch } from './FileSearch';
import { FileRenameDialog } from './FileRenameDialog';
import {
  readFile,
  writeFile,
  deleteFile,
  renameFile,
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
  const { tabs, activeTabId, openTab, closeTab, markTabAsSaved, getActiveTab } = useTabsStore();
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [renameTarget, setRenameTarget] = useState<{ path: string; name: string } | null>(null);

  // Store FileBrowser ref for refreshing
  const fileBrowserRef = useRef<FileBrowserHandle>(null);
  const refreshTriggerRef = useRef<number>(0);

  // Load file content when tab is activated
  useEffect(() => {
    const activeTab = getActiveTab();
    if (activeTab) {
      const tabElement = document.getElementById(`tab-content-${activeTab.id}`);
      if (!tabElement) {
        // Load file content
        loadFile(activeTab.path);
      }
    }
  }, [activeTabId]);

  // Load file
  const loadFile = useCallback(async (path: string) => {
    try {
      const result = await readFile(path);
      const fileExtension = path.split('.').pop()?.toLowerCase() || '';

      // Update or create tab with content
      openTab({
        id: path, // Use path as tab ID
        path,
        name: path.split('/').pop() || 'file',
        content: result.content,
        language: detectLanguage(fileExtension),
        hasUnsavedChanges: false,
        isModified: false,
      });
    } catch (err) {
      console.error('Failed to load file:', err);
      setDeleteSuccess(`Failed to load file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setTimeout(() => setDeleteSuccess(null), 3000);
    }
  }, [openTab, workspaceRoot]);

  // Detect language from extension
  const detectLanguage = (ext: string): string => {
    const langMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      json: 'json',
      md: 'markdown',
      css: 'css',
      html: 'html',
      py: 'python',
      go: 'go',
      sql: 'sql',
      yaml: 'yaml',
      xml: 'xml',
    };
    return langMap[ext] || 'plaintext';
  };

  // Save tab content
  const handleSave = useCallback(async (tabPath: string, content: string) => {
    try {
      await writeFile(tabPath, content);
      markTabAsSaved(tabs.find((t) => t.path === tabPath)?.id || '');
    } catch (err) {
      throw err;
    }
  }, [tabs, writeFile, markTabAsSaved]);

  // Delete file
  const handleDelete = useCallback(async (tabId: string, tabPath: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${tabPath}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await deleteFile(tabPath, true);

      if (result.requiresConfirmation) {
        alert('Please confirm deletion');
        return;
      }

      if (result.success) {
        closeTab(tabId);
        setDeleteSuccess(`File "${tabPath}" deleted successfully`);

        // Force refresh of file browser
        refreshTriggerRef.current += 1;

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess(null);
        }, 3000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete file';
      setDeleteSuccess(`Failed to delete file: ${errorMsg}`);
      setTimeout(() => setDeleteSuccess(null), 3000);
    }
  }, [closeTab]);

  // Handle tab close (wrapper for handleDelete)
  const handleTabClose = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    handleDelete(tabId, tab.path);
  }, [tabs, handleDelete]);

  // Copy file path
  const handleCopyPath = useCallback(async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      alert('Path copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy path:', err);
      alert('Failed to copy path');
    }
  }, []);

  // Download file
  const handleDownload = useCallback((tab: any) => {
    if (!tab.content) return;

    const blob = new Blob([tab.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tab.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, []);

  // Handle search result selection
  const handleSearchResultSelect = useCallback(async (file: any) => {
    if (file.type === 'directory') {
      // For directories, load the directory (could expand in browser)
      return;
    }

    // For files, open in new tab
    loadFile(file.path);
    setIsSearchDialogOpen(false);
  }, [loadFile]);

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

  // Handle file rename
  const handleRename = useCallback(async (path: string, name: string) => {
    if (!workspaceRoot) return;

    try {
      await renameFile(path, name, workspaceRoot);
      setDeleteSuccess(`Successfully renamed to "${name}"`);

      // Refresh file browser
      refreshTriggerRef.current += 1;

      // Close dialogs
      setIsRenameDialogOpen(false);
      setContextMenuOpen(false);

      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to rename file';
      setDeleteSuccess(errorMsg);
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    }
  }, [workspaceRoot, renameFile, setIsRenameDialogOpen, setContextMenuOpen, setDeleteSuccess]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, filePath: string, fileName: string) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);

    // Store target for menu actions
    setRenameTarget({ path: filePath, name: fileName });
  }, [setContextMenuPosition, setContextMenuOpen, setRenameTarget]);

  // Handle context menu action
  const handleContextMenuAction = useCallback(async (action: 'rename', target: { path: string; name: string }) => {
    if (action === 'rename') {
      setIsRenameDialogOpen(true);
    }

    setContextMenuOpen(false);
  }, [setIsRenameDialogOpen, setContextMenuOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        onClose();
      }
      // Ctrl+W to close current tab
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
      }
      // Ctrl+T to open new tab
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        setIsSearchDialogOpen(true);
      }
      // Ctrl+Shift+U to open upload dialog
      if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        e.preventDefault();
        setIsUploadDialogOpen((prev) => !prev);
      }
      // Ctrl+K to open search dialog
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsSearchDialogOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeTabId, closeTab, isUploadDialogOpen, isSearchDialogOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-7xl h-[85vh]"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Workspace Files
            </h2>
            {tabs.length > 0 && (
              <span className="text-sm text-gray-600 ml-2">
                {tabs.length} {tabs.length === 1 ? 'tab' : 'tabs'} open
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchDialogOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded transition-colors"
              title="Search Files (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsUploadDialogOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded transition-colors"
              title="Upload Files (Ctrl+Shift+U)"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <TabBar onTabClose={handleTabClose} />

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

          {/* Left Side: File Browser or Editor
          <div className="flex-1 overflow-hidden flex flex-col min-w-0">
            {activeTabId ? (
              // Show active tab editor
              <>
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    id={`tab-content-${tab.id}`}
                    className={`flex-1 overflow-hidden ${tab.id !== activeTabId ? 'hidden' : ''}`}
                  >
                    <FileEditor
                      path={tab.path}
                      content={tab.content}
                      metadata={{
                        filename: tab.name,
                        path: tab.path,
                        size: tab.content.length,
                        lastModified: new Date(),
                        mimeType: 'text/plain',
                      }}
                      isBinary={false}
                      isLarge={false}
                      warning={undefined}
                      onSave={(content) => handleSave(tab.path, content)}
                      projectRoot={workspaceRoot}
                    />
                  </div>
                ))}
              </>
            ) : (
              // Show file browser when no tabs open
              <FileBrowser
                ref={fileBrowserRef}
                workspaceRoot={workspaceRoot}
                selectedPath={null}
                onFileSelect={loadFile}
                refreshTrigger={refreshTriggerRef.current}
              />
            )}
          </div>

          {/* Right Side: File Browser (when tabs are open) */}
          <div className={`flex-shrink-0 border-l border-gray-200 ${activeTabId ? '' : 'hidden'}`} style={{ width: `${sidebarWidth}px` }}>
            <FileBrowser
              ref={fileBrowserRef}
              workspaceRoot={workspaceRoot}
              selectedPath={tabs.find((t) => t.id === activeTabId)?.path || null}
              onFileSelect={loadFile}
              refreshTrigger={refreshTriggerRef.current}
            />
          </div>
        </div>

        {/* Success/Error Messages */}
        {deleteSuccess && (
          <div className="px-4 py-2 mx-4 mt-2 bg-green-50 border border-green-200 rounded text-sm text-green-600">
            {deleteSuccess}
            <button
              onClick={() => setDeleteSuccess(null)}
              className="float-right text-green-600 hover:text-green-800 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* File Search Dialog */}
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

        {/* File Rename Dialog */}
        <FileRenameDialog
          visible={isRenameDialogOpen}
          onClose={() => {
            setIsRenameDialogOpen(false);
            setContextMenuOpen(false);
          }}
          onSubmit={async (newName) => {
            if (!renameTarget) return;
            await handleRename(renameTarget.path, newName);
          }}
          currentName={renameTarget?.name || ''}
          currentPath={renameTarget?.path || ''}
        />

        {/* Context Menu */}
        {contextMenuOpen && renameTarget && (
          <div
            className="fixed flex flex-col gap-1 py-1 rounded-lg shadow-xl border border-gray-200 bg-white z-50 min-w-48"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
              position: 'fixed',
            }}
            onClick={() => setContextMenuOpen(false)}
          >
            <button
              onClick={() => handleRename}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-t-lg transition-colors text-left"
            >
              <FileText className="w-4 h-4" />
              <span>Rename</span>
            </button>
            <button
              onClick={() => {
                if (renameTarget) {
                  closeTab(tabs.find((t) => t.path === renameTarget.path)?.id || '');
                }
                setContextMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-b-lg transition-colors text-left"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
