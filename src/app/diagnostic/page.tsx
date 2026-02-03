'use client';

import { useState, useEffect } from 'react';
import { readFile, listDirectory } from '@/lib/workspace/files-service';

/**
 * Diagnostic Tool for File Loading Issues
 *
 * This component helps diagnose why files don't load in the editor.
 */

interface DiagnosticResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function DiagnosticTool() {
  const [workspaceRoot, setWorkspaceRoot] = useState('');
  const [testPath, setTestPath] = useState('');
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Auto-detect a test path
    const detectPath = async () => {
      try {
        // Try to list current directory
        const listing = await listDirectory('/', process.cwd());
        if (listing.files.length > 0) {
          const firstTextFile = listing.files.find(f => f.type === 'file' && f.name.endsWith('.md') || f.name.endsWith('.ts') || f.name.endsWith('.js'));
          if (firstTextFile) {
            setTestPath(firstTextFile.path);
          } else if (listing.files.length > 0) {
            setTestPath(listing.files[0].path);
          }
        }
      } catch (e) {
        console.error('Failed to auto-detect path:', e);
      }
    };

    detectPath();
  }, []);

  const addResult = (step: string, status: 'success' | 'error', message: string, details?: any) => {
    setResults(prev => [...prev, { step, status, message, details }]);
  };

  const runDiagnostic = async () => {
    if (!testPath) {
      alert('Please enter a test path');
      return;
    }

    setIsRunning(true);
    setResults([]);
    addResult('Start', 'success', 'Starting diagnostic');

    try {
      // Step 1: List directory
      addResult('Listing Directory', 'pending', 'Attempting to list root directory');
      const listing = await listDirectory('/', workspaceRoot || undefined);
      addResult('Listing Directory', 'success', `Found ${listing.files.length} items`, {
        root: listing.root,
        path: listing.path,
        filesFound: listing.files.length
      });

      // Step 2: Find the test file in listing
      addResult('Find Test File', 'pending', `Looking for file: ${testPath}`);
      const foundFile = listing.files.find(f => f.path === testPath || f.name === testPath.split('/').pop());
      if (foundFile) {
        addResult('Find Test File', 'success', 'File found in directory listing', foundFile);
      } else {
        addResult('Find Test File', 'error', 'File not found in directory listing', { testPath, availableFiles: listing.files.map(f => f.path) });
      }

      // Step 3: Try to read file
      addResult('Read File', 'pending', `Attempting to read file: ${testPath}`);
      const fileContent = await readFile(testPath, workspaceRoot || undefined);
      addResult('Read File', 'success', `Successfully read file (${fileContent.content.length} bytes)`, {
        contentLength: fileContent.content.length,
        metadata: fileContent.metadata,
        isBinary: fileContent.isBinary,
        isLarge: fileContent.isLarge,
        warning: fileContent.warning,
        contentPreview: fileContent.content.substring(0, 100)
      });

      // Step 4: Summary
      addResult('Summary', 'success', 'All tests passed! File loading should work.');

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addResult('Error', 'error', `Diagnostic failed: ${errorMsg}`, {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          File Loading Diagnostic Tool
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workspace Root
              </label>
              <input
                type="text"
                value={workspaceRoot}
                onChange={(e) => setWorkspaceRoot(e.target.value)}
                placeholder="e.g., /Users/username/workspaces"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to use current directory
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test File Path (relative to root)
              </label>
              <input
                type="text"
                value={testPath}
                onChange={(e) => setTestPath(e.target.value)}
                placeholder="e.g., package.json, src/app/page.tsx"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Path relative to workspace root
              </p>
            </div>

            <button
              onClick={runDiagnostic}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? 'Running Diagnostic...' : 'Run Diagnostic'}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Diagnostic Results
            </h2>

            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.status === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : result.status === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.status === 'success' && (
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {result.status === 'error' && (
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {result.status === 'pending' && (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span className={`font-medium ${
                      result.status === 'success'
                        ? 'text-green-900 dark:text-green-100'
                        : result.status === 'error'
                        ? 'text-red-900 dark:text-red-100'
                        : 'text-blue-900 dark:text-blue-100'
                    }`}>
                      {result.step}
                    </span>
                  </div>

                  <p className={`text-sm mb-2 ${
                    result.status === 'success'
                      ? 'text-green-700 dark:text-green-300'
                      : result.status === 'error'
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    {result.message}
                  </p>

                  {result.details && (
                    <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
