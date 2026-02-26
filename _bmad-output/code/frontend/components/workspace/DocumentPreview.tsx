/**
 * Document Preview Component
 *
 * Implements STORY-14-5: File Preview - Document Preview
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut,
  Maximize, Minimize, File
} from 'lucide-react';

interface DocumentPreviewProps {
  src: string;
  type: 'pdf' | 'docx' | 'doc';
  className?: string;
  apiBasePath?: string;
}

export default function DocumentPreview({ src, type, className = '', apiBasePath }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<any>(null);

  // Build the full URL based on apiBasePath
  const fileUrl = apiBasePath ? `${apiBasePath}?path=${encodeURIComponent(src)}` : src;

  // Load PDF
  const loadPDF = useCallback(async () => {
    if (type !== 'pdf') return;

    try {
      const pdfjs = await import('react-pdf');
      const {.getDocument } = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      const loadingTask = getDocument(fileUrl);
      pdfRef.current = await loadingTask.promise;
      setTotalPages(pdfRef.current.numPages);
      renderPage(currentPage);
    } catch (error) {
      console.error('Failed to load PDF:', error);
    }
  }, [fileUrl, type, currentPage]);

  // Render page
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || !canvasRef.current) return;

    try {
      const page = await pdfRef.current.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // Calculate scale to fit container
      const containerWidth = canvas.parentElement?.clientWidth || 800;
      const viewport = page.getViewport({ scale: zoom });
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;
    } catch (error) {
      console.error('Failed to render page:', error);
    }
  }, [zoom]);

  // Initialize
  React.useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  // Re-render on zoom or page change
  React.useEffect(() => {
    if (type === 'pdf' && pdfRef.current) {
      renderPage(currentPage);
    }
  }, [zoom, currentPage, type, renderPage]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleDownload = useCallback(async () => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${type}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [fileUrl, type]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Document not supported case
  if (type !== 'pdf') {
    return (
      <div className={`h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 ${className}`}>
        <div className="text-center p-8">
          <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Preview Not Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {type.toUpperCase()} files cannot be previewed in the browser.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download {type.toUpperCase()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full flex flex-col bg-gray-100 dark:bg-gray-900 relative
        ${isFullscreen ? 'fixed inset-0 z-50' : ''}
        ${className}
      `}
    >
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages || '--'}
        </span>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-40"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-40"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />

          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm w-12 text-center text-gray-700 dark:text-gray-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />

          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          className="shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Page navigation bar */}
      {totalPages > 0 && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
