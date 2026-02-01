/**
 * File Upload Progress Component
 *
 * Displays upload progress for multiple files.
 * Supports drag & drop and file selection.
 */

'use client';

import { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

export interface UploadProgressItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface FileUploadProps {
  visible: boolean;
  onClose: () => void;
  onUploadComplete?: (files: any[]) => void;
  targetPath?: string;
}

export function FileUpload({
  visible,
  onClose,
  onUploadComplete,
  targetPath = '/',
}: FileUploadProps) {
  const [uploads, setUploads] = useState<UploadProgressItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    startUpload(selectedFiles);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    startUpload(droppedFiles);
  };

  // Start upload process
  const startUpload = (files: File[]) => {
    if (files.length === 0) return;

    // Create upload items
    const uploadItems: UploadProgressItem[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setUploads(uploadItems);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Get status icon
  const getStatusIcon = (status: UploadProgressItem['status'], error?: string) => {
    switch (status) {
      case 'pending':
        return <File className="w-4 h-4 text-gray-400" />;
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Upload Files
              </h2>
              <p className="text-sm text-gray-600">
                Target: {targetPath}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Drag & Drop Zone */}
          <div
            ref={dropZoneRef}
            className="m-6 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop files here
            </p>
            <p className="text-sm text-gray-600 mb-4">
              or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Supports up to 100MB per file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Upload List */}
          {uploads.length > 0 && (
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Upload Queue ({uploads.length})
                </h3>

                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <UploadItem
                      key={upload.id}
                      upload={upload}
                      formatFileSize={formatFileSize}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <p className="text-sm text-gray-600">
            {uploads.length} {uploads.length === 1 ? 'file' : 'files'} selected
          </p>
          <button
            onClick={onClose}
            disabled={uploads.some((u) => u.status === 'uploading')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface UploadItemProps {
  upload: UploadProgressItem;
  formatFileSize: (bytes: number) => string;
  getStatusIcon: (status: UploadProgressItem['status'], error?: string) => React.ReactNode;
}

function UploadItem({ upload, formatFileSize, getStatusIcon }: UploadItemProps) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {getStatusIcon(upload.status, upload.error)}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {upload.file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(upload.file.size)}
        </p>
      </div>

      {/* Progress */}
      {upload.status === 'uploading' && (
        <div className="w-32">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${upload.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1 text-right">
            {Math.round(upload.progress)}%
          </p>
        </div>
      )}

      {/* Status Text */}
      {upload.status !== 'uploading' && (
        <div className="flex-shrink-0 text-xs font-medium">
          {upload.status === 'success' && (
            <span className="text-green-600">Finished</span>
          )}
          {upload.status === 'error' && (
            <span className="text-red-600">Failed</span>
          )}
        </div>
      )}

      {/* Error Message */}
      {upload.status === 'error' && upload.error && (
        <p className="col-span-2 text-xs text-red-600 mt-1">
          {upload.error}
        </p>
      )}
    </div>
  );
}
