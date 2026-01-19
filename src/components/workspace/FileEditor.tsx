/**
 * File Editor Component
 *
 * Code editor with syntax highlighting, line numbers,
 * search/replace, and save functionality.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { EditorView, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { indentOnInput, bracketMatching, foldKeymap, syntaxHighlighting } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches } from '@codemirror/search';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { sql } from '@codemirror/lang-sql';
import { css } from '@codemirror/lang-css';
import { markdown } from '@codemirror/lang-markdown';
import { tags } from '@lezer/highlight';
import { HighlightStyle } from '@codemirror/language';
import { ChevronLeft, ChevronDown, Save, Sparkles, File, Folder, FolderOpen, RefreshCw } from 'lucide-react';
import type { FileMetadata } from '@/lib/workspace/files-service';
import { formatFileSize, formatDate } from '@/lib/workspace/files-service';
import { listDirectory } from '@/lib/workspace/files-service';
import type { FileInfo } from '@/lib/workspace/files-service';

interface FileEditorProps {
  path: string | null;
  content: string;
  metadata?: FileMetadata;
  isBinary?: boolean;
  isLarge?: boolean;
  warning?: string;
  onSave: (path: string, content: string, root?: string) => Promise<void>;
  onClose?: () => void;
  readOnly?: boolean;
  projectRoot?: string; // The root directory for this project (workspace path)
  hideFileTree?: boolean; // Hide the embedded file tree panel in the editor
}

interface FileNode extends FileInfo {
  children?: FileNode[];
  isOpen?: boolean;
}

// Recursive File Tree Node Component
function FileTreeNode({
  nodes,
  selectedPath,
  onNodeClick,
  depth = 0,
}: {
  nodes: FileNode[];
  selectedPath: string | null;
  onNodeClick: (node: FileNode) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <div key={node.path}>
          <button
            onClick={() => onNodeClick(node)}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-left text-xs rounded-md transition-colors ${
              node.path === selectedPath
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
            title={node.path}
          >
            {node.type === 'directory' ? (
              <>
                {node.isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                )}
                {node.isOpen ? (
                  <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 flex-shrink-0 text-blue-500" />
                )}
                <span className="truncate flex-1">{node.name}</span>
              </>
            ) : (
              <>
                <span className="w-3.5 h-3.5 flex-shrink-0" />
                <File className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="truncate flex-1">{node.name}</span>
              </>
            )}
          </button>
          {/* Show children if folder is open */}
          {node.type === 'directory' && node.isOpen && node.children && (
            <FileTreeNode
              nodes={node.children}
              selectedPath={selectedPath}
              onNodeClick={onNodeClick}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function FileEditor({
  path,
  content,
  metadata,
  isBinary,
  isLarge,
  warning,
  onSave,
  onClose,
  readOnly = false,
  projectRoot,
  hideFileTree = false,
}: FileEditorProps) {
  const [editorContent, setEditorContent] = useState(content);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lineCount, setLineCount] = useState(0);
  const [guttersVisible, setGuttersVisible] = useState(true);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [currentDir, setCurrentDir] = useState<string>('/');
  const [loadingDir, setLoadingDir] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef<Compartment>(new Compartment());

  // Load file tree when path changes or when projectRoot is set
  useEffect(() => {
    // Don't load file tree if it's hidden
    if (hideFileTree) return;

    // Load from project root if no file is selected, otherwise load from file's directory
    if (projectRoot && projectRoot.trim().length > 0) {
      if (path) {
        loadFileTree();
      } else {
        // Load root directory when no file is selected
        loadRootDirectory();
      }
    }
  }, [path, projectRoot, hideFileTree]);

  const loadRootDirectory = async () => {
    if (!projectRoot || !projectRoot.trim()) return;

    setLoadingDir(true);
    try {
      console.log('[FileEditor] Loading root directory, projectRoot:', projectRoot);
      const response = await listDirectory('/', projectRoot);
      console.log('[FileEditor] Root directory response:', response);

      if (response.files) {
        await buildFileTree(response.files);
      }
    } catch (error) {
      console.error('[FileEditor] Failed to load root directory:', error);
    } finally {
      setLoadingDir(false);
    }
  };

  const buildFileTree = async (files: FileInfo[]) => {
    // Convert to tree structure - limit depth to 2 for performance
    console.log('[FileEditor] Building file tree from files:', files);
    const tree: FileNode[] = [];

    for (const file of files) {
      if (file.type === 'directory') {
        // Load children for first level directories only
        try {
          // Use the path returned from API (relative to project root)
          const subDirPath = file.path.startsWith('/') ? file.path : `/${file.path}`;
          const subResponse = await listDirectory(subDirPath, projectRoot);
          const children: FileNode[] = [];

          for (const child of subResponse.files) {
            if (child.type === 'directory') {
              // Don't load nested children, just add placeholder
              children.push({
                ...child,
                children: [],
                isOpen: false,
              });
            } else {
              children.push({ ...child, isOpen: false });
            }
          }

          children.sort((a, b) => {
            if (a.type === 'directory' && b.type !== 'directory') return -1;
            if (a.type !== 'directory' && b.type === 'directory') return 1;
            return a.name.localeCompare(b.name);
          });

          tree.push({
            ...file,
            children,
            isOpen: false,
          });
        } catch (error) {
          console.error('[FileEditor] Failed to load directory:', file.path, error);
          tree.push({
            ...file,
            children: [],
            isOpen: false,
          });
        }
      } else {
        tree.push({ ...file, isOpen: false });
      }
    }

    tree.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    console.log('[FileEditor] Built file tree with', tree.length, 'items');
    setFileTree(tree);
  };

  const loadFileTree = async () => {
    if (!path) {
      console.log('[FileEditor] No file selected, loading root directory instead');
      await loadRootDirectory();
      return;
    }

    setLoadingDir(true);
    try {
      // Get the directory containing the current file
      const pathParts = path.split('/').filter(p => p);
      const dirPath = pathParts.slice(0, -1).join('/') || '/';
      // Normalize to always start with /
      const normalizedDirPath = dirPath === '' ? '/' : dirPath.startsWith('/') ? dirPath : `/${dirPath}`;
      setCurrentDir(normalizedDirPath);

      console.log('[FileEditor] Loading file tree for path:', normalizedDirPath, 'projectRoot:', projectRoot);
      const response = await listDirectory(normalizedDirPath, projectRoot);
      console.log('[FileEditor] File tree response:', response);

      if (response.files) {
        await buildFileTree(response.files);
      }
    } catch (error) {
      console.error('[FileEditor] Failed to load file tree:', error);
    } finally {
      setLoadingDir(false);
    }
  };

  const toggleFolder = (node: FileNode, tree: FileNode[]): FileNode[] => {
    const toggleNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((item) => {
        if (item.path === node.path) {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.children) {
          return { ...item, children: toggleNode(item.children as FileNode[]) };
        }
        return item;
      });
    };
    return toggleNode(tree);
  };

  const handleFileSelect = async (fileNode: FileNode) => {
    if (fileNode.type === 'directory') {
      const newTree = toggleFolder(fileNode, fileTree);
      setFileTree(newTree);
    } else if (onClose) {
      // Navigate to different file
      onClose();
      // Reload with new file path would go here
    }
  };

  const toggleGutters = () => {
    setGuttersVisible(!guttersVisible);
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(
          guttersVisible ? languageExtension() : []
        ),
      });
    }
  };

  // Local function to detect language from file path
  const getLanguageFromPath = (filePath: string): string => {
    if (!filePath) return 'text';

    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const name = filePath.toLowerCase();

    // Language extensions mapping
    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      mjs: 'javascript',
      mts: 'typescript',
      cjs: 'javascript',
      cts: 'typescript',
      json: 'json',
      jsonc: 'json',
      md: 'markdown',
      mdx: 'markdown',
      markdown: 'markdown',
      rst: 'markdown',
      txt: 'text',
      yaml: 'yaml',
      yml: 'yaml',
      xml: 'xml',
      html: 'html',
      htm: 'html',
      css: 'css',
      scss: 'scss',
      less: 'less',
      py: 'python',
      pyi: 'python',
      java: 'java',
      c: 'cpp',
      h: 'cpp',
      cc: 'cpp',
      cpp: 'cpp',
      hpp: 'cpp',
      cxx: 'cpp',
      hxx: 'cpp',
      php: 'php',
      rs: 'rust',
      go: 'go',
      sql: 'sql',
      sh: 'bash',
      bash: 'bash',
      conf: 'text',
      ini: 'text',
    };

    // Special cases
    if (name === 'dockerfile') return 'text';
    if (name === 'docker-compose.yml' || name === 'docker-compose.yaml') return 'yaml';
    if (name === 'package.json' || name === 'tsconfig.json') return 'json';

    return langMap[ext] || 'text';
  };

  // Calculate language support based on file extension
  const languageExtension = useCallback(() => {
    if (!path) return [];

    const language = getLanguageFromPath(path);
    const ext = path.split('.').pop()?.toLowerCase() || '';

    switch (language) {
      case 'javascript':
      case 'typescript':
        return [javascript({ jsx: true, typescript: true })];
      case 'json':
        return [json()];
      case 'html':
        return [html()];
      case 'markdown':
        // Simplified markdown handler without codeLanguages to avoid initialization issues
        return [
          markdown({
            codeLanguages: [], // Empty array to avoid undefined language issues
          })
        ];
      case 'css':
      case 'scss':
      case 'less':
        return [css()];
      case 'python':
        return [python()];
      case 'java':
        return [java()];
      case 'cpp':
      case 'c':
      case 'cc':
      case 'cxx':
      case 'h':
      case 'hpp':
      case 'hxx':
        return [cpp()];
      case 'php':
        return [php()];
      case 'rust':
        return [rust()];
      case 'go':
        return [go()];
      case 'sql':
        return [sql()];
      case 'yaml':
      case 'yml':
        return [];
      case 'xml':
        return [html()];
      case 'text':
      default:
        return [];
    }
  }, [path]);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current || isBinary || readOnly) return;

    const parent = editorRef.current;
    parent.innerHTML = '';

    // Create a highlighter for text files (basic keyword highlighting)
    const textHighlight = HighlightStyle.define([
      { tag: tags.keyword, color: '#ff79c6' },
      { tag: tags.string, color: '#f1fa8c' },
      { tag: tags.number, color: '#bd93f9' },
      { tag: tags.comment, color: '#6272a4' },
    ]);

    viewRef.current = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: guttersVisible ? [
          languageCompartment.current.of(languageExtension()),
          syntaxHighlighting(textHighlight),
          lineNumbers(),
          highlightActiveLineGutter(),
          indentOnInput(),
          bracketMatching(),
          highlightSelectionMatches(),
          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            ...foldKeymap,
            indentWithTab,
            {
              key: 'Mod-s',
              run: () => {
                handleSave();
                return true;
              },
            },
          ]),
          history(),
          autocompletion(),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              setEditorContent(newContent);
              setHasChanges(newContent !== content);
            }
          }),
          EditorView.theme({
            '&': {
              fontSize: '14px',
              color: '#1f2937',
            },
            '.cm-scroller': {
              fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
            },
            '.cm-gutters': {
              backgroundColor: '#f9fafb',
              color: '#9ca3af',
              border: 'none',
              borderRight: '1px solid #e5e7eb',
              minWidth: guttersVisible ? '50px' : '0px',
            },
            '.cm-activeLineGutter': {
              backgroundColor: '#f3f4f6',
            },
          }),
        ] : [
          languageCompartment.current.of(languageExtension()),
          syntaxHighlighting(textHighlight),
          highlightActiveLineGutter(),
          indentOnInput(),
          bracketMatching(),
          highlightSelectionMatches(),
          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            ...foldKeymap,
            indentWithTab,
            {
              key: 'Mod-s',
              run: () => {
                handleSave();
                return true;
              },
            },
          ]),
          history(),
          autocompletion(),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              setEditorContent(newContent);
              setHasChanges(newContent !== content);
            }
          }),
          EditorView.theme({
            '&': {
              fontSize: '14px',
              color: '#1f2937',
            },
            '.cm-scroller': {
              fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
            },
            '.cm-gutters': {
              display: 'none',
            },
            '.cm-activeLineGutter': {
              backgroundColor: '#f3f4f6',
            },
          }),
        ],
      }),
      parent,
    });

    // Update line count
    setLineCount(viewRef.current.state.doc.lines);

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [path, content, isBinary, readOnly, languageExtension, guttersVisible]);

  // Update language when path changes
  useEffect(() => {
    if (viewRef.current && !isBinary) {
      viewRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(languageExtension()),
      });
    }
  }, [path, languageExtension, isBinary]);

  // Handle save
  const handleSave = async () => {
    if (!path || readOnly) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(path, editorContent, projectRoot);
      setHasChanges(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorContent, path, readOnly]);

  // Binary file message
  if (isBinary) {
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <div className="text-gray-400 text-sm">
          Binary file - content not available for viewing
        </div>
      </div>
    );
  }

  // Read-only mode (no editor)
  if (readOnly) {
    return (
      <div className="flex flex-col h-full bg-gray-50 overflow-auto">
        <div className="p-4 whitespace-pre font-mono text-sm">
          {editorContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Directory breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
            <span className="font-mono">{currentDir}</span>
          </div>
          {!warning && path && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
              {getLanguageFromPath(path).toUpperCase()}
            </span>
          )}
          {warning && (
            <span className="text-xs text-yellow-600 whitespace-nowrap">
              ⚠️ {warning}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!hideFileTree && (
            /* Toggle gutters button */
            <button
              onClick={toggleGutters}
              className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                guttersVisible ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-600'
              }`}
              title={guttersVisible ? 'Hide file tree' : 'Show file tree'}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {hasChanges && (
            <span className="text-xs text-yellow-600 whitespace-nowrap">
              Unsaved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-1.5 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors flex-shrink-0 text-white"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Save Error */}
      {saveError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm flex-shrink-0">
          {saveError}
        </div>
      )}

      {/* File Tree and Editor */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* File Tree Sidebar - Collapsible */}
        {!hideFileTree && guttersVisible && (
          <div className="w-56 flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden flex flex-col min-h-0">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Files
              </span>
              <button
                onClick={loadFileTree}
                disabled={loadingDir}
                className="p-1 rounded hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-3 h-3 text-gray-500 ${loadingDir ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-1 min-h-0">
              {loadingDir ? (
                <div className="flex items-center justify-center h-32 text-gray-400 text-xs">
                  Loading...
                </div>
              ) : fileTree.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400 text-xs">
                  No files
                </div>
              ) : (
                <div className="min-h-full">
                  <FileTreeNode
                    nodes={fileTree}
                    selectedPath={path}
                    onNodeClick={handleFileSelect}
                    depth={0}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editor Container */}
        <div
          ref={editorRef}
          className="flex-1 overflow-auto min-w-0 min-h-0"
          style={{ minHeight: '200px' }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-white border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>{lineCount} lines</span>
        </div>
        <div className="flex items-center gap-4 min-w-0">
          {metadata && (
            <>
              <span className="truncate">{metadata.filename}</span>
              <span className="whitespace-nowrap">{formatFileSize(metadata.size)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
