'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, MessageSquare } from 'lucide-react';
import { ChatInterface } from '@/components/claude';
import { FileEditor } from '@/components/workspace/FileEditor';
import { FileBrowser } from '@/components/workspace/FileBrowser';
import { FileOperationNotification } from '@/components/workspace/FileOperationNotification';
import { readFile, writeFile, type FileMetadata } from '@/lib/workspace/files-service';
import { useParams, useRouter } from 'next/navigation';
import { useClaudeStore } from '@/lib/store/claude-store';

interface WorkspaceProject {
  id: string;
  name: string;
  path: string;
  description: string | null;
  status: 'active' | 'missing';
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();

  // Get file operation state from Claude store
  const { fileOperation, clearFileOperation } = useClaudeStore();

  const projectId = params.id as string;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  // File editor state
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | undefined>();
  const [isBinary, setIsBinary] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [warning, setWarning] = useState<string | undefined>();
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Fetch project details
  useEffect(() => {
    async function fetchProject() {
      try {
        setLoadingProject(true);
        const response = await fetch(`/api/workspaces/${projectId}`);

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

  // Handle file operation notifications - auto-switch Workspace to the affected file
  useEffect(() => {
    async function handleFileOperation() {
      const operationType = fileOperation.type as 'create' | 'update' | 'delete' | null;
      const operationFilePath = fileOperation.filePath;

      if (operationType && operationFilePath && selectedProject) {
        // Check if the file path is within the current project root
        const isWithinProject = operationFilePath.startsWith(selectedProject.path);

        if (isWithinProject) {
          // Convert absolute path to relative path (remove project prefix)
          const relativePath = operationFilePath.slice(selectedProject.path.length).replace(/^\//, '');

          console.log('[ProjectDetailPage] File operation detected within project:', {
            operationType,
            operationFilePath,
            relativePath,
            projectRoot: selectedProject.path,
          });

          // Auto-switch to the file for create/update operations
          if (operationType === 'create' || operationType === 'update') {
            try {
              setLoadingFile(true);
              setFileError(null);

              const result = await readFile(relativePath, selectedProject.path);
              setFileContent(result.content);
              setFileMetadata(result.metadata);
              setIsBinary(result.isBinary ?? false);
              setIsLarge(result.isLarge ?? false);
              setWarning(result.warning);
              setSelectedFile(relativePath);

              console.log('[ProjectDetailPage] Auto-switched to file:', relativePath);

              // Clear notification after handling
              setTimeout(() => {
                clearFileOperation();
              }, 500);
            } catch (err) {
              console.error('[ProjectDetailPage] Failed to auto-load file after operation:', err);
              // Still clear the notification even if loading failed
              clearFileOperation();
            } finally {
              setLoadingFile(false);
            }
          } else if (operationType === 'delete') {
            // If current file was deleted, clear selection
            if (selectedFile && selectedFile === relativePath) {
              setSelectedFile(null);
              setFileContent('');
              setFileMetadata(undefined);
            }
            // Clear notification after handling
            setTimeout(() => {
              clearFileOperation();
            }, 500);
          }
        } else {
          console.log('[ProjectDetailPage] File operation outside current project, ignoring:', operationFilePath);
          // Clear notification if it's not for this project
          clearFileOperation();
        }
      }
    }

    handleFileOperation();
  }, [fileOperation, selectedProject, selectedFile]);

  // Handle view file from notification action button
  const handleViewFileFromNotification = (filePath: string) => {
    if (!selectedProject) return;

    // Convert absolute path to relative path
    const relativePath = filePath.startsWith(selectedProject.path)
      ? filePath.slice(selectedProject.path.length).replace(/^\//, '')
      : filePath;

    handleFileSelect(relativePath);
  };

  // Load file content
  const handleFileSelect = async (path: string) => {
    if (selectedFile === path) return;

    setLoadingFile(true);
    setFileError(null);

    try {
      const result = await readFile(path, selectedProject?.path);
      setFileContent(result.content);
      setFileMetadata(result.metadata);
      setIsBinary(result.isBinary ?? false);
      setIsLarge(result.isLarge ?? false);
      setWarning(result.warning);
      setSelectedFile(path);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load file';
      console.error('[ProjectDetailPage] Failed to load file:', err);
      setFileError(errorMsg);
      alert(`Failed to load file: ${errorMsg}`);
    } finally {
      setLoadingFile(false);
    }
  };

  // Save file
  const handleFileSave = async (path: string, content: string, root?: string) => {
    try {
      if (root) {
        await writeFile(path, content, root);
      } else {
        await writeFile(path, content);
      }
      setFileContent(content);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save file';
      console.error('[ProjectDetailPage] Failed to save file:', err);
      alert(`Failed to save file: ${errorMsg}`);
      throw err;
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

            {/* Project Workspace - Editor with File Browser */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col" style={{ minHeight: '600px', height: 'calc(100vh - 200px)' }}>
              <div className="flex-1 flex overflow-hidden">
                {/* File Browser Sidebar */}
                <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                  <FileBrowser
                    workspaceRoot={selectedProject.path}
                    selectedPath={selectedFile}
                    onFileSelect={handleFileSelect}
                  />
                </div>

                {/* File Editor Area */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  {selectedFile ? (
                    <FileEditor
                      path={selectedFile}
                      content={fileContent}
                      metadata={fileMetadata}
                      isBinary={isBinary}
                      isLarge={isLarge}
                      warning={warning}
                      onSave={handleFileSave}
                      projectRoot={selectedProject.path}
                      hideFileTree={true}
                    />
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* File Operation Notification - shows when files are created/updated/deleted */}
      <FileOperationNotification onViewFile={handleViewFileFromNotification} />
    </div>
  );
}
