'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X, Loader2 } from 'lucide-react';

// Try to import react-pdf with error handling
const usePdfComponents = () => {
  const [components, setComponents] = useState<(typeof import('react-pdf')) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPdfComponents = async () => {
      try {
        // Check if running on client side
        if (typeof window === 'undefined') {
          return;
        }

        // Dynamically import react-pdf
        const pdfModule = await import('react-pdf');

        // Set up PDF.js worker if not already set
        try {
          const pdfjs = await import('pdfjs-dist');
          const pdfjsLib = pdfjs.default || pdfjs;
          if (pdfjsLib && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
            const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
          }
        } catch (workerError) {
          console.warn('Could not set up PDF.js worker:', workerError);
        }

        if (isMounted) {
          setComponents(pdfModule);
        }
      } catch (err) {
        if (isMounted) {
          const errMsg = err instanceof Error ? err.message : 'Failed to load PDF viewer';
          setError(errMsg);
          console.error('Failed to load react-pdf:', err);
        }
      }
    };

    loadPdfComponents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically create Document and Page components
  const Document = (props: any) => {
    if (!components?.Document) return null;
    const DocumentComponent = components.Document;
    return React.createElement(DocumentComponent, props);
  };

  const Page = (props: any) => {
    if (!components?.Page) return null;
    const PageComponent = components.Page;
    return React.createElement(PageComponent, props);
  };

  return { Document, Page, isLoading: !components && !error, error };
};

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
  const [renderError, setRenderError] = useState<string | null>(null);

  const { Document, Page, isLoading: isLibraryLoading, error: libraryError } = usePdfComponents();

  // Fallback: show download-only view if PDF library fails to load
  if (libraryError || !Document || !Page) {
    return (
      <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {fileName || 'Document Preview'}
          </h3>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Download"
              >
                <Download size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
            )}
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
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 p-6 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Download className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              PDF Preview Unavailable
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {libraryError || 'For security reasons, PDF preview requires specific browser settings. Please download the file to view it.'}
            </p>
            {onDownload && (
              <button
                onClick={onDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={16} />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleDocumentLoadSuccess = useCallback(({ numPages: loadedNumPages }: { numPages: number }) => {
    setNumPages(loadedNumPages);
    setIsLoading(false);
    setRenderError(null);
  }, []);

  const handleDocumentLoadError = useCallback((err: Error) => {
    console.error('PDF load error:', err);
    setRenderError('Failed to load PDF. Please try again or download the file.');
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
    setRenderError('An error occurred while rendering the PDF. Please try again.');
  }, []);

  // Reset state when file changes
  useEffect(() => {
    setPageNumber(1);
    setScale(1.0);
    setIsLoading(true);
    setRenderError(null);
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
        {renderError ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <X className="mx-auto h-12 w-12 text-red-600 dark:text-red-400 mb-3" />
            <h3 className="text-lg font-medium text-red-900 dark:text-red-200 mb-2">
              Preview Error
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{renderError}</p>
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
        ) : isLoading || isLibraryLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLibraryLoading ? 'Loading PDF viewer...' : 'Loading PDF...'}
            </p>
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
      {!renderError && !isLoading && !isLibraryLoading && numPages > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use arrow keys to navigate pages. Use +/- keys to zoom.
          </p>
        </div>
      )}
    </div>
  );
}
