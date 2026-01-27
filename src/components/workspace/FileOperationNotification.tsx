/**
 * File Operation Notification Component
 *
 * Displays a notification when Claude performs file operations (create/update/delete).
 * Shows operation type, file path, and provides quick access to view the file.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { File, Plus, Edit2, Trash2, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useClaudeStore } from '@/lib/store/claude-store';

interface FileOperationNotificationProps {
  onViewFile?: (filePath: string) => void;
}

type OperationType = 'create' | 'update' | 'delete';

const operationIcons: Record<OperationType, React.ComponentType<{ className?: string }>> = {
  create: Plus,
  update: Edit2,
  delete: Trash2,
};

const operationLabels: Record<OperationType, string> = {
  create: 'File Created',
  update: 'File Updated',
  delete: 'File Deleted',
};

const operationColors: Record<OperationType, string> = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500',
};

const operationBorderColors: Record<OperationType, string> = {
  create: 'border-green-200',
  update: 'border-blue-200',
  delete: 'border-red-200',
};

const operationTextColors: Record<OperationType, string> = {
  create: 'text-green-700',
  update: 'text-blue-700',
  delete: 'text-red-700',
};

export function FileOperationNotification({ onViewFile }: FileOperationNotificationProps) {
  const { fileOperation, clearFileOperation } = useClaudeStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const operation = fileOperation.type as OperationType | null;
  const filePath = fileOperation.filePath;

  // Extract file name from path
  const fileName = filePath ? filePath.split('/').pop() || filePath : '';

  // Handle animation
  useEffect(() => {
    if (operation && filePath) {
      setIsAnimating(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setDismissing(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        setDismissing(false);
      }, 300);
    }
  }, [operation, filePath]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (isVisible && operation && filePath) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, operation, filePath]);

  const handleDismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(() => {
      clearFileOperation();
    }, 300);
  }, [clearFileOperation]);

  const handleViewFile = useCallback(() => {
    if (filePath && onViewFile) {
      onViewFile(filePath);
      handleDismiss();
    }
  }, [filePath, onViewFile, handleDismiss]);

  if (!isAnimating || !operation || !filePath) return null;

  const Icon = operationIcons[operation];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${dismissing ? 'translate-y-2 opacity-0' : ''}`}
    >
      <div className={`bg-white border-2 ${operationBorderColors[operation]} rounded-xl shadow-lg max-w-md overflow-hidden`}>
        {/* Header */}
        <div className={`${operationColors[operation]} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">{operationLabels[operation]}</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 ${operationTextColors[operation]}.10 rounded-lg bg-gray-50`}>
              <File className={`w-5 h-5 ${operationTextColors[operation]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1 truncate">{fileName}</p>
              <p className="text-xs text-gray-500 font-mono truncate">{filePath}</p>
            </div>
          </div>

          {/* Action buttons */}
          {operation !== 'delete' && onViewFile && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleViewFile}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                View File
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {operation === 'delete' && (
            <div className="mt-4 flex items-center gap-2 text-xs text-red-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              File has been removed
            </div>
          )}

          {/* Progress bar - auto-dismiss */}
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400 transition-all duration-100 ease-linear"
              style={{
                width: dismissing ? '0%' : '100%',
                animation: isVisible && !dismissing ? 'shrink 8s linear' : 'none',
              }}
            />
          </div>
        </div>

        {/* Timestamp */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {new Date(fileOperation.timestamp || Date.now()).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Hook to get file operation state
 *
 * Convenience hook for components that need to subscribe to file operation changes
 */
export function useFileOperation() {
  const { fileOperation, clearFileOperation, setFileOperation } = useClaudeStore();

  return {
    operation: fileOperation.type as OperationType | null,
    filePath: fileOperation.filePath,
    operationId: fileOperation.operationId,
    timestamp: fileOperation.timestamp,
    clearFileOperation,
    setFileOperation,
  };
}
