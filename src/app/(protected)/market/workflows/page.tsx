/**
 * Workflows Market Page (Protected Route)
 * Route: /market/workflows -> /auroraforce/market/workflows
 */

'use client';

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WorkflowList from '@/components/workflows/WorkflowList';
import { useWorkflows } from '@/hooks/useWorkflows';

export default function MarketplacePage() {
  const router = useRouter();
  const { data: workflowsData, loading, error } = useWorkflows();

  const handleSelectWorkflow = (workflowId: string) => {
    router.push(`/auroraforce/workspace/new`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen flex flex-col">
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
              工作流市场
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              浏览、下载和导入工作流模板
            </p>
          </div>
          <Button asChild asChild>
            <Link href="/auroraforce/workspace/new">
              新建工作空间
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
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
              <div className="text-red-600 dark:text-red-400 mb-2">加载失败: {error}</div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                重试
              </Button>
            </div>
          )}

          {!loading && !error && workflowsData && workflowsData.workflows && workflowsData.workflows.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                所有工作流
                {workflowsData.workflows.length} 个工作流可用
              </h2>
            </div>
          )}

          {!loading && !error && workflowsData && workflowsData.workflows && workflowsData.workflows.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                暂无可用的工作流
              </p>
            </div>
          )}

          {workflowsData && workflowsData.workflows && workflowsData.workflows.length > 0 && (
            <WorkflowList
              workflows={workflows.workflows}
              onSelectWorkflow={handleSelectWorkflow}
              onFavorite={(id) => alert('收藏功能尚未实现')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
