/**
 * Tab Bar Component
 *
 * Implements STORY-14-9: Multi-file Tab System
 */

'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { X, MoreHorizontal } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { getFileInfo } from '@/utils/file-types';

interface TabBarProps {
  className?: string;
  onTabClose?: (tabId: string) => void;
  onTabContextMenu?: (tabId: string, event: React.MouseEvent) => void;
}

interface TabItemProps {
  tab: {
    id: string;
    path: string;
    name: string;
    type: 'code' | 'markdown' | 'image' | 'pdf' | 'ppt' | 'unknown';
    isModified: boolean;
    isReadOnly?: boolean;
  };
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function TabItem({ tab, isActive, onClick, onClose, onContextMenu }: TabItemProps) {
  const fileInfo = getFileInfo(tab.name);

  return (
    <div
      className={`
        group flex items-center gap-2 px-3 py-2 border-b-2 min-w-0 max-w-48
        transition-colors cursor-pointer select-none
        ${isActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }
        ${tab.isModified ? 'italic' : ''}
      `}
      onClick={onClick}
      onContextMenu={onContextMenu}
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
    >
      {/* File type indicator */}
      <span className={`text-sm ${tab.isModified ? 'text-blue-500' : ''}`}>
        {tab.isModified && !isActive && '● '}
        {tab.isReadOnly && '🔒 '}
      </span>

      {/* File name */}
      <span
        className="text-sm truncate"
        title={tab.path}
      >
        {tab.name}
      </span>

      {/* Modified indicator for active tab */}
      {tab.isModified && isActive && (
        <span className="w-2 h-2 rounded-full bg-blue-500" aria-label="Unsaved changes" />
      )}

      {/* Close button */}
      <button
        className={`
          ml-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700
          transition-opacity opacity-0 group-hover:opacity-100
        `}
        onClick={onClose}
        aria-label={`Close ${tab.name}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

interface TabDropdownProps {
  onSelect?: (action: string, tabId: string) => void;
}

function TabDropdown({ onSelect }: TabDropdownProps) {
  const {
    openTabs,
    activeTabId,
    closeTab,
    closeAllTabs,
    closeOtherTabs,
  } = useWorkspaceStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const activeTab = openTabs.find((t) => t.id === activeTabId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    if (activeTab) {
      closeTab(activeTab.id);
      onSelect?.('close', activeTab.id);
    }
  };

  const handleCloseOthers = () => {
    if (activeTab) {
      closeOtherTabs(activeTab.id);
      onSelect?.('close-others', activeTab.id);
    }
  };

  const handleCloseAll = () => {
    closeAllTabs();
    onSelect?.('close-all', '');
  };

  const handleCloseAllBut = (tabId: string) => {
    closeOtherTabs(tabId);
    onSelect?.('close-all-but', tabId);
  };

  return (
    <div className="relative" ref={buttonRef}>
      <button
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Tab options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-48"
          role="menu"
        >
          <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            Active: {activeTab?.name || 'None'}
          </div>

          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
            onClick={() => {
              activeTab?.id && handleCloseAllBut(activeTab.id);
              setIsOpen(false);
            }}
            role="menuitem"
            disabled={!activeTab}
          >
            <span>Close Others</span>
            <span className="text-gray-400">Ctrl+W</span>
          </button>

          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              handleCloseAll();
              setIsOpen(false);
            }}
            role="menuitem"
          >
            Close All Tabs
          </button>

          {/* List all tabs in menu */}
          <div className="my-1 border-t border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
            {openTabs.map((tab) => (
              <button
                key={tab.id}
                className={`
                  w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                  flex items-center justify-between
                  ${tab.id === activeTabId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                `}
                onClick={() => {
                  onCloseOther(tab.id);
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                <span className="truncate mr-2">{tab.name}</span>
                {tab.isModified && <span className="text-blue-500">●</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TabBar({ className = '', onTabClose, onTabContextMenu }: TabBarProps) {
  const {
    openTabs,
    activeTabId,
    setActiveTab,
    closeTab,
    closeAllTabs,
  } = useWorkspaceStore();

  const handleClose = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      e.stopPropagation();
      const tab = openTabs.find((t) => t.id === tabId);
      const hasUnsaved = tab?.isModified;

      if (hasUnsaved) {
        // TODO: Show unsaved changes confirmation dialog
        const confirmed = window.confirm(
          `Do you want to save changes to "${tab.name}" before closing?`
        );
        if (confirmed) {
          // TODO: Save file
          closeTab(tabId);
        }
        return;
      }

      closeTab(tabId);
      onTabClose?.(tabId);
    },
    [openTabs, closeTab, onTabClose]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 'w' && activeTabId) {
        e.preventDefault();
        const tab = openTabs.find((t) => t.id === activeTabId);
        if (tab && !tab.isModified) {
          closeTab(activeTabId);
        }
      }

      if (modifier && e.key === 't') {
        e.preventDefault();
        // TODO: Create new file
      }

      if (modifier && e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = openTabs.findIndex((t) => t.id === activeTabId);
        if (e.shiftKey) {
          // Previous tab
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : openTabs.length - 1;
          setActiveTab(openTabs[prevIndex]?.id || null);
        } else {
          // Next tab
          const nextIndex = currentIndex < openTabs.length - 1 ? currentIndex + 1 : 0;
          setActiveTab(openTabs[nextIndex]?.id || null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, openTabs, setActiveTab, closeTab]);

  if (openTabs.length === 0) {
    return (
      <div className={`h-10 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
          No files open
        </div>
      </div>
    );
  }

  return (
    <div className={`h-10 border-b border-gray-200 dark:border-gray-700 flex ${className}`}>
      {/* Tab items */}
      <div className="flex-1 flex overflow-x-auto scrollbar-hide">
        {openTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onClick={() => setActiveTab(tab.id)}
            onClose={(e) => handleClose(e, tab.id)}
            onContextMenu={(e) => onTabContextMenu?.(tab.id, e)}
          />
        ))}
      </div>

      {/* Tab dropdown menu */}
      <TabDropdown />
    </div>
  );
}
