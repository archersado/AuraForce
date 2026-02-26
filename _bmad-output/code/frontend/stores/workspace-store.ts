/**
 * Workspace Store
 * Zustand store for managing workspace state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Tab {
  id: string;
  path: string;
  name: string;
  type: 'code' | 'markdown' | 'image' | 'pdf' | 'ppt' | 'unknown';
  isModified: boolean;
  isReadOnly?: boolean;
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt?: string;
  children?: FileNode[];
}

export interface SearchResult {
  path: string;
  name: string;
  matches: number;
  preview?: string;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  theme: 'light' | 'dark' | 'auto';
}

interface WorkspaceState {
  // File tree
  fileTree: FileNode[];
  selectedFile: string | null;
  expandedFolders: Set<string>;

  // Tabs
  openTabs: Tab[];
  activeTabId: string | null;

  // Editor content
  editorContent: Record<string, string>;
  unsavedChanges: Set<string>;

  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;

  // UI state
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  panelState: 'default' | 'split' | 'preview-only';

  // Editor settings
  editorSettings: EditorSettings;

  // Actions - File tree
  setFileTree: (tree: FileNode[]) => void;
  toggleFolder: (folderId: string) => void;
  expandFolder: (folderId: string) => void;
  collapseFolder: (folderId: string) => void;
  setSelectedFile: (path: string | null) => void;

  // Actions - Tabs
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (tabId: string) => void;

  // Actions - Editor
  setEditorContent: (path: string, content: string) => void;
  markAsModified: (path: string) => void;
  markAsSaved: (path: string) => void;

  // Actions - Search
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  clearSearch: () => void;

  // Actions - UI
  setSidebarWidth: (width: number) => void;
  toggleSidebar: () => void;
  setPanelState: (state: 'default' | 'split' | 'preview-only') => void;

  // Actions - Settings
  setEditorSettings: (settings: Partial<EditorSettings>) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    (set, get) => ({
      // Initial state
      fileTree: [],
      selectedFile: null,
      expandedFolders: new Set(),
      openTabs: [],
      activeTabId: null,
      editorContent: {},
      unsavedChanges: new Set(),
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      sidebarWidth: 280,
      sidebarCollapsed: false,
      panelState: 'default',
      editorSettings: {
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'off',
        minimap: true,
        lineNumbers: 'on',
        theme: 'auto',
      },

      // File tree actions
      setFileTree: (tree) => set({ fileTree: tree }),

      toggleFolder: (folderId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedFolders);
          if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
          } else {
            newExpanded.add(folderId);
          }
          return { expandedFolders: newExpanded };
        }),

      expandFolder: (folderId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedFolders);
          newExpanded.add(folderId);
          return { expandedFolders: newExpanded };
        }),

      collapseFolder: (folderId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedFolders);
          newExpanded.delete(folderId);
          return { expandedFolders: newExpanded };
        }),

      setSelectedFile: (path) => set({ selectedFile: path }),

      // Tab actions
      openTab: (tab) =>
        set((state) => {
          const existingTab = state.openTabs.find((t) => t.id === tab.id);
          if (!existingTab) {
            return {
              openTabs: [...state.openTabs, tab],
              activeTabId: tab.id,
              editorContent: {
                ...state.editorContent,
                [tab.path]: state.editorContent[tab.path] || '',
              },
            };
          }
          return { activeTabId: tab.id };
        }),

      closeTab: (tabId) =>
        set((state) => {
          const newTabs = state.openTabs.filter((t) => t.id !== tabId);
          const newActiveTab = state.activeTabId === tabId
            ? newTabs.length > 0
              ? newTabs[newTabs.length - 1].id
              : null
            : state.activeTabId;

          return {
            openTabs: newTabs,
            activeTabId: newActiveTab,
            selectedFile: newActiveTab
              ? newTabs.find((t) => t.id === newActiveTab)?.path || null
              : null,
          };
        }),

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      closeAllTabs: () =>
        set({
          openTabs: [],
          activeTabId: null,
          unsavedChanges: new Set(),
        }),

      closeOtherTabs: (tabId) =>
        set((state) => {
          const keepTab = state.openTabs.find((t) => t.id === tabId);
          if (!keepTab) return state;

          return {
            openTabs: [keepTab],
            activeTabId: tabId,
          };
        }),

      // Editor actions
      setEditorContent: (path, content) =>
        set((state) => ({
          editorContent: {
            ...state.editorContent,
            [path]: content,
          },
        })),

      markAsModified: (path) =>
        set((state) => ({
          unsavedChanges: new Set([...state.unsavedChanges, path]),
          openTabs: state.openTabs.map((tab) =>
            tab.path === path ? { ...tab, isModified: true } : tab
          ),
        })),

      markAsSaved: (path) =>
        set((state) => {
          const newUnsaved = new Set(state.unsavedChanges);
          newUnsaved.delete(path);
          return {
            unsavedChanges: newUnsaved,
            openTabs: state.openTabs.map((tab) =>
              tab.path === path ? { ...tab, isModified: false } : tab
            ),
          };
        }),

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      setSearchResults: (results) => set({ searchResults: results, isSearching: false }),

      clearSearch: () =>
        set({
          searchQuery: '',
          searchResults: [],
          isSearching: false,
        }),

      // UI actions
      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
          sidebarWidth: state.sidebarCollapsed ? 280 : 50,
        })),

      setPanelState: (panelState) => set({ panelState }),

      // Settings actions
      setEditorSettings: (settings) =>
        set((state) => ({
          editorSettings: { ...state.editorSettings, ...settings },
        })),
    }),
    {
      name: 'workspace-store',
    }
  )
);

// Selectors
export const selectActiveTab = (state: WorkspaceState) =>
  state.openTabs.find((t) => t.id === state.activeTabId);

export const selectFileByPath = (path: string) => (state: WorkspaceState) =>
  state.openTabs.find((t) => t.path === path);
