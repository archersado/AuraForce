/**
 * TabBar Enhanced Component
 *
 * Displays file tabs with drag-and-drop reordering and context menu.
 * Features:
 * - File type icons
 * - Unsaved indicator (*)
 * - Close buttons (x)
 * - Hover effects
 * - Active tab highlight
 * - Drag-and-drop reordering
 * - Right-click context menu
 *
 * @version 2.0.0 (Enhanced with drag-and-drop and context menu)
 */

'use client';

import { X, Copy, XCircle, MoreHorizontal } from 'lucide-react';
import { useTabsStore, type Tab } from '@/stores/workspace-tabs-store';
import { getFileIcon } from '@/components/workspace/CodeEditor.utils';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useCallback, useEffect } from 'react';

interface TabBarProps {
  onTabClose?: (tabId: string) => void;
}

interface TabItemProps {
  tab: Tab;
  index: number;
  onTabClose?: (tabId: string) => void;
  onCloseWithConfirmation?: (tab: Tab) => Promise<boolean>;
  onContextMenu?: (e: React.MouseEvent) => void;
}

// Sortable Tab Item
function SortableTab({ tab, index, onTabClose, onCloseWithConfirmation, onContextMenu }: TabItemProps) {
  const { activeTabId, setActiveTab, closeTab } = useTabsStore();

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

  const handleClose = () => {
    if (tab.hasUnsavedChanges && onCloseWithConfirmation) {
      onCloseWithConfirmation(tab).then((shouldClose) => {
        if (shouldClose) {
          closeTab(tab.id);
          if (onTabClose) {
            onTabClose(tab.id);
          }
        }
      });
    } else {
      closeTab(tab.id);
      if (onTabClose) {
        onTabClose(tab.id);
      }
    }
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 px-3 py-2 rounded-t-sm border-t-2 transition-all cursor-pointer min-w-0 flex-shrink-0 max-w-xs select-none ${
        tab.isActive
          ? 'border-blue-600 bg-blue-50'
          : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={() => setActiveTab(tab.id)}
      onAuxClick={(e) => {
        if (e.button === 1) {
          handleMiddleClick(e);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onContextMenu) {
          onContextMenu(e);
        }
      }}
      title={tab.path}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        title="Drag to reorder"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </div>

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
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
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
  );
}

// Context Menu Component
function TabContextMenu({
  tab,
  x,
  y,
  onClose,
  onCloseTab,
  onCloseOthers,
  onCloseAll,
  onCopyPath,
}: {
  tab: Tab;
  x: number;
  y: number;
  onClose: () => void;
  onCloseTab: (tab: Tab) => void;
  onCloseOthers: (tab: Tab) => void;
  onCloseAll: () => void;
  onCopyPath: (path: string) => void;
}) {
  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[200px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onCloseTab(tab);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Close Tab
      </button>
      <button
        onClick={() => {
          onCloseOthers(tab);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <XCircle className="w-4 h-4" />
        Close Others
      </button>
      <div className="border-t border-gray-200 my-1" />
      <button
        onClick={() => {
          onCopyPath(tab.path);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        Copy Path
      </button>
      <div className="border-t border-gray-200 my-1" />
      <button
        onClick={() => {
          onCloseAll();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <XCircle className="w-4 h-4" />
        Close All
      </button>
    </div>
  );
}

export function TabBarEnhanced({ onTabClose }: TabBarProps) {
  const { tabs, activeTabId, closeTab, closeOtherTabs, closeAllTabs } = useTabsStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    tab: Tab;
    x: number;
    y: number;
  } | null>(null);

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over.id);

      // Reorder tabs in store
      const newTabs = arrayMove(tabs, oldIndex, newIndex);
      storeReorderedTabs(newTabs);
    }

    setActiveId(null);
  }, [tabs]);

  // Store reordered tabs
  const storeReorderedTabs = useCallback((newTabs: Tab[]) => {
    // Update store with new order
    useTabsStore.setState({ tabs: newTabs });
  }, []);

  // Handle tab close with confirmation
  const handleCloseWithConfirmation = useCallback(async (tab: Tab): Promise<boolean> => {
    if (tab.hasUnsavedChanges) {
      const confirmed = window.confirm(
        `Save changes to "${tab.name}" before closing?`
      );

      if (confirmed) {
        // TODO: Implement save functionality
        return true;
      }
      return false;
    }
    return true;
  }, []);

  // Handle context menu actions
  const handleCloseTab = useCallback((tab: Tab) => {
    if (tab.hasUnsavedChanges) {
      const confirmed = window.confirm(
        `Discard unsaved changes to "${tab.name}" and close?`
      );
      if (!confirmed) return;
    }
    closeTab(tab.id);
    if (onTabClose) {
      onTabClose(tab.id);
    }
  }, [closeTab, onTabClose]);

  const handleCloseOthers = useCallback((tab: Tab) => {
    closeOtherTabs();
  }, [closeOtherTabs]);

  const handleCloseAll = useCallback(() => {
    closeAllTabs();
  }, [closeAllTabs]);

  const handleCopyPath = useCallback(async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy path:', err);
    }
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

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
    <>
      <div className="h-12 bg-white border-b border-gray-200 flex items-center overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
            <div className="flex items-center gap-1 px-2">
              {tabs.map((tab, index) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  index={index}
                  onTabClose={onTabClose}
                  onCloseWithConfirmation={handleCloseWithConfirmation}
                  onContextMenu={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenu({
                      tab,
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-t-sm border-t-2 border-blue-600 bg-blue-50 min-w-0 flex-shrink-0 max-w-xs">
                <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-lg">{getFileIcon(tabs.find(t => t.id === activeId)?.name || '')?.icon || '📄'}</span>
                <span className="text-sm truncate">
                  {tabs.find(t => t.id === activeId)?.name || ''}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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

      {/* Context Menu */}
      {contextMenu && (
        <TabContextMenu
          tab={contextMenu.tab}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCloseTab={handleCloseTab}
          onCloseOthers={handleCloseOthers}
          onCloseAll={handleCloseAll}
          onCopyPath={handleCopyPath}
        />
      )}
    </>
  );
}

export default TabBarEnhanced;
