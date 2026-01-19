/**
 * Markdown Preview Editor Component
 *
 * A preview-mode markdown editor where users can edit directly in preview mode.
 * Features:
 * - WYSIWYG-like preview editing
 * - Real-time markdown rendering
 * - Contenteditable markdown syntax elements
 * - Support for common markdown syntax (headers, lists, bold, italic, code, etc.)
 * - Inline toolbar for formatting
 * - Auto-save support
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Code, List, ListOrdered, Link, Type, Minus, Quote, Save, Eye, Edit3 } from 'lucide-react';

interface MarkdownPreviewEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
  showViewToggle?: boolean;
  placeholder?: string;
  className?: string;
}

type EditMode = 'preview' | 'source';

/**
 * Convert raw Markdown to HTML for contenteditable preview mode
 */
function markdownToPreviewHTML(markdown: string): string {
  let html = markdown;

  // Escape HTML to prevent XSS
  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Headers (# to ######)
  html = html.replace(/^######\s+(.+)$/gm, (match, content) => `<h6 class="md-header md-h6" data-md-type="header" data-md-level="6">${content}</h6>`);
  html = html.replace(/^#####\s+(.+)$/gm, (match, content) => `<h5 class="md-header md-h5" data-md-type="header" data-md-level="5">${content}</h5>`);
  html = html.replace(/^####\s+(.+)$/gm, (match, content) => `<h4 class="md-header md-h4" data-md-type="header" data-md-level="4">${content}</h4>`);
  html = html.replace(/^###\s+(.+)$/gm, (match, content) => `<h3 class="md-header md-h3" data-md-type="header" data-md-level="3">${content}</h3>`);
  html = html.replace(/^##\s+(.+)$/gm, (match, content) => `<h2 class="md-header md-h2" data-md-type="header" data-md-level="2">${content}</h2>`);
  html = html.replace(/^#\s+(.+)$/gm, (match, content) => `<h1 class="md-header md-h1" data-md-type="header" data-md-level="1">${content}</h1>`);

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold" data-md-type="bold">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="md-bold" data-md-type="bold">$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, '<em class="md-italic" data-md-type="italic">$1</em>');
  html = html.replace(/_(.+?)_/g, '<em class="md-italic" data-md-type="italic">$1</em>');

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code" data-md-type="inline-code">$1</code>');

  // Code blocks (```lang...```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text';
    return `<pre class="md-code-block" data-md-type="code" data-md-lang="${language}"><code>${code.trim()}</code></pre>`;
  });

  // Blockquotes (> text)
  html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote class="md-blockquote" data-md-type="blockquote">$1</blockquote>');

  // Unordered lists (- item or * item)
  const listItems: string[] = [];
  const processLists = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    let result: string[] = [];

    for (const line of lines) {
      const ulMatch = line.match(/^[\-\*]\s+(.+)$/);
      const olMatch = line.match(/^\d+\.\s+(.+)$/);

      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) result.push(listType === 'ul' ? '</ul>' : '</ol>');
          result.push('<ul class="md-list md-list-unordered" data-md-type="list-unordered">');
          inList = true;
          listType = 'ul';
        }
        result.push(`<li class="md-list-item" data-md-type="list-item">${ulMatch[1]}</li>`);
      } else if (olMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) result.push(listType === 'ul' ? '</ul>' : '</ol>');
          result.push('<ol class="md-list md-list-ordered" data-md-type="list-ordered">');
          inList = true;
          listType = 'ol';
        }
        result.push(`<li class="md-list-item" data-md-type="list-item">${olMatch[1]}</li>`);
      } else {
        if (inList) {
          result.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }
        result.push(line);
      }
    }

    if (inList) {
      result.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    return result.join('\n');
  };

  html = processLists(html);

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link" data-md-type="link" target="_blank" rel="noopener noreferrer">$1</a>');

  // Images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="md-image" data-md-type="image" />');

  // Horizontal rules (--- or ***)
  html = html.replace(/^(\-{3,}|\*{3,})$/gm, '<hr class="md-hr" data-md-type="hr" />');

  // Line breaks (two spaces at end of line)
  html = html.replace(/  \n/g, '<br data-md-type="br" />\n');

  // Paragraphs (wrap remaining text in p tags)
  html = html.split('\n\n').map(para => {
    if (!para.trim()) return '';
    // Skip if it starts with HTML tag or is already wrapped
    if (para.trim().startsWith('<') || para.includes('<p')) return para;
    return `<p class="md-paragraph" data-md-type="paragraph">${para}</p>`;
  }).join('\n\n');

  return html;
}

/**
 * Convert preview HTML back to raw Markdown
 */
function previewHTMLToMarkdown(html: string): string {
  let markdown = html;
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Headers
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1\n\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/g, '##### $1\n\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/g, '###### $1\n\n');

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');

  // Inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`');

  // Code blocks
  markdown = markdown.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (match) => {
    const codeMatch = match.match(/<code[^>]*>([\s\S]*?)<\/code>/);
    if (codeMatch) {
      return '```\n' + codeMatch[1].trim() + '\n```';
    }
    return match;
  });

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '> $1');

  // Unordered lists
  markdown = markdown.replace(/<ul[^>]*>/g, '');
  markdown = markdown.replace(/<\/ul>/g, '\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1');

  // Ordered lists
  markdown = markdown.replace(/<ol[^>]*>/g, '');
  markdown = markdown.replace(/<\/ol>/g, '');
  // For ordered lists, we'd need to track numbering, simplifying for now

  // Links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');

  // Images
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, '![$2]($1)');

  // Paragraphs
  markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '$1\n\n');

  // Horizontal rules
  markdown = markdown.replace(/<hr[^>]*>/g, '---');

  // Line breaks
  markdown = markdown.replace(/<br[^>]*>/g, '\n');

  // Code cleanup
  markdown = markdown.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  markdown = markdown.replace(/&amp;/g, '&').replace(/&quot;/g, '"');

  // Normalize line breaks
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}

/**
 * Apply markdown formatting to selected text in contenteditable
 */
function applyFormat(formatType: string): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  if (!selectedText) return;

  let before = '';
  let after = '';

  switch (formatType) {
    case 'bold':
      before = '**';
      after = '**';
      break;
    case 'italic':
      before = '*';
      after = '*';
      break;
    case 'code':
      before = '`';
      after = '`';
      break;
    case 'link':
      before = '[';
      after = '](url)';
      break;
    case 'h1':
      before = '# ';
      after = '';
      break;
    case 'h2':
      before = '## ';
      after = '';
      break;
    case 'h3':
      before = '### ';
      after = '';
      break;
    case 'blockquote':
      before = '> ';
      after = '';
      break;
    case 'ul':
      before = '- ';
      after = '';
      break;
    case 'ol':
      before = '1. ';
      after = '';
      break;
    case 'hr':
      before = '\n---\n';
      after = '';
      break;
  }

  const newText = before + selectedText + after;
  document.execCommand('insertText', false, newText);
}

/**
 * Markdown Preview Editor Component
 */
export function MarkdownPreviewEditor({
  content,
  onChange,
  onSave,
  readOnly = false,
  showViewToggle = true,
  placeholder = 'Start typing...',
  className = '',
}: MarkdownPreviewEditorProps) {
  const [editMode, setEditMode] = useState<EditMode>('preview');
  const [localContent, setLocalContent] = useState(content);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const previewRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync with external content prop
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Update preview HTML when content changes
  useEffect(() => {
    if (previewRef.current && editMode === 'preview') {
      previewRef.current.innerHTML = markdownToPreviewHTML(localContent || placeholder);
    }
  }, [localContent, editMode, placeholder]);

  // Handle content changes
  const handleChange = useCallback(
    (newContent: string) => {
      setLocalContent(newContent);
      onChange(newContent);
    },
    [onChange]
  );

  // Handle preview editor content changes
  const handlePreviewChange = useCallback(() => {
    if (previewRef.current) {
      // Convert HTML back to markdown
      const html = previewRef.current.innerHTML;
      const markdown = previewHTMLToMarkdown(html);
      handleChange(markdown);
    }
  }, [handleChange]);

  // Handle source editor changes
  const handleSourceChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleChange(e.target.value);
    },
    [handleChange]
  );

  // Handle save
  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  // Handle text selection to show toolbar
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || editMode !== 'preview') {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current?.getBoundingClientRect();

    if (editorRect && rect.top > 0) {
      setToolbarPosition({
        top: rect.top - editorRect.top - 50,
        left: rect.left - editorRect.left + rect.width / 2 - 100,
      });
      setShowToolbar(true);
    }
  }, [editMode]);

  // Handle mouse up/selection changes
  useEffect(() => {
    if (editMode === 'preview' && !readOnly) {
      document.addEventListener('mouseup', handleSelection);
      document.addEventListener('keyup', handleSelection);
      return () => {
        document.removeEventListener('mouseup', handleSelection);
        document.removeEventListener('keyup', handleSelection);
      };
    }
  }, [editMode, readOnly, handleSelection]);

  // Handle format button clicks
  const handleFormat = useCallback((formatType: string) => {
    applyFormat(formatType);
    handlePreviewChange();
    setShowToolbar(false);
  }, [handlePreviewChange]);

  return (
    <div className={`flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`} ref={editorRef}>
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {showViewToggle && (
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setEditMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  editMode === 'preview' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Preview Mode"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setEditMode('source')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  editMode === 'source' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Source Mode"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Source</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      {/* Floating Toolbar for Preview Mode */}
      {showToolbar && editMode === 'preview' && !readOnly && (
        <div
          className="fixed z-50 bg-white shadow-lg border border-gray-200 rounded-lg p-1 flex flex-wrap gap-1 max-w-md animate-in fade-in slide-in-from-top-2"
          style={{
            top: `${Math.min(toolbarPosition.top, window.innerHeight - 200)}px`,
            left: `${Math.max(10, Math.min(toolbarPosition.left, window.innerWidth - 420))}px`,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <FormatButton onClick={() => handleFormat('bold')} icon={Bold} label="Bold" />
          <FormatButton onClick={() => handleFormat('italic')} icon={Italic} label="Italic" />
          <FormatButton onClick={() => handleFormat('code')} icon={Code} label="Code" />
          <div className="w-px bg-gray-200 mx-1" />
          <FormatButton onClick={() => handleFormat('link')} icon={Link} label="Link" />
          <div className="w-px bg-gray-200 mx-1" />
          <FormatButton onClick={() => handleFormat('h1')} icon={Type} label="H1" />
          <FormatButton onClick={() => handleFormat('h2')} icon={Type} label="H2" />
          <FormatButton onClick={() => handleFormat('h3')} icon={Type} label="H3" />
          <div className="w-px bg-gray-200 mx-1" />
          <FormatButton onClick={() => handleFormat('ul')} icon={List} label="List" />
          <FormatButton onClick={() => handleFormat('ol')} icon={ListOrdered} label="Numbered" />
          <div className="w-px bg-gray-200 mx-1" />
          <FormatButton onClick={() => handleFormat('blockquote')} icon={Quote} label="Quote" />
          <FormatButton onClick={() => handleFormat('hr')} icon={Minus} label="Divider" />
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-auto min-h-0">
        {editMode === 'preview' ? (
          <div
            ref={previewRef}
            contentEditable={!readOnly}
            onInput={handlePreviewChange}
            onKeyUp={handlePreviewChange}
            className="min-h-full p-6 focus:outline-none prose prose-sm max-w-none"
            style={{
              minHeight: '300px',
              cursor: readOnly ? 'default' : 'text',
            }}
            suppressContentEditableWarning
          />
        ) : (
          <textarea
            ref={sourceRef}
            value={localContent}
            onChange={handleSourceChange}
            readOnly={readOnly}
            placeholder={placeholder}
            className="w-full h-full min-h-[300px] p-4 font-mono text-sm resize-none focus:outline-none"
            style={{
              minHeight: '300px',
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
        <span className="capitalize">{editMode} Mode</span>
        <span>{localContent.split('').length.toLocaleString()} characters</span>
      </div>
    </div>
  );
}

/**
 * Format Toolbar Button
 */
function FormatButton({ onClick, icon: Icon, label }: { onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-100 rounded-md transition-colors group relative"
      title={label}
    >
      <Icon className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
    </button>
  );
}
