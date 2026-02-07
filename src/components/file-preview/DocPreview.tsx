'use client';

import React, { useCallback } from 'react';
import { Download, X, FileText } from 'lucide-react';

interface DocPreviewProps {
  fileUrl: string;
  fileName?: string;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}

export default function DocPreview({
  fileUrl,
  fileName,
  onClose,
  onDownload,
  className = ''
}: DocPreviewProps) {
  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    } else {
      // Fallback: create a download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'document.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [fileUrl, fileName, onDownload]);

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {fileName || 'Document Preview'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Word 97-2003 Format</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              title="Close"
            >
              <X size={16} className="text-red-600 dark:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content - No Preview Available Message */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <FileText className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Preview Not Available
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Direct preview for legacy Word (.doc) files is not available in this version.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 mb-6 text-left">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              Why can't I preview .doc files?
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">
              Legacy .doc format is a proprietary Microsoft format that requires specialized
              conversion tools. We'll be adding support for this format in a future update.
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> Consider converting to .docx for better compatibility.
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download size={16} />
            Download File
          </button>
        </div>
      </div>
    </div>
  );
}
