/**
 * SDK Resources Types
 *
 * Defines types for Claude Agent SDK resources that can be discovered and loaded.
 */

/**
 * Resource types discovered from project
 */
export type ResourceType = 'plugin' | 'command' | 'mcp-server' | 'skill' | 'template';

/**
 * Base interface for all SDK resources
 */
export interface SDKResource {
  id: string;
  type: ResourceType;
  name: string;
  description?: string;
  source: string;
  // Location in the project
  path: string;
  // Whether this is enabled
  enabled: boolean;
  icon?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Plugin resource (Bmad modules, NextUI plugins, etc.)
 */
export interface PluginResource extends SDKResource {
  type: 'plugin';
  pluginType: 'module' | 'component' | 'utility' | 'integration';
  version?: string;
  dependencies?: string[];
  author?: string;
  commands?: string[]; // Commands provided by this plugin
}

/**
 * Command resource (custom CLI commands, scripts)
 */
export interface CommandResource extends SDKResource {
  type: 'command';
  commandType: 'cli' | 'script' | 'npm';
  executable: string; // e.g., 'npx', 'node', 'npm'
  arguments?: string[];
  icon?: string;
  riskLevel?: 'safe' | 'moderate' | 'high';
}

/**
 * MCP Server resource
 */
export interface MCPServerResource extends SDKResource {
  type: 'mcp-server';
  serverType: 'stdio' | 'sse' | 'local';
  command?: string; // for stdio
  url?: string; // for sse
  tools?: string[]; // tools available in this MCP server
}

/**
 * Skill resource (AI skills, workflows, agents)
 */
export interface SkillResource extends SDKResource {
  type: 'skill';
  skillType: 'agent' | 'workflow' | 'prompt' | 'command';
  category?: string;
  examples?: string[];
}

/**
 * Template resource (project templates, scaffolding)
 */
export interface TemplateResource extends SDKResource {
  type: 'template';
  templateType: 'project' | 'component' | 'page' | 'feature';
  languages?: string[];
  frameworks?: string[];
}

/**
 * Scan result response from API
 */
export interface SDKResourcesResult {
  resources: SDKResource[];
  scanPath: string;
  scanTime: string;
  summary: {
    total: number;
    byType: Record<ResourceType, number>;
  };
}

/**
 * Category for slash commands from SDK resources
 */
export type SDKCommandCategory = 'plugin' | 'sdk-command' | 'mcp-tool' | 'skill';

/**
 * Extended slash command that represents an SDK resource
 */
export interface SDKSlashCommand {
  name: string;
  label: string;
  description: string;
  category: SDKCommandCategory;
  icon: string;
  sourceInfo: {
    source: string; // e.g., 'plugin:my-plugin', 'mcp:filesystem'
    path: string;
  };
  params?: Array<{
    name: string;
    label: string;
    required: boolean;
    type: 'text' | 'file' | 'number' | 'boolean' | 'select';
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
  example?: string;
  riskLevel?: 'safe' | 'moderate' | 'high';
}
