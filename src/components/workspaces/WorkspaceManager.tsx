'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Folder, Trash2, Clock, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

interface WorkspaceProject {
  id: string;
  userId: string;
  name: string;
  path: string;
  description: string | null;
  workflowTemplateId: string | null;
  lastOpenedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'missing';
}

interface WorkspaceManagerProps {
  onSelectProject?: (project: WorkspaceProject) => void;
  onCreateProject?: () => void;
}

export default function WorkspaceManager({ onSelectProject, onCreateProject }: WorkspaceManagerProps) {
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch('/api/workspaces');

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/workspaces/${projectId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete project');
      }

      if (data.success) {
        await fetchProjects();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(dateString);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Workspace Projects
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your workspace projects
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        // Empty State
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first project to get started
          </p>
          <button
            onClick={onCreateProject}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        // Projects List
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer"
              onClick={() => onSelectProject?.(project)}
            >
              {/* Project Icon */}
              <div className={`p-3 rounded-lg ${
                project.status === 'active'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600'
              }`}>
                <Folder size={20} />
              </div>

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {project.name}
                  </h3>
                  {project.status === 'missing' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Missing
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatRelativeTime(project.lastOpenedAt)}
                  </span>
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject?.(project);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  title="Open Project"
                >
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
