/**
 * File Rename Dialog Component
 *
 * Used for renaming files and directories.
 * Features:
 * - Name validation
 * - Preview of full path
 * - Character count
 * - Error handling
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, X, AlertCircle } from 'lucide-react';

export interface FileRenameDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => Promise<void>;
  currentName: string;
  currentPath: string;
}

export function FileRenameDialog({
  visible,
  onClose,
  onSubmit,
  currentName,
  currentPath,
}: FileRenameDialogProps) {
  const [newName, setNewName] = useState(currentName);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (visible) {
      setNewName(currentName);
      setErrors({});
      setIsSubmitting(false);

      // Focus input after a short delay
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [visible, currentName]);

  // Validate name
  const validateName = (name: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      newErrors.name = 'File name cannot be empty';
    }

    if (name.length > 255) {
      newErrors.name = 'File name must be 255 characters or less';
    }

    // Check for invalid characters
    const invalidChars = /[<>:"|?*\/]/;
    if (invalidChars.test(name)) {
      newErrors.name = 'File name contains invalid characters';
    }

    // Check for leading/trailing spaces
    if (name !== name.trim()) {
      newErrors.name = 'File name cannot start or end with spaces';
    }

    // Check for reserved names (Windows)
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    const nameWithoutExt = name.split('.')[0].toUpperCase();
    if (reservedNames.includes(nameWithoutExt)) {
      newErrors.name = `Cannot use reserved name: ${nameWithoutExt}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get file extension
  const getExtension = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot) : '';
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(newName)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(newName);
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to rename file';
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  const fileExtension = getExtension(currentName);
  const displayName = currentName.replace(fileExtension, '');
  const newDisplayName = newName.replace(fileExtension, '');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Rename</h2>
              <p className="text-sm text-gray-600">
                {currentPath}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* File Extension Display */}
            {fileExtension && (
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Name
                </label>
                <div className="relative inline-flex items-center gap-1 w-full">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewName(e.target.value + fileExtension)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        onClose();
                      }
                    }}
                    className={`flex-1 px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter new file name"
                    disabled={isSubmitting}
                    autoFocus
                  />
                  <span className="text-gray-500 bg-white border border-gray-300 rounded-lg px-3 py-3">
                    {fileExtension}
                  </span>
                  {errors.name && (
                    <div className="absolute -bottom-5 left-0 right-0 bg-red-50 text-red-600 text-xs px-2 py-1 rounded">
                      {errors.name}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {newName.length} / 255 characters
                </p>
              </div>
            )}

            {/* No Extension Case */}
            {!fileExtension && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Name
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      onClose();
                    }
                  }}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="Enter new file name"
                  disabled={isSubmitting}
                  autoFocus
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {newName.length} / 255 characters
                </p>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? 'Renaming...' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
