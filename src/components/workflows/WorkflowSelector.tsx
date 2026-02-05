/**
 * Workflow Selector Component
 *
 * Display workflows with category navigation and selection.
 * Used in /workspace/new page for selecting templates.
 */

'use client';

import * as React from 'react';
import { FileCode, Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import { SearchBox } from './SearchBox';
import { WorkflowSelectableItem } from './WorkflowSelectableItem';
import { type WorkflowSpec } from './WorkflowsCard';
import { cn } from '@/lib/utils';

interface WorkflowSelectorProps {
  onSelect?: (workflow: WorkflowSpec) => void;
  onCancel?: () => void;
  selectedWorkflowId?: string;
  className?: string;
}

interface CategorySection {
  id: string;
  title: string;
  workflows: WorkflowSpec[];
}

export function WorkflowSelector({
  onSelect,
  onCancel,
  selectedWorkflowId,
  className,
}: WorkflowSelectorProps) {
  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('my-templates');
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<WorkflowSpec | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [workflows, setWorkflows] = React.useState<WorkflowSpec[]>([]);

  // Category definitions
  const categories = [
    { id: 'my-templates', label: '我的模板', icon: FileCode },
    { id: 'recommended', label: '推荐模板', icon: FileCode },
    { id: 'public', label: '公开模板', icon: FileCode },
  ];

  // Fetch workflows
  const fetchWorkflows = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search: searchQuery,
      });

      // Add filters based on category
      if (activeCategory === 'recommended') {
        params.append('status', 'deployed');
      } else if (activeCategory === 'public') {
        params.append('visibility', 'public');
      }

      const response = await apiFetch(`/api/workflows?${params.toString()}`);
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
  }, [searchQuery, activeCategory]);

  // Load workflows
  React.useEffect(() => {
    fetchWorkflows();
  }, [searchQuery, activeCategory, fetchWorkflows]);

  // Group workflows by category
  const groupedWorkflows = React.useMemo(() => {
    const sections: CategorySection[] = [
      {
        id: 'my-templates',
        title: '我的模板',
        workflows: workflows.filter(w => w.visibility === 'private'),
      },
      {
        id: 'recommended',
        title: '推荐模板',
        workflows: workflows.filter(w => w.status === 'deployed'),
      },
      {
        id: 'public',
        title: '公开模板',
        workflows: workflows.filter(w => w.visibility === 'public'),
      },
    ];

    // Filter out empty sections
    return sections.filter(section => section.workflows.length > 0 || activeCategory === section.id);
  }, [workflows, activeCategory]);

  // Handle workflow selection
  const handleSelect = (workflow: WorkflowSpec) => {
    setSelectedWorkflow(workflow);
    onSelect?.(workflow);
  };

  // Handle confirm
  const handleConfirm = () => {
    if (selectedWorkflow && onSelect) {
      onSelect(selectedWorkflow);
    }
  };

  // Handle retry
  const handleRetry = () => {
    fetchWorkflows();
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Left sidebar - Category navigation */}
      <div className="w-56 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            分类
          </h3>
          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{category.label}</span>
                  {isActive && (
                    <FileCode className="h-4 w-4 rotate-90" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Right side - Workflow list */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索工作流..."
            disabled={loading}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">加载中...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && workflows.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileCode className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                没有找到工作流
              </p>
              {(searchQuery || activeCategory !== 'my-templates') && (
                <button
                  onClick={handleRetry}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  显示所有工作流
                </button>
              )}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>重试</span>
              </button>
            </div>
          )}

          {/* Workflow list */}
          {!loading && !error && groupedWorkflows.map((section) => (
            <div key={section.id} className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {section.title}
              </h4>
              <div className="space-y-2">
                {section.workflows.map((workflow) => (
                  <WorkflowSelectableItem
                    key={workflow.id}
                    workflow={workflow}
                    isSelected={selectedWorkflow?.id === workflow.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
