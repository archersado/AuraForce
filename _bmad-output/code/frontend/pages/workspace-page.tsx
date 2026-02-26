/**
 * Workspace Main Page
 *
 * Epic 14: Workspace Editor & File Management
 * Main entry point for the workspace editor
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Search, Plus, Upload, Download, Settings,
  Menu, PanelLeft, PanelRight, Terminal
} from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspace-store';
import FileTree from '@/components/workspace/FileTree';
import FileTreeWithSearch from '@/components/workspace/FileTreeWithSearch';
import TabBar from '@/components/workspace/TabBar';
import CodeEditor from '@/components/workspace/CodeEditor';
import MarkdownEditor from '@/components/workspace/MarkdownEditor';
import ImagePreview from '@/components/workspace/ImagePreview';
import DocumentPreview from '@/components/workspace/DocumentPreview';
import PPTPreview from '@/components/workspace/PPTPreview';
import FileSearch from '@/components/workspace/FileSearch';
import ClaudeAgentPanel from '@/components/workspace/ClaudeAgentPanel';

export default function WorkspacePage() {
  const {
    openTabs,
    activeTabId,
    selectedFile,
    editorContent,
    setEditorContent,
    markAsModified,
    sidebarWidth,
    sidebarCollapsed,
    toggleSidebar,
    setSidebarWidth,
    panelState,
    setPanelState,
    fileTree,
    setFileTree,
    searchQuery,
    setSearchQuery,
  } = useWorkspaceStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isClaudePanelOpen, setIsClaudePanelOpen] = useState(false);

  // Load workspace data on mount
  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const loadWorkspaceData = async () => {
    try {
      const response = await fetch('/auraforce/api/workspace/files');
      if (response.ok) {
        const data = await response.json();
        setFileTree(data.tree || []);
      }
    } catch (error) {
      console.error('Failed to load workspace:', error);
      // Use mock data for development
      setFileTree(getMockFileTree());
    }
  };

  const handleSave = useCallback(
    async (tabId: string) => {
      const tab = openTabs.find((t) => t.id === tabId);
      if (!tab) return;

      const content = editorContent[tab.path];

      try {
        const response = await fetch(`/auraforce/api/workspace/files`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: tab.path, content }),
        });

        if (response.ok) {
          markAsSaved(tab.path);
        }
      } catch (error) {
        console.error('Failed to save file:', error);
      }
    },
    [openTabs, editorContent, markAsSaved]
  );

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    },
    [isDragging, setSidebarWidth]
  );

  const handleResizeStart = () => {
    setIsDragging(true);
  };

  const handleResizeEnd = () => {
    setIsDragging(false);
  };

  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const currentContent = activeTab ? editorContent[activeTab.path] || '' : '';

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Workspace
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="New file (Ctrl+N)"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Upload files"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            className={`
              p-1.5 rounded transition-colors
              ${isClaudePanelOpen
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
            title="Claude Assistant"
            onClick={() => setIsClaudePanelOpen(!isClaudePanelOpen)}
          >
            <Terminal className="w-5 h-5" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Tree */}
        {!sidebarCollapsed && (
          <div
            className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
            style={{ width: sidebarWidth }}
          >
            {/* Search */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-auto">
              {searchQuery ? (
                <FileTreeWithSearch searchQuery={searchQuery} />
              ) : (
                <FileTree />
              )}
            </div>

            {/* Resize handle */}
            <div
              className="w-1 hover:bg-blue-500 cursor-col-resize absolute right-0 top-0 bottom-0"
              onMouseDown={handleResizeStart}
              onMouseMove={handleResize}
              onMouseUp={handleResizeEnd}
              onMouseLeave={handleResizeEnd}
            />
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab ? (
            <>
              <TabBar />

              {/* Editor/Preview */}
              <div className="flex-1 overflow-hidden">
                <EditorSwitcher
                  tab={activeTab}
                  content={currentContent}
                  onChange={(value) => {
                    setEditorContent(activeTab.path, value);
                    markAsModified(activeTab.path);
                  }}
                  onSave={() => handleSave(activeTab.id)}
                  panelState={panelState}
                  onPanelStateChange={setPanelState}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </div>

        {/* Claude Agent Panel */}
        {isClaudePanelOpen && (
          <div
            className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col"
            style={{ width: 350 }}
          >
            <ClaudeAgentPanel
              onClose={() => setIsClaudePanelOpen(false)}
              selectedFile={selectedFile}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Editor Switcher
 * Renders the appropriate editor based on file type
 */
interface EditorSwitcherProps {
  tab: {
    id: string;
    path: string;
    name: string;
    type: 'code' | 'markdown' | 'image' | 'pdf' | 'ppt' | 'unknown';
    isModified: boolean;
  };
  content: string;
  onChange: (value: string) => void;
  onSave: () => void;
  panelState: 'default' | 'split' | 'preview-only';
  onPanelStateChange: (state: any) => void;
}

function EditorSwitcher({ tab, content, onChange, onSave, panelState, onPanelStateChange }: EditorSwitcherProps) {
  switch (tab.type) {
    case 'code':
      return (
        <CodeEditor
          language="typescript"
          value={content}
          onChange={onChange}
          onSave={onSave}
        />
      );

    case 'markdown':
      return (
        <MarkdownEditor
          value={content}
          onChange={onChange}
          initialPanelState={panelState}
          onPanelStateChange={onPanelStateChange}
        />
      );

    case 'image':
      return (
        <ImagePreview
          src={tab.path}
          apiBasePath="/auraforce/api/workspace/files/download"
        />
      );

    case 'pdf':
      return (
        <DocumentPreview
          src={tab.path}
          apiBasePath="/auraforce/api/workspace/files/download"
          type="pdf"
        />
      );

    case 'ppt':
      return (
        <PPTPreview
          src={tab.path}
          apiBasePath="/auraforce/api/workspace/files/download"
        />
      );

    default:
      return (
        <div className="h-full flex items-center justify-center text-gray-400">
          <p>Preview not available for this file type</p>
        </div>
      );
  }
}

/**
 * Empty State
 */
function EmptyState() {
  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <Terminal className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        No file selected
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Select a file from the file tree or create a new one
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        New File
      </button>
    </div>
  );
}

/**
 * File Upload Handler
 */
async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch('/auraforce/api/workspace/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // Reload file tree
      // TODO: Reload workspace data
    }
  } catch (error) {
    console.error('Failed to upload files:', error);
  }
}

/**
 * Mock File Tree for Development
 */
function getMockFileTree() {
  return [
    {
      id: 'root',
      name: 'workspace',
      path: '/',
      type: 'folder',
      children: [
        {
          id: 'src',
          name: 'src',
          path: '/src',
          type: 'folder',
          children: [
            {
              id: 'src-app',
              name: 'app',
              path: '/src/app',
              type: 'folder',
              children: [
                {
                  id: 'src-app-page',
                  name: 'page.tsx',
                  path: '/src/app/page.tsx',
                  type: 'file',
                  size: 2048,
                },
                {
                  id: 'src-app-layout',
                  name: 'layout.tsx',
                  path: '/src/app/layout.tsx',
                  type: 'file',
                  size: 1024,
                },
              ],
            },
            {
              id: 'src-components',
              name: 'components',
              path: '/src/components',
              type: 'folder',
              children: [
                {
                  id: 'src-components-button',
                  name: 'Button.tsx',
                  path: '/src/components/Button.tsx',
                  type: 'file',
                  size: 512,
                },
              ],
            },
            {
              id: 'src-pages-readme',
              name: 'README.md',
              path: '/src/README.md',
              type: 'file',
              size: 1024,
            },
          ],
        },
        {
          id: 'package',
          name: 'package.json',
          path: '/package.json',
          type: 'file',
          size: 1536,
        },
      ],
    },
  ];
}
