/**
 * CodeEditor-v2.tsx - Export fix and C language support
 *
 * Export correctly and use lang-cpp for C language support
 */

'use client';

import { useEffect, useRef } from 'react';

// Core CodeMirror imports
import { EditorView, basicSetup } from 'codemirror';
import { keymap, drawSelection, rectangularSelection } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';
import {
  indentOnInput,
  bracketMatching,
  syntaxHighlighting,
  defaultHighlightStyle,
  foldGutter,
  indentUnit,
} from '@codemirror/language';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches } from '@codemirror/search';
import { oneDark } from '@codemirror/theme-one-dark';

// Language imports (using lang-cpp for both C and C++)
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { go } from '@codemirror/lang-go';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { cpp } from '@codemirror/lang-cpp'; // Contains both C and C++

// Installed packages
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';

// Available languages
const languages: {
  [key: string]: {
    name: string;
    ext: string;
    support: any;
  };
} = {
  javascript: { name: 'JavaScript', ext: '.js', support: javascript() },
  typescript: { name: 'TypeScript', ext: '.ts', support: javascript() },
  python: { name: 'Python', ext: '.py', support: python() },
  java: { name: 'Java', ext: '.java', support: java() },
  html: { name: 'HTML', ext: '.html', support: html() },
  css: { name: 'CSS', ext: '.css', support: css() },
  json: { name: 'JSON', ext: '.json', support: json() },
  markdown: { name: 'Markdown', ext: '.md', support: markdown() },
  xml: { name: 'XML', ext: '.xml', support: xml() },
  yaml: { name: 'YAML', ext: '.yml', support: yaml() },
  go: { name: 'Go', ext: '.go', support: go() },
  rust: { name: 'Rust', ext: '.rs', support: rust() },
  php: { name: 'PHP', ext: '.php', support: php() },
  sql: { name: 'SQL', ext: '.sql', support: sql() },
  c: { name: 'C', ext: '.c', support: cpp() }, // Note: lang-cpp provides both C and C++
  cpp: { name: 'C++', ext: '.cpp', support: cpp() },
};

// Export both default and named so it can be imported as CodeEditor or CodeEditorV2
export default function CodeEditorV2({
  value = '',
  onChange = () => {},
  language = 'javascript',
  fileName = 'untitled.js',
  readOnly = false,
  className = '',
  height = '400px',
}: {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  fileName?: string;
  readOnly?: boolean;
  className?: string;
  height?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const langSupport = languages[language] || languages.javascript;
    const extensions = [
      basicSetup,
      keymap.of(defaultKeymap),
      indentUnit.of('  '),
      indentOnInput(),
      bracketMatching(),
      autocompletion(),
      highlightSelectionMatches(),
      langSupport?.support || javascript(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      foldGutter(),
      drawSelection(),
      rectangularSelection(),
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString();
          onChange(newValue);
        }
      }),
    ];

    const view = new EditorView({
      doc: value,
      extensions,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [value, language, onChange, readOnly]);

  return (
    <div className="w-full h-full border border-gray-700 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-900">
      <div ref={editorRef} className="w-full h-full overflow-auto" style={{ height }} />
    </div>
  );
}

// Named export for FileEditor to import as CodeEditor { CodeEditorV2 as CodeEditor };
