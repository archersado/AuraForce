/**
 * AI Markdown Editor Component using Tiptap
 *
 * A powerful WYSIWYG Markdown editor with AI capabilities.
 * Built on top of Tiptap with support for:
 * - Real-time markdown rendering
 * - Tables
 * - Task lists
 * - Links and images
 * - Code blocks
 * - Placeholder text
 * - Read-only mode
 */

'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';

import { Save, Eye, Edit3, Sparkles, Bold, Italic, Code, ListOrdered, List, Quote, Link as LinkIcon, Image as ImageIcon, Minus, Undo, Redo, Heading1, Heading2, Heading3, CheckSquare } from 'lucide-react';

interface AIMarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  showPreviewToggles?: boolean;
}

type EditorMode = 'edit' | 'preview';

/**
 * Simple markdown to HTML renderer for preview mode
 */
function MarkdownPreview({ content }: { content: string }) {
  const html = useMemo(() => {
    let html = content;

    // Escape HTML for safety
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-base font-bold mt-4 mb-2 text-gray-900 pb-1 border-b border-gray-100">$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-lg font-bold mt-4 mb-2 text-gray-900 pb-1 border-b border-gray-100">$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-xl font-bold mt-4 mb-2 text-gray-900 pb-1 border-b border-gray-100">$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-5 mb-3 text-gray-900 pb-2 border-b border-gray-200">$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900 pb-2 border-b border-gray-200">$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-4 text-gray-900 pb-3 border-b border-gray-200">$1</h1>');

    // Bold/Italic/Strike
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-gray-400">$1</del>');

    // Inline code
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200">$1</code>');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm"><code>${code.trim()}</code></pre>`;
    });

    // Blockquote
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-50/50 rounded-r italic text-gray-700">$1</blockquote>');

    // Task lists
    html = html.replace(/^\s*-\s+\[x\]\s+(.+)$/gim, '<li class="flex items-center gap-2 ml-6 my-1"><span class="w-4 h-4 bg-green-500 rounded-sm flex-shrink-0"></span><span class="line-through text-gray-400">$1</span></li>');
    html = html.replace(/^\s*-\s+\[\s\]\s+(.+)$/gim, '<li class="flex items-center gap-2 ml-6 my-1"><span class="w-4 h-4 border-2 border-gray-300 rounded-sm flex-shrink-0"></span><span class="text-gray-700">$1</span></li>');

    // Unordered lists
    html = html.replace(/^\s*-\s+(?!-)(.+)$/gm, '<li class="ml-6 list-disc text-gray-700">$1</li>');

    // Ordered lists
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-6 list-decimal text-gray-700">$1</li>');

    // Wrap list items
    html = html.replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, '<ul class="my-4 space-y-1">$&</ul>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:text-purple-700 underline decoration-purple-300 hover:decoration-purple-500 underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-gray-200" loading="lazy" />');

    // Horizontal rule
    html = html.replace(/^(\-{3,}|\*{3,})$/gm, '<hr class="my-6 border-t-2 border-gray-200" />');

    // Line breaks
    html = html.replace(/  \n/g, '<br />');

    // Paragraphs (wrap remaining text in p tags)
    html = html.split('\n\n').map(para => {
      if (!para.trim()) return '';
      const trimmed = para.trim();
      // Skip if already starts with HTML tag
      if (trimmed.startsWith('<') && trimmed.includes('</')) return para;
      return `<p class="mb-4 leading-relaxed text-gray-700">${para}</p>`;
    }).join('\n\n');

    return html;
  }, [content]);

  return (
    <div
      className="prose prose-sm md:prose-base min-h-full p-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * AI Markdown Editor Component
 */
export function AIMarkdownEditor({
  content,
  onChange,
  onSave,
  readOnly = false,
  placeholder = 'Start writing...',
  className = '',
  showPreviewToggles = true,
}: AIMarkdownEditorProps) {
  const [mode, setMode] = useState<EditorMode>('edit');
  const [hasChanges, setHasChanges] = useState(false);
  const [viewMarkdown, setViewMarkdown] = useState(content);

  // Initialize Tiptap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Markdown.configure({
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-600 hover:text-purple-700 underline',
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // Get markdown content
      const markdownContent = editor.getText();
      setViewMarkdown(markdownContent);
      setHasChanges(markdownContent !== content);
      onChange(markdownContent);
    },
  });

  // Sync with external content prop
  useEffect(() => {
    if (editor && content !== viewMarkdown) {
      editor.commands.setContent(content, { emitUpdate: false });
      setViewMarkdown(content);
      setHasChanges(false);
    }
  }, [content, editor, viewMarkdown]);

  // Handle save
  const handleSave = useCallback(() => {
    onSave?.();
    setHasChanges(false);
  }, [onSave]);

  // Format toolbar buttons
  const ToolbarButton = ({ onClick, isActive, icon: Icon, title, ariaLabel }: any) => (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      disabled={readOnly}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? 'bg-purple-100 text-purple-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  if (!editor && mode === 'edit') {
    return (
      <div className={`flex flex-col h-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <span className="text-sm text-gray-500">Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-gray-800 text-sm">AI Editor</span>
          </div>

          {showPreviewToggles && !readOnly && (
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setMode('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  mode === 'edit'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Edit Mode"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  mode === 'preview'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Preview Mode"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-yellow-600 whitespace-nowrap">Unsaved</span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors text-white flex-shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      {mode === 'edit' && editor && (
        <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon={Undo}
            title="Undo"
            ariaLabel="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon={Redo}
            title="Redo"
            ariaLabel="Redo"
          />
          <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon={Heading1}
            title="Heading 1"
            ariaLabel="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon={Heading2}
            title="Heading 2"
            ariaLabel="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon={Heading3}
            title="Heading 3"
            ariaLabel="Heading 3"
          />
          <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />

          {/* Text formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={Bold}
            title="Bold (Cmd+B)"
            ariaLabel="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={Italic}
            title="Italic (Cmd+I)"
            ariaLabel="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            icon={Code}
            title="Inline Code"
            ariaLabel="Inline Code"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            icon={Quote}
            title="Blockquote"
            ariaLabel="Blockquote"
          />
          <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={List}
            title="Bullet List"
            ariaLabel="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={ListOrdered}
            title="Ordered List"
            ariaLabel="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            icon={CheckSquare}
            title="Task List"
            ariaLabel="Task List"
          />
          <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />

          {/* Links & Images */}
          <ToolbarButton
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            isActive={editor.isActive('link')}
            icon={LinkIcon}
            title="Add Link"
            ariaLabel="Add Link"
          />
          <ToolbarButton
            onClick={() => {
              const url = window.prompt('Enter image URL:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            isActive={false}
            icon={ImageIcon}
            title="Add Image"
            ariaLabel="Add Image"
          />
          <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0" />

          {/* Horizontal rule */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            icon={Minus}
            title="Horizontal Rule"
            ariaLabel="Horizontal Rule"
          />
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 min-h-0 overflow-auto bg-white">
        {mode === 'edit' && editor ? (
          <EditorContent editor={editor} name="content" />
        ) : (
          <MarkdownPreview content={viewMarkdown} />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1.5 bg-white border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="capitalize">{mode} Mode</span>
          <span>{viewMarkdown.split('').length.toLocaleString()} characters</span>
          <span>{viewMarkdown.split('\n').filter((l) => l).length} lines</span>
          <span>{viewMarkdown.split(/\s+/).filter((w) => w).length} words</span>
        </div>
        <div>Tiptap AI Editor</div>
      </div>
    </div>
  );
}
