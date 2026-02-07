'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, ExternalLink, Globe, AlertCircle, Loader2, X } from 'lucide-react';

interface WebViewHistoryItem {
  url: string;
  timestamp: number;
}

interface WebViewerProps {
  initialUrl?: string;
  onClose?: () => void;
  className?: string;
}

export default function WebViewer({ initialUrl = '', onClose, className = '' }: WebViewerProps) {
  const [url, setUrl] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(100); // percentage
  const [history, setHistory] = useState<WebViewHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const SCALES = [50, 75, 100, 120, 150];

  /**
   * Validate URL - only allow HTTPS URLs
   */
  const validateUrl = useCallback((inputUrl: string): { valid: boolean; normalizedUrl: string; error?: string } => {
    if (!inputUrl.trim()) {
      return { valid: false, normalizedUrl: '', error: 'URL is required' };
    }

    let normalizedUrl = inputUrl.trim();

    // Add protocol if missing
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Only allow HTTPS
    if (!normalizedUrl.startsWith('https://')) {
      return { valid: false, normalizedUrl, error: 'Only HTTPS URLs are allowed for security' };
    }

    // Block localhost and private networks
    if (
      normalizedUrl.includes('localhost') ||
      normalizedUrl.includes('127.0.0.1') ||
      normalizedUrl.match(/^https:\/\/(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/)
    ) {
      return { valid: false, normalizedUrl, error: 'Private network URLs are not allowed' };
    }

    // Block javascript and data protocols
    if (normalizedUrl.toLowerCase().startsWith('javascript:') || normalizedUrl.toLowerCase().startsWith('data:')) {
      return { valid: false, normalizedUrl, error: 'Unsafe URL protocol detected' };
    }

    try {
      new URL(normalizedUrl);
      return { valid: true, normalizedUrl };
    } catch {
      return { valid: false, normalizedUrl, error: 'Invalid URL format' };
    }
  }, []);

  /**
   * Load a URL
   */
  const loadUrl = useCallback(
    (inputUrl: string) => {
      const validation = validateUrl(inputUrl);

      if (!validation.valid) {
        setError(validation.error || 'Invalid URL');
        return;
      }

      setError(null);
      setIsLoading(true);

      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({
        url: validation.normalizedUrl,
        timestamp: Date.now()
      });

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setUrl(validation.normalizedUrl);
      setCurrentUrl(validation.normalizedUrl);
    },
    [history, historyIndex, validateUrl]
  );

  /**
   * Handle URL input
   */
  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      loadUrl(url);
    },
    [url, loadUrl]
  );

  /**
   * Navigate back in history
   */
  const handleBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevUrl = history[newIndex].url;
      setUrl(prevUrl);
      setCurrentUrl(prevUrl);
    }
  }, [history, historyIndex]);

  /**
   * Navigate forward in history
   */
  const handleForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex].url;
      setUrl(nextUrl);
      setCurrentUrl(nextUrl);
    }
  }, [history, historyIndex]);

  /**
   * Refresh current page
   */
  const handleRefresh = useCallback(() => {
    if (currentUrl) {
      setIsLoading(true);
      // Force iframe reload
      if (iframeRef.current) {
        iframeRef.current.src = currentUrl;
      }
    }
  }, [currentUrl]);

  /**
   * Handle iframe load
   */
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  /**
   * Handle iframe error
   */
  const handleIframeError = useCallback(() => {
    setError('Failed to load the page. The site may be blocked or unavailable.');
    setIsLoading(false);
  }, []);

  /**
   * Change scale
   */
  const changeScale = useCallback((newScale: number) => {
    setScale(newScale);
  }, []);

  /**
   * Open URL in new tab
   */
  const openInNewTab = useCallback(() => {
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  }, [currentUrl]);

  // Load initial URL if provided
  useEffect(() => {
    if (initialUrl) {
      loadUrl(initialUrl);
    }
  }, [initialUrl, loadUrl]);

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* Logo/Icon */}
        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />

        {/* URL Input */}
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g., https://example.com)"
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </form>

        {/* Go Button */}
        <button
          onClick={() => loadUrl(url)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
        >
          Go
        </button>

        {/* Open in New Tab */}
        {currentUrl && (
          <button
            onClick={openInNewTab}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            title="Open in new tab"
          >
            <ExternalLink size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
            title="Close"
          >
            <X size={18} className="text-red-600 dark:text-red-400" />
          </button>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {/* Back */}
        <button
          onClick={handleBack}
          disabled={historyIndex <= 0}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          title="Back"
        >
          <ChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* Forward */}
        <button
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          title="Forward"
        >
          <ChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={!currentUrl}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          title="Refresh"
        >
          <RotateCw size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2 flex-shrink-0" />

        {/* Scale Selector */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {SCALES.map((s) => (
            <button
              key={s}
              onClick={() => changeScale(s)}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                scale === s
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
        {error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 max-w-md mx-auto">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400 mb-3" />
            <h3 className="text-lg font-medium text-red-900 dark:text-red-200 mb-2">
              Error Loading Page
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
            {currentUrl && (
              <button
                onClick={openInNewTab}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <ExternalLink size={16} />
                Open in New Tab
              </button>
            )}
          </div>
        ) : !currentUrl ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <Globe className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Ready to Browse
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter a URL above to load a webpage. Only HTTPS URLs are allowed for security.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={currentUrl}
              title="Web Viewer"
              className="border-0 rounded-lg shadow-lg bg-white dark:bg-gray-900 transition-all duration-300"
              style={{
                width: `${scale}%`,
                height: '100%',
                maxHeight: '100%'
              }}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      {currentUrl && !error && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Viewing: {currentUrl} • Scale: {scale}%
          </p>
        </div>
      )}
    </div>
  );
}
