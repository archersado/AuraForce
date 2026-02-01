'use client';

import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import WorkspaceManager from '@/components/workspaces/WorkspaceManager';
import TemplateSelect from '@/components/workflows/TemplateSelect';
import WorkflowUpload from '@/components/workflows/WorkflowUpload';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type View = 'dashboard' | 'templateSelect' | 'upload';

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [view, setView] = useState<View>(() => {
    // Set initial view based on URL
    const path = searchParams.get('page');
    if (path === 'templates') return 'templateSelect';
    if (path === 'upload') return 'upload';
    return 'dashboard';
  });

  const handleSelectProject = (project: { id: string }) => {
    // Navigate to the project detail page
    router.push(`/project/${project.id}`);
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

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
              {view === 'dashboard' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to AuraForce Workspace
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Create projects from templates or build your own workflows.
                Start by creating a new project or selecting an existing one.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => setView('templateSelect')}
                className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    New Project
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Start with a workflow template
                </p>
              </button>

              <button
                onClick={() => setView('upload')}
                className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Workflow
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Upload a workflow as a template
                </p>
              </button>

              <Link
                href="/skill-builder"
                className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg transition-all group block"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    技能提取
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  通过对话提取你的专业技能
                </p>
              </Link>

              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                    <Terminal className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-2">
                    更多功能
                  </h3>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
                  敬请期待
                </p>
              </div>
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
