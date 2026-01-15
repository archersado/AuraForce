/**
 * Workflow Specs List Component
 *
 * Displays all deployed workflow specifications with status indicators,
 * supports pagination, deletion, and search/filter.
 */

'use client';

import { useState, useEffect } from 'react';
import { Trash2, Search, ChevronDown, ChevronUp, FolderOpen } from 'lucide-react';

interface WorkflowMetadata {
  tags?: string[];
  requires?: string[];
  resources?: Array<{ path: string; description?: string }>;
  agents?: Array<{ name: string; path: string }>;
  subWorkflows?: Array<{ name: string; path: string }>;
}

interface WorkflowSpec {
  id: string;
  name: string;
  description?: string | null;
  version?: string | null;
  author?: string | null;
  ccPath: string;
  status: string;
  metadata?: WorkflowMetadata;
  deployedAt: string;
  updatedAt: string;
}

interface WorkflowSpecListProps {
  onDelete?: (workflowId: string) => void;
  refreshKey?: number;
}

export default function WorkflowSpecList({ onDelete, refreshKey }: WorkflowSpecListProps) {
  const [workflows, setWorkflows] = useState<WorkflowSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      if (searchTerm) {
        params.set('search', searchTerm);
      }

      const response = await fetch(`/api/workflows?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }

      const data = await response.json();
      setWorkflows(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [page, statusFilter, refreshKey]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchWorkflows();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (workflowId: string) => {
    if (!confirm('确定要删除这个工作流吗？部署的文件也将被删除。')) {
      return;
    }

    setDeletingId(workflowId);

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workflow');
      }

      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      onDelete?.(workflowId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workflow');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      deployed: {
        label: '已部署',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      },
      error: {
        label: '错误',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      },
      pending: {
        label: '等待中',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      },
    };

    const config = statusConfig[status] || statusConfig.deployed;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading && workflows.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error && workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-2">{error}</div>
        <button
          onClick={fetchWorkflows}
          className="text-purple-600 hover:underline dark:text-purple-400"
        >
          重试
        </button>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500">还没有部署任何工作流</p>
        <p className="text-sm text-gray-400 mt-1">上传你的第一个 BMAD 工作流规范文件</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索工作流名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">所有状态</option>
          <option value="deployed">已部署</option>
          <option value="pending">等待中</option>
          <option value="error">错误</option>
        </select>
      </div>

      {/* Workflow List */}
      <div className="space-y-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Main Row */}
            <div className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {workflow.name}
                  </h3>
                  {getStatusBadge(workflow.status)}
                </div>
                {workflow.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {workflow.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>v{workflow.version}</span>
                  <span>•</span>
                  <span>{workflow.author}</span>
                  <span>•</span>
                  <span>{new Date(workflow.deployedAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedWorkflow(
                    expandedWorkflow === workflow.id ? null : workflow.id
                  )}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  {expandedWorkflow === workflow.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(workflow.id)}
                  disabled={deletingId === workflow.id}
                  className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedWorkflow === workflow.id && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700 mt-2">
                <div className="pt-3 space-y-3">
                  {/* CC Path */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Claude Code 路径
                    </h4>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                      {workflow.ccPath}
                    </code>
                  </div>

                  {/* Metadata */}
                  {workflow.metadata && (
                    <div className="space-y-2">
                      {workflow.metadata.tags && workflow.metadata.tags.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            标签
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {workflow.metadata.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {workflow.metadata.requires && workflow.metadata.requires.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            依赖
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {workflow.metadata.requires.map((req: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {workflow.metadata.agents && workflow.metadata.agents.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            子 Agent ({workflow.metadata.agents.length})
                          </h4>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                            {workflow.metadata.agents.map((agent: { name: string }, i) => (
                              <li key={i}>{agent.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {workflow.metadata.subWorkflows && workflow.metadata.subWorkflows.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            子工作流 ({workflow.metadata.subWorkflows.length})
                          </h4>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                            {workflow.metadata.subWorkflows.map((wf: { name: string }, i) => (
                              <li key={i}>{wf.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Updated Time */}
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    最后更新: {new Date(workflow.updatedAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            第 {page} 页，共 {totalPages} 页
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
