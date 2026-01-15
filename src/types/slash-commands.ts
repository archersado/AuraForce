/**
 * Slash Command Types
 *
 * Defines slash commands for Claude Code integration.
 * Users can type /command to directly invoke Claude Code functionality.
 */

export interface SDKSlashCommand {
  name: string;
  label: string;
  description: string;
  category: 'plugin' | 'sdk-command' | 'mcp-tool' | 'skill';
  icon: string;
  sourceInfo: { source: string; path: string };
  riskLevel?: 'safe' | 'moderate' | 'high';
}

/**
 * Slash command definition
 */
export interface SlashCommand {
  /**
   * Command name (what user types after /)
   * Example: "read" for /read
   */
  name: string;

  /**
   * Display label shown in command palette
   */
  label: string;

  /**
   * Description of what the command does
   */
  description: string;

  /**
   * Category for organization
   */
  category: CommandCategory;

  /**
   * Icon name (lucide-react)
   */
  icon: string;

  /**
   * Command alias/shortcut
   */
  alias?: string[];

  /**
   * Parameters configuration
   */
  params?: CommandParameter[];

  /**
   * Example usage
   */
  example?: string;

  /**
   * Whether this command confirmation is required
   */
  requiresConfirmation?: boolean;

  /**
   * Risk level for executing this command
   */
  riskLevel?: 'safe' | 'moderate' | 'high';
}

/**
 * Command categories
 */
export type CommandCategory =
  | 'file'        // File operations (read, write, create, delete)
  | 'code'        // Code operations (refactor, test, debug)
  | 'navigation'  // Navigate and search
  | 'system'      // System commands
  | 'session'     // Session management
  | 'help'        // Help and info
  | 'custom'      // Custom/extended commands
  | 'plugin'      // Plugin commands from SDK
  | 'sdk-command' // SDK custom commands
  | 'mcp-tool'    // MCP server tools
  | 'skill';      // AI skills and workflows

/**
 * Command parameter definition
 */
export interface CommandParameter {
  /**
   * Parameter name
   */
  name: string;

  /**
   * Parameter label displayed to user
   */
  label: string;

  /**
   * Parameter description
   */
  description?: string;

  /**
   * Whether parameter is required
   */
  required: boolean;

  /**
   * Parameter type
   */
  type: 'text' | 'file' | 'number' | 'boolean' | 'select';

  /**
   * Default value
   */
  defaultValue?: unknown;

  /**
   * Options for select type
   */
  options?: Array<{ value: string; label: string }>;

  /**
   * Validation regex pattern
   */
  pattern?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;
}

/**
 * Command category icons and colors
 */
export const commandCategoryIcons: Record<CommandCategory, string> = {
  file: 'FileText',
  code: 'Wrench',
  navigation: 'Search',
  system: 'Command',
  session: 'X',
  help: 'HelpCircle',
  custom: 'Lightbulb',
  plugin: 'Puzzle',
  'sdk-command': 'Terminal',
  'mcp-tool': 'Server',
  skill: 'Brain',
} as const;

export const commandCategoryColors: Record<CommandCategory, [string, string]> = {
  file: ['text-blue-600', 'bg-blue-50'],
  code: ['text-purple-600', 'bg-purple-50'],
  navigation: ['text-green-600', 'bg-green-50'],
  system: ['text-orange-600', 'bg-orange-50'],
  session: ['text-gray-600', 'bg-gray-50'],
  help: ['text-teal-600', 'bg-teal-50'],
  custom: ['text-pink-600', 'bg-pink-50'],
  plugin: ['text-indigo-600', 'bg-indigo-50'],
  'sdk-command': ['text-cyan-600', 'bg-cyan-50'],
  'mcp-tool': ['text-rose-600', 'bg-rose-50'],
  skill: ['text-emerald-600', 'bg-emerald-50'],
} as const;

/**
 * Available slash commands
 */
export const SLASH_COMMANDS: SlashCommand[] = [
  // File Operations
  {
    name: 'read',
    label: 'Read File',
    description: 'Read the contents of a file',
    category: 'file',
    icon: 'FileText',
    alias: ['cat'],
    params: [
      {
        name: 'path',
        label: 'File Path',
        description: 'Path to the file you want to read',
        required: true,
        type: 'text',
        placeholder: 'src/app/page.tsx',
      },
      {
        name: 'from_line',
        label: 'From Line',
        description: 'Starting line number (optional)',
        required: false,
        type: 'number',
        defaultValue: 1,
      },
    ],
    example: '/read src/app/page.tsx',
    riskLevel: 'safe',
  },
  {
    name: 'write',
    label: 'Write File',
    description: 'Write content to a file (create or overwrite)',
    category: 'file',
    icon: 'FileEdit',
    alias: ['create'],
    params: [
      {
        name: 'path',
        label: 'File Path',
        description: 'Path where the file will be written',
        required: true,
        type: 'text',
        placeholder: 'src/app/page.tsx',
      },
      {
        name: 'content',
        label: 'Content',
        description: 'Content to write to the file',
        required: true,
        type: 'text',
        placeholder: 'Enter file content...',
      },
    ],
    example: '/write src/app/page.tsx --content "Hello World"',
    requiresConfirmation: true,
    riskLevel: 'moderate',
  },
  {
    name: 'delete',
    label: 'Delete File',
    description: 'Delete a file from the file system',
    category: 'file',
    icon: 'Trash2',
    params: [
      {
        name: 'path',
        label: 'File Path',
        description: 'Path to the file to delete',
        required: true,
        type: 'text',
        placeholder: 'src/old-file.tsx',
      },
    ],
    example: '/delete src/old-file.tsx',
    requiresConfirmation: true,
    riskLevel: 'high',
  },

  // Code Operations
  {
    name: 'refactor',
    label: 'Refactor Code',
    description: 'Refactor code to improve quality and maintainability',
    category: 'code',
    icon: 'Wrench',
    params: [
      {
        name: 'target',
        label: 'Target',
        description: 'Function, class, or code section to refactor',
        required: true,
        type: 'text',
        placeholder: 'function handleAuth',
      },
      {
        name: 'path',
        label: 'File Path',
        description: 'File containing the code',
        required: true,
        type: 'text',
        placeholder: 'src/lib/auth.ts',
      },
    ],
    example: '/refactor "function handleAuth" src/lib/auth.ts',
    requiresConfirmation: true,
    riskLevel: 'moderate',
  },
  {
    name: 'test',
    label: 'Run Tests',
    description: 'Run tests for the project',
    category: 'code',
    icon: 'PlayCircle',
    alias: ['run-tests'],
    params: [
      {
        name: 'pattern',
        label: 'Test Pattern',
        description: 'Glob pattern for test files',
        required: false,
        type: 'text',
        placeholder: '*.test.tsx',
      },
      {
        name: 'watch',
        label: 'Watch Mode',
        description: 'Run tests in watch mode',
        required: false,
        type: 'boolean',
        defaultValue: false,
      },
    ],
    example: '/test --pattern "*.test.ts" --watch',
    riskLevel: 'safe',
  },
  {
    name: 'debug',
    label: 'Debug Code',
    description: 'Debug an issue or error in the codebase',
    category: 'code',
    icon: 'Bug',
    params: [
      {
        name: 'issue',
        label: 'Issue or Error',
        description: 'Describe the issue or paste the error',
        required: true,
        type: 'text',
        placeholder: 'TypeError: Cannot read property of undefined',
      },
      {
        name: 'context',
        label: 'Context',
        description: 'Additional context about the issue',
        required: false,
        type: 'text',
      },
    ],
    example: '/debug "TypeError: Cannot read property"',
    riskLevel: 'safe',
  },

  // Navigation
  {
    name: 'search',
    label: 'Search Code',
    description: 'Search for text or patterns in the codebase',
    category: 'navigation',
    icon: 'Search',
    alias: ['find'],
    params: [
      {
        name: 'query',
        label: 'Search Query',
        description: 'Text to search for',
        required: true,
        type: 'text',
        placeholder: 'useEffect',
      },
      {
        name: 'path',
        label: 'Path Filter',
        description: 'Limit search to specific path',
        required: false,
        type: 'text',
        placeholder: 'src/components',
      },
    ],
    example: '/search "useEffect" --path "src/components"',
    riskLevel: 'safe',
  },
  {
    name: 'grep',
    label: 'RegExp Search',
    description: 'Search using regular expressions',
    category: 'navigation',
    icon: 'Regex',
    params: [
      {
        name: 'pattern',
        label: 'RegEx Pattern',
        description: 'Regular expression to search',
        required: true,
        type: 'text',
        placeholder: 'import.*from',
      },
    ],
    example: '/grep "import.*from.*react"',
    riskLevel: 'safe',
  },

  // System Commands
  {
    name: 'explain',
    label: 'Explain Code',
    description: 'Get an explanation of what the code does',
    category: 'code',
    icon: 'Lightbulb',
    params: [
      {
        name: 'target',
        label: 'Target Code',
        description: 'Function, class, or code to explain',
        required: true,
        type: 'text',
      },
      {
        name: 'depth',
        label: 'Detail Level',
        description: 'How detailed the explanation should be',
        required: false,
        type: 'select',
        options: [
          { value: 'brief', label: 'Brief' },
          { value: 'detailed', label: 'Detailed' },
          { value: 'comprehensive', label: 'Comprehensive' },
        ],
        defaultValue: 'detailed',
      },
    ],
    example: '/explain "useSession" --depth detailed',
    riskLevel: 'safe',
  },
  {
    name: 'help',
    label: 'Show Help',
    description: 'Display available commands and their usage',
    category: 'help',
    icon: 'HelpCircle',
    example: '/help',
    riskLevel: 'safe',
  },
  {
    name: 'clear',
    label: 'Clear Chat',
    description: 'Clear the current chat conversation',
    category: 'session',
    icon: 'X',
    example: '/clear',
    riskLevel: 'safe',
  },

  // Custom Commands (extend as needed)
  {
    name: 'commit',
    label: 'Create Commit',
    description: 'Create a git commit with a message',
    category: 'system',
    icon: 'GitCommit',
    params: [
      {
        name: 'message',
        label: 'Commit Message',
        description: 'Commit message',
        required: true,
        type: 'text',
        placeholder: 'feat: add new feature',
      },
    ],
    example: '/commit --message "feat: add new feature"',
    requiresConfirmation: true,
    riskLevel: 'moderate',
  },
];

/**
 * Get command by name (handles aliases)
 */
export function getSlashCommand(name: string): SlashCommand | undefined {
  const normalizedName = name.toLowerCase().replace(/^\//, '');
  if (normalizedName === '') return undefined;
  return SLASH_COMMANDS.find(
    (cmd) =>
      cmd.name === normalizedName ||
      cmd.alias?.includes(normalizedName)
  );
}

/**
 * Get commands by category
 */
export function getCommandsByCategory(category: CommandCategory): SlashCommand[] {
  return SLASH_COMMANDS.filter((cmd) => cmd.category === category);
}

/**
 * Group commands by category
 */
export function groupCommandsByCategory(commands?: SlashCommand[]): Record<string, SlashCommand[]> {
  const commandList = commands || SLASH_COMMANDS;
  const groups: Record<string, SlashCommand[]> = {};

  for (const category of Object.keys(commandCategoryIcons)) {
    groups[category] = commandList.filter((cmd) => cmd.category === category);
  }

  return groups;
}

/**
 * Get all unique categories
 */
export function getCommandCategories(): CommandCategory[] {
  const categories = new Set<CommandCategory>();
  for (const cmd of SLASH_COMMANDS) {
    categories.add(cmd.category);
  }
  return Array.from(categories);
}

/**
 * Parse slash command input
 * Returns null if input is not a slash command
 */
export interface ParsedSlashCommand {
  command: SlashCommand;
  rawInput: string;
  args: Record<string, string>;
}

export function parseSlashCommand(input: string): ParsedSlashCommand | null {
  if (!input.trim().startsWith('/')) {
    return null;
  }

  const inputWithoutSlash = input.trim().slice(1);
  if (inputWithoutSlash === '') {
    return null;
  }

  const parts = inputWithoutSlash.split(/\s+/);
  const commandName = parts[0];
  const partsWithoutCommand = parts.slice(1);

  const command = getSlashCommand(commandName);
  if (!command) {
    return null;
  }

  const args: Record<string, string> = {};

  // Parse named arguments (--key value or --key=value)
  let i = 0;
  while (i < partsWithoutCommand.length) {
    const part = partsWithoutCommand[i];

    if (part.startsWith('--')) {
      const key = part.slice(2);

      if (key.includes('=')) {
        // --key=value format
        const [k, value] = key.split('=');
        args[k] = value;
        i++;
      } else {
        // --key value format
        args[key] = partsWithoutCommand[i + 1] || '';
        i += 2;
      }
    } else {
      // Positional argument - try to match with params
      const positionalParams = command.params?.filter((p) => p.required && !args[p.name]).slice(0, 1);
      if (positionalParams && positionalParams.length > 0) {
        args[positionalParams[0].name] = part;
      }
      i++;
    }
  }

  return {
    command,
    rawInput: input,
    args,
  };
}

/**
 * Fetch SDK commands from API
 * Returns dynamic commands from project plugins, tools, and skills
 */
export async function fetchSDKCommands(
  scanPath?: string
): Promise<Array<{ name: string; label: string; description: string; category: 'plugin' | 'sdk-command' | 'mcp-tool' | 'skill'; icon: string; sourceInfo: { source: string; path: string }; riskLevel?: 'safe' | 'moderate' | 'high' }>> {
  try {
    const url = new URL('/api/sdk/resources/slash-commands', window.location.origin);

    if (scanPath) {
      url.searchParams.append('path', scanPath);
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error('[fetchSDKCommands] Failed to fetch:', response.status);
      return [];
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error('[fetchSDKCommands] Error:', error);
    return [];
  }
}

/**
 * Get all commands including static and SDK commands
 */
export async function getAllCommands(params?: { scanPath?: string }): Promise<SlashCommand[]> {
  // Get all static commands first
  const staticCommands = [...SLASH_COMMANDS];

  // Try to get SDK commands (only works on client-side)
  try {
    if (typeof window !== 'undefined') {
      const sdkCommands = await fetchSDKCommands(params?.scanPath);

      // Convert SDK commands to SlashCommand format
      const convertedSDKCommands: SlashCommand[] = sdkCommands.map((cmd) => ({
        name: cmd.name,
        label: cmd.label,
        description: cmd.description,
        category: cmd.category,
        icon: cmd.icon,
        example: `/${cmd.name}`,
        riskLevel: cmd.riskLevel,
      }));

      return [...staticCommands, ...convertedSDKCommands];
    }
  } catch (error) {
    console.error('[getAllCommands] Failed to load SDK commands:', error);
  }

  return staticCommands;
}
