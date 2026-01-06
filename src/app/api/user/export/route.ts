/**
 * Data Export API Endpoint
 *
 * GET /api/user/export
 *
 * Handles user data export in various formats.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/rate-limiting';
import { formatAsJSON, formatAsCSV, getContentType, generateExportFilename } from '@/lib/data-export/formatter';

/**
 * GET - Export user data
 */
export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }

    // Rate limiting
    const { result, retryAfter } = checkRateLimit(`export:${session.userId}`, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: '导出请求过于频繁，请稍后重试',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter?.toString() || '3600',
          },
        }
      );
    }

    // Get format from query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';

    const validFormats = ['json', 'csv'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { success: false, message: '无效的导出格式' },
        { status: 400 }
      );
    }

    // Format the data
    let data: string;
    try {
      if (format === 'json') {
        data = await formatAsJSON(session.userId);
      } else {
        data = await formatAsCSV(session.userId);
      }
    } catch (error) {
      console.error('Data format error:', error);
      return NextResponse.json(
        { success: false, message: '数据导出失败' },
        { status: 500 }
      );
    }

    // Generate filename
    const filename = generateExportFilename(session.user.email, format as 'json' | 'csv');
    const contentType = getContentType(format as 'json' | 'csv');

    // Log export event
    console.log(`Data export requested: User ${session.userId}, Format ${format}`);

    // Return file download response
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '数据导出失败，请稍后重试',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
