/**
 * Code Editor Component
 * Monaco Editor integration for syntax-highlighted code editing
 *
 * Implements STORY-14-2: Code Editor with Syntax Highlighting
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import type { editor } from 'monaco-editor';
import { useWorkspaceStore } from '@/stores/workspace-store';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  fontSize?: number;
  theme?: 'light' | 'dark' | 'auto';
  minimap?: boolean;
  lineNumbers?: 'on' | 'off' | 'relative';
  wordWrap?: 'on' | 'off';
}

export default function CodeEditor({
  language,
  value,
  onChange,
  readOnly = false,
  fontSize = 14,
  theme = 'light',
  minimap = true,
  lineNumbers = 'on',
  wordWrap = 'off',
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const { editorSettings } = useWorkspaceStore();

  // Initialize Monaco Editor
  useEffect(() => {
    if (!containerRef.current) return;

    // Define custom theme for WolfGaze
    monaco.editor.defineTheme('aurawolf', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D' },
        { token: 'keyword', foreground: 'FF7B72' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'constant', foreground: 'FFA657' },
        { token: 'variable', foreground: 'D2A8FF' },
      ],
      colors: {
        'editor.background': '#0F172A',
        'editor.foreground': '#E4E4E7',
        'editor.lineHighlightBackground': '#1E293B',
        'editorCursor.foreground': '#71717A',
        'editor.selectionBackground': '#334155',
        'editor.inactiveSelectionBackground': '#1E293B',
      },
    });

    // Create editor instance
    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme: 'aurawolf',
      readOnly,
      fontSize: editorSettings.fontSize,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', monospace",
      fontLigatures: true,
      tabSize: editorSettings.tabSize,
      minimap: {
        enabled: minimap,
      },
      lineNumbers,
      wordWrap,
      automaticLayout: false, // We handle layout manually
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      rulers: [80, 120],
      bracketPairColorization: {
        enabled: true,
      },
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      padding: {
        top: 12,
        bottom: 12,
      },
      suggest: {
        showIcons: true,
        showSnippets: true,
        showStatusBar: true,
      },
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'always',
      formatOnPaste: true,
      formatOnType: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
    });

    // Handle content changes
    const disposable = editorRef.current.onDidChangeModelContent(() => {
      const newValue = editorRef.current?.getValue() || '';
      onChange(newValue);
    });

    // Setup resize observer
    resizeObserverRef.current = new ResizeObserver(() => {
      editorRef.current?.layout();
    });
    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      disposable.dispose();
      resizeObserverRef.current?.disconnect();
      editorRef.current?.dispose();
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update value when it changes externally
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentValue = editor.getValue();
    if (currentValue !== value) {
      editor.setValue(value);
    }
  }, [value]);

  // Update language
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  }, [language]);

  // Update settings
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.updateOptions({
      fontSize: editorSettings.fontSize,
      tabSize: editorSettings.tabSize,
      lineNumbers: editorSettings.lineNumbers,
      wordWrap: editorSettings.wordWrap,
    });
  }, [editorSettings]);

  // Expose focus method
  const focus = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  // Expose editor instance
  useEffect(() => {
    (containerRef.current as any).editorRef = editorRef.current;
    (containerRef.current as any).focus = focus;
  }, [focus]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        minHeight: '400px',
      }}
    />
  );
}

/**
 * Hook to access editor instance
 */
export const useEditorInstance = <
  T extends editor.IStandaloneCodeEditor | null
>() => {
  const [editor, setEditor] = React.useState<T | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setEditor((ref.current as any).editorRef as T);
    }
  }, [ref]);

  return { ref, editor };
};
