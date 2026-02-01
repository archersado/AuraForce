/**
 * Code Snippets Manager Component
 *
 * Provides reusable code snippets with:
 * - Language-specific snippets
- User-defined snippets
- Quick insert and search
- Tab place holders
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Code, Plus, Trash2, Edit, ChevronDown, ChevronRight, Copy, Sparkles } from 'lucide-react';

// Snippet interface
export interface Snippet {
  id: string;
  name: string;
  description: string;
  language: string;
  prefix: string; // Trigger key
  body: string; // The snippet code with tab stops ($1, $2, etc.)
  tags: string[];
  isBuiltIn?: boolean;
}

// Predefined built-in snippets
const BUILT_IN_SNIPPETS: Snippet[] = [
  // JavaScript/TypeScript
  {
    id: 'js-console-log',
    name: 'console.log',
    description: 'Log output to console',
    language: 'javascript',
    prefix: 'clg',
    body: 'console.log($1);',
    tags: ['debug', 'output'],
    isBuiltIn: true,
  },
  {
    id: 'js-console-error',
    name: 'console.error',
    description: 'Log error to console',
    language: 'javascript',
    prefix: 'clerr',
    body: 'console.error($1);',
    tags: ['debug', 'error'],
    isBuiltIn: true,
  },
  {
    id: 'js-function',
    name: 'function',
    description: 'Create a function',
    language: 'javascript',
    prefix: 'fn',
    body: `function $1($2) {
  $3
}`,
    tags: ['function', 'basic'],
    isBuiltIn: true,
  },
  {
    id: 'js-arrow-function',
    name: 'arrow function',
    description: 'Create an arrow function',
    language: 'javascript',
    prefix: 'arf',
    body: 'const $1 = ($2) => $3;',
    tags: ['function', 'arrow'],
    isBuiltIn: true,
  },
  {
    id: 'js-async-function',
    name: 'async function',
    description: 'Create an async function',
    language: 'javascript',
    prefix: 'afn',
    body: `async function $1($2) {
  $3
}`,
    tags: ['async', 'function'],
    isBuiltIn: true,
  },
  {
    id: 'js-for-loop',
    name: 'for loop',
    description: 'Create a for loop',
    language: 'javascript',
    prefix: 'for',
    body: `for (let i = 0; i < $1.length; i++) {
  $2
}`,
    tags: ['loop', 'iteration'],
    isBuiltIn: true,
  },
  {
    id: 'js-for-each',
    name: 'forEach',
    description: 'Array forEach loop',
    language: 'javascript',
    prefix: 'fe',
    body: `$1.forEach(($2) => {
  $3
});`,
    tags: ['loop', 'array'],
    isBuiltIn: true,
  },
  {
    id: 'js-map',
    name: 'array map',
    description: 'Array map operation',
    language: 'javascript',
    prefix: 'map',
    body: `const $1 = $2.map(($3) => $4);`,
    tags: ['array', 'transform'],
    isBuiltIn: true,
  },
  {
    id: 'js-filter',
    name: 'array filter',
    description: 'Array filter operation',
    language: 'javascript',
    prefix: 'filter',
    body: `const $1 = $2.filter(($3) => $4);`,
    tags: ['array', 'filter'],
    isBuiltIn: true,
  },
  {
    id: 'js-promise',
    name: 'Promise',
    description: 'Create a Promise',
    language: 'javascript',
    prefix: 'prom',
    body: `new Promise((resolve, reject) => {
  $1
});`,
    tags: ['async', 'promise'],
    isBuiltIn: true,
  },

  // React
  {
    id: 'react-component',
    name: 'React Component',
    description: 'Create a functional component',
    language: 'typescript',
    prefix: 'rcc',
    body: `import React from 'react';

interface Props {
  $1
}

export const $2: React.FC<Props> = ({ $3 }) => {
  return (
    <div>$4</div>
  );
};
`,
    tags: ['react', 'component', 'typescript'],
    isBuiltIn: true,
  },
  {
    id: 'react-hook',
    name: 'React Hook',
    description: 'Create a custom hook',
    language: 'typescript',
    prefix: 'hk',
    body: `import { useState, useEffect } from 'react';

export const use$1 = () => {
  const [$2, set$2] = useState<$3>(null);

  useEffect(() => {
    $4
  }, []);

  return { $2, set$2 };
};
`,
    tags: ['react', 'hook', 'custom'],
    isBuiltIn: true,
  },
  {
    id: 'react-use-effect',
    name: 'useEffect',
    description: 'React useEffect hook',
    language: 'typescript',
    prefix: 'ue',
    body: `useEffect(() => {
  $1

  return () => {
    $2
  };
}, [$3]);
`,
    tags: ['react', 'effect'],
    isBuiltIn: true,
  },
  {
    id: 'react-use-state',
    name: 'useState',
    description: 'React useState hook',
    language: 'typescript',
    prefix: 'us',
    body: `const [$1, set$1] = useState<$2>($3);`,
    tags: ['react', 'state'],
    isBuiltIn: true,
  },

  // Python
  {
    id: 'python-function',
    name: 'function',
    description: 'Create a Python function',
    language: 'python',
    prefix: 'def',
    body: `def $1($2):
    $3`,
    tags: ['function'],
    isBuiltIn: true,
  },
  {
    id: 'python-class',
    name: 'class',
    description: 'Create a Python class',
    language: 'python',
    prefix: 'cls',
    body: `class $1:
    def __init__(self, $2):
        $3
`,
    tags: ['class', 'oop'],
    isBuiltIn: true,
  },
  {
    id: 'python-for-loop',
    name: 'for loop',
    description: 'Create a Python for loop',
    language: 'python',
    prefix: 'for',
    body: `for $1 in $2:
    $3`,
    tags: ['loop', 'iteration'],
    isBuiltIn: true,
  },
  {
    id: 'python-try-except',
    name: 'try/except',
    description: 'Try/except block',
    language: 'python',
    prefix: 'try',
    body: `try:
    $1
except $2 as e:
    $3
`,
    tags: ['exception', 'error handling'],
    isBuiltIn: true,
  },

  // SQL
  {
    id: 'sql-select',
    name: 'SELECT',
    description: 'Select query',
    language: 'sql',
    prefix: 'sel',
    body: `SELECT $1
FROM $2
WHERE $3;`,
    tags: ['select', 'query'],
    isBuiltIn: true,
  },
  {
    id: 'sql-insert',
    name: 'INSERT',
    description: 'Insert statement',
    language: 'sql',
    prefix: 'ins',
    body: `INSERT INTO $1 ($2)
VALUES ($3);`,
    tags: ['insert'],
    isBuiltIn: true,
  },
  {
    id: 'sql-update',
    name: 'UPDATE',
    description: 'Update statement',
    language: 'sql',
    prefix: 'upd',
    body: `UPDATE $1
SET $2 = $3
WHERE $4;`,
    tags: ['update'],
    isBuiltIn: true,
  },

  // HTML
  {
    id: 'html-boilerplate',
    name: 'HTML Boilerplate',
    description: 'Basic HTML template',
    language: 'html',
    prefix: 'html',
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$1</title>
</head>
<body>
  $2
</body>
</html>`,
    tags: ['boilerplate', 'template'],
    isBuiltIn: true,
  },
  {
    id: 'html-div',
    name: 'div',
    description: 'Div element',
    language: 'html',
    prefix: 'div',
    body: `<div class="$1">
  $2
</div>`,
    tags: ['div', 'element'],
    isBuiltIn: true,
  },
];

interface CodeSnippetsPanelProps {
  visible: boolean;
  onClose: () => void;
  language?: string;
  onInsert?: (snippet: Snippet) => void;
}

export function CodeSnippetsPanel({
  visible,
  onClose,
  language = 'javascript',
  onInsert,
}: CodeSnippetsPanelProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [userSnippets, setUserSnippets] = useState<Snippet[]>([]);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Load snippets from localStorage
  const loadUserSnippets = useCallback(() => {
    const saved = localStorage.getItem('workspace:user-snippets');
    if (saved) {
      try {
        setUserSnippets(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load user snippets:', err);
      }
    }
  }, []);

  useEffect(() => {
    loadUserSnippets();
  }, [loadUserSnippets]);

  // Combine built-in and user snippets
  const allSnippets = [...BUILT_IN_SNIPPETS, ...userSnippets];

  // Filter snippets
  const filteredSnippets = allSnippets.filter((snippet) => {
    const matchesSearch =
      searchQuery === '' ||
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.prefix.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLanguage =
      selectedLanguage === 'all' ||
      snippet.language === selectedLanguage ||
      snippet.language.toLowerCase().includes(selectedLanguage.toLowerCase());

    return matchesSearch && matchesLanguage;
  });

  // Get unique languages
  const languages = [
    'all',
    ...Array.from(
      new Set(
        allSnippets
          .map((s) => s.language)
          .filter((l): l is string => !!l)
      )
    ),
  ];

  // Handle create snippet
  const handleCreateSnippet = () => {
    setEditingSnippet({
      id: `user-${Date.now()}`,
      name: '',
      description: '',
      language: selectedLanguage === 'all' ? 'javascript' : selectedLanguage,
      prefix: '',
      body: '',
      tags: [],
    });
    setIsCreating(true);
  };

  // Handle save snippet
  const handleSaveSnippet = (snippet: Snippet) => {
    const updatedUserSnippets = editingSnippet?.id
      ? userSnippets.map((s) => (s.id === snippet.id ? snippet : s))
      : [snippet, ...userSnippets];

    setUserSnippets(updatedUserSnippets);
    localStorage.setItem('workspace:user-snippets', JSON.stringify(updatedUserSnippets));

    setEditingSnippet(null);
    setIsCreating(false);
  };

  // Handle delete snippet
  const handleDeleteSnippet = (snippetId: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      const updatedSnippets = userSnippets.filter((s) => s.id !== snippetId);
      setUserSnippets(updatedSnippets);
      localStorage.setItem('workspace:user-snippets', JSON.stringify(updatedSnippets));
    }
  };

  // Handle insert snippet
  const handleInsertSnippet = (snippet: Snippet) => {
    if (onInsert) {
      onInsert(snippet);
    }
  };

  // Handle copy snippet
  const handleCopySnippet = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.body);
    setCopiedSnippet(snippet.id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (!isCreating) {
            onClose();
          }
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                代码片段
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredSnippets.length} 片段 • {userSnippets.length} 自定义
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateSnippet}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新建片段
            </button>
            <button
              onClick={onClose}
              disabled={isCreating}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索片段..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100"
              />
            </div>

            {/* Language filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100 min-w-[150px]"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Snippets List */}
        {editingSnippet ? (
          // Edit snippet form
          <SnippetEditor
            snippet={editingSnippet}
            onSave={handleSaveSnippet}
            onCancel={() => {
              setEditingSnippet(null);
              setIsCreating(false);
            }}
          />
        ) : (
          // Snippets list
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {filteredSnippets.length > 0 ? (
              <div className="space-y-3">
                {filteredSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    onInsert={handleInsertSnippet}
                    onCopy={handleCopySnippet}
                    onEdit={() => {
                      if (!snippet.isBuiltIn) {
                        setEditingSnippet(snippet);
                        setIsCreating(false);
                      }
                    }}
                    onDelete={() => {
                      if (!snippet.isBuiltIn) {
                        handleDeleteSnippet(snippet.id);
                      }
                    }}
                    copied={copiedSnippet === snippet.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p className="mb-2">没有找到匹配的代码片段</p>
                <p className="text-sm">
                  {userSnippets.length === 0 && searchQuery === ''
                    ? '点击"新建片段"创建第一个代码片段'
                    : '尝试其他搜索词'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Tab</kbd>{' '}
              to navigate
              {', '}
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd>{' '}
              to insert
            </div>
            <div>
              按 <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl</kbd> +{' '}
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Space</kbd> 触发片段
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Snippet Card Component
interface SnippetCardProps {
  snippet: Snippet;
  onInsert: (snippet: Snippet) => void;
  onCopy: (snippet: Snippet) => void;
  onEdit: () => void;
  onDelete: () => void;
  copied: boolean;
}

function SnippetCard({
  snippet,
  onInsert,
  onCopy,
  onEdit,
  onDelete,
  copied,
}: SnippetCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-600 transition-colors hover:shadow-lg">
      <div className="flex items-start justify-between">
        {/* Left side - Name and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {snippet.name}
            </h4>
            {snippet.isBuiltIn && (
              <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-0.5 rounded">
                Built-in
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {snippet.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Prefix trigger */}
            <kbd className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-mono rounded">
              {snippet.prefix}
            </kbd>

            {/* Tags */}
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}

            {/* Language */}
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              {snippet.language}
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={expanded ? 'Hide' : 'Show code'}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          <button
            onClick={() => onInsert(snippet)}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="Insert snippet"
          >
            <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </button>

          <button
            onClick={() => onCopy(snippet)}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Copy className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {!snippet.isBuiltIn && (
            <>
              <button
                onClick={onEdit}
                className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Edit snippet"
              >
                <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>

              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete snippet"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body preview (always shown, can be expanded) */}
      {expanded && (
        <div className="mt-3">
          <textarea
            readOnly
            value={snippet.body}
            className="w-full h-40 p-3 bg-gray-900 dark:bg-gray-950 text-gray-100 font-mono text-sm rounded-lg resize-none focus:outline-none"
            style={{
              fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            }}
          />
        </div>
      )}
    </div>
  );
}

// Snippet Editor Component
function SnippetEditor({
  snippet,
  onSave,
  onCancel,
}: {
  snippet: Snippet;
  onSave: (snippet: Snippet) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Snippet>(snippet);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100"
              placeholder="例如：React Component"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              描述
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100"
              placeholder="简短描述这个片段的用途"
              required
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              语言
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100"
              required
            >
              <option value="javascript">JavaScript/TypeScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          {/* Prefix (trigger) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              触发前缀 (prefix)
            </label>
            <input
              type="text"
              value={formData.prefix}
              onChange={(e) =>
                setFormData({ ...formData, prefix: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100"
              placeholder="例如：rc (for React Component)"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              输入这个前缀然后按 Tab 或 Ctrl+Space 触发片段
            </p>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              代码 (body)
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              className="w-full h-64 px-4 py-3 bg-gray-900 dark:bg-gray-950 text-gray-100 font-mono text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="// 使用 $1, $2, $3 作为 tab 停留点"
              required
              style={{
                fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              使用 <code className="bg-gray-800 px-1 rounded">{`$1`}</code>,{' '}
              <code className="bg-gray-800 px-1 rounded">{`$2`}</code>,{' '}
              <code className="bg-gray-800 px-1 rounded">{`$3`}</code> 作为光标停留位置
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标签 (tags)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100"
              placeholder="react, component, hook (用 comma 分隔)"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              用逗号分隔多个标签，便于搜索和过滤
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              保存片段
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CodeSnippetsPanel;
