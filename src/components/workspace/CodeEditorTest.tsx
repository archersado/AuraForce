/**
 * CodeEditor Test Component
 *
 * Simple test component to verify the code editor functionality
 */

'use client';

import { useState } from 'react';
import { CodeEditor } from './CodeEditor-v2';

export function CodeEditorTest() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(
    `// Welcome to AuraForce Code Editor!

function greet(name) {
  return \`Hello, \${name}!\`;
}

const result = greet('Developer');
console.log(result);

// Try:
// - Changing the language (Python, Java, Go, Rust, etc.)
// - Using keyboard shortcuts (Ctrl+S to save, Ctrl+Space for autocomplete)
// - Adding multiple cursors (Alt+Click)
// - Folding code blocks (click ▶ in gutter)
`
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <label>
          Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-2 px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
        </label>
      </div>

      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          theme="dark"
          height="500px"
          fontSize={14}
          lineNumbers={true}
          wrapLines={false}
          codeFolding={true}
          minimap={true}
          bracketMatching={true}
          onSave={() => alert('Code saved!')}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Status:</strong> {code.split('\n').length} lines, {code.length} characters</p>
      </div>
    </div>
  );
}

export default CodeEditorTest;
