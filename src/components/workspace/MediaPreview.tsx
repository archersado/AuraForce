/**
 * Media Preview Component
 *
 * Displays images and presentation files in the Workspace editor.
 * Supports zoom, rotation, and basic viewing controls.
 */

'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, X } from 'lucide-react';
import { getFilePreviewUrl, formatFileSize, formatDate } from '@/lib/workspace/files-service';
import type { FileMetadata } from '@/lib/workspace/files-service';

interface MediaPreviewProps {
  path: string;
  metadata: FileMetadata;
  projectRoot?: string;
  onClose?: () => void;
}

export function MediaPreview({ path, metadata, projectRoot, onClose }: MediaPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = getFilePreviewUrl(path, projectRoot);

  // Determine file type
  const isPowerpoint = path.toLowerCase().endsWith('.pptx') ||
                       path.toLowerCase().endsWith('.ppt');
  const isImage = metadata.mimeType?.startsWith('image/');

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 400));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 25));
  const handleZoomReset = () => setZoom(100);
  const handleRotate = () => setRotation((rotation + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = metadata.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setLoading(false);
    setError('Failed to load image');
  };

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <div className="text-center p-8">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-sm text-gray-300 truncate" title={path}>
            {metadata.filename}
          </span>
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
            {metadata.mimeType}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="p-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-gray-300" />
            </button>
            <span className="w-16 text-center text-sm text-gray-300">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 400}
              className="p-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-gray-300" />
            </button>
            {zoom !== 100 && (
              <button
                onClick={handleZoomReset}
                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title="Reset zoom"
              >
                Reset
              </button>
            )}
          </div>

          {/* Rotation for images */}
          {isImage && (
            <button
              onClick={handleRotate}
              className={`p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors ${
                rotation !== 0 ? 'text-blue-400' : 'text-gray-300'
              }`}
              title="Rotate image"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4 text-gray-300" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors ml-2"
              title="Close preview"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>{formatFileSize(metadata.size)}</span>
          <span>•</span>
          <span>{formatDate(metadata.lastModified)}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading media...</p>
          </div>
        )}

        {!loading && isImage && (
          <div
            className="transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={previewUrl}
              alt={metadata.filename}
              className="max-w-full max-h-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))',
              }}
            />
          </div>
        )}

        {!loading && isPowerpoint && (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-24 h-24 mb-4 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.5 16.5c-1.5 1.5-1.5 4.243 0 5.756v-8.876c0-1.513 1.5-4.256 0-5.756l-1.5-1.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.5 7.5l4.5-4.5 9 9-9 9 9-9-4.5-4.5"
              />
            </svg>
            <p className="text-lg font-medium mb-2">PowerPoint Presentation</p>
            <p className="text-sm mb-4 text-center">
              Preview for PowerPoint files (.ppt, .pptx) is coming soon.
            </p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Download to View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
