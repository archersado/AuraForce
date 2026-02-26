/**
 * PPT Preview Component
 *
 * Implements STORY-14-5: PPT File Preview with Slide Mode
 * Supports .pptx format with full slideshow functionality
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Download, Maximize, Minimize,
  Play, Pause, Presentation,
  AlertCircle, Loader2
} from 'lucide-react';
import {
  parsePPTX,
  isValidPPTX,
  generateSlideThumbnail,
  revokeObjectURLs,
  type PPTXSlide,
  type PPTXParseResult,
} from '@/lib/workspace/pptx-parser';

interface PPTPreviewProps {
  src: string;
  className?: string;
  onLoad?: (result: PPTXParseResult) => void;
  apiBasePath?: string;
}

export default function PPTPreview({ src, className = '', onLoad, apiBasePath = '/auraforce/api/workspace/files/download' }: PPTPreviewProps) {
  const [slides, setSlides] = useState<PPTXSlide[]>([]);
  const [totalSlides, setTotalSlides] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presentationTitle, setPresentationTitle] = useState('Presentation');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slidesRef = useRef<PPTXSlide[]>([]); // Keep a reference for cleanup

  // Load PPTX file on mount
  useEffect(() => {
    loadPPTX();

    return () => {
      // Clean up object URLs on unmount
      if (slidesRef.current.length > 0) {
        revokeObjectURLs(slidesRef.current);
      }
    };
  }, [src, apiBasePath]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && totalSlides > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 3000); // 3 seconds per slide
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalSlides]);

  const loadPPTX = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build the full URL for the file download API
      const fileUrl = `${apiBasePath}?path=${encodeURIComponent(src)}`;
      const result = await parsePPTX(fileUrl);

      if (result.hasError) {
        setError(result.error || 'Failed to parse PPTX file');
        setSlides([]);
        setTotalSlides(0);
      } else {
        // Update slides with thumbnail colors
        const slidesWithThumbnails = result.slides.map((slide) => ({
          ...slide,
          thumbnail: slide.thumbnail || generateSlideThumbnail(slide.number),
        }));

        setSlides(slidesWithThumbnails);
        slidesRef.current = slidesWithThumbnails; // Keep reference for cleanup
        setTotalSlides(result.totalSlides);
        setCurrentSlide(0);
        setPresentationTitle(result.title);

        // Notify parent component
        if (onLoad) {
          onLoad(result);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load presentation';
      setError(errorMessage);
      setSlides([]);
      setTotalSlides(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
    if (isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      // Build the full URL for the file download API
      const fileUrl = `${apiBasePath}?path=${encodeURIComponent(src)}`;
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Try to get filename from src path
      const urlParts = src.split('/');
      const filename = urlParts[urlParts.length - 1] || 'presentation.pptx';
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  }, [src, apiBasePath]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
        case ' ': // Space
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          if (isPlaying) {
            setIsPlaying(false);
          }
          break;
        case 'Home':
          setCurrentSlide(0);
          break;
        case 'End':
          setCurrentSlide(totalSlides - 1);
          break;
      }
    },
    [handlePrevious, handleNext, isFullscreen, toggleFullscreen, isPlaying, totalSlides]
  );

  const currentSlideData = slides[currentSlide];

  // Loading state
  if (isLoading) {
    return (
      <div className={`h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 ${className}`}>
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading presentation...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 ${className}`}>
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Failed to Load Presentation
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md text-center">
          {error}
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    );
  }

  // Empty state (no slides)
  if (slides.length === 0) {
    return (
      <div className={`h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 ${className}`}>
        <Presentation className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Slides Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This presentation file appears to be empty or invalid.
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full flex flex-col bg-gray-900 relative
        ${isFullscreen ? 'fixed inset-0 z-50' : ''}
        ${className}
      `}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Toolbar */}
      {!isFullscreen && (
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-4">
            <Presentation className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium">{presentationTitle}</div>
              <div className="text-xs text-gray-400">
                Slide {currentSlide + 1} of {totalSlides}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              onClick={handlePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="w-px h-4 bg-gray-600 mx-2" />
            <button
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              onClick={handlePrevious}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-600 mx-2" />
            <button
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              onClick={handleDownload}
              title="Download"
              aria-label="Download presentation"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              onClick={toggleFullscreen}
              title="Fullscreen"
              aria-label="Toggle fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slide Display */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden max-w-full"
          style={{
            aspectRatio: '16/9',
            maxWidth: '90%',
            maxHeight: '90%',
          }}
        >
          {/* Background color based on thumbnail */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: currentSlideData?.thumbnail }}
          />

          {/* Slide content */}
          {currentSlideData && (
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
              {/* Display images if available */}
              {currentSlideData.hasImages && currentSlideData.images.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  {currentSlideData.images.map((imageUrl, idx) => (
                    <img
                      key={idx}
                      src={imageUrl}
                      alt={`Slide ${currentSlideData.number} image ${idx + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  ))}
                </div>
              ) : (
                // Display text content if no images
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 text-gray-800">
                    {currentSlideData.title}
                  </h2>
                  {currentSlideData.content && (
                    <p className="text-xl text-gray-600 whitespace-pre-line">
                      {currentSlideData.content}
                    </p>
                  )}
                </div>
              )}

              {/* Slide number indicator */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white rounded text-sm">
                {currentSlide + 1} / {totalSlides}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div className="bg-gray-800 p-3 border-t border-gray-700">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleSlideClick(index)}
                className={`
                  flex-shrink-0 w-20 h-12 rounded border-2 transition-all overflow-hidden
                  ${
                    index === currentSlide
                      ? 'border-blue-500 scale-105 shadow-lg'
                      : 'border-gray-600 opacity-60 hover:opacity-100 hover:border-gray-400'
                  }
                `}
                title={slide.title || `Slide ${slide.number}`}
                aria-label={`Go to slide ${slide.number}`}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: slide.thumbnail }}
                >
                  {slide.number}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen close button */}
      {isFullscreen && (
        <button
          className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors shadow-lg"
          onClick={toggleFullscreen}
          aria-label="Exit fullscreen"
        >
          <Minimize className="w-5 h-5" />
        </button>
      )}

      {/* Slide progression indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-16 left-0 right-0 px-6 pointer-events-none">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${totalSlides > 0 ? ((currentSlide + 1) / totalSlides) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {!isFullscreen && (
        <div className="absolute top-20 left-4 px-3 py-2 bg-black/50 text-white rounded text-xs backdrop-blur-sm pointer-events-none">
          ← → navigation • Space next • Esc fullscreen
        </div>
      )}
    </div>
  );
}
