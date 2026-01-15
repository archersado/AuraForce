/**
 * SDK Resources Scanner Service
 *
 * Scans the project directory to discover Claude Agent SDK resources:
 * - Skills (AI skills, workflows, agents)
 * - MCP Servers (Model Context Protocol servers)
 * - Plugins (Bmad modules, components, utilities)
 * - Subagents (Claude subagents)
 * - Claude Commands (claude commands from SDK)
 *
 * Target directories:
 * 1. Global Claude SDK resources (user home)
 * 2. Project-specific resources in: .claude/, cc/, .clauderc, clauderc
 *
 * Does NOT include: npm scripts, build tools, or other development commands
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type {
  SDKResource,
  ResourceType,
  CommandResource,
  MCPServerResource,
  SkillResource,
  SDKResourcesResult,
} from '@/types/sdk-resources';

/**
 * Configuration for SDK resource scanning
 */
interface ScanConfig {
  scanPath: string;
  includeGenericDirs: boolean; // Include directories like bmad, workflows regardless
}

/**
 * Scanner for detecting SDK resources in a project
 */
export class SDKResourcesScanner {
  private config: ScanConfig;

  constructor(config?: Partial<ScanConfig>) {
    this.config = {
      scanPath: config?.scanPath || process.cwd(),
      includeGenericDirs: config?.includeGenericDirs || false,
    };
  }

  /**
   * Check if a path should be included (complements shouldExclude)
   */
  private shouldInclude(filePath: string): boolean {
    // First check standard excludes
    const excludePatterns = [
      /node_modules/,
      /\.next/,
      /\.git/,
      /dist/,
      /build/,
      /coverage/,
      /\.cache/,
      /tmp/,
      /temp/,
    ];

    // Always exclude certain patterns
    for (const pattern of excludePatterns) {
      if (pattern.test(filePath)) {
        return false;
      }
    }

    // For files/directories, check if they're in Claude-specific directories
    const relativePath = path.relative(this.config.scanPath, filePath);
    const parts = relativePath.split(path.sep);

    const claudeDirs = ['.claude', 'cc', '.clauderc', 'clauderc', '_bmad', 'bmad'];
    const isInClaudeDir = parts.some(p => claudeDirs.includes(p.toLowerCase()));

    // Include if in Claude dirs OR if includeGenericDirs is true
    return isInClaudeDir || this.config.includeGenericDirs;
  }

  /**
   * Check if a path should be excluded from scanning
   */
  private shouldExclude(filePath: string): boolean {
    return !this.shouldInclude(filePath);
  }

  /**
   * Recursively scan directories for resources
   */
  private async scanDirectory(dir: string, depth = 0): Promise<string[]> {
    const maxDepth = 15; // Prevent infinite recursion
    // Don't exclude root dir - always scan it to find Claude directories
    if (depth > maxDepth || (depth > 0 && this.shouldExclude(dir))) {
      return [];
    }

    const results: string[] = [];

    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subResults = await this.scanDirectory(fullPath, depth + 1);
          results.push(...subResults);
        } else {
          if (this.shouldInclude(fullPath)) {
            results.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      console.warn(`[SDK Scanner] Cannot read directory: ${dir}`, error);
    }

    return results;
  }

  /**
   * Generate a unique and meaningful name for a resource based on its path
   */
  private generateResourceName(filePath: string, type: 'agent' | 'workflow' | 'plugin' | 'skill' | 'command' | 'mcp'): string {
    const relativePath = path.relative(this.config.scanPath, filePath);
    const parts = relativePath.split(path.sep);
    const fileName = path.basename(filePath, path.extname(filePath));

    const dirNames = parts.slice(0, -1);
    const parentDir = dirNames.length > 0 ? dirNames[dirNames.length - 1] : '';
    const grandParentDir = dirNames.length > 1 ? dirNames[dirNames.length - 2] : '';

    const genericNames = ['workflow', 'workflows', 'agent', 'agents', 'template', 'templates', '_config', '_bmad', 'skills', 'commands', 'mcp', 'plugins'];

    const meaningfulParts: string[] = [];

    // Add meaningful grandparent directory
    if (grandParentDir && !genericNames.includes(grandParentDir.toLowerCase())) {
      meaningfulParts.push(grandParentDir);
    }

    // Add parent directory if it's not generic
    if (parentDir && !genericNames.includes(parentDir.toLowerCase()) && parentDir !== grandParentDir) {
      meaningfulParts.push(parentDir);
    }

    // Add filename if it's not generic or if we don't have enough parts
    if (!genericNames.includes(fileName.toLowerCase()) || meaningfulParts.length === 0) {
      let cleanFileName = fileName
        .replace(/\.customize$/, '')
        .replace(/\.template$/, '')
        .replace(/^_/, '');
      meaningfulParts.push(cleanFileName);
    }

    // Special handling for _config/agents - use the filename as primary name
    if (parentDir === 'agents' && grandParentDir === '_config') {
      const cleanName = fileName
        .replace(/\.customize$/, '')
        .replace(/^bmm-/, '')
        .replace(/^cis-/, '')
        .replace(/^core-/, '')
        .replace(/^_/g, '');
      return cleanName;
    }

    const baseName = meaningfulParts.join('-');
    return baseName || fileName;
  }

  /**
   * Detect Claude Agent SDK skills (skills, workflows, agents)
   */
  private detectClaudeSkills(filePath: string): SkillResource | null {
    const relativePath = path.relative(this.config.scanPath, filePath);
    const dirName = path.dirname(relativePath).toLowerCase();

    // Check for agent files
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for agent definition files
      if (dirName.includes('agents') || dirName.includes('subagents')) {
        const name = this.generateResourceName(filePath, 'agent');
        return {
          id: `claude-agent-${name.replace(/\//g, '-')}`,
          type: 'skill',
          skillType: 'agent',
          name: name,
          description: `Claude Agent: ${name}`,
          source: 'claude-sdk',
          path: relativePath,
          enabled: true,
          icon: 'Bot',
          category: 'agent',
        };
      }

      // Check for workflow files
      if (dirName.includes('workflows') || dirName.includes('skills')) {
        const name = this.generateResourceName(filePath, 'workflow');
        return {
          id: `claude-workflow-${name.replace(/\//g, '-')}`,
          type: 'skill',
          skillType: 'workflow',
          name: name,
          description: `Claude Workflow: ${name}`,
          source: 'claude-sdk',
          path: relativePath,
          enabled: true,
          icon: 'Workflow',
          category: 'workflow',
        };
      }

      // Check for Bmad agent/workflow files with specific patterns
      if (content.includes('name:') && (content.includes('agents:') || content.includes('role:'))) {
        const name = this.generateResourceName(filePath, 'skill');
        return {
          id: `claude-skill-${name.replace(/\//g, '-')}`,
          type: 'skill',
          skillType: 'agent',
          name: name,
          description: `Claude Skill: ${name}`,
          source: 'claude-sdk',
          path: relativePath,
          enabled: true,
          icon: 'Brain',
          category: 'skill',
        };
      }
    }

    // Check for TypeScript/JavaScript skill files
    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
      const baseName = path.basename(filePath, path.extname(filePath));

      if (dirName.includes('skills') || dirName.includes('commands')) {
        return {
          id: `claude-command-${baseName}`,
          type: 'skill',
          skillType: 'command',
          name: baseName,
          description: `Claude Command: ${baseName}`,
          source: 'claude-sdk',
          path: relativePath,
          enabled: true,
          icon: 'Terminal',
          category: 'command',
        };
      }
    }

    return null;
  }

  /**
   * Detect MCP servers configuration
   */
  private detectMCPServers(filePath: string): MCPServerResource | null {
    const relativePath = path.relative(this.config.scanPath, filePath);
    const dirName = path.dirname(relativePath).toLowerCase();

    // Check for Claude Desktop MCP config
    if (dirName.includes('mcp') && (filePath.endsWith('.json') || filePath.endsWith('.yaml'))) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');

        if (filePath.endsWith('.json')) {
          const config = JSON.parse(content);

          for (const [name, serverConfig] of Object.entries(config as Record<string, any>)) {
            const server: MCPServerResource = {
              id: `mcp-${name}`,
              type: 'mcp-server',
              name: name,
              description: serverConfig.description || `MCP server: ${name}`,
              source: 'claude-mcp',
              path: relativePath,
              enabled: true,
              serverType: 'stdio',
              command: serverConfig.command,
              metadata: {
                args: serverConfig.args,
                env: serverConfig.env,
              },
            };

            if (serverConfig.url) {
              server.serverType = 'sse';
              server.url = serverConfig.url;
            }

            return server;
          }
        }
      } catch (error) {
        console.warn(`[SDK Scanner] Failed to parse MCP config: ${filePath}`, error);
      }
    }

    return null;
  }

  /**
   * Scan for all SDK resources
   */
  async scan(): Promise<SDKResourcesResult> {
    console.log(`[SDK Scanner] Starting scan at: ${this.config.scanPath}`);

    const files = await this.scanDirectory(this.config.scanPath);
    const resources: SDKResource[] = [];

    console.log(`[SDK Scanner] Found ${files.length} files to analyze`);

    for (const filePath of files) {
      try {
        // Detect Claude skills/workflows/agents
        const skill = this.detectClaudeSkills(filePath);
        if (skill) {
          console.log(`[SDK Scanner] Detected skill: ${skill.name}`);
          resources.push(skill);
          continue;
        }

        // Detect MCP servers
        const mcpServer = this.detectMCPServers(filePath);
        if (mcpServer) {
          console.log(`[SDK Scanner] Detected MCP server: ${mcpServer.name}`);
          resources.push(mcpServer);
          continue;
        }
      } catch (error) {
        console.warn(`[SDK Scanner] Failed to analyze file: ${filePath}`, error);
      }
    }

    // Calculate summary
    const byType: Record<ResourceType, number> = {
      plugin: 0,
      command: 0,
      'mcp-server': 0,
      skill: 0,
      template: 0,
    };

    for (const resource of resources) {
      byType[resource.type]++;
    }

    const result: SDKResourcesResult = {
      resources,
      scanPath: this.config.scanPath,
      scanTime: new Date().toISOString(),
      summary: {
        total: resources.length,
        byType,
      },
    };

    console.log(`[SDK Scanner] Scan complete. Found ${result.summary.total} resources:`, result.summary.byType);

    return result;
  }

  /**
   * Convert SDK resources to slash commands for the UI
   */
  resourcesToSlashCommands(resources: SDKResource[]) {
    return resources.map((resource) => {
      const baseCommand = {
        name: resource.name,
        label: resource.name,
        description: resource.description || resource.name,
        icon: resource.icon || 'Zap',
        sourceInfo: {
          source: resource.source,
          path: resource.path,
        },
        riskLevel: 'safe' as const,
      };

      if (resource.type === 'command') {
        return {
          ...baseCommand,
          category: 'sdk-command' as const,
          riskLevel: (resource as CommandResource).riskLevel || 'safe',
        };
      }

      if (resource.type === 'mcp-server') {
        return {
          ...baseCommand,
          category: 'mcp-tool' as const,
          name: `mcp:${resource.name}`,
          label: `MCP: ${resource.name}`,
        };
      }

      if (resource.type === 'skill') {
        const skill = resource as SkillResource;
        let name = resource.name;
        let label = `Skill: ${resource.name}`;

        // Add prefix based on skill type
        if (skill.skillType === 'agent') {
          name = `agent:${resource.name}`;
          label = `Agent: ${resource.name}`;
        } else if (skill.skillType === 'workflow') {
          name = `workflow:${resource.name}`;
          label = `Workflow: ${resource.name}`;
        } else if (skill.skillType === 'command') {
          name = `cmd:${resource.name}`;
          label = `Command: ${resource.name}`;
        }

        return {
          ...baseCommand,
          category: 'skill' as const,
          name,
          label,
        };
      }

      if (resource.type === 'plugin') {
        return {
          ...baseCommand,
          category: 'plugin' as const,
          name: `plugin:${resource.name}`,
          label: `Plugin: ${resource.name}`,
        };
      }

      return {
        ...baseCommand,
        category: 'sdk-command' as const,
      };
    });
  }
}

// Export singleton instance
export const sdkResourcesScanner = new SDKResourcesScanner();
