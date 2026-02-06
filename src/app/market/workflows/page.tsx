/**
 * Workflows Market Page (Protected Route)
 * Route: /market/workflows -> /auroraforce/market/workflows
 */

'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkflowsCard, type WorkflowSpec } from '@/components/workflows/WorkflowsCard';
import { useWorkflows } from '@/hooks/useWorkflows';
import { Button } from '@/components/ui/button';
import WorkflowSpecUpload from '@/components/workflows/WorkflowSpecUpload';

export default function MarketplacePage() {
  const router = useRouter();
  const { data: workflowsData, isLoading: loading, error, refetch } = useWorkflows();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleSelectWorkflow = (workflowId: string) => {
    router.push(`/workspace/new`);
  };

  const handleUploadComplete = () => {
    refetch?.();
    setIsUploadDialogOpen(false);
  };

  const workflows = workflowsData?.data || [];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">

          {/* Page Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                工作流市场
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                浏览、下载和导入工作流模板
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/workspace/new">
                  新建工作空间
                </Link>
              </Button>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                上传工作流
              </Button>
            </div>
          </div>

          <div className="mb-3">
            <Button
              variant="outline"
              onClick={() => refetch?.()}
              className="w-full"
            >
              刷新工作流列表
            </Button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">加载中...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-2">加载失败: {String(error)}</div>
              <Button
                variant="outline"
                onClick={() => refetch?.()}
              >
                重试
              </Button>
            </div>
          )}

          {!loading && !error && !workflows || workflows.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                暂无可用的工作流
              </p>
            </div>
          )}

          {workflows && workflows.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow: WorkflowSpec) => (
                <WorkflowsCard
                  key={workflow.id}
                  workflow={workflow}
                  onLoad={handleSelectWorkflow}
                  isLoading={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      {isUploadDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col w-full max-w-2xl max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  上传工作流
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  支持 .md, .yaml, .yml 格式的工作流文件
                </p>
              </div>
              <button
                onClick={() => setIsUploadDialogOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <WorkflowSpecUpload onUploadComplete={handleUploadComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
