/**
 * Batch Operations Component
 *
 * Provides bulk file operations with:
 * - Multi-file selection
- Batch delete, move, rename
- Progress tracking
- Confirmation dialogs
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Check,
  X,
  Trash2,
  FolderDown,
  Copy,
  Download,
  MoreHorizontal,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useTabsStore } from '@/stores/workspace-tabs-store';

interface BatchOperationsProps {
  files: {
    path: string;
    name: string;
    type: 'file' | 'directory';
    size?: number;
  }[];
  workspaceRoot?: string;
  onDelete?: (paths: string[]) => Promise<void>;
  onMove?: (paths: string[], destination: string) => Promise<void>;
  onExport?: (paths: string[]) => Promise<void>;
  disabled?: boolean;
}

interface BatchState {
  selectedFiles: Set<string>;
  selectAll: boolean;
  showMenu: boolean;
  isProcessing: boolean;
  processedCount: number;
  totalCount: number;
  error: string | null;
}

export function BatchOperations({
  files,
  workspaceRoot,
  onDelete,
  onMove,
  onExport,
  disabled = false,
}: BatchOperationsProps) {
  const [state, setState] = useState<BatchState>({
    selectedFiles: new Set(),
    selectAll: false,
    showMenu: false,
    isProcessing: false,
    processedCount: 0,
    totalCount: 0,
    error: null,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    type: 'delete' | 'move';
    files: string[];
  } | null>(null);

  const [moveDestination, setMoveDestination] = useState<string>('/');

  // Open tabs store
  const { tabs, activeTabId } = useTabsStore();

  // Calculate batch counts
  const selectedFileCount = state.selectedFiles.size;
  const hasSelection = selectedFileCount > 0;
  const selectedFolders = files.filter(
    (file) =>
      state.selectedFiles.has(file.path) && file.type === 'directory'
  );
  const selectedFilesOnly = files.filter(
    (file) =>
      state.selectedFiles.has(file.path) && file.type === 'file'
  );

  // Toggle file selection
  const toggleFileSelection = useCallback((path: string) => {
    const newSelected = new Set(state.selectedFiles);

    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }

    const selectAll = newSelected.size === files.length;

    setState((prev) => ({
      ...prev,
      selectedFiles: newSelected,
      selectAll,
    }));
  }, [state.selectedFiles, files.length]);

  // Toggle all files
  const toggleSelectAll = useCallback(() => {
    const newSelectAll = !state.selectAll;

    const newSelected = newSelectAll
      ? new Set<string>(files.map((file) => file.path))
      : new Set<string>();

    setState((prev) => ({
      ...prev,
      selectedFiles: newSelected,
      selectAll: newSelectAll,
    }));
  }, [state.selectAll, files]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedFiles: new Set<string>(),
      selectAll: false,
    }));
  }, []);

  // Batch delete
  const handleBatchDelete = async () => {
    const selectedPaths = Array.from(state.selectedFiles);

    if (selectedPaths.length === 0) return;

    // Show confirmation dialog
    setShowConfirmDialog({
      type: 'delete',
      files: selectedPaths,
    });
  };

  // Confirm and execute delete
  const executeBatchDelete = async () => {
    if (!showConfirmDialog || !onDelete) return;

    const paths = showConfirmDialog.files;

    setState({
      selectedFiles: new Set(),
      selectAll: false,
      showMenu: false,
      isProcessing: true,
      processedCount: 0,
      totalCount: paths.length,
      error: null,
    });

    try {
      // Process files in batches
      const BATCH_SIZE = 10;
      for (let i = 0; i < paths.length; i += BATCH_SIZE) {
        const batch = paths.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map((path) => onDelete?.([path])));

        setState((prev) => ({
          ...prev,
          processedCount: i + batch.length,
        }));
      }

      setState({
        selectedFiles: new Set(),
        selectAll: false,
        showMenu: false,
        isProcessing: false,
        processedCount: 0,
        totalCount: 0,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: err instanceof Error ? err.message : 'Delete failed',
      }));
    }

    setShowConfirmDialog(null);
  };

  // Batch move
  const handleBatchMove = async () => {
    const selectedPaths = Array.from(state.selectedFiles);

    if (selectedPaths.length === 0 || !onMove) return;

    setShowConfirmDialog({
      type: 'move',
      files: selectedPaths,
    });
  };

  // Execute batch move
  const executeBatchMove = async () => {
    if (!showConfirmDialog || !onMove) return;

    const paths = showConfirmDialog.files;

    setState({
      selectedFiles: new Set(),
      selectAll: false,
      showMenu: false,
      isProcessing: true,
      processedCount: 0,
      totalCount: paths.length,
      error: null,
    });

    try {
      await Promise.all(paths.map((path) => onMove?.([path], moveDestination)));

      setState({
        selectedFiles: new Set(),
        selectAll: false,
        showMenu: false,
        isProcessing: false,
        processedCount: 0,
        totalCount: 0,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: err instanceof Error ? err.message : 'Move failed',
      }));
    }

    setShowConfirmDialog(null);
  };

  // Batch export
  const handleBatchExport = async () => {
    const selectedPaths = Array.from(state.selectedFiles);

    if (selectedPaths.length === 0 || !onExport) return;

    setState({
      ...state,
      isProcessing: true,
      processedCount: 0,
      totalCount: selectedPaths.length,
      error: null,
    });

    try {
      await onExport(selectedPaths);

      setState({
        selectedFiles: new Set(),
        selectAll: false,
        showMenu: false,
        isProcessing: false,
        processedCount: 0,
        totalCount: 0,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: err instanceof Error ? err.message : 'Export failed',
      }));
    }
  };

  // Reset error
  const resetError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Escape key to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && hasSelection) {
        e.preventDefault();
        clearSelection();
      }

      // Ctrl+A to select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        toggleSelectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSelection, clearSelection, toggleSelectAll]);

  return (
    <div className="space-y-4">
      {/* Batch Actions Bar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        {/* Left side - Selection info */}
        <div className="flex items-center gap-4">
          {/* Select all checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.selectAll}
              onChange={toggleSelectAll}
              disabled={disabled || files.length === 0}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              全选 ({files.length})
            </span>
          </label>

          {/* Selection count */}
          {hasSelection && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                已选择 {selectedFileCount} 个项目
              </span>
              {selectedFolders.length > 0 && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  ({selectedFolders.length} 文件夹, {selectedFilesOnly.length} 文件)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        {hasSelection && (
          <div className="flex items-center gap-2">
            {/* Batch delete */}
            {onDelete && (
              <button
                onClick={handleBatchDelete}
                disabled={state.isProcessing}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title={`Delete ${selectedFileCount} items`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Batch move */}
            {onMove && (
              <button
                onClick={handleBatchMove}
                disabled={state.isProcessing}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                title={`Move ${selectedFileCount} items`}
              >
                <FolderDown className="w-4 h-4" />
              </button>
            )}

            {/* Batch export */}
            {onExport && (
              <button
                onClick={handleBatchExport}
                disabled={state.isProcessing}
                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                title={`Export ${selectedFileCount} items`}
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Clear selection */}
            <button
              onClick={clearSelection}
              disabled={state.isProcessing}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Error message */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              批量操作失败
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {state.error}
            </p>
          </div>
          <button
            onClick={resetError}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      )}

      {/* Progress indicator */}
      {state.isProcessing && state.totalCount > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          <div className="flex-1">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              正在处理中...
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {state.processedCount} / {state.totalCount} 已完成
            </p>
          </div>
          <div className="w-32">
            <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all"
                style={{
                  width: `${
                    (state.processedCount / state.totalCount) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmationDialog
          type={showConfirmDialog.type}
          files={showConfirmDialog.files}
          onConfirm={
            showConfirmDialog.type === 'delete'
              ? executeBatchDelete
              : executeBatchMove
          }
          onCancel={() => setShowConfirmDialog(null)}
          moveDestination={moveDestination}
          onMoveDestinationChange={setMoveDestination}
        />
      )}

      {/* Success banner */}
      {!state.isProcessing &&
        !state.error &&
        state.processedCount > 0 &&
        showConfirmDialog === null && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                操作完成
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                成功处理 {state.processedCount} 个项目
              </p>
            </div>
            <button
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  processedCount: 0,
                }));
              }}
              className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-green-600 dark:text-green-400" />
            </button>
          </div>
        )}
    </div>
  );
}

// Confirmation Dialog Component
interface ConfirmationDialogProps {
  type: 'delete' | 'move';
  files: string[];
  onConfirm: () => void;
  onCancel: () => void;
  moveDestination?: string;
  onMoveDestinationChange?: (destination: string) => void;
}

function ConfirmationDialog({
  type,
  files,
  onConfirm,
  onCancel,
  moveDestination,
  onMoveDestinationChange,
}: ConfirmationDialogProps) {
  const fileNames = files.map((path) => path.split('/').pop() || path);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              type === 'delete'
                ? 'bg-red-100 dark:bg-red-900/20'
                : 'bg-blue-100 dark:bg-blue-900/20'
            }`}
          >
            {type === 'delete' ? (
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : (
              <FolderDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {type === 'delete' ? '确认删除' : '确认移动'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {type === 'delete'
                ? `您正在删除 ${files.length} 个项目`
                : `您正在移动 ${files.length} 个项目`}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* File list */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {fileNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center ${
                    type === 'delete'
                      ? 'bg-red-100 dark:bg-red-900/20'
                      : 'bg-blue-100 dark:bg-blue-900/20'
                  }`}
                >
                  {type === 'delete' ? (
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <FolderDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* Move destination input */}
          {type === 'move' && moveDestination !== undefined && onMoveDestinationChange && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                目标位置
              </label>
              <input
                type="text"
                value={moveDestination}
                onChange={(e) => onMoveDestinationChange(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                placeholder="/path/to/destination"
              />
            </div>
          )}

          {/* Warning */}
          <div
            className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
              type === 'delete'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 flex-shrink-0 ${
                type === 'delete'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  type === 'delete'
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}
              >
                {type === 'delete'
                  ? '此操作无法撤销'
                  : '确保目标位置有足够的权限'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {type === 'delete' &&
                  '永久删除的文件将无法恢复。请确认您要继续。'}
                {type === 'move' &&
                  '文件移动时可能会覆盖目标位置中已存在的同名文件。'}
              </p>

              {type === 'delete' && files.length > 5 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  批量删除的文件数量较多，请先备份重要数据。
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity bg-${
              type === 'delete' ? 'red-600 hover:bg-red-700' : 'blue-600 hover:bg-blue-700'
            }`}
          >
            {type === 'delete' ? '确认删除' : '确认移动'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatchOperations;
