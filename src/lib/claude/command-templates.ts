/**
 * Claude Command Templates
 *
 * Defines reusable command templates for common Claude Code operations.
 * Templates use pattern matching to extract parameters from natural language.
 */

import type { CommandTemplate, CommandType } from './types';

/**
 * Built-in command templates
 */
export const commandTemplates: CommandTemplate[] = [
  // WRITE/CREATE Operations
  {
    id: 'create-component',
    pattern: /create (?:a )?(?:new )?(react|vue|angular) component (?:called |named )?["']?(\w+)["']?/i,
    intent: 'write' as CommandType,
    action: 'create-component',
    parameterMatch: {
      type: /(?:react|vue|angular)/i,
      name: /(\w+)/,
    },
    description: 'Create a new component file',
    examples: [
      'Create a React component called Navbar',
      'Create a new Vue component named Sidebar',
      'create component Header in React',
    ],
  },
  {
    id: 'create-file',
    pattern: /create (?:a )?(?:new )?(?:file )?(?:called |named )?["']?([^"']+)["']?/i,
    intent: 'write' as CommandType,
    action: 'create-file',
    parameterMatch: {
      filename: /[^"']+/,
    },
    description: 'Create a new file',
    examples: [
      'Create a file called utils.ts',
      'Create new file helpers.js',
      'Create file config.json',
    ],
  },
  {
    id: 'write-code',
    pattern: /write (?:a)?(?:function|class|code) (?:called |named )?["']?(\w+)["']?(?:that (?:does|implements) (.+))?/i,
    intent: 'write' as CommandType,
    action: 'write-code',
    parameterMatch: {
      name: /(\w+)/,
      implementation: /(?:does|implements) (.+)/,
    },
    description: 'Write new code implementation',
    examples: [
      'Write a function called fetchData',
      'Write a class named UserService that manages user data',
      'Write code for auth middleware',
    ],
  },

  // READ Operations
  {
    id: 'read-file',
    pattern: /read (?:file )?(?:called |named )?["']?([^"']+)["']?/i,
    intent: 'read' as CommandType,
    action: 'read-file',
    parameterMatch: {
      filename: /[^"']+/,
    },
    description: 'Read and display a file',
    examples: [
      'Read file app.tsx',
      'Read package.json',
      'Read the file called README.md',
    ],
  },
  {
    id: 'show-file',
    pattern: /show (?:me )?(?:the )?(?:file )?(?:called |named )?["']?([^"']+)["']?/i,
    intent: 'read' as CommandType,
    action: 'read-file',
    parameterMatch: {
      filename: /[^"']+/,
    },
    description: 'Display file contents',
    examples: [
      'Show me the file index.html',
      'Show package.json',
      'Show the file config.ts',
    ],
  },
  {
    id: 'list-files',
    pattern: /(list|show) (?:all )?(?:files|directories)/i,
    intent: 'read' as CommandType,
    action: 'list-files',
    parameterMatch: {},
    description: 'List all files in current directory',
    examples: [
      'List all files',
      'Show files',
      'List directories',
    ],
  },

  // DEBUG Operations
  {
    id: 'debug-function',
    pattern: /debug (?:the )?(?:function )?(?:called |named )?["']?(\w+)["']?/i,
    intent: 'debug' as CommandType,
    action: 'debug-function',
    parameterMatch: {
      functionName: /(\w+)/,
    },
    description: 'Debug a specific function',
    examples: [
      'Debug the function fetchData',
      'Debug authenticateUser',
      'Debug function handleSubmit',
    ],
  },
  {
    id: 'find-bug',
    pattern: /find (?:the )?(?:bug|issue|problem)(?: in)?(?: the)?(?: file )?(?:called |named )?["']?([^"']+)["']?/i,
    intent: 'debug' as CommandType,
    action: 'find-bug',
    parameterMatch: {
      filename: /[^"']+/,
    },
    description: 'Find and identify bugs in code',
    examples: [
      'Find the bug in app.tsx',
      'Find issues in utils.js',
      'Find the problem in the authentication code',
    ],
  },
  {
    id: 'fix-error',
    pattern: /fix (?:the )?(?:error|bug)(?: in)?(?: the)?(?: file )?(?:called |named )?["']?([^"']+)["']?/i,
    intent: 'debug' as CommandType,
    action: 'fix-error',
    parameterMatch: {
      filename: /[^"']+/,
    },
    description: 'Fix identified errors',
    examples: [
      'Fix the error in app.tsx',
      'Fix bugs in utils.js',
      'Fix the error',
    ],
  },

  // EXPLAIN Operations
  {
    id: 'explain-code',
    pattern: /explain (?:this )?(?:code|function|file)/i,
    intent: 'explain' as CommandType,
    action: 'explain-code',
    parameterMatch: {},
    description: 'Explain the selected code',
    examples: [
      'Explain this code',
      'Explain the function',
      'Explain the file',
    ],
  },
  {
    id: 'explain-function',
    pattern: /explain (?:the )?(?:function )?(?:called |named )?["']?(\w+)["']?/i,
    intent: 'explain' as CommandType,
    action: 'explain-function',
    parameterMatch: {
      functionName: /(\w+)/,
    },
    description: 'Explain a specific function',
    examples: [
      'Explain the function fetchData',
      'Explain authenticateUser',
      'Explain function with name processOrder',
    ],
  },
  {
    id: 'how-does-work',
    pattern: /how does (?:the )?(?:code|function|file) (?:called |named )?["']?(\w+)["']? work/i,
    intent: 'explain' as CommandType,
    action: 'explain-function',
    parameterMatch: {
      functionName: /(\w+)/,
    },
    description: 'Explain how code works',
    examples: [
      'How does the function fetchData work',
      'How does authenticateUser work',
      'How does this code work',
    ],
  },

  // REFACTOR Operations
  {
    id: 'refactor-code',
    pattern: /refactor (?:the )?(?:code|function)(?: called)?(?: named)?:?["']?(\w+)?["']?/i,
    intent: 'refactor' as CommandType,
    action: 'refactor-code',
    parameterMatch: {
      functionName: /(\w+)/,
    },
    description: 'Refactor and improve code',
    examples: [
      'Refactor the code',
      'Refactor function fetchData',
      'Refactor: updateUserData',
    ],
  },
  {
    id: 'improve-code',
    pattern: /improve (?:the )?(?:code|file|function)/i,
    intent: 'refactor' as CommandType,
    action: 'refactor-code',
    parameterMatch: {},
    description: 'Improve code quality',
    examples: [
      'Improve the code',
      'Improve this function',
      'Make the code better',
    ],
  },

  // TEST Operations
  {
    id: 'write-test',
    pattern: /write (?:a )?(?:unit )?(?:test for )?(?:the )?(?:function )?(?:called |named )?["']?(\w+)["']?/i,
    intent: 'test' as CommandType,
    action: 'write-test',
    parameterMatch: {
      functionName: /(\w+)/,
    },
    description: 'Write tests for the code',
    examples: [
      'Write a test for fetchData',
      'Write unit tests for authenticateUser',
      'Write test function handleSubmit',
    ],
  },
  {
    id: 'run-tests',
    pattern: /run (?:the )?(?:tests|test suite)/i,
    intent: 'test' as CommandType,
    action: 'run-tests',
    parameterMatch: {},
    description: 'Run the test suite',
    examples: [
      'Run tests',
      'Run the test suite',
      'Execute tests',
    ],
  },

  // EXECUTE Operations
  {
    id: 'run-script',
    pattern: /run (?:the )?(?:script|command|npm script) (?:called |named )?["']?([^"']+)["']?/i,
    intent: 'execute' as CommandType,
    action: 'run-script',
    parameterMatch: {
      scriptName: /[^"']+/,
    },
    description: 'Execute a script or command',
    examples: [
      'Run the script build',
      'Run npm script dev',
      'Execute command start',
    ],
  },
  {
    id: 'build-project',
    pattern: /build (?:the )?(?:project|app)/i,
    intent: 'execute' as CommandType,
    action: 'build-project',
    parameterMatch: {},
    description: 'Build the project',
    examples: [
      'Build the project',
      'Build the app',
      'Run build',
    ],
  },
];

/**
 * Get templates by command type
 */
export function getTemplatesByType(type: string): CommandTemplate[] {
  return commandTemplates.filter((template) => template.intent === type);
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): CommandTemplate | undefined {
  return commandTemplates.find((template) => template.id === id);
}

/**
 * Find template that matches the given input
 */
export function findMatchingTemplate(
  input: string
): { template: CommandTemplate; matches: RegExpMatchArray } | null {
  for (const template of commandTemplates) {
    const matches = input.match(template.pattern);
    if (matches) {
      return { template, matches };
    }
  }
  return null;
}
