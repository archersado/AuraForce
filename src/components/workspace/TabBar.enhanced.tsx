/**
 * Tab Bar Component - Enhanced
 *
 * Displays file tabs with:
 * - Drag and drop reordering
 * - Right-click context menu
 * - Unsaved file warnings
 * - Close buttons
 * - Active tab highlight
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Copy, Settings, Lock, Layout, RotateCcw, XCircle } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTabsStore, type Tab } from '@/stores/workspace-tabs-store';
import { getFileIcon } from '@/components/workspace/CodeEditor.utils';
import { ConfirmationDialog } from '@/components/ui/confirm-dialog';

interface TabBarProps {
  onTabClose?: (tabId: string) => void;
}

interface SortableTabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

/**
 * Sortable Tab Item
 */
function SortableTabItem({ tab, isActive, onClick, onClose, onContextMenu }: SortableTabItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatTabName = (name: string, maxLength = 30): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group flex items-center gap-2 px-3 py-2 rounded-t-sm border-t-2 transition-all cursor-pointer min-w-0 flex-shrink-0 max-w-xs ${
        isActive
          ? 'border-blue-600 bg-blue-50'
          : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={tab.path}
    >
      {/* Drag Handle Indicator */}
      <div className="flex-shrink-0 w-1 h-4 mr-1 rounded-full bg-gray-300 opacity-0 group-hover:opacity-100" />

      {/* File Type Icon */}
      <span className="text-lg flex-shrink-0" title={tab.language}>
        {getFileIcon(tab.name)?.icon || '📄'}
      </span>

      {/* Tab Name */}
      <span className={`${tab.hasUnsavedChanges ? 'font-semibold' : ''} text-sm truncate`}
            title={`${tab.name}${tab.hasUnsavedChanges ? ' (unsaved)' : ''}`}>
        {tab.hasUnsavedChanges && <span className="mr-0.5 font-bold text-blue-600">*</span>}
        {formatTabName(tab.name)}
      </span>

      {/* Close Button */}
      <button
        onClick={onClose}
        className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors ${
          isActive
            ? 'hover:bg-red-100 text-gray-500'
            : 'hover:bg-red-50 text-gray-400'
        }`}
        title="Close tab (Ctrl+W)"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * Context Menu Component
 */
function TabContextMenu({
  position,
  visible,
  onClose,
  onSelect,
  tab,
}: {
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
  onSelect: (action: string) => void;
  tab: Tab | null;
}) {
  useEffect(() => {
    const handleClickOutside = () => onClose();
    if (visible) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [visible, onClose]);

  if (!visible || !tab) return null;

  const menuItems = [
    { id: 'close', icon: X, label: 'Close Tab', danger: false, separator: false },
    { id: 'close-others', icon: XCircle, label: 'Close Others', danger: false, separator: false },
    { id: 'close-all', icon: RotateCcw, label: 'Close All', danger: true, separator: true },
    { id: 'copy-path', icon: Copy, label: 'Copy Path', danger: false, separator: true },
    { id: 'pin', icon: Lock, label: 'Pin Tab', danger: false, separator: false },
    { id: 'format', icon: Layout, label: 'Format Code', danger: false, separator: false },
    { id: 'settings', icon: Settings, label: 'Settings', danger: false, separator: true },
  ];

  return (
    <div
      className="fixed z-50 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item) => (
        <div key={item.id}>
          {item.separator && <div className="border-t border-gray-200 dark:border-gray-700 my-1 mx-2" />}
          <button
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
              item.danger
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}{tab.hasUnsavedChanges && item.id === 'close' && ' *'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Main TabBar Component
 */
export function TabBar({ onTabClose }: TabBarProps) {
  const { tabs, activeTabId, setActiveTab, closeTab, closeOtherTabs, closeAllTabs, reorderTab, hasUnsavedTabs, markTabAsSaved } = useTabsStore();

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    tab: Tab | null;
    position: { x: number; y: number };
  }>({
    visible: false,
    tab: null,
    position: { x: 0, y: 0 },
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
    message: string;
    onConfirm: () => void;
  }>({ visible: false, message: '', onConfirm: () => {} });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over.id);
      reorderTab(oldIndex, newIndex);
    }
  }, [tabs, reorderTab]);

  const handleTabClick = useCallback((tab: Tab) => {
    setActiveTab(tab.id);
  }, [setActiveTab]);

  const handleTabClose = useCallback((e: React.MouseEvent, tab: Tab, saveBeforeClose = false) => {
    e.stopPropagation();

    if (tab.hasUnsavedChanges) {
      setConfirmDialog({
        visible: true,
        message: `Do you want to close "${tab.name}"? All unsaved changes will be lost.`,
        onConfirm: async () => {
          if (saveBeforeClose) {
            // TODO: Save before closing
            // For now, just close with warning
          }
          closeTab(tab.id);
          if (onTabClose) {
            onTabClose(tab.id);
          }
          setConfirmDialog({ visible: false, message: '', onConfirm: () => {} });
        },
      });
    } else {
      closeTab(tab.id);
      if (onTabClose) {
        onTabClose(tab.id);
      }
    }
  }, [closeTab, onTabClose]);

  const handleTabContextMenu = useCallback((e: React.MouseEvent, tab: Tab) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      tab,
      position: { x: e.clientX, y: e.clientY },
    });
  }, []);

  const handleContextMenuSelect = useCallback((action: string) => {
    const tabToClose = contextMenu.tab;

    setContextMenu({ visible: false, tab: null, position: { x: 0, y: 0 } });

    switch (action) {
      case 'close':
        if (tabToClose) {
          handleTabClose({ stopPropagation: () => {} } as React.MouseEvent, tabToClose);
        }
        break;
      case 'close-others':
        if (activeTabId) {
          // Close all tabs except the current one
          const tabsToClose = tabs.filter((t) => t.id !== activeTabId && t.hasUnsavedChanges);
          if (tabsToClose.length > 0) {
            setConfirmDialog({
              visible: true,
              message: `Do you want to close other tabs? ${tabsToClose.length} file(s) have unsaved changes.`,
              onConfirm: () => {
                closeOtherTabs();
                setConfirmDialog({ visible: false, message: '', onConfirm: () => {} });
              },
            });
          } else {
            closeOtherTabs();
          }
        }
        break;
      case 'close-all':
        if (hasUnsavedTabs()) {
          setConfirmDialog({
            visible: true,
            message: 'Do you want to close all tabs? All unsaved changes will be lost.',
            onConfirm: () => {
              closeAllTabs();
              setConfirmDialog({ visible: false, message: '', onConfirm: () => {} });
            },
          });
        } else {
          closeAllTabs();
        }
        break;
      case 'copy-path':
        if (tabToClose) {
          navigator.clipboard.writeText(tabToClose.path);
        }
        break;
      case 'pin':
        // TODO: Implement pinning functionality
        break;
      case 'format':
        // TODO: Implement format functionality
        break;
      case 'settings':
        // TODO: Open settings
        break;
    }
  }, [handleTabClose, contextMenu, activeTabId, tabs, closeOtherTabs, closeAllTabs, hasUnsavedTabs]);

  // Window beforeunload handler for unsaved tabs
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedTabs()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedTabs]);

  if (tabs.length === 0) {
    return (
      <div className="h-12 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
          No files open
        </p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center overflow-x-auto">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-2">
            {tabs.map((tab) => (
              <SortableTabItem
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onClick={() => handleTabClick(tab)}
                onClose={(e) => handleTabClose(e, tab)}
                onContextMenu={(e) => handleTabContextMenu(e, tab)}
              />
            ))}
          </div>

          {/* Close All / Close Others */}
          {tabs.length > 1 && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  if (activeTabId) {
                    const tabsToClose = tabs.filter((t) => t.id !== activeTabId && t.hasUnsavedChanges);
                    if (tabsToClose.length > 0) {
                      setConfirmDialog({
                        visible: true,
                        message: `Do you want to close other tabs? ${tabsToClose.length} file(s) have unsaved changes.`,
                        onConfirm: () => {
                          closeOtherTabs();
                          setConfirmDialog({ visible: false, message: '', onConfirm: () => {} });
                        },
                      });
                    } else {
                      closeOtherTabs();
                    }
                  }
                }}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs transition-colors"
                title="Close Others"
              >
                Close Others
              </button>
              <button
                onClick={() => {
                  if (hasUnsavedTabs()) {
                    setConfirmDialog({
                      visible: true,
                      message: 'Do you want to close all tabs? All unsaved changes will be lost.',
                      onConfirm: () => {
                        closeAllTabs();
                        setConfirmDialog({ visible: false, message: '', onConfirm: () => {} });
                      },
                    });
                  } else {
                    closeAllTabs();
                  }
                }}
                className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-xs transition-colors"
                title="Close All"
              >
                Close All
              </button>
            </div>
          )}
        </div>
      </DndContext>

      {/* Context Menu */}
      <TabContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        tab={contextMenu.tab}
        onClose={() => setContextMenu({ visible: false, tab: null, position: { x: 0, y: 0 } })}
        onSelect={handleContextMenuSelect}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.visible}
        title="Unsaved Changes"
        message={confirmDialog.message}
        confirmText="Close"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ visible: false, message: '', onConfirm: () => {} })}
      />
    </>
  );
}
