'use client';

import * as React from 'react';
import { Check, FileCode, Tag, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type WorkflowSpec, type WorkflowMetadata, type WorkflowStats } from './WorkflowsCard';

interface WorkflowSelectableItemProps {
  workflow: WorkflowSpec;
  isSelected: boolean;
  onSelect: (workflow: WorkflowSpec) => void;
  onDeselect?: () => void;
  showPreview?: boolean;
  previewPath?: string;
  className?: string;
}

export function WorkflowSelectableItem({
  workflow,
  isSelected,
  onSelect,
  onDeselect,
  showPreview = false,
  previewPath,
  className,
}: WorkflowSelectableItemProps) {
  const { name, description, version, author, status, visibility, metadata } = workflow;

  const handleSelect = () => {
    if (isSelected && onDeselect) {
      onDeselect();
    } else {
      onSelect(workflow);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      deployed: { label: '已部署', className: 'bg-green-100 text-green-700' },
      error: { label: '错误', className: 'bg-red-100 text-red-700' },
      pending: { label: '处理中', className: 'bg-yellow-100 text-yellow-700' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.deployed;

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
          config.className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {config.label}
      </span>
    );
  };

  const getVisibilityBadge = () => {
    const visibilityConfig = {
      public: { label: '公开', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
      private: { label: '私有', className: 'bg-gray-50 text-gray-700 border border-gray-200' },
    };

    const config = visibilityConfig[visibility as keyof typeof visibilityConfig] || visibilityConfig.private;

    return (
      <span
        className={cn('inline-flex items-center px-2 py-1 rounded-md text-xs font-medium', config.className)}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div
      onClick={handleSelect}
      className={cn(
        'relative group',
        'p-4 rounded-lg border-2',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-md',
        // Selected state
        isSelected
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-400'
          : 'border-gray-200 bg-white hover:border-purple-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:border-purple-500',
        className
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center shadow-md">
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          {/* Icon and Title */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={cn(
                'flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center',
                'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30'
              )}
            >
              <FileCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Name */}
              <h3
                className={cn(
                  'text-sm font-semibold truncate',
                  'text-gray-900 dark:text-gray-100'
                )}
              >
                {name}
              </h3>

              {/* Version */}
              {version && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">v{version}</p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {getStatusBadge()}
            {getVisibilityBadge()}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {/* Author */}
          {author && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {author}
            </span>
          )}

          {/* Tags */}
          {metadata?.tags && metadata.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{metadata.tags.join(', ')}</span>
            </span>
          )}

          {/* Deployed At */}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {new Date(workflow.deployedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Preview Button (Optional) */}
        {showPreview && previewPath && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(previewPath, '_blank');
            }}
            className={cn(
              'mt-2 text-xs font-medium text-purple-600 hover:text-purple-700',
              'dark:text-purple-400 dark:hover:text-purple-300',
              'transition-colors'
            )}
          >
            查看预览 →
          </button>
        )}
      </div>
    </div>
  );
}
