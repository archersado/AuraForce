/**
 * Workflow Market Store - Zustand v5.0.9
 *
 * Manages workflow market state including selected workflows,
 * favorites, and market-specific UI state.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Type definitions
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

export type WorkflowFilter = {
  search: string;
  category: 'all' | 'recommended' | 'latest' | 'popular' | 'favorites';
  status?: string;
  visibility?: string;
};

/**
 * Workflow market state
 */
interface WorkflowMarketState {
  /** Currently selected workflow (for WorkflowSelector) */
  selectedWorkflow: WorkflowSpec | null;
  /** Favorite workflow IDs */
  favoriteWorkflowIds: Set<string>;
  /** Current page for pagination */
  currentPage: number;
  /** Total items available */
  totalItems: number;
  /** Is loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Current search/filter params */
  currentFilter: WorkflowFilter;
}

/**
 * Workflow market actions
 */
interface WorkflowMarketActions {
  /** Set selected workflow */
  setSelectedWorkflow: (workflow: WorkflowSpec | null) => void;
  /** Toggle workflow favorite */
  toggleFavorite: (workflowId: string) => Promise<void>;
  /** Set favorite workflow IDs (from API) */
  setFavoriteWorkflowIds: (ids: string[]) => void;
  /** Set current page */
  setCurrentPage: (page: number) => void;
  /** Set total items */
  setTotalItems: (total: number) => void;
  /** Set loading state */
  setIsLoading: (loading: boolean) => void;
  /** Set error */
  setError: (error: string | null) => void;
  /** Set current filter */
  setCurrentFilter: (filter: Partial<WorkflowFilter>) => void;
  /** Check if workflow is favorite */
  isFavorite: (workflowId: string) => boolean;
  /** Reset state */
  resetStore: () => void;
}

/**
 * Combined workflow market store type
 */
type WorkflowMarketStore = WorkflowMarketState & WorkflowMarketActions;

/**
 * Default initial state
 */
const initialState: WorkflowMarketState = {
  selectedWorkflow: null,
  favoriteWorkflowIds: new Set(),
  currentPage: 1,
  totalItems: 0,
  isLoading: false,
  error: null,
  currentFilter: {
    search: '',
    category: 'all',
  },
};

/**
 * Create workflow market store with DevTools middleware
 */
export const useWorkflowMarketStore = create<WorkflowMarketStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setSelectedWorkflow: (workflow) =>
        set({ selectedWorkflow: workflow }, false, 'setSelectedWorkflow'),

      toggleFavorite: async (workflowId) => {
        const { favoriteWorkflowIds } = get();
        const isFavorite = favoriteWorkflowIds.has(workflowId);

        try {
          // Optimistic update
          const newFavorites = new Set(favoriteWorkflowIds);
          if (isFavorite) {
            newFavorites.delete(workflowId);
          } else {
            newFavorites.add(workflowId);
          }
          set({ favoriteWorkflowIds: newFavorites }, false, 'toggleFavorite');

          // API call
          const response = await fetch(`/api/workflows/${workflowId}/favorite`, {
            method: isFavorite ? 'DELETE' : 'POST',
          });

          if (!response.ok) {
            throw new Error('Failed to update favorite');
          }

          const data = await response.json();
          if (!data.success) {
            throw new Error(data.error || 'Failed to update favorite');
          }
        } catch (err) {
          // Rollback on error
          const oldFavorites = new Set(favoriteWorkflowIds);
          set({ favoriteWorkflowIds: oldFavorites }, false, 'toggleFavorite rollback');
          throw err;
        }
      },

      setFavoriteWorkflowIds: (ids) =>
        set({ favoriteWorkflowIds: new Set(ids) }, false, 'setFavoriteWorkflowIds'),

      setCurrentPage: (page) =>
        set({ currentPage: page }, false, 'setCurrentPage'),

      setTotalItems: (total) =>
        set({ totalItems: total }, false, 'setTotalItems'),

      setIsLoading: (loading) =>
        set({ isLoading: loading }, false, 'setIsLoading'),

      setError: (error) =>
        set({ error }, false, 'setError'),

      setCurrentFilter: (filter) =>
        set(
          (state) => ({
            currentFilter: { ...state.currentFilter, ...filter },
            currentPage: 1, // Reset to page 1 when filter changes
          }),
          false,
          'setCurrentFilter'
        ),

      isFavorite: (workflowId) => {
        return get().favoriteWorkflowIds.has(workflowId);
      },

      resetStore: () =>
        set(initialState, false, 'resetStore'),
    }),
    {
      name: 'WorkflowMarketStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Individual state selectors for performance optimization
 */
export const useSelectedWorkflow = () =>
  useWorkflowMarketStore((state) => state.selectedWorkflow);

export const useFavoriteWorkflowIds = () =>
  useWorkflowMarketStore((state) => state.favoriteWorkflowIds);

export const useCurrentPage = () =>
  useWorkflowMarketStore((state) => state.currentPage);

export const useTotalItems = () =>
  useWorkflowMarketStore((state) => state.totalItems);

export const useIsLoading = () =>
  useWorkflowMarketStore((state) => state.isLoading);

export const useError = () =>
  useWorkflowMarketStore((state) => state.error);

export const useCurrentFilter = () =>
  useWorkflowMarketStore((state) => state.currentFilter);

/**
 * Action selectors
 */
export const useSetSelectedWorkflow = () =>
  useWorkflowMarketStore((state) => state.setSelectedWorkflow);

export const useToggleFavorite = () =>
  useWorkflowMarketStore((state) => state.toggleFavorite);

export const useSetFavoriteWorkflowIds = () =>
  useWorkflowMarketStore((state) => state.setFavoriteWorkflowIds);

export const useSetCurrentPage = () =>
  useWorkflowMarketStore((state) => state.setCurrentPage);

export const useSetTotalItems = () =>
  useWorkflowMarketStore((state) => state.setTotalItems);

export const useSetIsLoading = () =>
  useWorkflowMarketStore((state) => state.setIsLoading);

export const useSetError = () =>
  useWorkflowMarketStore((state) => state.setError);

export const useSetCurrentFilter = () =>
  useWorkflowMarketStore((state) => state.setCurrentFilter);

export const useIsFavorite = () =>
  useWorkflowMarketStore((state) => state.isFavorite);

export const useResetWorkflowMarketStore = () =>
  useWorkflowMarketStore((state) => state.resetStore);
