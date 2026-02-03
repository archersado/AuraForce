/**
 * Workflow Market Page
 *
 * Displays all available workflows with search, filtering, and pagination.
 * Route: /market/workflows
 */

'use client';

import * as React from 'react';
import { FileCode, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchBox } from '@/components/workflows/SearchBox';
import { CategoryTabs } from '@/components/workflows/CategoryTabs';
import { WorkflowsCard, type WorkflowSpec } from '@/components/workflows/WorkflowsCard';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useCurrentFilter, useCurrentPage, useSetCurrentPage, useSetCurrentFilter } from '@/stores';
import { cn } from '@/lib/utils';

export default function WorkflowMarketPage() {
  const [loadingWorkflowId, setLoadingWorkflowId] = React.useState<string | null>(null);

  // Store hooks
  const currentFilter = useCurrentFilter();
  const currentPage = useCurrentPage();
  const setPage = useSetCurrentPage();
  const setFilter = useSetCurrentFilter();

  // Query workflows
  const { data, isLoading, error, refetch } = useWorkflows(
    {
      search: currentFilter.search,
      status: currentFilter.category === 'recommended' ? 'deployed' : undefined,
      page: currentPage,
      limit: 12,
    },
    {
      // TanStack Query v5 uses placeholderData instead of keepPreviousData
      placeholderData: (previousData) => previousData as any,
    }
  );

  const workflows = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  // Category tabs
  const tabs = [
    { value: 'all', label: '全部', count: workflows.length },
    { value: 'recommended', label: '推荐', count: workflows.filter(w => w.status === 'deployed').length },
    { value: 'latest', label: '最新', count: 0 },
    { value: 'popular', label: '热门', count: 0 },
    { value: 'favorites', label: '我的收藏', count: 0 },
  ];

  // Handle search
  const handleSearch = (search: string) => {
    setFilter({ search });
    setPage(1); // Reset to page 1 on search
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setFilter({ category: tab as any });
    setPage(1); // Reset to page 1 on tab change
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle load workflow
  const handleLoad = async (id: string) => {
    setLoadingWorkflowId(id);
    // TODO: Implement load workflow logic
    console.log('Loading workflow:', id);
    setTimeout(() => {
      setLoadingWorkflowId(null);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header with Search */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              探索工作流
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              浏览社区创建的工作流模板
            </p>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            className={cn(
              'self-start px-4 py-2 flex items-center gap-2',
              'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'rounded-lg transition-colors'
            )}
            aria-label="刷新"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            <span className="text-sm">刷新</span>
          </button>
        </div>

        {/* Search */}
        <div className="max-w-2xl mb-6">
          <SearchBox
            value={currentFilter.search}
            onChange={handleSearch}
            placeholder="搜索工作流名称或描述..."
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <CategoryTabs
            tabs={tabs}
            activeTab={currentFilter.category}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              加载失败
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md">
              {typeof error === 'string' ? error : '加载工作流列表时发生错误'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && workflows.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <FileCode className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              没有找到工作流
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              尝试更改搜索条件或选择其他分类
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && workflows.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <RefreshCw className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        )}

        {/* Workflow Grid */}
        {!isLoading && !error && workflows.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow: WorkflowSpec) => (
                <WorkflowsCard
                  key={workflow.id}
                  workflow={workflow}
                  onLoad={handleLoad}
                  isLoading={loadingWorkflowId === workflow.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'p-2 rounded-lg border border-gray-200 dark:border-gray-700',
                    'text-gray-600 dark:text-gray-400',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors',
                    'flex items-center justify-center'
                  )}
                  aria-label="上一页"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    const isActive = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          'min-w-[40px] h-10 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-purple-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'p-2 rounded-lg border border-gray-200 dark:border-gray-700',
                    'text-gray-600 dark:text-gray-400',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors',
                    'flex items-center justify-center'
                  )}
                  aria-label="下一页"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Page info */}
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              第 {currentPage} 页，共 {totalPages} 页 · {pagination?.total || 0} 个工作流
            </div>
          </>
        )}
      </div>
    </div>
  );
}
