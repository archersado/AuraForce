/**
 * Workflow Spec Upload Component
 *
 * Allows users to upload BMAD workflow specification files via drag-and-drop
 * or file browser, validates them, and displays upload progress and results.
 */

'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Folder, Lock, Globe, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

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

interface FormState {
  name: string;
  description: string;
  visibility: 'private' | 'public';
}

const defaultFormState: FormState = {
  name: '',
  description: '',
  visibility: 'private',
};

export default function WorkflowSpecUpload({ onUploadComplete }: WorkflowSpecUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<Map<string, File[]>>(new Map());
  const [uploadMode, setUploadMode] = useState<'file' | 'folder'>('file');
  const [form, setForm] = useState<FormState>(defaultFormState);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Reset form when files change
  const resetForm = useCallback(() => {
    setForm(defaultFormState);
  }, []);

  // Read first file content to extract metadata
  const extractMetadata = async (file: File): Promise<{ name?: string; description?: string }> => {
    try {
      const content = await file.text();
      // Simple extraction for name and description from markdown/yaml
      // Name look for pattern: name: "xxx" or name: xxx
      const nameMatch = content.match(/name\s*:\s*["']?([^"':\n\r}{]+)/i);
      const descMatch = content.match(/description\s*:\s*["']?([^"']+)["']?/i);

      return {
        name: nameMatch?.[1]?.trim(),
        description: descMatch?.[1]?.trim(),
      };
    } catch {
      return {};
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (uploadMode === 'file') {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(file => {
        const ext = file.name.toLowerCase();
        return ext.endsWith('.md') || ext.endsWith('.yaml') || ext.endsWith('.yml');
      });
      setSelectedFiles(prev => [...prev, ...validFiles]);

      // Auto-fill form from first file if empty
      if (form.name === '' && validFiles.length > 0) {
        const metadata = await extractMetadata(validFiles[0]);
        setForm(prev => ({
          ...prev,
          name: metadata.name || prev.name,
          description: metadata.description || prev.description,
        }));
      }
    } else {
      // Folder mode - handle dropped folders
      const items = Array.from(e.dataTransfer.items);
      const foldersMap = new Map<string, File[]>();

      const processEntry = async (entry: any, path = '') => {
        if (entry.isFile) {
          entry.file((file: File) => {
            // Filter valid files
            const ext = file.name.toLowerCase();
            if (ext.endsWith('.md') || ext.endsWith('.yaml') || ext.endsWith('.yml')) {
              const folderName = path.split('/')[0] || 'root';
              if (!foldersMap.has(folderName)) {
                foldersMap.set(folderName, []);
              }
              // Set webkitRelativePath manually for dropped folders
              (file as any).webkitRelativePath = path ? `${path}/${file.name}` : file.name;
              foldersMap.get(folderName)!.push(file);
            }
          });
        } else if (entry.isDirectory) {
          const dirReader = entry.createReader();
          const entries = await new Promise<any[]>((resolve) => {
            dirReader.readEntries((entries: any[]) => resolve(entries));
          });
          for (const childEntry of entries) {
            await processEntry(childEntry, path ? `${path}/${entry.name}` : entry.name);
          }
        }
      };

      items.forEach((item: any) => {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) processEntry(entry);
        }
      });

      // Update state after processing
      setTimeout(() => {
        setSelectedFolders(prev => {
          const newMap = new Map(prev);
          foldersMap.forEach((files, name) => {
            newMap.set(name, files);
          });
          return newMap;
        });

        // Auto-fill from first file in first folder
        if (form.name === '' && foldersMap.size > 0) {
          const firstFolder = Array.from(foldersMap.values())[0];
          if (firstFolder.length > 0) {
            extractMetadata(firstFolder[0]).then(metadata => {
              setForm(prev => ({
                ...prev,
                name: metadata.name || prev.name,
                description: metadata.description || prev.description,
              }));
            });
          }
        }
      }, 100);
    }
  }, [uploadMode, form.name, form.description]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (uploadMode === 'file') {
        setSelectedFiles(prev => [...prev, ...files]);

        // Auto-fill form from first file if empty
        if (form.name === '' && files.length > 0) {
          const metadata = await extractMetadata(files[0]);
          setForm(prev => ({
            ...prev,
            name: metadata.name || prev.name,
            description: metadata.description || prev.description,
          }));
        }
      } else {
        // Folder mode - organize files by folder
        const foldersMap = new Map<string, File[]>();
        files.forEach(file => {
          const webkitRelativePath = (file as any).webkitRelativePath;
          if (webkitRelativePath) {
            const folderName = webkitRelativePath.split('/')[0];
            if (!foldersMap.has(folderName)) {
              foldersMap.set(folderName, []);
            }
            foldersMap.get(folderName)!.push(file);
          }
        });
        setSelectedFolders(prev => {
          const newMap = new Map(prev);
          foldersMap.forEach((files, name) => {
            newMap.set(name, files);
          });
          return newMap;
        });

        // Auto-fill from first file
        if (form.name === '' && foldersMap.size > 0) {
          const firstFolder = Array.from(foldersMap.values())[0];
          if (firstFolder.length > 0) {
            const metadata = await extractMetadata(firstFolder[0]);
            setForm(prev => ({
              ...prev,
              name: metadata.name || prev.name,
              description: metadata.description || prev.description,
            }));
          }
        }
      }
      e.target.value = ''; // Reset input
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const remaining = prev.filter((_, i) => i !== index);
      // Reset form if no files left
      if (remaining.length === 0) {
        resetForm();
      }
      return remaining;
    });
  };

  const removeFolder = (folderName: string) => {
    setSelectedFolders(prev => {
      const newMap = new Map(prev);
      newMap.delete(folderName);
      // Reset form if no folders left
      if (newMap.size === 0) {
        resetForm();
      }
      return newMap;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 && selectedFolders.size === 0) {
      return;
    }

    // Validate form
    if (!form.name || form.name.trim() === '') {
      setResults([
        {
          fileName: 'Form',
          success: false,
          error: '工作流名称是必填项',
        },
      ]);
      return;
    }

    setIsUploading(true);
    setResults([]);

    try {
      const formData = new FormData();

      // Add workflow metadata
      formData.append('workflowName', form.name.trim());
      if (form.description?.trim()) {
        formData.append('workflowDescription', form.description.trim());
      }
      formData.append('visibility', form.visibility);

      if (uploadMode === 'file') {
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
      } else {
        // Upload folders
        selectedFolders.forEach((files) => {
          files.forEach(file => {
            formData.append('files', file);
          });
        });
      }

      const response = await apiFetch('/api/workflows/upload', {
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
        setSelectedFolders(new Map());
        resetForm();
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
    setSelectedFolders(new Map());
    setResults([]);
    resetForm();
  };

  const hasFiles = uploadMode === 'file' ? selectedFiles.length > 0 : selectedFolders.size > 0;
  const canUpload = hasFiles && form.name.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="space-y-4">
        {/* Workflow Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            工作流名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="例如: 代码审查助手"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            描述
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="描述这个工作流的功能和用途..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            可见性
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, visibility: 'private' }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors flex-1 ${
                form.visibility === 'private'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              {form.visibility === 'private' ? <Lock size={18} /> : <EyeOff size={18} />}
              <span>私有</span>
            </button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, visibility: 'public' }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors flex-1 ${
                form.visibility === 'public'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              {form.visibility === 'public' ? <Globe size={18} /> : <Eye size={18} />}
              <span>公开</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {form.visibility === 'private'
              ? '仅您自己可以看到此工作流'
              : '所有用户都可以在市场中发现并使用此工作流'}
          </p>
        </div>
      </div>

      {/* Upload Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUploadMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadMode === 'file'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
          }`}
        >
          <FileText size={18} />
          <span>文件</span>
        </button>
        <button
          onClick={() => setUploadMode('folder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadMode === 'folder'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
          }`}
        >
          <Folder size={18} />
          <span>文件夹</span>
        </button>
      </div>

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
          accept={uploadMode === 'file' ? '.md,.yaml,.yml' : undefined}
          {...(uploadMode === 'folder' ? { webkitdirectory: '', directory: '' } : {})}
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
              {uploadMode === 'file' ? '拖放文件到这里或点击上传' : '拖放文件夹到这里或点击选择'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {uploadMode === 'file'
                ? '支持 .md, .yaml, .yml 格式（最大 5MB/文件，总计 50MB）'
                : '支持选择多个文件夹（支持 .md, .yaml, .yml 格式）'}
            </p>
          </div>
        </label>
      </div>

      {/* Selected Files */}
      {uploadMode === 'file' && selectedFiles.length > 0 && (
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
            disabled={!canUpload || isUploading}
            className={`w-full py-2 px-4 font-medium rounded-lg transition-colors ${
              canUpload && !isUploading
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? '上传中...' : '上传并部署'}
          </button>
        </div>
      )}

      {/* Selected Folders */}
      {uploadMode === 'folder' && selectedFolders.size > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              已选择文件夹 ({selectedFolders.size})
            </h3>
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              清除
            </button>
          </div>
          <div className="space-y-2">
            {Array.from(selectedFolders.entries()).map(([folderName, files]) => (
              <div
                key={folderName}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {folderName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({files.length} 个文件)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFolder(folderName)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </button>
                </div>
                <div className="ml-8 space-y-1">
                  {files.slice(0, 5).map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <FileText className="w-3 h-3" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                  {files.length > 5 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      还有 {files.length - 5} 个文件...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={!canUpload || isUploading}
            className={`w-full py-2 px-4 font-medium rounded-lg transition-colors ${
              canUpload && !isUploading
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
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
          {/* Show form fields on success for workflow name and visibility */}
          {results.some(r => r.success) && form.name && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">已保存设置:</p>
              <div className="mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p><strong>名称:</strong> {form.name}</p>
                {form.description && <p><strong>描述:</strong> {form.description}</p>}
                <p><strong>可见性:</strong> {form.visibility === 'public' ? '公开' : '私有'}</p>
              </div>
            </div>
          )}
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
