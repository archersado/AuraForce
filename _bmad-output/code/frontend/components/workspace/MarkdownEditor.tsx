/**
 * Markdown Editor Component
 * Split-view Markdown editor with live preview
 *
 * Implements STORY-14-3: File Preview - Markdown Support
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Columns3, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeEditor, { useEditorInstance } from './CodeEditor';

export type PanelState = 'default' | 'split' | 'preview-only' | 'editor-only';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  initialPanelState?: PanelState;
  onPanelStateChange?: (state: PanelState) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  initialPanelState = 'default',
  onPanelStateChange,
}) => {
  const [panelState, setPanelState] = useState<PanelState>(initialPanelState);
  const { ref: editorRef } = useEditorInstance();

  const handlePanelStateChange = useCallback(
    (newState: PanelState) => {
      setPanelState(newState);
      onPanelStateChange?.(newState);
    },
    [onPanelStateChange]
  );

  const togglePreview = useCallback(() => {
    if (panelState === 'editor-only') {
      handlePanelStateChange('default');
    } else if (panelState === 'default') {
      handlePanelStateChange('preview-only');
    } else {
      handlePanelStateChange('editor-only');
    }
  }, [panelState, handlePanelStateChange]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-10 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-1">
          <button
            className={`
              p-1.5 rounded transition-colors
              ${panelState === 'editor-only'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
            onClick={() => handlePanelStateChange('editor-only')}
            title="Editor only (Ctrl+E)"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            className={`
              px-2 py-1.5 rounded transition-colors flex items-center gap-1
              ${panelState === 'default' || panelState === 'split'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
            onClick={() => handlePanelStateChange('default')}
            title="Split view (Ctrl+S)"
          >
            <Columns3 className="w-4 h-4" />
          </button>
          <button
            className={`
              p-1.5 rounded transition-colors
              ${panelState === 'preview-only'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
            onClick={() => handlePanelStateChange('preview-only')}
            title="Preview only (Ctrl+P)"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Markdown
        </div>

        <button
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          onClick={togglePreview}
          title="Toggle preview"
        >
          {panelState === 'preview-only' ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Editor / Preview area */}
      <div className="flex-1 flex overflow-hidden">
        {(panelState === 'default' || panelState === 'split' || panelState === 'editor-only') && (
          <div
            className={`
              border-r border-gray-200 dark:border-gray-700
              ${panelState === 'split' ? 'w-1/2' : 'w-full'}
            `}
          >
            <CodeEditor
              ref={editorRef}
              language="markdown"
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              theme="light"
              minimap={false}
              lineNumbers="on"
              wordWrap="on"
            />
          </div>
        )}

        {(panelState === 'default' || panelState === 'preview-only') && (
          <div
            className={`
              overflow-auto bg-white dark:bg-gray-900
              ${panelState === 'default' ? 'w-1/2' : 'w-full'}
            `}
          >
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Markdown Preview Component
 */
interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  return (
    <div className={`p-6 prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            return !inline && language ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={className}
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ node, ...props }) {
            return (
              <a
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            );
          },
          img({ node, ...props }) {
            return (
              <img
                className="rounded-lg shadow-md"
                alt={props.alt || 'Image'}
                loading="lazy"
                {...props}
              />
            );
          },
          blockquote({ node, children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto">
                <table
                  className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
                  {...props}
                />
              </div>
            );
          },
          th({ node, ...props }) {
            return (
              <th
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800"
                {...props}
              />
            );
          },
          td({ node, ...props }) {
            return (
              <td
                className="border border-gray-300 dark:border-gray-600 px-4 py-2"
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownEditor;
