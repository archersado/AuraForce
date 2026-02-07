'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Download, X, Loader2, FileText } from 'lucide-react';
import mammoth from 'mammoth';

interface DocxPreviewProps {
  fileUrl: string;
  fileName?: string;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}

export default function DocxPreview({
  fileUrl,
  fileName,
  onClose,
  onDownload,
  className = ''
}: DocxPreviewProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocxFile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setContent('');

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Title'] => h1.title:fresh",
            "p[style-name='Subtitle'] => p.subtitle:fresh"
          ]
        }
      );

      setContent(result.value);

      if (result.messages && result.messages.length > 0) {
        console.warn('Mammoth conversion messages:', result.messages);
      }
    } catch (err) {
      console.error('DOCX load error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load DOCX file. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [fileUrl]);

  useEffect(() => {
    loadDocxFile();
  }, [loadDocxFile]);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    } else {
      // Fallback: create a download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'document.docx';
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
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {fileName || 'Document Preview'}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            title="Download"
          >
            <Download size={14} />
            <span>Download</span>
          </button>

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

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 p-6">
        {error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 max-w-md mx-auto mt-8">
            <X className="mx-auto h-12 w-12 text-red-600 dark:text-red-400 mb-3" />
            <h3 className="text-lg font-medium text-red-900 dark:text-red-200 mb-2">
              Preview Error
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download size={16} />
              Download File
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading document...</p>
          </div>
        ) : content ? (
          <div className="max-w-4xl mx-auto">
            <div
              className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto mt-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Empty Document
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This document appears to be empty or could not be converted to HTML.
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download size={16} />
              Download File
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!error && !isLoading && content && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Document converted to HTML. Some formatting may differ. Download to view the original file.
          </p>
        </div>
      )}
    </div>
  );
}
