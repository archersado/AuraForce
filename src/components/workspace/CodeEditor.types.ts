/**
 * Code Editor Types
 *
 * Type definitions for the code editor component
 */

export interface CodeEditorLanguage {
  name: string;
  extensions: string[];
  aliases?: string[];
  mimeTypes?: string[];
}

export interface CodeEditorTheme {
  name: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    selection: string;
    lineHighlight: string;
    gutter: string;
    gutterForeground: string;
    cursor: string;
  };
}

export interface CodeEditorOptions {
  autoIndent?: boolean;
 autoCloseBrackets?: boolean;
  autoCloseQuotes?: boolean;
  matchBrackets?: boolean;
  showLineNumbers?: boolean;
  wordWrap?: boolean;
  tabSize?: number;
  indentUnit?: number;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  minimap?: boolean;
  codeFolding?: boolean;
  bracketMatching?: boolean;
  highlightSelectionMatches?: boolean;
  scrollBeyondLastLine?: boolean;
  renderWhitespace?: boolean;
}

export interface CursorPosition {
  line: number;
  column: number;
  position: number;
}

export interface EditorSelection {
  from: number;
  to: number;
  primary: boolean;
}

export interface EditorState {
  content: string;
  selections: EditorSelection[];
  cursorPosition: CursorPosition;
  language: string;
}

export interface CompletionItem {
  label: string;
  type: 'keyword' | 'function' | 'variable' | 'class' | 'interface' | 'type';
  detail?: string;
  documentation?: string;
  boost?: number;
}

export interface HoverTooltip {
  pos: number;
  end: number;
  above: boolean;
  content: string | { text: string; html?: boolean };
}

export interface FoldedCode {
  from: number;
  to: number;
  collapsed: boolean;
}

export interface CodeEditorAPI {
  getValue(): string;
  setValue(value: string): void;
  getLanguage(): string;
  setLanguage(language: string): void;
  setTheme(theme: 'light' | 'dark'): void;
  getSelections(): EditorSelection[];
  setSelection(selections: EditorSelection[]): void;
  focus(): void;
  blur(): void;
  undo(): void;
  redo(): void;
  formatDocument(): void;
  find(pattern: string, options?: FindOptions): FindResult[];
  replace(pattern: string, replacement: string): number;
}

export interface FindOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  regexp?: boolean;
}

export interface FindResult {
  from: number;
  to: number;
  match: string;
}

export interface LanguageSupport {
  name: string;
  extensions: string[];
  keywords: string[];
  comment: {
    line: string;
    block?: { open: string; close: string };
  };
  indentUnit?: number;
  brackets?: string[][];
}

// Language-specific configurations
export const LANGUAGE_CONFIGS: Record<string, LanguageSupport> = {
  javascript: {
    name: 'JavaScript',
    extensions: ['js', 'jsx', 'mjs', 'cjs'],
    keywords: [
      'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
      'class', 'extends', 'import', 'export', 'default', 'async', 'await',
      'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'typeof', 'instanceof',
    ],
    comment: {
      line: '//',
      block: { open: '/*', close: '*/' },
    },
    indentUnit: 2,
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  },
  typescript: {
    name: 'TypeScript',
    extensions: ['ts', 'tsx', 'mts', 'cts'],
    keywords: [
      'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
      'class', 'extends', 'import', 'export', 'default', 'async', 'await',
      'interface', 'type', 'enum', 'implements', 'public', 'private', 'protected',
      'readonly', 'abstract', 'static', 'get', 'set', 'typeof', 'instanceof',
    ],
    comment: {
      line: '//',
      block: { open: '/*', close: '*/' },
    },
    indentUnit: 2,
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  },
  python: {
    name: 'Python',
    extensions: ['py', 'pyw'],
    keywords: [
      'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue',
      'return', 'yield', 'import', 'from', 'as', 'try', 'except', 'finally',
      'raise', 'with', 'lambda', 'pass', 'assert', 'del', 'global', 'nonlocal',
    ],
    comment: {
      line: '#',
    },
    indentUnit: 4,
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  },
  // Add more language configs as needed...
};

export default CodeEditorOptions;
