/**
 * Create Folder Dialog Component
 *
 * Provides UI for creating new folders.
 * Features:
 * - Name validation
 * - Current path display
 * - Duplicate prevention
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, FolderPlus, AlertCircle } from 'lucide-react';

export interface CreateFolderDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  parentPath?: string;
}

export function CreateFolderDialog({
  visible,
  onClose,
  onSubmit,
  parentPath = '/',
}: CreateFolderProps) {
  const [folderName, setFolderName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (visible) {
      setFolderName('');
      setErrors({});
      setIsSubmitting(false);
      
      // Focus input after a short delay
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [visible, parentPath]);

  // Validate folder name
  const validateFolderName = (name: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      newErrors.name = 'Folder name cannot be empty';
    }

    if (name.length > 255) {
      newErrors.name = 'Folder name must be 255 characters or less';
    }

    // Check for invalid characters
    const invalidChars = /[<>:"|?*\/\\]/
    if (invalidChars.test(name)) {
      newErrors.name = 'Folder name contains invalid characters';
    }

    // Check for leading/trailing spaces
    if (name !== name.trim()) {
      newErrors.name = 'Name cannot start or end with spaces';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFolderName(folderName)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const trimmedName = folderName.trim();

      await onSubmit(trimmedName);
      
      setFolderName('');
      setErrors({});
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create folder' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">创建新文件夹</h2>
              <p className="text-sm text-gray-600">
                位置: {parentPath}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文件夹名称
              </label>
              <input
                ref={inputRef}
                type="text"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  // Clear errors when user types
                  if (errors.submit || errors.name) {
                    setErrors({ ...errors, submit: '', name: '' });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onClose();
                  }
                }}
                className={`w-full px-4 py-3 bg-white border ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                } rounded-lg focus:outline-none`}
                placeholder="输入文件夹名称..."
                disabled={isSubmitting}
                maxLength={255}
              />
              {errors.name && (
                <div className="mt-1 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.name}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {folderName.length} / 255 characters
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
              <p className="mb-1">💡 提示:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>文件夹名称不能包含: <code> &lt; &gt; : " / \ ? * </code></li>
                <li>首尾不能有空格</li>
                <li>最多 255 个字符</li>
                <li>区分大小写</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? '创建中...' : '创建'}
            </button>
          </div>
        </form>

        {/* Submit Error */}
        {errors.submit && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {errors.submit}
          </div>
        )}
      </div>
    </div>
  );
}
