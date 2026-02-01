/**
 * Resizable Split Pane Component
 *
 * Provides draggable resize handle for adjusting panel sizes.
 * Features:
 * - Horizontal/Vertical split
- Min/max size constraints
- Touch support
- Smooth resize animation
- Persistence
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical, GripHorizontal, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

type Direction = 'horizontal' | 'vertical';

interface ResizablePaneProps {
  children: [React.ReactNode, React.ReactNode];
  direction?: Direction;
  minSize?: number;
  maxSize?: number;
  initialSize?: number;
  className?: string;
  onResize?: (size: number) => void;
  showControls?: boolean;
  id?: string;
}

export function ResizablePane({
  children: [left, right],
  direction = 'vertical',
  minSize = 100,
  maxSize = Infinity,
  initialSize,
  className = '',
  onResize,
  showControls = true,
  id = 'default',
}: ResizablePaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startPosRef = useRef(0);
  const startSizeRef = useRef(0);

  // Load saved size from localStorage
  const [firstPaneSize, setFirstPaneSize] = useState<number>(() => {
    if (typeof initialSize === 'number') {
      return initialSize;
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`workspace:pane-size-${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if saved within last 7 days
        if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return parsed.size;
        }
      }
    }

    // Default to 50%
    return 50;
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      isResizingRef.current = true;

      if (direction === 'horizontal') {
        startPosRef.current = e.clientX;
        startSizeRef.current = firstPaneSize;
      } else {
        startPosRef.current = e.clientY;
        startSizeRef.current = firstPaneSize;
      }

      // Add global cursor styles
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    },
    [direction, firstPaneSize]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        const containerWidth = containerRect.width;
        const delta = e.clientX - startPosRef.current;
        newSize = startSizeRef.current + (delta / containerWidth) * 100;
      } else {
        const containerHeight = containerRect.height;
        const delta = e.clientY - startPosRef.current;
        newSize = startSizeRef.current + (delta / containerHeight) * 100;
      }

      // Constrain size
      newSize = Math.max(minSize, Math.min(maxSize, newSize));

      setFirstPaneSize(newSize);

      if (onResize) {
        onResize(newSize);
      }
    };

    const handleMouseUp = () => {
      if (!isResizingRef.current) return;

      isResizingRef.current = false;

      // Reset cursor styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Save size to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `workspace:pane-size-${id}`,
          JSON.stringify({
            size: firstPaneSize,
            timestamp: Date.now(),
          })
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [direction, minSize, maxSize, onResize, id, firstPaneSize]);

  // Touch support
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizingRef.current) return;

      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const touch = e.touches[0];
      let newSize: number;

      if (direction === 'horizontal') {
        const containerWidth = containerRect.width;
        const delta = touch.clientX - startPosRef.current;
        newSize = startSizeRef.current + (delta / containerWidth) * 100;
      } else {
        const containerHeight = containerRect.height;
        const delta = touch.clientY - startPosRef.current;
        newSize = startSizeRef.current + (delta / containerHeight) * 100;
      }

      // Constrain size
      newSize = Math.max(minSize, Math.min(maxSize, newSize));

      setFirstPaneSize(newSize);

      if (onResize) {
        onResize(newSize);
      }
    };

    const handleTouchEnd = () => {
      if (!isResizingRef.current) return;

      isResizingRef.current = false;

      // Save size to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `workspace:pane-size-${id}`,
          JSON.stringify({
            size: firstPaneSize,
            timestamp: Date.now(),
          })
        );
      }
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [direction, minSize, maxSize, onResize, id, firstPaneSize]);

  // Reset to 50% (default)
  const handleReset = () => {
    setFirstPaneSize(50);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`workspace:pane-size-${id}`);
    }

    if (onResize) {
      onResize(50);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${direction === 'horizontal' ? 'flex-col' : 'flex-row'} h-full ${className}`}
    >
      {/* First pane */}
      <div
        className="overflow-hidden"
        style={{
          flex: `${firstPaneSize} 1 0`,
          minHeight: minSize,
          maxHeight: maxSize,
        }}
      >
        {left}
      </div>

      {/* Resize handle */}
      <div
        className={`
          relative
          flex-shrink-0
          ${direction === 'horizontal' ? 'h-2 w-full cursor-y-resize' : 'w-2 h-full cursor-x-resize'}
          group
          hover:bg-purple-500
          transition-colors duration-200
          dark:hover:bg-purple-600
        `}
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          e.preventDefault();

          const touch = e.touches[0];
          startPosRef.current = direction === 'horizontal' ? touch.clientY : touch.clientX;
          startSizeRef.current = firstPaneSize;
          isResizingRef.current = true;
        }}
      >
        {/* Grip icon */}
        <div
          className={`
            absolute
            flex items-center justify-center
            ${direction === 'horizontal' ? 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'}
            opacity-0 group-hover:opacity-100 transition-opacity
          `}
        >
          {direction === 'horizontal' ? (
            <GripHorizontal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <GripVertical className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          )}
        </div>

        {/* Size label (on hover) */}
        {showControls && (
          <div
            className={`
              absolute
              bg-black/75 dark:bg-white/75
              text-white dark:text-gray-900
              text-xs
              px-2 py-1
              rounded
              opacity-0 group-hover:opacity-100
              transition-opacity
              whitespace-nowrap
              font-mono
              ${direction === 'horizontal' ? 'bottom-6 left-1/2 -translate-x-1/2' : 'right-6 top-1/2 -translate-y-1/2'}
            `}
          >
            {Math.round(firstPaneSize)}%
          </div>
        )}
      </div>

      {/* Second pane */}
      <div
        className="overflow-hidden"
        style={{
          flex: `${100 - firstPaneSize} 1 0`,
        }}
      >
        {right}
      </div>

      {/* Controls */}
      {showControls && (
        <button
          onClick={handleReset}
          className={`
            absolute
            p-2
            bg-white dark:bg-gray-800
            rounded-lg shadow-lg
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors
            ${direction === 'horizontal' ? 'bottom-4 right-4' : 'right-4 top-4'}
          `}
          title="Reset to 50%"
        >
          <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      )}
    </div>
  );
}

// Wrapper for three-pane resizable layout
interface ThreePaneResizableProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  initialLeftSize?: number;
  initialRightSize?: number;
  onLeftResize?: (size: number) => void;
  onRightResize?: (size: number) => void;
  minPaneSize?: number;
  className?: string;
}

export function ThreePaneResizable({
  left,
  center,
  right,
  initialLeftSize,
  initialRightSize,
  onLeftResize,
  onRightResize,
  minPaneSize = 100,
  className = '',
}: ThreePaneResizableProps) {
  return (
    <ResizablePane
      id="three-pane-left"
      direction="horizontal"
      initialSize={initialLeftSize}
      minSize={minPaneSize}
      maxSize={60}
      onResize={onLeftResize}
      className={className}
    >
      {/* Left pane */}
      <div className="h-full">
        {left}
      </div>

      {/* Right pane: contains center and right */}
      <ResizablePane
        id="three-pane-right"
        direction="horizontal"
        initialSize={initialRightSize}
        minSize={minPaneSize}
        maxSize={80}
        onResize={onRightResize}
      >
        {/* Center pane */}
        <div className="h-full">
          {center}
        </div>

        {/* Right pane */}
        <div className="h-full">
          {right}
        </div>
      </ResizablePane>
    </ResizablePane>
  );
}

// Resizable panel with maximize/minimize
interface ResizablePanelProps {
  children: React.ReactNode;
  title?: string;
  isMaximized: boolean;
  onMaximizeToggle?: () => void;
  canMaximize?: boolean;
  className?: string;
}

export function ResizablePanel({
  children,
  title,
  isMaximized,
  onMaximizeToggle,
  canMaximize = true,
  className = '',
}: ResizablePanelProps) {
  return (
    <div
      className={`
        flex flex-col h-full
        ${isMaximized ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}
        ${className}
      `}
    >
      {/* Header with maximize button */}
      {(title || canMaximize) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title}
            </span>
          )}
          {canMaximize && onMaximizeToggle && (
            <button
              onClick={onMaximizeToggle}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default ResizablePane;
