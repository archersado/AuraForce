/**
 * Workflow Spec Upload Component
 *
 * Allows users to upload BMAD workflow specification files via drag-and-drop
 * or file browser, validates them, and displays upload progress and results.
 */

'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

interface UploadResult {
  fileName: string;
  success: boolean;
  workflowId?: string;
  ccPath?: string;
  error?: string;
  warnings?: string[];
}

interface WorkflowSpecUploadProps {
  onUploadComplete?: (results: UploadResult[]) => void;
}

export default function WorkflowSpecUpload({ onUploadComplete }: WorkflowSpecUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const ext = file.name.toLowerCase();
      return ext.endsWith('.md') || ext.endsWith('.yaml') || ext.endsWith('.yml');
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      e.target.value = ''; // Reset input
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    setResults([]);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/workflows/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResults(data.results || []);

      if (data.results?.every((r: UploadResult) => r.success)) {
        setSelectedFiles([]);
      }

      onUploadComplete?.(data.results || []);
    } catch (error) {
      setResults([
        {
          fileName: 'Upload',
          success: false,
          error: error instanceof Error ? error.message : 'Upload failed',
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setSelectedFiles([]);
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-purple-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="workflow-upload"
          multiple
          accept=".md,.yaml,.yml"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor="workflow-upload"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              拖放文件到这里或点击上传
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              支持 .md, .yaml, .yml 格式（最大 5MB/文件，总计 50MB）
            </p>
          </div>
        </label>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              已选择文件 ({selectedFiles.length})
            </h3>
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              清除
            </button>
          </div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? '上传中...' : '上传并部署'}
          </button>
        </div>
      )}

      {/* Upload Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            上传结果
          </h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {result.fileName}
                  </p>
                  {result.error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {result.error}
                    </p>
                  )}
                  {result.ccPath && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      部署到: {result.ccPath}
                    </p>
                  )}
                  {result.warnings && result.warnings.length > 0 && (
                    <ul className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 list-disc list-inside">
                      {result.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
          {results.some(r => r.success) && (
            <button
              onClick={reset}
              className="w-full py-2 px-4 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors"
            >
              上传更多
            </button>
          )}
        </div>
      )}
    </div>
  );
}
