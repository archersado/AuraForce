'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, Download, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { SearchBox } from './SearchBox';
import { CategoryTabs } from './CategoryTabs';
import { WorkflowsCard, type WorkflowSpec } from './WorkflowsCard';
import { cn } from '@/lib/utils';

interface WorkflowPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadWorkflow?: (workflowId: string) => Promise<void>;
  className?: string;
}

export function WorkflowPanel({
  isOpen,
  onClose,
  onLoadWorkflow,
  className,
}: WorkflowPanelProps) {
  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loadingWorkflowId, setLoadingWorkflowId] = React.useState<string | null>(null);
  const [workflows, setWorkflows] = React.useState<WorkflowSpec[]>([]);

  // Category tabs
  const tabs = [
    { value: 'all', label: '全部', count: workflows.length },
    { value: 'recommended', label: '推荐', count: workflows.filter(w => w.status === 'deployed').length },
    { value: 'latest', label: '最新', count: 0 },
    { value: 'popular', label: '热门', count: 0 },
    { value: 'favorites', label: '我的收藏', count: 0 },
  ];

  // Fetch workflows
  const fetchWorkflows = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: activeTab === 'all' ? 'all' : activeTab === 'recommended' ? 'deployed' : 'all',
      });

      const response = await fetch(`/api/workflows?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setWorkflows(data.data);
      } else {
        setError(data.error || '加载失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTab]);

  // Load on open and when search/tab changes
  React.useEffect(() => {
    if (isOpen) {
      fetchWorkflows();
    }
  }, [isOpen, searchQuery, activeTab, fetchWorkflows]);

  // Handle load workflow
  const handleLoad = async (workflowId: string) => {
    if (!onLoadWorkflow) return;

    setLoadingWorkflowId(workflowId);
    try {
      await onLoadWorkflow(workflowId);
      onClose(); // Close panel after successful load
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载工作流失败');
    } finally {
      setLoadingWorkflowId(null);
    }
  };

  // Handle retry
  const handleRetry = () => {
    fetchWorkflows();
  };

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50',
          'w-full md:w-[320px]',
          'bg-white dark:bg-gray-900',
          'shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          'flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              工作流市场
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索工作流..."
            disabled={loading}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-2">
          <CategoryTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="flex-nowrap"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Loading state */}
          {loading && workflows.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm">加载中...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-40 p-4">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 inline mr-2" />
                重试
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && workflows.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <Download className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-sm">没有找到工作流</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                尝试更改搜索条件或筛选条件
              </p>
            </div>
          )}

          {/* Workflow list */}
          {!loading && !error && workflows.length > 0 && (
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  onClick={() => handleLoad(workflow.id)}
                  className="cursor-pointer"
                >
                  <WorkflowsCard
                    workflow={workflow}
                    onLoad={(id) => handleLoad(id)}
                    showActions
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Link to full market page */}
          <Link
            href="/market/workflows"
            onClick={onClose}
            className="block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            开启工作流市场
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            共 {workflows.length} 个工作流可用
          </p>
        </div>
      </div>
    </>
  );
}
