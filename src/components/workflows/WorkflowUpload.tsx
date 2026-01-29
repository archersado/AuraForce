'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Folder, X, Check, AlertCircle } from 'lucide-react';

interface FolderItem {
  name: string;
  files: File[];
}

interface WorkflowUploadProps {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export default function WorkflowUpload({ onSuccess, onError }: WorkflowUploadProps) {
  const [uploadType, setUploadType] = useState<'file' | 'folder'>('folder');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [workflowName, setWorkflowName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<FolderItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Add selected files
    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);

    // Use the first file's name as default workflow name if not set
    if (!workflowName && newFiles.length > 0) {
      setWorkflowName(newFiles[0].name.replace(/\.(md|markdown)$/i, ''));
    }

    // Reset input
    e.target.value = '';
  }, [workflowName]);

  const handleFolderSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Group files by folder name
    const filesArray = Array.from(files);
    const firstFile = filesArray[0];
    const webkitRelativePath = (firstFile as any).webkitRelativePath;
    if (webkitRelativePath) {
      const folderName = webkitRelativePath.split('/')[0];

      const newFolder: FolderItem = {
        name: folderName,
        files: filesArray
      };

      setSelectedFolders(prev => {
        // Check if folder already exists
        const existingIndex = prev.findIndex(f => f.name === folderName);
        if (existingIndex >= 0) {
          // Replace existing folder
          const newFolders = [...prev];
          newFolders[existingIndex] = newFolder;
          return newFolders;
        }
        // Add new folder
        return [...prev, newFolder];
      });

      // Use folder name as default workflow name if not set
      if (!workflowName) {
        setWorkflowName(folderName);
      }
    }

    // Reset input
    e.target.value = '';
  }, [workflowName]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeFolder = (index: number) => {
    setSelectedFolders(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadType === 'file' && selectedFiles.length === 0) {
      onError?.('Please select files to upload');
      return;
    }

    if (uploadType === 'folder' && selectedFolders.length === 0) {
      onError?.('Please select folders to upload');
      return;
    }

    setUploading(true);
    setResults([]);

    try {
      if (uploadType === 'file') {
        // Upload all selected files
        const formData = new FormData();
        formData.append('uploadType', 'file');
        if (workflowName) {
          formData.append('workflowName', workflowName);
        }
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch('/api/workflows/upload-v2', {
          method: 'POST',
          headers: {
            'Cookie': document.cookie,
          },
          body: formData,
        });

        const data = await response.json();
        setResults(data.results || [data]);

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        if (data.success) {
          onSuccess?.(data);
          setSelectedFiles([]);
        }
      } else {
        // Upload each folder separately
        const uploadResults = [];

        for (const folder of selectedFolders) {
          const formData = new FormData();
          formData.append('uploadType', 'folder');
          formData.append('workflowName', folder.name);

          // Upload files for this folder
          folder.files.forEach(file => {
            const relativePath = (file as any).webkitRelativePath;
            formData.append(`folder-${relativePath}`, file);
          });

          const response = await fetch('/api/workflows/upload-v2', {
            method: 'POST',
            headers: {
              'Cookie': document.cookie,
            },
            body: formData,
          });

          const data = await response.json();

          uploadResults.push({
            fileName: folder.name,
            success: response.ok && data.success,
            workflowId: data.workflowId,
            error: data.error,
            message: data.message,
          });
        }

        setResults(uploadResults);

        const successCount = uploadResults.filter(r => r.success).length;
        if (successCount === uploadResults.length) {
          onSuccess?.({ results: uploadResults });
          setSelectedFolders([]);
        } else {
          const errorMessages = uploadResults
            .filter(r => !r.success)
            .map(r => `${r.fileName}: ${r.error}`)
            .join('; ');
          onError?.(`Some uploads failed: ${errorMessages}`);
        }
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
              <div className="flex gap-2">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".md,.markdown"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports .md and .markdown files (multiple files allowed)
              </p>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Files ({selectedFiles.length})
                </span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    <span className="truncate text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-600 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Workflow Folder
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="space-y-1 text-center">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex gap-2">
                <label
                  htmlFor="folder-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload folder</span>
                  <input
                    ref={folderInputRef}
                    id="folder-upload"
                    type="file"
                    {...({ webkitdirectory: '', directory: '' } as any)}
                    multiple
                    className="sr-only"
                    onChange={handleFolderSelect}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload workflow folders (multiple folders allowed)
              </p>
            </div>
          </div>

          {/* Selected Folders List */}
          {selectedFolders.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Folders ({selectedFolders.length})
                </span>
                <button
                  onClick={() => setSelectedFolders([])}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFolders.map((folder, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        📁 {folder.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({folder.files.length} files)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFolder(index)}
                      className="text-red-500 hover:text-red-600 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
