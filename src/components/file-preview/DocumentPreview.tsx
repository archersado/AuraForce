'use client';

import React from 'react';
import PdfPreview from './PdfPreview';
import DocxPreview from './DocxPreview';
import DocPreview from './DocPreview';
import { FileText, AlertCircle } from 'lucide-react';

export type FileType = 'pdf' | 'docx' | 'doc' | 'unknown';

export interface DocumentPreviewProps {
  fileUrl: string;
  fileName?: string;
  fileType?: FileType;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}

/**
 * Detect file type from file name or URL
 */
export function detectFileType(fileName: string): FileType {
  const nameLower = fileName.toLowerCase();

  if (nameLower.endsWith('.pdf')) {
    return 'pdf';
  } else if (nameLower.endsWith('.docx')) {
    return 'docx';
  } else if (nameLower.endsWith('.doc')) {
    return 'doc';
  }

  return 'unknown';
}

/**
 * Unified document preview component that routes to appropriate viewer based on file type
 */
export default function DocumentPreview({
  fileUrl,
  fileName,
  fileType,
  onClose,
  onDownload,
  className = ''
}: DocumentPreviewProps) {
  // Auto-detect file type if not provided
  const detectedType = fileType || (fileName ? detectFileType(fileName) : 'unknown');

  const handleDownload = React.useCallback(() => {
    if (onDownload) {
      onDownload();
    } else {
      // Fallback: create a download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [fileUrl, fileName, onDownload]);

  // Route to appropriate preview component
  switch (detectedType) {
    case 'pdf':
      return (
        <PdfPreview
          fileUrl={fileUrl}
          fileName={fileName}
          onClose={onClose}
          onDownload={handleDownload}
          className={className}
        />
      );

    case 'docx':
      return (
        <DocxPreview
          fileUrl={fileUrl}
          fileName={fileName}
          onClose={onClose}
          onDownload={handleDownload}
          className={className}
        />
      );

    case 'doc':
      return (
        <DocPreview
          fileUrl={fileUrl}
          fileName={fileName}
          onClose={onClose}
          onDownload={handleDownload}
          className={className}
        />
      );

    case 'unknown':
    default:
      return (
        <UnsupportedFormat
          fileName={fileName || 'Unknown File'}
          onClose={onClose}
          onDownload={handleDownload}
          className={className}
        />
      );
  }
}

/**
 * Component for unsupported file formats
 */
function UnsupportedFormat({
  fileName,
  onClose,
  onDownload,
  className = ''
}: {
  fileName: string;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{fileName}</h3>
        </div>
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

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Unsupported File Format
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This file type is not supported for preview. You can download it to view it in an
            appropriate application.
          </p>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 text-left">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Supported formats:
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• PDF (.pdf)</li>
              <li>• Word Document (.docx)</li>
              <li>• Legacy Word (.doc) - download only</li>
            </ul>
          </div>

          {onDownload && (
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <FileText size={16} />
              Download File
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
