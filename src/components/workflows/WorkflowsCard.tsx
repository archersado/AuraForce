'use client';

import * as React from 'react';
import {
  FolderOpen,
  Tag,
  Clock,
  User,
  Star,
  Download,
  Eye,
  Heart,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface WorkflowMetadata {
  tags?: string[];
  requires?: string[];
  resources?: Array<{ path: string; description?: string }>;
  agents?: Array<{ name: string; path: string }>;
  subWorkflows?: Array<{ name: string; path: string }>;
}

export interface WorkflowStats {
  loads?: number;
  favorites?: number;
  rating?: number;
  ratingCount?: number;
}

export interface WorkflowSpec {
  id: string;
  name: string;
  description?: string | null;
  version?: string | null;
  author?: string | null;
  status: string;
  visibility?: string;
  metadata?: WorkflowMetadata;
  stats?: WorkflowStats;
  deployedAt: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
}

interface WorkflowsCardProps {
  workflow: WorkflowSpec;
  onViewDetails?: (id: string) => void;
  onLoad?: (id: string) => void;
  onFavorite?: (id: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  className?: string;
  showActions?: boolean;
  isLoading?: boolean;
}

// Export loader hook for external use
export function useLoader(loadingWorkflowId: string | null) {
  return {
    isLoading: (id: string) => loadingWorkflowId === id,
    setLoading: React.useState<(id: string | null) => void>(),
  };
}

export function WorkflowsCard({
  workflow,
  onViewDetails,
  onLoad,
  onFavorite,
  isFavorite = false,
  className,
  showActions = true,
  isLoading = false,
}: WorkflowsCardProps) {
  const {
    id,
    name,
    description,
    version,
    author,
    status,
    visibility,
    metadata,
    stats,
    deployedAt,
    thumbnailUrl,
  } = workflow;

  const [isFavoriting, setIsFavoriting] = React.useState(false);

  // Generate gradient color based on name (consistent for the same workflow)
  const getGradientClass = () => {
    const gradients = [
      'from-blue-100 to-purple-100',
      'from-green-100 to-teal-100',
      'from-orange-100 to-pink-100',
      'from-purple-100 to-pink-100',
      'from-cyan-100 to-blue-100',
    ];
    const index = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % gradients.length;
    return gradients[index];
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onFavorite) {
      setIsFavoriting(true);
      try {
        await onFavorite(id, !isFavorite);
      } finally {
        setIsFavoriting(false);
      }
    }
  };

  return (
    <div
      className={cn(
        'group relative',
        'bg-white dark:bg-gray-900',
        'border-2 border-gray-200 dark:border-gray-700',
        'rounded-xl overflow-hidden',
        'cursor-pointer transition-all duration-300',
        'hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500',
        'hover:-translate-y-1',
        isLoading && 'opacity-70 pointer-events-none',
        className
      )}
    >
      {/* Thumbnail / Image Area */}
      <div
        className={cn(
          'h-40 w-full relative',
          'bg-gradient-to-br',
          getGradientClass(),
          'dark:from-purple-900/20 dark:to-pink-900/20',
          'flex items-center justify-center'
        )}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <FolderOpen
            className={cn(
              'h-16 w-16',
              'text-purple-600 dark:text-purple-400',
              'opacity-80 group-hover:scale-110 transition-transform duration-300'
            )}
          />
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          {visibility === 'public' && (
            <Badge variant="public" className="shadow-sm">
              公开
            </Badge>
          )}
          {status === 'deployed' && (
            <Badge variant="success" className="shadow-sm">
              已部署
            </Badge>
          )}
          {status === 'error' && (
            <Badge variant="error" className="shadow-sm">
              错误
            </Badge>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title and Version */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              'text-lg font-semibold leading-tight',
              'text-gray-900 dark:text-gray-100',
              'group-hover:text-purple-600 dark:group-hover:text-purple-400',
              'transition-colors'
            )}
          >
            {name}
          </h3>
          {version && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              v{version}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tags */}
        {metadata?.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="flex items-center text-xs font-normal text-gray-600 dark:text-gray-400"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {/* Loads */}
            {stats?.loads !== undefined && (
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {stats.loads}
              </span>
            )}

            {/* Favorites */}
            {stats?.favorites !== undefined && (
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {stats.favorites}
              </span>
            )}

            {/* Rating */}
            {stats?.rating !== undefined && stats.ratingCount !== undefined && stats.ratingCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {stats.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Author */}
          {author && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <User className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px]">{author}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {/* Details Button */}
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onViewDetails(id);
                }}
                className="flex-1 group/btn"
                disabled={isLoading}
              >
                <Eye className="w-4 h-4 mr-2" />
                详情
              </Button>
            )}

            {/* Load Button */}
            {onLoad && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onLoad(id);
                }}
                disabled={isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white group/btn disabled:bg-purple-400"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    加载中
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    加载
                  </>
                )}
              </Button>
            )}

            {/* Favorite Button */}
            {onFavorite && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavorite}
                disabled={isFavoriting || isLoading}
                className={cn(
                  'flex items-center justify-center',
                  'group-hover:border-purple-300 dark:group-hover:border-purple-500',
                  isFavorite && 'border-red-300 text-red-600 hover:bg-red-50'
                )}
              >
                <Heart
                  className={cn(
                    'w-4 h-4',
                    isFavorite && 'fill-current',
                    isFavoriting && 'animate-pulse'
                  )}
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
