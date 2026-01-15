'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Moon, Sun, LayoutDashboard, Terminal, Sparkles, FileText, Folder as FolderIcon, ChevronLeft, MessageSquare, Settings } from 'lucide-react';
import { EmbeddedChat } from '@/components/claude';
import WorkspaceManager from '@/components/workspaces/WorkspaceManager';
import TemplateSelect from '@/components/workflows/TemplateSelect';
import WorkflowUpload from '@/components/workflows/WorkflowUpload';
import { ChatInterface } from '@/components/claude';

type View = 'dashboard' | 'templateSelect' | 'upload' | 'project' | 'claude';

interface WorkspaceProject {
  id: string;
  name: string;
  path: string;
  description: string | null;
  status: 'active' | 'missing';
}

export default function WorkspacePage() {
  const [view, setView] = useState<View>('dashboard');
  const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSelectProject = (project: WorkspaceProject) => {
    setSelectedProject(project);
    setView('project');
  };

  const handleCreateProject = () => {
    setView('templateSelect');
  };

  const handleLoadTemplate = (templateId: string, projectName: string) => {
    setView('dashboard');
    // Refresh projects after loading template
    window.location.reload();
  };

  const handleBack = () => {
    if (view === 'project') {
      setView('dashboard');
      setSelectedProject(null);
    } else {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/signout';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-900 transition-colors`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-full mx-auto">
          <div className="flex items-center gap-4">
            {view !== 'dashboard' && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mr-2"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform ${
                sidebarCollapsed ? '-rotate-180' : ''
              }`} />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AuraForce Workspace
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedProject ? selectedProject.name : 'Workspace Dashboard'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation */}
            <nav className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'dashboard'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setView('templateSelect')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'templateSelect'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Templates</span>
              </button>
              <button
                onClick={() => setView('upload')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'upload'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <UploadIcon />
                <span>Upload</span>
              </button>
            </nav>

            {/* Actions */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Left Sidebar - Claude Chat (only show in project view) */}
        {view === 'project' && (
          <div
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
              sidebarCollapsed ? 'w-12' : 'w-96'
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
          {view === 'dashboard' && (
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
                      <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                      <UploadIcon />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Upload Workflow
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a workflow as a template
                  </p>
                </button>

                <a
                  href="/claude"
                  className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg transition-all group block"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Terminal className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Full Claude
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Open the Claude interface
                  </p>
                </a>
              </div>

              {/* Workspace Projects */}
              <WorkspaceManager
                onSelectProject={handleSelectProject}
                onCreateProject={handleCreateProject}
              />
            </div>
          )}

          {view === 'templateSelect' && (
            <TemplateSelect
              onLoadTemplate={handleLoadTemplate}
            />
          )}

          {view === 'upload' && (
            <WorkflowUpload
              onSuccess={(result) => {
                alert('Workflow uploaded successfully!');
                setView('dashboard');
              }}
              onError={(error) => {
                alert(`Upload failed: ${error}`);
              }}
            />
          )}

          {view === 'project' && selectedProject && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2">
                  <a
                    href="/claude"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Full Claude</span>
                  </a>
                </div>
              </div>

              {/* Project Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Files Panel */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="font-medium text-gray-900 dark:text-white">Project Files</h3>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedProject.path}
                    </span>
                  </div>

                  <div className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <FolderIcon className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Project Workspace
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Your project files will appear here. Use the Claude chat on the left to interact with AI and manage your workflow.
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
                      <span className="font-mono">{selectedProject.path}</span>
                    </div>
                  </div>
                </div>

                {/* Info / Quick Actions Panel */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => setSidebarCollapsed(false)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span>Open Claude Chat</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>Edit README.md</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span>Build Workflow</span>
                      </button>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">Project Info</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Project ID
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">
                          {selectedProject.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Status
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          selectedProject.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {selectedProject.status === 'active' ? 'Active' : 'Missing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
