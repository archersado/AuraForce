/**
 * React Query Hooks for Workflows
 *
 * Provides data fetching and mutation hooks for workflows.
 * Uses TanStack Query v5 for caching, deduplication, and state management.
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiFetch, buildApiUrl } from '@/lib/api-client';
import {
  type WorkflowSpec,
  type WorkflowStats,
} from '@/components/workflows';

// Type definitions
export interface WorkflowsResponse {
  success: boolean;
  data: WorkflowSpec[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WorkflowStatsResponse {
  success: boolean;
  data: {
    id: string;
    workflowId: string;
    loads: number;
    favorites: number;
    rating: number;
    ratingCount: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

// Query keys
export const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...workflowKeys.lists(), filters] as const,
  details: () => [...workflowKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
  stats: (id: string) => [...workflowKeys.all, 'stats', id] as const,
  favorites: () => [...workflowKeys.all, 'favorites'] as const,
};

/**
 * Fetch workflows list
 */
export function useWorkflows(
  params: { search?: string; status?: string; page?: number; limit?: number } = {},
  options?: Omit<UseQueryOptions<WorkflowsResponse, ErrorResponse, WorkflowsResponse, readonly unknown[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workflowKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch(`/api/workflows?${searchParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workflows');
      }

      return data;
    },
    ...options,
  });
}

/**
 * Fetch workflow details
 */
export function useWorkflowDetail(
  id: string,
  options?: Omit<UseQueryOptions<WorkflowSpec, ErrorResponse, WorkflowSpec, readonly unknown[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: async () => {
      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch(`/api/workflows/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workflow detail');
      }

      return data.data;
    },
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch favorite workflows
 */
export function useFavoriteWorkflows(
  options?: Omit<UseQueryOptions<WorkflowsResponse, ErrorResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workflowKeys.favorites(),
    queryFn: async () => {
      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch('/api/workflows/favorites');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch favorite workflows');
      }

      return data;
    },
    ...options,
  });
}

/**
 * Fetch popular workflows
 */
export function usePopularWorkflows(
  options?: Omit<UseQueryOptions<WorkflowsResponse, ErrorResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...workflowKeys.lists(), 'popular'],
    queryFn: async () => {
      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch('/api/workflows/popular');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch popular workflows');
      }

      return data;
    },
    ...options,
  });
}

/**
 * Toggle workflow favorite
 */
export function useToggleWorkflowFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workflowId }: { workflowId: string }) => {
      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch(`/api/workflows/${workflowId}/favorite`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle favorite');
      }

      return data;
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
  });
}

/**
 * Create workflow
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<WorkflowSpec>) => {
      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create workflow');
      }

      return responseData;
    },
    onSuccess: () => {
      // Invalidate workflows list
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
    },
  });
}

/**
 * Update workflow
 */
export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: any }) => {
      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch(`/api/workflows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update workflow');
      }

      return responseData;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific workflow and list
      queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
    },
  });
}

/**
 * Delete workflow
 */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // Note: apiFetch automatically adds basePath '/auraforce' prefix
      const response = await apiFetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete workflow');
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate workflows list
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
    },
  });
}
