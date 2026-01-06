/**
 * Usage Tracker
 *
 * Tracks and validates user resource usage against subscription limits.
 */

import { subscriptionService } from './subscription.service';
import type { UsageMetrics } from './subscription.service';

export class UsageTracker {
  /**
   * Track skill creation
   */
  async trackSkillCreated(userId: string): Promise<void> {
    await subscriptionService.recordUsage(userId, 'skills');
  }

  /**
   * Track business model creation
   */
  async trackBusinessModelCreated(userId: string): Promise<void> {
    await subscriptionService.recordUsage(userId, 'businessModels');
  }

  /**
   * Track API call usage
   */
  async trackApiCallUsed(userId: string): Promise<void> {
    await subscriptionService.recordUsage(userId, 'apiCalls');
  }

  /**
   * Check if user can create a skill
   */
  async canCreateSkill(userId: string): Promise<boolean> {
    try {
      return await subscriptionService.checkSubscriptionLimit(userId, 'skills');
    } catch (error) {
      console.error('Error checking skill limit:', error);
      return false;
    }
  }

  /**
   * Check if user can create a business model
   */
  async canCreateBusinessModel(userId: string): Promise<boolean> {
    try {
      return await subscriptionService.checkSubscriptionLimit(userId, 'businessModels');
    } catch (error) {
      console.error('Error checking business model limit:', error);
      return false;
    }
  }

  /**
   * Check if user has API access
   */
  async hasApiAccess(userId: string): Promise<boolean> {
    try {
      return await subscriptionService.checkSubscriptionLimit(userId, 'apiAccess');
    } catch (error) {
      console.error('Error checking API access:', error);
      return false;
    }
  }

  /**
   * Get remaining counts for user
   */
  async getRemainingCounts(userId: string): Promise<{
    skills: number | null;
    businessModels: number | null;
  }> {
    try {
      return await subscriptionService.getRemainingCounts(userId);
    } catch (error) {
      console.error('Error getting remaining counts:', error);
      return {
        skills: 0,
        businessModels: 0,
      };
    }
  }

  /**
   * Get full usage metrics
   */
  async getUsageMetrics(userId: string): Promise<UsageMetrics> {
    try {
      return await subscriptionService.getUsageMetrics(userId);
    } catch (error) {
      console.error('Error getting usage metrics:', error);
      return {
        skills: { used: 0, limit: 0 },
        businessModels: { used: 0, limit: 0 },
        apiCalls: { used: 0, limit: null },
      };
    }
  }

  /**
   * Check if user is approaching a limit (>= 80% usage)
   */
  async isApproachingLimit(userId: string, feature: 'skills' | 'businessModels'): Promise<{
    isApproaching: boolean;
    percentage: number;
  }> {
    try {
      const metrics = await this.getUsageMetrics(userId);
      const featureMetrics = metrics[feature];

      if (featureMetrics.limit === null) {
        return { isApproaching: false, percentage: 0 };
      }

      const percentage = (featureMetrics.used / featureMetrics.limit) * 100;
      const isApproaching = percentage >= 80;

      return { isApproaching, percentage: Math.round(percentage) };
    } catch (error) {
      console.error('Error checking limit approach:', error);
      return { isApproaching: false, percentage: 0 };
    }
  }

  /**
   * Get limit warning message
   */
  async getLimitWarningMessage(userId: string): Promise<string | null> {
    const skillWarning = await this.isApproachingLimit(userId, 'skills');
    const bmWarning = await this.isApproachingLimit(userId, 'businessModels');

    if (skillWarning.isApproaching) {
      if (skillWarning.percentage >= 100) {
        return `您已达到技能创建上限（${skillWarning.percentage}%），请升级订阅`;
      }
      return `您即将达到技能创建上限（${skillWarning.percentage}%）`;
    }

    if (bmWarning.isApproaching) {
      if (bmWarning.percentage >= 100) {
        return `您已达到商业模式创建上限（${bmWarning.percentage}%），请升级订阅`;
      }
      return `您即将达到商业模式创建上限（${bmWarning.percentage}%）`;
    }

    return null;
  }
}

// Export singleton instance
export const usageTracker = new UsageTracker();

/**
 * Middleware function to check skill creation limit
 * Use this in API routes before allowing skill creation
 */
export async function checkSkillLimit(userId: string) {
  const canCreate = await usageTracker.canCreateSkill(userId);

  if (!canCreate) {
    const metrics = await usageTracker.getUsageMetrics(userId);
    throw new Error(
      `LIMIT_REACHED: 您已达到技能创建上限 (${metrics.skills.used}/${metrics.skills.limit})，请升级订阅`
    );
  }
}

/**
 * Middleware function to check business model creation limit
 * Use this in API routes before allowing business model creation
 */
export async function checkBusinessModelLimit(userId: string) {
  const canCreate = await usageTracker.canCreateBusinessModel(userId);

  if (!canCreate) {
    const metrics = await usageTracker.getUsageMetrics(userId);
    throw new Error(
      `LIMIT_REACHED: 您已达到商业模式创建上限 (${metrics.businessModels.used}/${metrics.businessModels.limit})，请升级订阅`
    );
  }
}
