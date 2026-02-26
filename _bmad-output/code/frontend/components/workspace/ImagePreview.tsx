/**
 * Image Preview Component
 *
 * Implements STORY-14-4: File Preview - Image Display
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  ZoomIn, ZoomOut, RotateCw, Download, X,
  Maximize, Minimize
} from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  apiBasePath?: string;
}

export default function ImagePreview({ src, alt, className = '', apiBasePath }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Build the full URL based on apiBasePath
  const imageUrl = apiBasePath ? `${apiBasePath}?path=${encodeURIComponent(src)}` : src;

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(async () => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = alt || 'image.png';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [imageUrl, alt]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  return (
    <div
      className={`
        h-full flex flex-col bg-gray-900 relative
        ${isFullscreen ? 'fixed inset-0 z-50' : ''}
        ${className}
      `}
    >
      {/* Toolbar */}
      {!isFullscreen && (
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
          <span className="text-sm truncate flex-1">{alt}</span>
          <div className="flex items-center gap-2">
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              onClick={handleZoomOut}
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              onClick={handleZoomIn}
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-600 mx-2" />
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              onClick={handleRotate}
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              onClick={handleReset}
              title="Reset"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-600 mx-2" />
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Image Display */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">
        <div
          className="relative transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            onClick={toggleFullscreen}
          >
            <Minimize className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
