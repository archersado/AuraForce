/**
 * New Workspace Page (Protected Route)
 * Route: /workspace/new -> /auroraforce/workspace/new
 */

'use client';

import * as React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { WorkflowSelector } from '@/components/workflows/WorkflowSelector';
import { type WorkflowSpec } from '@/components/workflows';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function NewWorkspacePage() {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowSpec | null>(null);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWorkflowSelect = (workflow: WorkflowSpec) => {
    setSelectedWorkflow(workflow);
    setError(null);
    if (workflows?.onSelect) {
      workflows.onSelect(workflow);
    }
  };

  const handleCreateProject = async () => {
    if (!selectedWorkflow) {
      setError('请选择一个工作流模板');
      return;
    }

    if (!projectName.trim()) {
      setError('请输入项目名称');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // TODO: Implement workspace creation API call
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          workflowTemplateId: selectedWorkflow.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建项目失败');
      }

      if (data.success) {
        router.push(`/auraforce/project/${data.project.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建项目失败');
      console.error('[NewWorkspacePage] Failed to create project:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white min-h-screen flex flex-col">
      {/* Unified AppHeader */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link
            href="/auroraforce/workspace"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            返回工作空间
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              创建新的工作空间
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              选择一个工作流模板作为起点创建新项目
            </p>
          </div>
          <Button asChild asChild>
            <Link href="/auroraforce/market/workflows">
              浏览工作流市场
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Workflow Selector */}
        <div className="w-3/4 h-full overflow-y-auto">
          <WorkflowSelector onSelect={handleWorkflowSelect} />
        </div>

        {/* Right: Project Config Panel */}
        <div className="w-1/4 h-full overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            项目配置
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {!selectedWorkflow ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                请在左侧选择一个工作流
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  项目名称
                </div>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="输入项目名称"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedWorkflow.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedWorkflow.description}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  版本: {selectedWorkflow.version}
                </div>
              </div>

              <Button
                onClick={handleCreateProject}
                disabled={isCreating || !projectName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? '创建中...' : '确认创建'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
