/**
 * Fix for FileEditor import error
 */

// Find this line in FileEditor.tsx:
// import { CodeEditor } from './CodeEditor-v2';

// And change it to match the named export
// import { CodeEditorV2 as CodeEditor } from './CodeEditor-v2';
