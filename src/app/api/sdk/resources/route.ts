/**
 * SDK Resources API
 *
 * Provides endpoints to scan and retrieve Claude Agent SDK resources:
 * - GET /api/sdk/resources - Scan and return available resources
 * - GET /api/sdk/resources/slash-commands - Return as slash commands for UI
 */

import { NextRequest, NextResponse } from 'next/server';
import { sdkResourcesScanner } from '@/lib/services/sdk-scanner-service';
import type { SDKResourcesResult, SDKSlashCommand } from '@/types/sdk-resources';
import type { ApiResponse } from '@/types/session';

/**
 * GET /api/sdk/resources
 *
 * Scan the project directory and return discovered SDK resources.
 * Query parameters:
 * - path: Optional custom scan path (defaults to process.cwd())
 * - refresh: Force re-scan (default: false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customPath = searchParams.get('path');
    const refresh = searchParams.get('refresh') === 'true';

    // Set scan path if provided
    if (customPath) {
      // Validate the path is within allowed directories
      const fs = require('fs');
      if (!fs.existsSync(customPath)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: 'VALIDATION_ERROR' as const,
              message: 'Path does not exist',
            },
          } as ApiResponse,
          { status: 400 }
        );
      }
      (sdkResourcesScanner as any).config.scanPath = customPath;
    }

    // Scan for resources
    const scanResult = await sdkResourcesScanner.scan();

    const response: ApiResponse<SDKResourcesResult> = {
      success: true,
      data: scanResult,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[SDK Resources API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'INTERNAL_ERROR' as const,
          message: 'Failed to scan SDK resources',
          details: error instanceof Error ? { message: error.message } : undefined,
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
