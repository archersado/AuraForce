/**
 * Enhanced File Upload Component - STORY-14-7 Implementation
 *
 * Complete file upload with chunked upload, progress tracking, and error handling
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import {
  uploadFilesBatch,
  uploadFile,
  formatFileSize,
  validateFileName,
} from '@/lib/workspace/file-upload-service';

export interface UploadProgressItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  filePath?: string;
}

interface EnhancedFileUploadProps {
  visible: boolean;
  onClose: () => void;
  onUploadComplete?: (files: UploadProgressItem[]) => void;
  targetPath?: string;
  workspaceRoot?: string;
}

export function EnhancedFileUpload({
  visible,
  onClose,
  onUploadComplete,
  targetPath = '/',
  workspaceRoot = '',
}: EnhancedFileUploadProps) {
  const [uploads, setUploads] = useState<UploadProgressItem[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    queueFiles(selectedFiles);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    queueFiles(droppedFiles);
  }, []);

  // Queue files for upload
  const queueFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      const validation = validateFileName(file.name);
      if (!validation.valid) {
        console.warn(`Skipping invalid file: ${file.name} - ${validation.error}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      alert('No valid files to upload');
      return;
    }

    const uploadItems: UploadProgressItem[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setUploads((prev) => [...prev, ...uploadItems]);
  }, []);

  // Cancel upload for a specific file
  const cancelUpload = useCallback((uploadId: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
  }, []);

  // Retry failed upload
  const retryUpload = useCallback(async (uploadItem: UploadProgressItem) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === uploadItem.id ? { ...u, status: 'pending', progress: 0, error: undefined } : u
      )
    );

    uploadNextFile();
  }, [uploads]);

  // Upload next file in queue
  const uploadNextFile = useCallback(async () => {
    setUploads((prev) => {
      const pendingItem = prev.find((u) => u.status === 'pending');

      if (!pendingItem) {
        setIsUploading(false);
        onUploadComplete?.(prev);
        return prev;
      }

      setIsUploading(true);

      // Update status to uploading
      const updated = prev.map((u) =>
        u.id === pendingItem.id ? { ...u, status: 'uploading', progress: 0 } : u
      );

      // Perform upload
      uploadFile(pendingItem.file, targetPath, workspaceRoot, (progress) => {
        setUploads((current) =>
          current.map((u) =>
            u.id === pendingItem.id ? { ...u, progress } : u
          )
        );
      })
        .then((result) => {
          setUploads((current) =>
            current.map((u) =>
              u.id === pendingItem.id
                ? {
                    ...u,
                    status: result.success ? 'success' : 'error',
                    progress: 100,
                    error: result.success ? undefined : result.error,
                    filePath: result.success ? result.filePath : undefined,
                  }
                : u
            )
          );

          // Upload next file
          setTimeout(() => {
            uploadNextFile();
          }, 0);
        })
        .catch((error) => {
          setUploads((current) =>
            current.map((u) =>
              u.id === pendingItem.id
                ? {
                    ...u,
                    status: 'error',
                    progress: 0,
                    error: error instanceof Error ? error.message : 'Unknown error',
                  }
                : u
            )
          );

          // Upload next file
          setTimeout(() => {
            uploadNextFile();
          }, 0);
        });

      return updated;
    });
  }, [targetPath, workspaceRoot, onUploadComplete]);

  // Start batch upload
  const startUpload = useCallback(() => {
    if (isUploading) return;

    const pendingFiles = uploads.filter((u) => u.status === 'pending');
    if (pendingFiles.length === 0) return;

    uploadNextFile();
  }, [uploads, isUploading, uploadNextFile]);

  // Close dialog
  const handleClose = useCallback(() => {
    const hasUploadingFiles = uploads.some((u) => u.status === 'uploading');

    if (hasUploadingFiles) {
      if (window.confirm('Upload is in progress. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [uploads, onClose]);

  // Clear completed uploads
  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status !== 'success'));
  }, []);

  // Count statuses
  const pendingCount = uploads.filter((u) => u.status === 'pending').length;
  const uploadingCount = uploads.filter((u) => u.status === 'uploading').length;
  const successCount = uploads.filter((u) => u.status === 'success').length;
  const errorCount = uploads.filter((u) => u.status === 'error').length;

  // Overall progress
  const totalFiles = uploads.length;
  const completedFiles = successCount + errorCount;
  const currentOverallProgress = totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload Files
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target: {targetPath}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Overall progress */}
            {currentOverallProgress > 0 && currentOverallProgress < 100 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentOverallProgress}%` }}
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {currentOverallProgress}%
                </span>
              </div>
            )}

            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Drag & Drop Zone */}
          <div
            ref={dropZoneRef}
            className="m-6 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500 dark:text-blue-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drag and drop files here
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              or click to browse
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supports files up to 100MB (large files will be uploaded in chunks)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Status Summary */}
          {uploads.length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex gap-4">
                  {pendingCount > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {pendingCount} pending
                    </span>
                  )}
                  {uploadingCount > 0 && (
                    <span className="text-blue-600 dark:text-blue-400">
                      {uploadingCount} uploading
                    </span>
                  )}
                  {successCount > 0 && (
                    <span className="text-green-600 dark:text-green-400">
                      {successCount} completed
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-red-600 dark:text-red-400">
                      {errorCount} failed
                    </span>
                  )}
                </div>

                <button
                  onClick={clearCompleted}
                  disabled={successCount === 0}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Clear completed
                </button>
              </div>
            </div>
          )}

          {/* Upload List */}
          {uploads.length > 0 && (
            <div className="px-6 pb-6 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {uploads.map((upload) => (
                  <EnhancedUploadProgressItem
                    key={upload.id}
                    upload={upload}
                    formatFileSize={formatFileSize}
                    onCancel={() => cancelUpload(upload.id)}
                    onRetry={() => retryUpload(upload)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {uploads.length} {uploads.length === 1 ? 'file' : 'files'} in queue
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Close
            </button>

            {uploads.some((u) => u.status === 'pending') && (
              <button
                onClick={startUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Start Upload
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EnhancedUploadProgressItemProps {
  upload: UploadProgressItem;
  formatFileSize: (bytes: number) => string;
  onCancel: () => void;
  onRetry: () => void;
}

function EnhancedUploadProgressItem({
  upload,
  formatFileSize,
  onCancel,
  onRetry,
}: EnhancedUploadProgressItemProps) {
  const getStatusIcon = () => {
    switch (upload.status) {
      case 'pending':
        return <File className="w-4 h-4 text-gray-400" />;
      case 'uploading':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
      {/* Status Icon */}
      <div className="flex-shrink-0">{getStatusIcon()}</div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {upload.file.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span>{formatFileSize(upload.file.size)}</span>
          {upload.progress > 0 && upload.status !== 'success' && (
            <>
              <span>•</span>
              <span>{Math.round(upload.progress)}%</span>
            </>
          )}
        </div>
        {upload.error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{upload.error}</p>
        )}
      </div>

      {/* Progress Bar */}
      {upload.status === 'uploading' && (
        <div className="w-32">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {upload.status === 'pending' && (
        <button
          onClick={onCancel}
          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {upload.status === 'error' && (
        <button
          onClick={onRetry}
          className="p-1.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          title="Retry"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}

      {upload.status === 'success' && (
        <CheckCircle className="w-5 h-5 text-green-500" />
      )}
    </div>
  );
}
