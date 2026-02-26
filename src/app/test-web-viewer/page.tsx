'use client';

import React, { useState } from 'react';
import WebViewer from '@/components/web-viewer/WebViewer';
import { Globe, ExternalLink } from 'lucide-react';

export default function WebViewerTestPage() {
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [initialUrl, setInitialUrl] = useState<string>('');

  const sampleUrls = [
    {
      name: 'W3C HTML Specification',
      url: 'https://html.spec.whatwg.org/',
      description: 'Official HTML5 specification'
    },
    {
      name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/',
      description: 'Web development documentation'
    },
    {
      name: 'React Documentation',
      url: 'https://react.dev/',
      description: 'React official documentation'
    },
    {
      name: 'TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/',
      description: 'TypeScript programming guide'
    },
    {
      name: 'GitHub Homepage',
      url: 'https://github.com/',
      description: 'Code hosting platform'
    },
    {
      name: 'Next.js Documentation',
      url: 'https://nextjs.org/docs',
      description: 'React framework documentation'
    }
  ];

  const handleLoadUrl = (url: string) => {
    setInitialUrl(url);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setInitialUrl('');
  };

  if (showViewer) {
    return (
      <div className="h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900 p-6">
        <WebViewer
          initialUrl={initialUrl}
          onClose={handleCloseViewer}
          className="rounded-lg shadow-lg h-full"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Web Viewer Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Test the secure web viewer with iframe browsing, navigation controls, and scale adjustments.
            </p>

            {/* Custom URL Input */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Load Custom URL
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as typeof e.target & {
                    urlInput: { value: string };
                  };
                  if (target.urlInput.value) {
                    handleLoadUrl(target.urlInput.value);
                  }
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  name="urlInput"
                  placeholder="Enter HTTPS URL (e.g., https://example.com)"
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Globe size={18} />
                  Load URL
                </button>
              </form>
            </div>

            {/* Sample URLs */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Sample Websites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleUrls.map((site) => (
                  <button
                    key={site.url}
                    onClick={() => handleLoadUrl(site.url)}
                    className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {site.name}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {site.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {site.url}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  🧪 Test Instructions
                </h3>
                <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Load a custom URL or select a sample</li>
                  <li>• Test navigation (back/forward buttons)</li>
                  <li>• Test different scale options (50%-150%)</li>
                  <li>• Verify HTTPS-only enforcement</li>
                  <li>• Test refresh and new tab functionality</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                  🔒 Security Features
                </h3>
                <ul className="text-xs text-green-800 dark:text-green-300 space-y-1">
                  <li>• Only HTTPS URLs allowed</li>
                  <li>• Private network URLs blocked</li>
                  <li>• JavaScript: protocol blocked</li>
                  <li>• iframe sandbox for isolation</li>
                  <li>• No referrer policy for privacy</li>
                </ul>
              </div>
            </div>

            {/* Error Testing */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Error Handling Tests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleLoadUrl('http://example.com')}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:border-red-300 dark:hover:border-red-700 transition-all text-left"
                >
                  <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                    Insecure HTTP
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    Should be blocked
                  </p>
                </button>

                <button
                  onClick={() => handleLoadUrl('https://192.168.1.1')}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:border-red-300 dark:hover:border-red-700 transition-all text-left"
                >
                  <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                    Private IP
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    Should be blocked
                  </p>
                </button>

                <button
                  onClick={() => handleLoadUrl('javascript:alert(1)')}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:border-red-300 dark:hover:border-red-700 transition-all text-left"
                >
                  <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                    JavaScript Protocol
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    Should be blocked
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
