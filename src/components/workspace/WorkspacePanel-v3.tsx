/**
 * Workspace Panel v3 - Enhanced with Multi-Tab Management
 *
 * Features:
 * - Multi-tab file editing (7+ files simultaneously)
 * - File browser with folder creation
 * - File search with filters
 * - File upload with drag & drop
 * - File rename dialog
 * - Auto-save and unsaved changes tracking
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Upload, Search, FolderPlus, Plus, MoreHorizontal, CheckCircle } from 'lucide-react';
import { FileBrowser, type FileBrowserHandle } from './FileBrowser';
import { FileEditor } from './FileEditor';
import { FileUpload } from './FileUpload';
import { FileSearch } from './FileSearch';
import { TabBar } from './TabBar';
import {
  readFile,
  writeFile,
  deleteFile,
  uploadFiles,
  getLanguageFromExtension,
  type FileMetadata,
} from '@/lib/workspace/files-service';
import { useTabsStore, type Tab } from '@/stores/workspace-tabs-store';

interface WorkspacePanelProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceRoot?: string;
}

export function WorkspacePanelV3({
  isOpen,
  onClose,
  workspaceRoot,
}: WorkspacePanelProps) {
  // Tab state from store
  const { tabs, activeTabId, openTab, closeTab, markTabAsSaved, markTabAsUnsaved } = useTabsStore();

  // UI state
  const [fileContent, setFileContent] = useState<string>('');
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Dialog states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // Refs
  const fileBrowserRef = useRef<FileBrowserHandle>(null);
  const refreshTriggerRef = useRef<number>(0);

  // --- EFFECTS ---

  // Reset when panel closes
  useEffect(() => {
    if (!isOpen) {
      setFileContent('');
      setFileMetadata(null);
    }
  }, [isOpen]);

  // Update file content when active tab changes
  useEffect(() => {
    const activeTab = tabs.find((t) => t.id === activeTabId);

    if (activeTab?.content !== undefined && tabs.find((t) => t.id === activeTabId)?.content) {
      setFileContent(activeTab.content || '');
    }

    if (activeTab?.path) {
      loadFileMetadata(activeTab.path);
    } else {
      setFileMetadata(null);
    }
  }, [activeTabId, tabs]);

  // Load file metadata
  const loadFileMetadata = async (path: string) => {
    try {
      const result = await readFile(path, workspaceRoot);
      setFileMetadata(result.metadata);
    } catch (err) {
      console.error('Failed to load file metadata:', err);
    }
  };

  // --- FILE OPERATIONS ---

  // Handle file selection from browser
  const handleFileSelect = useCallback(async (path: string) => {
    if (!workspaceRoot || loading) return;

    setLoading(true);

    try {
      const result = await readFile(path, workspaceRoot);

      // Open new tab or activate existing
      const existingTab = tabs.find((t) => t.path === path);

      if (existingTab) {
        // Activate existing tab
        if (activeTabId !== existingTab.id) {
        }
      } else {
        // Create new tab
        openTab({
          path,
          name: path.split('/').pop() || 'untitled',
          content: result.content,
          language: getLanguageFromExtension(path),
          hasUnsavedChanges: false,
        });
      }

      setFileContent(result.content);
      setFileMetadata(result.metadata);

      showNotification('success', `File "${path.split('/').pop()}" loaded`);
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  }, [workspaceRoot, loading, tabs, activeTabId, openTab]);

  // Handle save file
  const handleSave = useCallback(async (): Promise<void> => {
    const activeTab = tabs.find((t) => t.id === activeTabId);

    if (!activeTab?.path || !fileContent) {
      showNotification('error', 'No file to save');
      return;
    }

    setLoading(true);

    try {
      await writeFile(activeTab.path, fileContent, workspaceRoot);
      markTabAsSaved(activeTabId!);
      showNotification('success', `File "${activeTab.name}" saved`);
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to save file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tabs, activeTabId, fileContent, workspaceRoot, markTabAsSaved]);

  // Handle delete file
  const handleDelete = async (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);

    if (!tab?.path) {
      showNotification('error', 'No file to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${tab.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      await deleteFile(tab.path, true);
      closeTab(tabId);
      showNotification('success', `File "${tab.name}" deleted`);
      refreshFileBrowser();
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUploadComplete = async (files: any[]): Promise<void> => {
    showNotification('success', `${files.length} file${files.length === 1 ? '' : 's'} uploaded`);
    refreshFileBrowser();
  };

  // Refresh file browser
  const refreshFileBrowser = () => {
    refreshTriggerRef.current += 1;
    fileBrowserRef.current?.forceRefresh();
  };

  // --- NOTIFICATIONS ---

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- KEYBOARD SHORTCUTS ---

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape' && isSearchDialogOpen) {
        setIsSearchDialogOpen(false);
      }

      // Ctrl+F for search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setIsSearchDialogOpen((prev) => !prev);
      }

      // Ctrl+Shift+U for upload
      if (e.ctrlKey && e.shiftKey && e.key === 'u') {
        e.preventDefault();
        setIsUploadDialogOpen(true);
      }

      // Ctrl+S for save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();

        if (activeTabId && tabs.find((t) => t.id === activeTabId)?.hasUnsavedChanges) {
          handleSave();
        }
      }

      // Ctrl+W for close tab
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();

        if (activeTabId) {
          const activeTab = tabs.find((t) => t.id === activeTabId);

          if (activeTab?.hasUnsavedChanges) {
            if (window.confirm(`Save changes to "${activeTab.name}" before closing?`)) {
              handleSave().then(() => {
                closeTab(activeTabId!);
              });
            } else {
              closeTab(activeTabId!);
            }
          } else {
            closeTab(activeTabId!);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchDialogOpen, activeTabId, tabs, handleSave, closeTab]);

  if (!isOpen) return null;

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col w-full max-w-7xl h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Workspace
              </h2>
              {activeTab?.path && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-lg">
                  /{activeTab.path}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchDialogOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Search Files (Ctrl+F)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Upload Button */}
            <button
              onClick={() => setIsUploadDialogOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Upload Files (Ctrl+Shift+U)"
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Save Button */}
            {activeTab?.hasUnsavedChanges && (
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                title="Save (Ctrl+S)"
              >
                Save
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <TabBar />

        {/* Main Content */}
        <div className="flex flex-1 min-w-0 overflow-hidden">
          {/* File Browser (Left Column) */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 overflow-y-auto">
            <FileBrowser
              ref={fileBrowserRef}
              workspaceRoot={workspaceRoot}
              selectedPath={activeTab?.path || null}
              onFileSelect={handleFileSelect}
              refreshTrigger={refreshTriggerRef.current}
            />
          </div>

          {/* Editor (Right Column) */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeTab ? (
              <div className="flex-1 bg-white dark:bg-gray-900">
                <FileEditor
                  content={activeTab.content || ''}
                  metadata={fileMetadata}
                  path={activeTab.path || ''}
                  language={activeTab.language || 'text'}
                  readOnly={false}
                  onSave={async (content) => {
                    setFileContent(content);
                    if (activeTab.id) {
                      markTabAsUnsaved(activeTab.id);
                    }
                  }}
                  workspaceRoot={workspaceRoot}
                />
              </div>
            ) : (
              // Empty state
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
                <div className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <FolderPlus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No file selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Select a file from the sidebar to start editing
                  </p>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+F</kbd>
                    <span>to search</span>
                    <span className="mx-1">•</span>
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+S</kbd>
                    <span>to save</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50">
            <div
              className={`rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 ${
                notification.type === 'success'
                  ? 'bg-white dark:bg-gray-800 border border-green-500'
                  : 'bg-white dark:bg-gray-800 border border-red-500'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {notification.message}
              </span>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dialogs */}
        <FileSearch
          visible={isSearchDialogOpen}
          onClose={() => setIsSearchDialogOpen(false)}
          onResultSelect={(path) => {
            handleFileSelect(path);
            setIsSearchDialogOpen(false);
          }}
          workspaceRoot={workspaceRoot}
        />

        <FileUpload
          visible={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          targetPath={workspaceRoot || '/'}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </div>
  );
}
