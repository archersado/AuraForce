'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, MessageSquare, Upload, Download, Search } from 'lucide-react';
import { ChatInterface } from '@/components/claude';
import { FileBrowser, type FileBrowserHandle } from '@/components/workspace/FileBrowser';
import { FileOperationNotification } from '@/components/workspace/FileOperationNotification';
import { TabBarEnhanced } from '@/components/workspace/TabBar.enhanced';
import { FileUpload } from '@/components/workspace/FileUpload';
import PPTPreview from '@/components/workspace/PPTPreview';
import { MediaPreviewEnhanced } from '@/components/workspace/MediaPreview.enhanced';
import DocumentPreview from '@/components/file-preview/DocumentPreview';
import { readFile, writeFile, type FileMetadata, getFilePreviewUrl } from '@/lib/workspace/files-service';
import { apiFetch } from '@/lib/api-client';
import { useParams, useRouter } from 'next/navigation';
import { useClaudeStore } from '@/lib/store/claude-store';
import { useTabsStore } from '@/stores/workspace-tabs-store';
import NextDynamic from 'next/dynamic';

// Dynamically import FileEditor to avoid SSR issues
const FileEditor = NextDynamic(() => import('@/components/workspace/FileEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface WorkspaceProject {
  id: string;
  name: string;
  path: string;
  description: string | null;
  status: 'active' | 'missing';
}

/**
 * Get file type based on extension
 */
function getFileType(path: string): 'code' | 'image' | 'ppt' | 'pdf' | 'docx' | 'unknown' {
  const ext = path.split('.').pop()?.toLowerCase() || '';

  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
    return 'image';
  }
  if (['ppt', 'pptx'].includes(ext)) {
    return 'ppt';
  }
  if (ext === 'pdf') {
    return 'pdf';
  }
  if (['doc', 'docx'].includes(ext)) {
    return 'docx';
  }
  if (['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html', 'md', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp'].includes(ext)) {
    return 'code';
  }

  return 'unknown';
}

export default function ProjectDetailPageEnhanced() {
  const params = useParams();
  const router = useRouter();

  // Get file operation state from Claude store
  const { fileOperation, clearFileOperation } = useClaudeStore();

  // Tab store
  const { openTab, setActiveTab, closeTab, closeAllTabs, activeTabId, tabs, markTabAsSaved, getActiveTab, updateTabContent } = useTabsStore();

  const projectId = params.id as string;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fileBrowserRef = useRef<FileBrowserHandle>(null);

  // Get active tab
  const activeTab = getActiveTab();

  // Clear all tabs when entering a new project to avoid stale data
  // This prevents issues with tabs from previously deleted or different projects
  useEffect(() => {
    if (projectId) {
      // Clear all stale tabs when entering a new project
      closeAllTabs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Fetch project details
  useEffect(() => {
    async function fetchProject() {
      try {
        setLoadingProject(true);
        const response = await apiFetch(`/api/workspaces/${projectId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Project not found');
        }

        const data = await response.json();
        if (data.success) {
          setSelectedProject(data.project);
        }
      } catch (err) {
        console.error('[ProjectDetailPage] Failed to load project:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to load project';
        alert(`Error: ${errorMsg}`);
        router.push('/workspace');
      } finally {
        setLoadingProject(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  // Safe string encoding for tab IDs (handles Unicode characters)
  const safeEncode = (str: string): string => {
    try {
      // Use encodeURIComponent to handle Unicode characters, then btoa
      return btoa(encodeURIComponent(str))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch (err) {
      // Fallback: simple hash-like encoding
      return str.split('').map(c => c.charCodeAt(0).toString(36)).join('-');
    }
  };

  // Check if file type requires content reading
  const shouldReadContent = (path: string): boolean => {
    const fileType = getFileType(path);
    // Only read content for code files and unknown files
    // Images, PPT, PDF, DOCX don't need content reading
    return fileType === 'code' || fileType === 'unknown';
  };

  // Load file content and open as a tab
  const loadFileAndOpenTab = async (path: string) => {
    console.log('[ProjectDetailPage] loadFileAndOpenTab called with:', path);
    if (!selectedProject) {
      console.warn('[ProjectDetailPage] loadFileAndOpenTab: No selected project');
      return;
    }

    const fileType = getFileType(path);

    try {
      let content = '';

      // Only read content for text files
      if (shouldReadContent(path)) {
        console.log('[ProjectDetailPage] Reading file content:', path, 'from root:', selectedProject.path);
        const result = await readFile(path, selectedProject.path);
        content = result.content;
        console.log('[ProjectDetailPage] File content loaded, length:', content.length);
      }

      // Open or activate tab
      openTab({
        id: `${selectedProject.id}-${safeEncode(path)}`,
        path,
        name: path.split('/').pop() || path,
        content,
        hasUnsavedChanges: false,
        language: path.split('.').pop() || 'text',
        isModified: false,
      });
      console.log('[ProjectDetailPage] Tab opened/activated:', path);
    } catch (err) {
      console.error('[ProjectDetailPage] Failed to load file:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load file';
      alert(errorMsg);
    }
  };

  // Handle file operation notifications - auto-switch Workspace to the affected file
  useEffect(() => {
    async function handleFileOperation() {
      const operationType = fileOperation.type as 'create' | 'update' | 'delete' | null;
      const operationFilePath = fileOperation.filePath;

      console.log('[ProjectDetailPage] fileOperation state changed:', JSON.stringify({
        operationType,
        operationFilePath,
        hasSelectedProject: !!selectedProject,
        selectedProjectPath: selectedProject?.path,
        hasFileBrowserRef: !!fileBrowserRef.current,
      }, null, 2));

      if (operationType && operationFilePath && selectedProject) {
        // Normalize path - handle both absolute and relative paths
        // If it's an absolute path, convert to relative path
        let relativePath = operationFilePath;
        if (operationFilePath.startsWith(selectedProject.path)) {
          // Absolute path - remove project prefix to get relative path
          relativePath = operationFilePath.slice(selectedProject.path.length).replace(/^\//, '');
        } else if (operationFilePath.startsWith('/')) {
          // Absolute path but not in this project - skip
          console.log('[ProjectDetailPage] File operation is outside current project:', {
            operationType,
            operationFilePath,
            projectRoot: selectedProject.path,
          });
          clearFileOperation();
          return;
        }
        // If it's already a relative path (no leading /), use it as-is

        console.log('[ProjectDetailPage] File operation detected within project:', JSON.stringify({
          operationType,
          operationFilePath,
          relativePath,
          projectRoot: selectedProject.path,
        }, null, 2));

        // Refresh the file browser to show new/modified files
        if (fileBrowserRef.current) {
          console.log('[ProjectDetailPage] Refreshing file browser...');
          fileBrowserRef.current.forceRefresh();
        }

        // Auto-switch to the file for create/update operations
        if (operationType === 'create' || operationType === 'update') {
          console.log('[ProjectDetailPage] Calling loadFileAndOpenTab with:', relativePath);
          await loadFileAndOpenTab(relativePath);
          // Clear notification after handling
          setTimeout(() => {
            clearFileOperation();
          }, 500);
        } else if (operationType === 'delete') {
          // If current file was deleted, close the tab
          const tab = tabs.find(t => t.path === relativePath);
          if (tab) {
            closeTab(tab.id);
          }
          setTimeout(() => {
            clearFileOperation();
          }, 500);
        }
      } else {
        console.log('[ProjectDetailPage] Skipping file operation:', {
          hasOperationType: !!operationType,
          hasOperationFilePath: !!operationFilePath,
          hasSelectedProject: !!selectedProject,
          reason: operationType ? (operationFilePath ? 'missing filePath' : 'missing operationType') : 'missing operationType',
        });
      }
    }

    handleFileOperation();
  }, [fileOperation, selectedProject, tabs, closeTab, loadFileAndOpenTab, clearFileOperation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle file selection from browser
  const handleFileSelect = async (path: string) => {
    if (activeTab?.path === path) {
      setActiveTab(activeTab.id);
      return;
    }
    await loadFileAndOpenTab(path);
  };

  // Handle view file from notification action button
  const handleViewFileFromNotification = (filePath: string) => {
    if (!selectedProject) return;

    // Convert absolute path to relative path
    const relativePath = filePath.startsWith(selectedProject.path)
      ? filePath.slice(selectedProject.path.length).replace(/^\//, '')
      : filePath;

    loadFileAndOpenTab(relativePath);
  };

  // Save file
  const handleFileSave = async (path: string, content: string, root?: string) => {
    try {
      if (root) {
        await writeFile(path, content, root);
      } else {
        await writeFile(path, content);
      }

      // Update tab content and mark as saved
      const tab = tabs.find((t) => t.path === path);
      if (tab) {
        markTabAsSaved(tab.id);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save file';
      console.error('[ProjectDetailPage] Failed to save file:', err);
      alert(`Failed to save file: ${errorMsg}`);
      throw err;
    }
  };

  // Handle tab close
  const handleTabClose = (tabId: string) => {
    closeTab(tabId);
    // Force refresh the file browser
    if (fileBrowserRef.current) {
      fileBrowserRef.current.forceRefresh();
    }
  };

  // Handle file upload complete
  const handleUploadComplete = async (files: any[]) => {
    if (files.length > 0 && fileBrowserRef.current) {
      fileBrowserRef.current.forceRefresh();
      setRefreshTrigger(prev => prev + 1);
      setIsUploadDialogOpen(false);
    }
  };

  // Loading state
  if (loadingProject) {
    return (
      <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  // Project not found
  if (!selectedProject) {
    return (
      <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project not found</h2>
            <button
              onClick={() => router.push('/workspace')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fileType = activeTab ? getFileType(activeTab.path) : 'unknown';

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
      {/* Main Content - Two Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Claude Chat */}
        <div
          className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            sidebarCollapsed ? 'w-12' : 'w-[500px]'
          } overflow-hidden flex-shrink-0`}
        >
          {sidebarCollapsed ? (
            // Collapsed state
            <div className="flex flex-col items-center py-4 h-full">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Expand chat"
              >
                <MessageSquare className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 rotate-90">
                Claude Chat
              </div>
            </div>
          ) : (
            // Expanded state - Use embedded Claude Chat
            <div className="h-full flex flex-col">
              {/* Claude Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Claude Chat</span>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Collapse"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Embedded Chat Interface */}
              <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 56px)' }}>
                <ChatInterface
                  projectPath={selectedProject.path}
                  projectId={selectedProject.id}
                  projectName={selectedProject.name}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Content - Project View */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Project Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/workspace')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Back to workspace"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedProject.name}
                  </h2>
                  {selectedProject.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsUploadDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>

            {/* Project Workspace - Editor with File Browser and Tabs */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col" style={{ minHeight: '600px', height: 'calc(100vh - 200px)' }}>
              <div className="flex-1 flex overflow-hidden">
                {/* File Browser Sidebar */}
                <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                  <FileBrowser
                    ref={fileBrowserRef}
                    workspaceRoot={selectedProject.path}
                    selectedPath={activeTab?.path || null}
                    onFileSelect={handleFileSelect}
                    refreshTrigger={refreshTrigger}
                  />
                </div>

                {/* Right Content Area with Tabs */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Tab Bar */}
                  {tabs.length > 0 && (
                    <TabBarEnhanced onTabClose={handleTabClose} />
                  )}

                  {/* File Preview / Editor Area */}
                  <div className="flex-1 overflow-hidden min-h-0">
                    {activeTab ? (
                      <>
                        {/* Image Preview */}
                        {fileType === 'image' && activeTab.path && (
                          <div className="h-full">
                            <MediaPreviewEnhanced
                              path={activeTab.path}
                              metadata={activeTab.content ? {
                                path: activeTab.path,
                                size: activeTab.content.length,
                                filename: activeTab.name,
                                lastModified: new Date(),
                                mimeType: activeTab.name.endsWith('.png') ? 'image/png' :
                                          activeTab.name.endsWith('.jpg') || activeTab.name.endsWith('.jpeg') ? 'image/jpeg' :
                                          activeTab.name.endsWith('.gif') ? 'image/gif' :
                                          'image/svg+xml',
                              } : {
                                path: activeTab.path,
                                size: 0,
                                filename: activeTab.name,
                                lastModified: new Date(),
                                mimeType: 'image/png',
                              }}
                              workspaceRoot={selectedProject.path}
                            />
                          </div>
                        )}

                        {/* PPT Preview */}
                        {fileType === 'ppt' && activeTab.path && (
                          <div className="h-full">
                            <PPTPreview
                              src={activeTab.path}
                              apiBasePath="/auraforce/api/workspace/files/download"
                            />
                          </div>
                        )}

                        {/* Document Preview (PDF, DOCX) */}
                        {(fileType === 'pdf' || fileType === 'docx') && activeTab.path && (
                          <div className="h-full">
                            <DocumentPreview
                              fileUrl={getFilePreviewUrl(activeTab.path, selectedProject.path)}
                              fileName={activeTab.name}
                            />
                          </div>
                        )}

                        {/* Code Editor */}
                        {(fileType === 'code' || fileType === 'unknown') && (
                          <div className="h-full">
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
                              onSave={async (content, filePath) => {
                                await handleFileSave(filePath, content);
                              }}
                              projectRoot={selectedProject.path}
                              hideFileTree={true}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <svg
                          className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No file selected
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Use the file browser on the left to select a file.
                        </p>
                        {tabs.length > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            You have {tabs.length} open {tabs.length === 1 ? 'tab' : 'tabs'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* File Operation Notification */}
      <FileOperationNotification onViewFile={handleViewFileFromNotification} />

      {/* File Upload Dialog */}
      <FileUpload
        visible={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadComplete={handleUploadComplete}
        targetPath={selectedProject.path}
      />
    </div>
  );
}
