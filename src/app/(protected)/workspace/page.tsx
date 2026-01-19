'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Terminal, Folder as FolderIcon, ChevronLeft, MessageSquare, RefreshCw } from 'lucide-react';
import { EmbeddedChat } from '@/components/claude';
import WorkspaceManager from '@/components/workspaces/WorkspaceManager';
import TemplateSelect from '@/components/workflows/TemplateSelect';
import WorkflowUpload from '@/components/workflows/WorkflowUpload';
import { ChatInterface } from '@/components/claude';
import { FileEditor } from '@/components/workspace/FileEditor';
import { FileBrowser } from '@/components/workspace/FileBrowser';
import { readFile, writeFile, type FileMetadata } from '@/lib/workspace/files-service';
import { useSearchParams, useRouter } from 'next/navigation';

type View = 'dashboard' | 'templateSelect' | 'upload' | 'project' | 'claude';

interface WorkspaceProject {
  id: string;
  name: string;
  path: string;
  description: string | null;
  status: 'active' | 'missing';
}

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<View>(() => {
    // Set initial view based on URL
    const path = searchParams.get('page');
    if (path === 'templates') return 'templateSelect';
    if (path === 'upload') return 'upload';
    if (path?.startsWith('project:')) return 'project';
    return 'dashboard';
  });
  const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // File editor state
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | undefined>();
  const [isBinary, setIsBinary] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [warning, setWarning] = useState<string | undefined>();
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleSelectProject = (project: WorkspaceProject) => {
    setSelectedProject(project);
    setView('project');
    router.push(`/workspace?page=project:${project.id}`);
  };

  const handleCreateProject = () => {
    setView('templateSelect');
    router.push('/workspace?page=templates');
  };

  const handleLoadTemplate = (templateId: string, projectName: string) => {
    setView('dashboard');
    router.push('/workspace');
    // Refresh projects after loading template
    window.location.reload();
  };

  const handleBack = () => {
    if (view === 'project') {
      setView('dashboard');
      setSelectedProject(null);
      router.push('/workspace');
    } else {
      setView('dashboard');
      router.push('/workspace');
    }
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
      console.error('[WorkspacePage] Failed to load file:', err);
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
      console.error('[WorkspacePage] Failed to save file:', err);
      alert(`Failed to save file: ${errorMsg}`);
      throw err;
    }
  };

  // Clear file selection when project changes
  useEffect(() => {
    if (!selectedProject) {
      setSelectedFile(null);
      setFileContent('');
      setFileMetadata(undefined);
    }
  }, [selectedProject]);

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
      {/* Main Content - Two Column Layout */}
      {view !== 'dashboard' && view !== 'templateSelect' && view !== 'upload' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Claude Chat (only show in project view) */}
          {view === 'project' && (
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

                  {/* Toggle button (always visible in expanded mode) */}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mr-2"
                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    <ChevronLeft className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                      sidebarCollapsed ? '-rotate-180' : ''
                    }`} />
                  </button>

                  {/* Embedded Chat Interface */}
                  <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 56px)' }}>
                    <ChatInterface
                      projectPath={selectedProject?.path}
                      projectId={selectedProject?.id}
                      projectName={selectedProject?.name}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Content - Project View */}
          <main className="flex-1 overflow-auto p-6">
            {view === 'project' && selectedProject && (
              <div className="space-y-6">
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
            )}
          </main>
        </div>
      )}

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to AuraForce Workspace
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Create projects from templates or build your own workflows.
                Start by creating a new project or selecting an existing one.
                Use the Claude chat on the left to interact with AI assistant.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setView('templateSelect')}
                className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    New Project
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start with a workflow template
                </p>
              </button>

              <button
                onClick={() => setView('upload')}
                className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upload Workflow
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a workflow as a template
                </p>
              </button>
            </div>

            {/* Workspace Projects */}
            <WorkspaceManager
              onSelectProject={handleSelectProject}
              onCreateProject={handleCreateProject}
            />
          </div>
        </div>
      )}

      {/* Template Select View */}
      {view === 'templateSelect' && (
        <div className="flex-1 overflow-auto p-6">
          <TemplateSelect
            onLoadTemplate={handleLoadTemplate}
          />
        </div>
      )}

      {/* Upload View */}
      {view === 'upload' && (
        <div className="flex-1 overflow-auto p-6">
          <WorkflowUpload
            onSuccess={(result) => {
              alert('Workflow uploaded successfully!');
              setView('dashboard');
              router.push('/workspace');
            }}
            onError={(error) => {
              alert(`Upload failed: ${error}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
