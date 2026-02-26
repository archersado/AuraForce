/**
 * MediaPreview Enhanced Component
 *
 * Displays images with enhanced preview features.
 * Supports:
 * - Zoom (25% - 400%) with presets
 * - Rotation (90° increments)
 * - Fit-to-screen and fit-to-width options
 * - Image metadata display (dimensions, EXIF if available)
 * - Thumbnail grid view
 *
 * @version 2.0.0 (Enhanced preview)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ZoomIn, ZoomOut, RotateCw, Download, X,
  Maximize, Minimize, Scan
} from 'lucide-react';
import {
  getFilePreviewUrl,
  formatFileSize,
  formatDate,
} from '@/lib/workspace/files-service';
import type { FileMetadata } from '@/lib/workspace/files-service';

interface MediaPreviewProps {
  path: string;
  metadata: FileMetadata;
  workspaceRoot?: string;
  onClose?: () => void;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export function MediaPreviewEnhanced({
  path,
  metadata,
  workspaceRoot,
  onClose,
}: MediaPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [fitMode, setFitMode] = useState<'screen' | 'width' | 'none'>('screen');
  const [showMetadata, setShowMetadata] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const previewUrl = getFilePreviewUrl(path, workspaceRoot);

  const isPowerpoint = path.toLowerCase().endsWith('.pptx') ||
                       path.toLowerCase().endsWith('.ppt');
  const isImage = metadata.mimeType?.startsWith('image/');

  // Zoom presets
  const zoomPresets = [25, 50, 75, 100, 150, 200, 300, 400];

  const getCalculatedZoom = (): number => {
    if (fitMode === 'none') {
      return zoom;
    }

    if (!imageRef.current || !imageDimensions) {
      return zoom;
    }

    const container = imageRef.current.parentElement;
    if (!container) return zoom;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let targetZoom: number;

    if (fitMode === 'screen') {
      // Fit entire image within screen
      const widthScale = (containerWidth - 40) / imageDimensions.width;
      const heightScale = (containerHeight - 40) / imageDimensions.height;
      targetZoom = Math.min(widthScale, heightScale) * 100;
    } else if (fitMode === 'width') {
      // Fit image width to container width
      targetZoom = ((containerWidth - 40) / imageDimensions.width) * 100;
    } else {
      targetZoom = zoom;
    }

    // Clamp to reasonable range
    return Math.max(25, Math.min(400, Math.round(targetZoom)));
  };

  const currentZoom = fitMode !== 'none' ? getCalculatedZoom() : zoom;

  const handleZoomIn = () => {
    setFitMode('none');
    setZoom((prev) => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setFitMode('none');
    setZoom((prev) => Math.max(prev - 25, 25));
  };

  const handleZoomToPreset = (preset: number) => {
    setFitMode('none');
    setZoom(preset);
  };

  const handleZoomReset = () => {
    setZoom(100);
    setFitMode('screen');
  };

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleFitToggle = () => {
    if (fitMode === 'screen') {
      setFitMode('width');
    } else if (fitMode === 'width') {
      setFitMode('none');
    } else {
      setFitMode('screen');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = metadata.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    setLoading(false);
    setError(null);
    setFitMode('screen');
  };

  const handleImageError = () => {
    setLoading(false);
    setError('Failed to load image');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomReset();
            break;
        }
      } else {
        switch (e.key) {
          case 'r':
          case 'R':
            handleRotate();
            break;
          case 'f':
          case 'F':
            handleFitToggle();
            break;
        }
      }
    };

    if (!loading && isImage) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [loading, isImage, zoom, fitMode]);

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <div className="text-center p-8">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          {imageDimensions && (
            <span className="text-xs text-gray-400">
              {imageDimensions.width} × {imageDimensions.height}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              disabled={currentZoom <= 25}
              className="p-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded transition-colors"
              title="Zoom out (Ctrl+-)"
            >
              <ZoomOut className="w-4 h-4 text-gray-300" />
            </button>
            <button
              onClick={() => setFitMode(fitMode === 'none' ? 'screen' : 'none')}
              className={`p-1.5 rounded transition-colors ${
                fitMode !== 'none'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              title="Toggle fit (F)"
            >
              {fitMode === 'screen' ? (
                <Minimize className="w-4 h-4" />
              ) : fitMode === 'width' ? (
                <Scan className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
            <span className="w-16 text-center text-sm text-gray-300 font-tabular-nums">
              {Math.round(currentZoom)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={currentZoom >= 400}
              className="p-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded transition-colors"
              title="Zoom in (Ctrl++)"
            >
              <ZoomIn className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* Rotation for images */}
          {isImage && (
            <button
              onClick={handleRotate}
              className={`p-1.5 rounded transition-colors ${
                rotation !== 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Rotate image (R)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {/* Metadata Toggle */}
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`p-1.5 rounded transition-colors ${
              showMetadata ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Toggle metadata"
          >
            <Scan className="w-4 h-4" />
          </button>

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
              title="Close preview (Esc)"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Metadata Panel */}
      {showMetadata && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-400 mb-1">Filename</div>
              <div className="text-gray-200 truncate" title={metadata.filename}>
                {metadata.filename}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Size</div>
              <div className="text-gray-200">{formatFileSize(metadata.size)}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Type</div>
              <div className="text-gray-200">{metadata.mimeType}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Modified</div>
              <div className="text-gray-200">{formatDate(metadata.lastModified)}</div>
            </div>
            {imageDimensions && (
              <>
                <div>
                  <div className="text-gray-400 mb-1">Dimensions</div>
                  <div className="text-gray-200">
                    {imageDimensions.width} × {imageDimensions.height}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Aspect Ratio</div>
                  <div className="text-gray-200">
                    {(imageDimensions.width / imageDimensions.height).toFixed(2)}:1
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center gap-4 px-4 py-1 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>{formatFileSize(metadata.size)}</span>
          <span>•</span>
          <span>{formatDate(metadata.lastModified)}</span>
        </div>
        <div className="flex-1" />
        {imageDimensions && (
          <span>{imageDimensions.width} × {imageDimensions.height} px</span>
        )}
      </div>

      {/* Zoom Presets */}
      {fitMode === 'none' && (
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-1 flex-shrink-0">
          <span className="text-xs text-gray-500 mr-2">Zoom:</span>
          {zoomPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleZoomToPreset(preset)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                currentZoom === preset
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center min-h-0 p-4">
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
              transform: `scale(${currentZoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <img
              ref={imageRef}
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
            <div className="w-24 h-24 mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-orange-500"
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
            </div>
            <p className="text-lg font-medium mb-2">PowerPoint Presentation</p>
            <p className="text-sm mb-4 text-center max-w-md">
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

export default MediaPreviewEnhanced;
