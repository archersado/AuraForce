'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Folder, X, Check, AlertCircle } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  content?: string;
  file?: File;
}

interface WorkflowUploadProps {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export default function WorkflowUpload({ onSuccess, onError }: WorkflowUploadProps) {
  const [uploadType, setUploadType] = useState<'file' | 'folder'>('file');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [workflowName, setWorkflowName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setWorkflowName(file.name.replace(/\.(md|markdown)$/i, ''));
  }, []);

  const handleFolderSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Get folder name from first file
    const firstFile = files[0];
    const webkitRelativePath = (firstFile as any).webkitRelativePath;
    if (webkitRelativePath) {
      const folderName = webkitRelativePath.split('/')[0];
      setWorkflowName(folderName);
    }
  }, []);

  const handleUpload = async () => {
    if (!workflowName) {
      onError?.('Please enter a workflow name');
      return;
    }

    setUploading(true);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append('uploadType', uploadType);
      formData.append('workflowName', workflowName);

      if (uploadType === 'file') {
        const fileInput = fileInputRef.current;
        if (!fileInput?.files?.[0]) {
          onError?.('Please select a file to upload');
          return;
        }

        const file = fileInput.files[0];
        formData.append('files', file);
      } else {
        const folderInput = folderInputRef.current;
        if (!folderInput?.files || folderInput.files.length === 0) {
          onError?.('Please select a folder to upload');
          return;
        }

        // Upload entire folder
        for (let i = 0; i < folderInput.files.length; i++) {
          const file = folderInput.files[i];
          const relativePath = (file as any).webkitRelativePath;
          formData.append(`folder-${relativePath}`, file);
        }
      }

      const response = await fetch('/api/workflows/upload-v2', {
        method: 'POST',
        headers: {
          'Cookie': document.cookie,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (data.success) {
        setResults(data.results || [data]);
        onSuccess?.(data);
      } else {
        onError?.(data.message || 'Upload failed');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Upload Workflow
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Upload a workflow file or folder as a template
        </p>
      </div>

      {/* Upload Type Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setUploadType('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadType === 'file'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
          }`}
        >
          <FileText size={18} />
          <span>File</span>
        </button>
        <button
          onClick={() => setUploadType('folder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadType === 'folder'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
          }`}
        >
          <Folder size={18} />
          <span>Folder</span>
        </button>
      </div>

      {/* Workflow Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Workflow Name
        </label>
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Enter workflow name..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Upload Area */}
      {uploadType === 'file' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Workflow File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="space-y-1 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".md,.markdown"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports .md and .markdown files up to 5MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Workflow Folder
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="space-y-1 text-center">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label
                  htmlFor="folder-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a folder</span>
                  <input
                    ref={folderInputRef}
                    id="folder-upload"
                    type="file"
                    webkitdirectory=""
                    directory=""
                    className="sr-only"
                    onChange={handleFolderSelect}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload entire workflow folder
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload size={20} />
            <span>Upload Workflow</span>
          </>
        )}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Results
          </h3>
          {results.map((result, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                result.success
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              {result.success ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {result.fileName || result.workflowName}
                </p>
                {result.error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{result.error}</p>
                )}
                {result.message && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">{result.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
