/**
 * Markdown Editor Component
 *
 * Displays Markdown content with edit/preview mode toggle.
 * Uses Cherry Markdown for rendering.
 */

'use client';

import { Edit, Eye, FileText } from 'lucide-react';
import Cherry from 'cherry-markdown';
import React, { useEffect, useRef, useState } from 'react';

import 'cherry-markdown/dist/cherry-markdown.css';

type EditorMode = 'edit' | 'preview';

interface MarkdownEditorProps {
  content: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({
  content,
  onChange,
  readOnly = false,
  placeholder = 'Start writing or paste Markdown...',
  className = '',
}: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cherryRef = useRef<Cherry | null>(null);
  const [mode, setMode] = useState<EditorMode>('edit');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化 Cherry Markdown
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    const cherryConfig = {
      editor: {
        defaultModel: 'edit&preview',
        height: '100%',
        placeholder,
      },
      toolbars: {
        showToolbar: true,
        toolbar: [
          'bold',
          'italic',
          'strikethrough',
          '|',
          'h1',
          'h2',
          'h3',
          '|',
          'list',
          'checklist',
          'quote',
          '|',
          'code',
          'table',
          '|',
          'link',
          'image',
          '|',
          'undo',
          'redo',
        ],
      },
    };

    const cherry = new Cherry({
      el: containerRef.current,
      value: content,
      ...cherryConfig,
    });

    // 监听内容变化
    cherry.on('afterChange', (data: any) => {
      if (onChange && data.markdownText !== content) {
        onChange(data.markdownText);
      }
    });

    cherryRef.current = cherry;
    setIsInitialized(true);

    // 根据初始模式设置
    cherry.switchModel(mode === 'edit' ? 'editOnly' : 'previewOnly');

    return () => {
      cherryRef.current?.destroy();
      setIsInitialized(false);
    };
  }, []);

  // 更新内容
  useEffect(() => {
    if (!cherryRef.current) return;

    const currentMarkdown = cherryRef.current.getMarkdown();
    if (content !== currentMarkdown) {
      cherryRef.current.setMarkdown(content);
    }
  }, [content]);

  // 切换模式
  useEffect(() => {
    if (!cherryRef.current) return;

    switch (mode) {
      case 'edit':
        cherryRef.current.switchModel('editOnly');
        break;
      case 'preview':
        cherryRef.current.switchModel('previewOnly');
        break;
    }
  }, [mode]);

  // 切换到编辑模式
  const handleEdit = () => setMode('edit');

  // 切换到预览模式
  const handlePreview = () => setMode('preview');

  return (
    <div className={`flex flex-col h-full bg-white/50 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-gray-800 text-sm">Markdown Editor</span>
          <span className="text-xs text-gray-400">Cherry Markdown</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleEdit}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'edit'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={readOnly}
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handlePreview}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'preview'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>

          {/* Character Count */}
          <div className="text-sm text-gray-500">
            {content.length.toLocaleString()} characters
          </div>
        </div>
      </div>

      {/* Content - Cherry Markdown Editor */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div ref={containerRef} className="cherry-container" style={{ height: '100%' }} />
      </div>
    </div>
  );
}
