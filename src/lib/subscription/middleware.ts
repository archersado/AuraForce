/**
 * Subscription Middleware
 *
 * Provides middleware functions to enforce subscription limits
 * on resource creation and actions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { usageTracker } from './usage-tracker';

/**
 * Error response for limit exceeded
 */
export function createLimitErrorResponse(resource: string, current: number, limit: number | null) {
  return NextResponse.json(
    {
      error: 'LIMIT_REACHED',
      message: `您已达到${resource}创建上限${limit !== null ? ` (${current}/${limit})` : ''}，请升级订阅`,
      current: { used: current, limit },
    },
    { status: 403 }
  );
}

/**
 * Middleware to check skill creation limit
 * Use in API routes before processing skill creation
 */
export async function enforceSkillLimit(request: NextRequest, userId: string) {
  const canCreate = await usageTracker.canCreateSkill(userId);

  if (!canCreate) {
    const metrics = await usageTracker.getUsageMetrics(userId);
    return createLimitErrorResponse(
      '技能',
      metrics.skills.used,
      metrics.skills.limit
    );
  }

  return null;
}

/**
 * Middleware to check business model creation limit
 * Use in API routes before processing business model creation
 */
export async function enforceBusinessModelLimit(request: NextRequest, userId: string) {
  const canCreate = await usageTracker.canCreateBusinessModel(userId);

  if (!canCreate) {
    const metrics = await usageTracker.getUsageMetrics(userId);
    return createLimitErrorResponse(
      '商业模式',
      metrics.businessModels.used,
      metrics.businessModels.limit
    );
  }

  return null;
}

/**
 * Middleware to check if user has API access
 */
export async function enforceApiAccess(userId: string): Promise<NextResponse | null> {
  const hasAccess = await usageTracker.hasApiAccess(userId);

  if (!hasAccess) {
    return NextResponse.json(
      {
        error: 'API_ACCESS_DENIED',
        message: 'API访问仅限专业版和企业版用户，请升级订阅',
      },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Generic limit enforcement middleware
 * Checks if user can perform an action based on their subscription
 */
export async function enforceSubscriptionLimit(
  userId: string,
  action: 'create-skill' | 'create-business-model' | 'api-access'
): Promise<NextResponse | null> {
  switch (action) {
    case 'create-skill':
      return enforceBusinessModelLimit(new NextRequest('http://localhost'), userId);
    case 'create-business-model':
      return enforceBusinessModelLimit(new NextRequest('http://localhost'), userId);
    case 'api-access':
      return enforceApiAccess(userId);
    default:
      return null;
  }
}

/**
 * Get limit warning message for UI display
 * Returns warning message if user is approaching or at limits
 */
export async function getLimitWarning(userId: string): Promise<{
  warning: string | null;
  isAtLimit: boolean;
  resourceType: string | null;
}> {
  const skillWarning = await usageTracker.isApproachingLimit(userId, 'skills');
  const bmWarning = await usageTracker.isApproachingLimit(userId, 'businessModels');

  if (skillWarning.percentage >= 100) {
    return {
      warning: `您已达到技能创建上限，请升级订阅`,
      isAtLimit: true,
      resourceType: 'skills',
    };
  }

  if (bmWarning.percentage >= 100) {
    return {
      warning: `您已达到商业模式创建上限，请升级订阅`,
      isAtLimit: true,
      resourceType: 'business-models',
    };
  }

  if (skillWarning.isApproaching) {
    return {
      warning: `您即将达到技能创建上限 (已使用${skillWarning.percentage}%)`,
      isAtLimit: false,
      resourceType: 'skills',
    };
  }

  if (bmWarning.isApproaching) {
    return {
      warning: `您即将达到商业模式创建上限 (已使用${bmWarning.percentage}%)`,
      isAtLimit: false,
      resourceType: 'business-models',
    };
  }

  return { warning: null, isAtLimit: false, resourceType: null };
}
