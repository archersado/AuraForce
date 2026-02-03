# AuraForce Code Editor - STORY-14-2

A powerful, feature-rich code editor built with CodeMirror 6 for the AuraForce platform.

## Quick Start

```tsx
import { CodeEditor } from '@/components/workspace/CodeEditor-v2';

<CodeEditor
  value={code}
  onChange={setCode}
  language="javascript"
  theme="dark"
  height="100%"
  fontSize={14}
  lineNumbers={true}
  codeFolding={true}
/>
```

## Features

### Core Features ✅

- **Syntax Highlighting** - Support for 20+ programming languages
- **Code Autocompletion** - Intelligent keyword suggestions
- **Code Folding** - Collapse and expand code blocks
- **Line Numbers** - Clearly visible line numbers
- **Multiple Cursors** - Edit multiple locations simultaneously

### Advanced Features ✨

- **Theme Support** - Light and dark themes (One Dark)
- **Keyboard Shortcuts** - Full keyboard support
- **Hover Tooltips** - Keyword descriptions
- **Bracket Matching** - Auto-highlight matching brackets
- **Search & Replace** - Integrated search (Ctrl+F, Ctrl+H)
- **Language Detection** - Automatic language detection from filename
- **Responsive Design** - Adjustable font size and height

## Supported Languages

1. JavaScript / TypeScript / JSX / TSX
2. Python
3. Java
4. C / C++
5. Go
6. Rust
7. PHP
8. HTML / HTML5
9. CSS / SCSS / Sass
10. JSON
11. XML
12. YAML
13. Markdown
14. SQL
15. Shell (Bash/Zsh)
16. Text

## Installation

All required dependencies are already installed:

```bash
npm install @codemirror/language @codemirror/view @codemirror/state
npm install @codemirror/lang-javascript @codemirror/lang-python
# ... other language packages
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Editor content |
| `onChange` | `(value: string) => void` | - | Content change callback |
| `language` | `string` | `'text'` | Programming language |
| `theme` | `'light' \| 'dark'` | `'dark'` | Editor theme |
| `fontSize` | `number` | `14` | Font size in pixels (12-24) |
| `lineHeight` | `number` | `1.6` | Line height multiplier |
| `lineNumbers` | `boolean` | `true` | Show line numbers |
| `wrapLines` | `boolean` | `false` | Enable word wrap |
| `codeFolding` | `boolean` | `true` | Enable code folding |
| `minimap` | `boolean` | `true` | Show minimap |
| `bracketMatching` | `boolean` | `true` | Enable bracket matching |
| `indentUnit` | `number` | `2` | Indentation size (spaces) |
| `tabSize` | `number` | `2` | Tab size |
| `readOnly` | `boolean` | `false` | Make editor read-only |
| `onCursorPositionChange` | `(pos: {line, col}) => void` | - | Cursor position callback |
| `onSave` | `() => void` | - | Save callback (Ctrl+S) |

## Examples

### Basic Usage

```tsx
import { useState } from 'react';
import { CodeEditor } from '@/components/workspace/CodeEditor-v2';

function App() {
  const [code, setCode] = useState('console.log("Hello!");');

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language="javascript"
      theme="dark"
    />
  );
}
```

### With Language Detection

```tsx
import { detectLanguageFromFileName } from '@/components/workspace/CodeEditor.utils';

function FileEditor({ fileName, content }) {
  const language = detectLanguageFromFileName(fileName);

  return (
    <CodeEditor
      value={content}
      onChange={(newContent) => console.log(newContent)}
      language={language}
    />
  );
}
```

### Advanced Configuration

```tsx
<CodeEditor
  value={code}
  onChange={setCode}
  language="python"
  theme="light"
  height="800px"
  fontSize={16}
  lineHeight={1.8}
  lineNumbers={true}
  wrapLines={true}
  codeFolding={true}
  minimap={false}
  bracketMatching={true}
  indentUnit={4}
  tabSize={4}
  onCursorPositionChange={(pos) => {
    console.log(`Line ${pos.line}, Column ${pos.col}`);
  }}
  onSave={() => {
    console.log('Saving...');
  }}
/>
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save |
| `Ctrl+Space` | Autocomplete |
| `Ctrl+F` | Find |
| `Ctrl+H` | Replace |
| `Ctrl+/` | Toggle comment |
| `Ctrl+[` | Fold code |
| `Alt+Click` | Add cursor |
| `Alt+Shift+Drag` | Rectangular selection |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |

## Demo

Visit `/code-editor-demo` for an interactive demo showcasing all features.

## Testing

Run the test component:

```tsx
import { CodeEditorTest } from '@/components/workspace/CodeEditorTest';

export default function TestPage() {
  return <CodeEditorTest />;
}
```

## Development

### File Structure

```
src/components/workspace/
├── CodeEditor-v2.tsx          # Main editor component
├── CodeEditor.types.ts        # TypeScript definitions
├── CodeEditor.utils.ts        # Utility functions
├── CodeEditor.examples.ts     # Test code examples
├── CodeEditor.README.md       # This file
├── CodeEditor.index.ts        # Export module
├── CodeEditorTest.tsx         # Test component
└── FileEditor-v2.tsx          # Enhanced file editor
```

### Adding a New Language

1. Check if the language package is available:
   ```bash
   npm list @codemirror/lang-[language-name]
   ```

2. If not, install it:
   ```bash
   npm install @codemirror/lang-[language-name]
   ```

3. Update `CodeEditor-v2.tsx`:
   ```tsx
   import { newLanguage } from '@codemirror/lang-newLanguage';

   // Add to getLanguageExtension function
   case 'newlang':
     return newLanguage();
   ```

4. Update `CodeEditor.utils.ts`:
   ```ts
   'newlang': { name: 'New Language', value: 'newlang', extensions: ['newlang'] }
   ```

## Troubleshooting

### Editor not rendering

Make sure the parent container has a defined height:
```tsx
<div style={{ height: '500px' }}>
  <CodeEditor value={code} onChange={setCode} />
</div>
```

### Language not working

Check that:
1. The language package is installed
2. The language name is correct in the `language` prop
3. The language is supported in `getLanguageExtension()`

### Autocomplete not triggering

- Press `Ctrl+Space` to manually trigger
- Check that `autocompletion` extension is loaded
- Ensure keywords are defined for the language

## Performance Tips

For large files (> 1MB), use the `LargeFileHandler` component:

```tsx
const fileSize = metadata?.size || 0;

if (fileSize > 1 * 1024 * 1024) {
  return (
    <LargeFileHandler
      content={content}
      onChange={setValue}
      readOnly={readOnly}
      fileName={fileName}
      language={language}
    />
  );
}

return (
  <CodeEditor value={content} onChange={setValue} language={language} />
);
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## License

MIT

## Contributing

This is part of the AuraForce project. Please follow the project's contribution guidelines.

## Support

For issues or questions, please contact the Frontend Team.
