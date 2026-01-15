/**
 * SDK Init API Endpoint
 *
 * Returns SDK resources from Agent SDK initialization.
 * This replaces the file system scanning approach for getting slash commands.
 *
 * The Agent SDK returns structured information about available tools, commands,
 * and resources during initialization. We cache this data and serve it to the frontend.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/session';

/**
 * GET /api/sdk/init
 *
 * Get SDK initialization data including available tools and commands.
 * This endpoint returns the same data that the Agent SDK provides during init.
 */
export async function GET(request: NextRequest) {
  try {
    // In the actual implementation, we would query the Agent SDK
    // to get its initialization data including available tools and commands.
    // For now, we'll return a placeholder response that matches the expected format.

    // TODO: Implement actual SDK init data retrieval
    // The SDK's init process returns information about:
    // - Available subagents (from _config/agents/)
    // - Available workflows (from _config/workflows/)
    // - Available MCP tools/servers
    // - Available built-in tools

    // For MVP, return empty result - the real implementation will
    // need to either:
    // 1. Store SDK init data globally when first query is made
    // 2. Create a separate init endpoint that runs SDK initialization
    // 3. Modify the query to include init data in its response

    const response: ApiResponse<{
      resources: Array<{
        id: string;
        name: string;
        type: 'agent' | 'workflow' | 'tool' | 'mcp';
        source: string;
        path?: string;
        description?: string;
      }>;
      timestamp: string;
    }> = {
      success: true,
      data: {
        resources: [],
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[SDK Init API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR' as const,
          message: 'Failed to get SDK init data',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
