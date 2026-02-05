/**
 * Workspace Tabs Store
 *
 * Manages open file tabs in the workspace editor.
 * Features:
 * - Multiple file tabs
 * - Tab switching
 * - Close tabs
 * - Unsaved indicator (*)
 * - File type icons
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tab {
  id: string;
  path: string;
  name: string;
  content: string;
  hasUnsavedChanges: boolean;
  language: string;
  isActive: boolean;
  isModified: boolean;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
  maxTabs: number;

  // Actions
  openTab: (tab: Omit<Tab, 'isActive'>) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: () => void;
  updateTabContent: (tabId: string, content: string) => void;
  markTabAsSaved: (tabId: string) => void;
  markTabAsUnsaved: (tabId: string) => void;
  getActiveTab: () => Tab | null;
  getTabsByPath: (path: string) => Tab[];
}

/**
 * Get file type icon from filename
 */
function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return '🖼️';
  }
  if (['md', 'mdx', 'markdown'].includes(ext)) {
    return '📝';
  }
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return '🖼️';
  }
  if (['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html'].includes(ext)) {
    return '📄';
  }

  return '📄';
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,
      maxTabs: 10,

      // Open a new tab or activate existing tab
      openTab: (tab) => {
        set((state) => {
          // Check if tab with same path already exists
          const existingTab = state.tabs.find((t) => t.path === tab.path);

          if (existingTab) {
            // Activate existing tab
            return {
              ...state,
              activeTabId: existingTab.id,
              tabs: state.tabs.map((t) =>
                t.id === existingTab.id ? { ...t, isActive: true } : { ...t, isActive: false }
              ),
            };
          }

          // Check max tabs limit
          if (state.tabs.length >= state.maxTabs) {
            // Remove oldest inactive tab
            const inactiveTabs = state.tabs.filter((t) => !t.isActive);
            if (inactiveTabs.length > 0) {
              const oldestInactiveTab = inactiveTabs[0];
              const newTabs = state.tabs.filter((t) => t.id !== oldestInactiveTab.id);

              // Create new tab
              const newTab: Tab = {
                ...tab,
                id: `${tab.path}-${Date.now()}`,
                isActive: true,
                isModified: false,
              };

              return {
                ...state,
                tabs: [...newTabs, newTab].map((t) =>
                  t.id === newTab.id ? t : { ...t, isActive: false }
                ),
                activeTabId: newTab.id,
              };
            }
          }

          // Create new tab
          const newTab: Tab = {
            ...tab,
            id: `${tab.path}-${Date.now()}`,
            isActive: true,
            isModified: false,
          };

          // Deactivate all other tabs and add new tab
          return {
            ...state,
            activeTabId: newTab.id,
            tabs: [
              ...state.tabs.map((t) => ({ ...t, isActive: false })),
              newTab,
            ],
          };
        });
      },

      // Close a specific tab
      closeTab: (tabId) => {
        set((state) => {
          const tabs = state.tabs.filter((t) => t.id !== tabId);

          // If closing active tab, activate nearest tab
          let newActiveTabId = state.activeTabId;
          if (state.activeTabId === tabId && tabs.length > 0) {
            const closedTabIndex = state.tabs.findIndex((t) => t.id === tabId);
            const nextIndex =
              closedTabIndex >= tabs.length ? tabs.length - 1 : closedTabIndex;
            newActiveTabId = (tabs[nextIndex ?? tabs[0]])?.id || tabs[0].id;

            // Mark new active tab
            const updatedTabs = tabs.map((t) =>
              t.id === newActiveTabId ? { ...t, isActive: true } : t
            );

            return {
              ...state,
              activeTabId: newActiveTabId,
              tabs: updatedTabs,
            };
          }

          return {
            ...state,
            activeTabId: newActiveTabId,
            tabs,
          };
        });
      },

      // Set active tab
      setActiveTab: (tabId) => {
        set((state) => ({
          ...state,
          activeTabId: tabId,
          tabs: state.tabs.map((t) =>
            t.id === tabId ? { ...t, isActive: true } : { ...t, isActive: false }
          ),
        }));
      },

      // Close all tabs
      closeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
      },

      // Close all tabs except current
      closeOtherTabs: () => {
        set((state) => {
          const activeTab = get().tabs.find((t) => t.id === state.activeTabId);

          if (!activeTab) {
            return state;
          }

          return {
            ...state,
            tabs: [activeTab],
          };
        });
      },

      // Update tab content (and mark as unsaved)
      updateTabContent: (tabId, content) => {
        set((state) => ({
          ...state,
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? { ...t, content, isModified: true, hasUnsavedChanges: true }
              : t
          ),
        }));
      },

      // Mark tab as saved
      markTabAsSaved: (tabId) => {
        set((state) => ({
          ...state,
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? { ...t, isModified: false, hasUnsavedChanges: false }
              : t
          ),
        }));
      },

      // Mark tab as unsaved
      markTabAsUnsaved: (tabId) => {
        set((state) => ({
          ...state,
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? { ...t, isModified: true, hasUnsavedChanges: true }
              : t
          ),
        }));
      },

      // Get active tab
      getActiveTab: () => {
        return get().tabs.find((t) => t.id === get().activeTabId) || null;
      },

      // Get tabs by path
      getTabsByPath: (path) => {
        return get().tabs.filter((t) => t.path === path);
      },
    }),
    {
      name: 'workspace-tabs',
    }
  )
);
