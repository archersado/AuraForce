'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X, Loader2 } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPreviewProps {
  fileUrl: string;
  fileName?: string;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}

export default function PdfPreview({ fileUrl, fileName, onClose, onDownload, className = '' }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDocumentLoadSuccess = useCallback(({ numPages: loadedNumPages }: { numPages: number }) => {
    setNumPages(loadedNumPages);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleDocumentLoadError = useCallback((err: Error) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF. Please try again or download the file.');
    setIsLoading(false);
  }, []);

  const changePage = useCallback((offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  }, [pageNumber, numPages]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleError = useCallback((e: unknown) => {
    console.error('PDF rendering error:', e);
    setError('An error occurred while rendering the PDF. Please try again.');
  }, []);

  // Reset state when file changes
  useEffect(() => {
    setPageNumber(1);
    setScale(1.0);
    setIsLoading(true);
    setError(null);
  }, [fileUrl]);

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {fileName || 'Document Preview'}
          </h3>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} className="text-gray-700 dark:text-gray-300" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 3.0}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} className="text-gray-700 dark:text-gray-300" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

          {/* Page Navigation */}
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : 'Loading...'}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

          {/* Download */}
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Download"
            >
              <Download size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}

          {/* Close */}
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
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 p-4 flex items-center justify-center">
        {error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <X className="mx-auto h-12 w-12 text-red-600 dark:text-red-400 mb-3" />
            <h3 className="text-lg font-medium text-red-900 dark:text-red-200 mb-2">
              Preview Error
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
            {onDownload && (
              <button
                onClick={onDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={16} />
                Download File
              </button>
            )}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading PDF...</p>
          </div>
        ) : (
          <div className="pdf-content-wrapper" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            <Document
              file={fileUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              onError={handleError}
              className="shadow-lg"
              loading={<div className="text-center p-8">Loading document...</div>}
              error={<div className="text-center text-red-500 p-8">Failed to load document</div>}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-white dark:bg-gray-900"
                width={800}
              />
            </Document>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!error && !isLoading && numPages > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use arrow keys to navigate pages. Use +/- keys to zoom.
          </p>
        </div>
      )}
    </div>
  );
}
