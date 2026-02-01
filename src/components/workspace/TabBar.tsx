/**
 * Tab Bar Component
 *
 * Displays file tabs with close buttons and unsaved indicators.
 * Features:
 * - File type icons
 * - Unsaved indicator (*)
 * - Close buttons (x)
 * - Hover effects
 * - Active tab highlight
 */

'use client';

import { X } from 'lucide-react';
import { useTabsStore, type Tab } from '@/stores/workspace-tabs-store';
import { getFileIcon } from '@/lib/workspace/files-service';

interface TabBarProps {
  onTabClose?: (tabId: string) => void;
}

export function TabBar({ onTabClose }: TabBarProps) {
  const { tabs, activeTabId, setActiveTab, closeTab, closeOtherTabs, closeAllTabs } = useTabsStore();

  // Format tab name
  const formatTabName = (name: string, maxLength = 30): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  // Handle middle click to close tab
  const handleMiddleClick = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    closeTab(tabId);

    if (onTabClose) {
      onTabClose(tabId);
    }
  };

  if (tabs.length === 0) {
    return (
      <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center">
        <p className="text-sm text-gray-500 px-4">
          No files open
        </p>
      </div>
    );
  }

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center overflow-x-auto">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group flex items-center gap-2 px-3 py-2 rounded-t-sm border-t-2 transition-all cursor-pointer min-w-0 flex-shrink-0 max-w-xs ${
              tab.isActive
                ? 'border-blue-600 bg-blue-50'
                : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(tab.id)}
            onAuxClick={(e) => {
              if (e.button === 1) {
                handleMiddleClick(e, tab.id);
              }
            }}
            title={tab.path}
          >
            {/* File Type Icon */}
            <span className="text-lg flex-shrink-0" title={tab.language}>
              {getFileIcon(tab.name)}
            </span>

            {/* Tab Name */}
            <span className={`${tab.hasUnsavedChanges ? 'font-semibold' : ''} text-sm truncate`}
                  title={`${tab.name}${tab.hasUnsavedChanges ? ' (unsaved)' : ''}`}>
              {tab.hasUnsavedChanges && <span className="mr-0.5 font-bold text-blue-600">*</span>}
              {formatTabName(tab.name)}
            </span>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
                if (onTabClose) {
                  onTabClose(tab.id);
                }
              }}
              className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
                tab.isActive
                  ? 'hover:bg-red-100 text-gray-500'
                  : 'hover:bg-red-50 text-gray-400'
              }`}
              title="Close tab (Ctrl+W)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Close All / Close Others */}
      {tabs.length > 1 && (
        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
          <button
            onClick={() => closeOtherTabs()}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded text-xs transition-colors"
            title="Close Others"
          >
            Close Others
          </button>
          <button
            onClick={() => closeAllTabs()}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded text-xs transition-colors"
            title="Close All"
          >
            Close All
          </button>
        </div>
      )}
    </div>
  );
}
