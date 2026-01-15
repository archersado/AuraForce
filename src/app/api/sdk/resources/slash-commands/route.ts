/**
 * SDK Slash Commands API
 *
 * Provides endpoint to get SDK resources formatted as slash commands.
 * This version uses Agent SDK's supportedCommands() to get actual slash commands.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

// Simple API response types for this endpoint
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    type: 'UNAUTHORIZED' | 'INTERNAL_ERROR';
    message: string;
    details?: Record<string, unknown>;
  };
}

// Function to load global MCP server configurations
function loadGlobalMcpServers(): Record<string, any> {
  const mcpServers: Record<string, any> = {};

  try {
    // Check for .claude directory in home directory
    const claudeDir = join(process.env.HOME || process.env.USERPROFILE || '', '.claude');
    if (!existsSync(claudeDir)) {
      return mcpServers;
    }

    // Find all .mcp.json files in the plugins directory
    const mcpConfigFiles = glob.sync('**/.mcp.json', { cwd: claudeDir });

    for (const configFile of mcpConfigFiles) {
      try {
        const configPath = join(claudeDir, configFile);
        const config = JSON.parse(readFileSync(configPath, 'utf8'));

        // Merge configurations
        Object.assign(mcpServers, config);
      } catch (error) {
        console.warn(`Failed to load MCP config from ${configFile}:`, error);
      }
    }
  } catch (error) {
    console.warn('Error loading global MCP servers:', error);
  }

  return mcpServers;
}

/**
 * GET /api/sdk/resources/slash-commands
 *
 * Get slash commands from Agent SDK by creating a session and calling supportedCommands().
 */
export async function GET(request: NextRequest) {
  try {
    // Check ANTHROPIC_API_KEY
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.includes('your-')) {
      console.warn('[SDK Slash Commands API] No valid API key found');
      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'UNAUTHORIZED' as const,
            message: 'No valid ANTHROPIC_API_KEY configured',
          },
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Load global MCP server configurations
    const globalMcpServers = loadGlobalMcpServers();
    console.log('[SDK Slash Commands API] Loaded MCP servers:', Object.keys(globalMcpServers));

    // Create a query instance to access slash commands
    const claudeQuery = query({
      prompt: 'List available commands', // Placeholder prompt
      options: {
        model: 'sonnet',
        cwd: process.cwd(),
        // Don't persist this temporary session
        persistSession: false,
        // Load plugins from the .claude directory to get custom slash commands
        plugins: [
          {
            type: 'local',
            path: '.claude'
          }
        ],
        // Load global MCP servers dynamically (only testing with one stable server)
        mcpServers: {
          'linear': {
            type: 'http',
            url: 'https://mcp.linear.app/mcp'
          }
        }
      }
    });

    // Get supported commands from the query interface
    const commands = await claudeQuery.supportedCommands();

    // Get MCP server status to see what's connected
    const mcpStatus = await claudeQuery.mcpServerStatus();
    console.log('[SDK Slash Commands API] MCP server status:', mcpStatus);
    console.log('[SDK Slash Commands API] Sample commands:', commands.slice(0, 5));

    // Add MCP server status as pseudo-commands to show their state
    const mcpStatusCommands = mcpStatus.map(server => ({
      name: `mcp:${server.name}`,
      label: `MCP: ${server.name}`,
      description: `MCP Server - Status: ${server.status}${server.status === 'needs-auth' ? ' (requires API key)' : ''}`,
      category: 'mcp-tool' as const,
      icon: server.status === 'connected' ? '🟢' : server.status === 'needs-auth' ? '🔑' : server.status === 'failed' ? '🔴' : '🟡',
      sourceInfo: {
        source: 'mcp-server',
        path: '/',
      },
    }));

    // Also add configured MCP servers that aren't in the status (likely failed to start)
    const configuredServers = Object.keys(globalMcpServers);
    const statusServerNames = mcpStatus.map(s => s.name);
    const missingServers = configuredServers.filter(name => !statusServerNames.includes(name));

    const missingServerCommands = missingServers.map(serverName => ({
      name: `mcp:${serverName}`,
      label: `MCP: ${serverName}`,
      description: `MCP Server - Status: failed to start (check configuration)`,
      category: 'mcp-tool' as const,
      icon: '🔴',
      sourceInfo: {
        source: 'mcp-server',
        path: '/',
      },
    }));

    // Convert to slash commands format expected by frontend
    const formattedCommands = commands.map(cmd => {
      // Determine category based on command characteristics
      let category: 'plugin' | 'sdk-command' | 'mcp-tool' | 'skill';
      let icon = '⚡';

      if (cmd.description?.includes('(plugin:.claude@inline)')) {
        // This is a local .claude plugin/skill
        if (cmd.name.includes(':workflows:')) {
          category = 'plugin';
          icon = '🔧';
        } else {
          category = 'skill';
          icon = '🧠';
        }
      } else if (cmd.description?.includes('mcp:') || mcpStatus.some(s => cmd.name.includes(s.name))) {
        // This is an MCP tool
        category = 'mcp-tool';
        icon = '🌐';
      } else {
        // This is a built-in SDK command
        category = 'sdk-command';
        icon = '⚡';
      }

      return {
        name: cmd.name,
        label: cmd.name,
        description: cmd.description,
        category,
        icon,
        sourceInfo: {
          source: category === 'mcp-tool' ? 'mcp-server' : category === 'skill' || category === 'plugin' ? 'local-plugin' : 'agent-sdk',
          path: '/',
        },
      };
    });

    // Combine all commands: actual commands + MCP status info
    const allCommands = [
      ...formattedCommands,
      ...mcpStatusCommands,
      ...missingServerCommands,
    ];

    const response: ApiResponse<Array<{
      name: string;
      label: string;
      description: string;
      category: 'plugin' | 'sdk-command' | 'mcp-tool' | 'skill';
      icon: string;
      sourceInfo: { source: string; path: string };
    }>> = {
      success: true,
      data: allCommands,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[SDK Slash Commands API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR' as const,
          message: 'Failed to get SDK slash commands',
          details: error instanceof Error ? { message: error.message, stack: error.stack } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
