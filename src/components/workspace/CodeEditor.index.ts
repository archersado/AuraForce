/**
 * CodeEditor Components Module
 *
 * Exports all code editor related components, utilities, and types
 */

// Main component
export { CodeEditor } from './CodeEditor-v2';

// Deprecated - kept for backward compatibility
export { CodeEditor as CodeEditorLegacy } from './CodeEditor';

// Types
export type {
  CodeEditorLanguage,
  CodeEditorTheme,
  CodeEditorOptions,
  CursorPosition,
  EditorSelection,
  EditorState,
  CompletionItem,
  HoverTooltip,
  FoldedCode,
  CodeEditorAPI,
  FindOptions,
  FindResult,
  LanguageSupport,
} from './CodeEditor.types';

// Utilities
export {
  detectLanguageFromFileName,
  detectLanguageFromPath,
  detectLanguageFromContent,
  getFileIcon,
  normalizeLanguage,
  getSupportedLanguages,
  isLanguageSupported,
  EXTENSION_MAP,
} from './CodeEditor.utils';

// Examples
export { testExamples } from './CodeEditor.examples';

// Re-export main types for convenience
export { languageDescriptions } from './CodeEditor-v2';
