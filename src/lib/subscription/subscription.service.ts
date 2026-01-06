/**
 * Subscription Service
 *
 * Handles subscription management, plan changes, and limit checking.
 */

import { prisma } from '@/lib/prisma';
import {
  SubscriptionLevel,
  Plan,
  getPlan,
  PLANS,
  BillingCycle,
  getBillingCycleMonths,
} from './plans';

export interface UsageMetrics {
  skills: { used: number; limit: number | null };
  businessModels: { used: number; limit: number | null };
  apiCalls: { used: number; limit: number | null };
}

export interface SubscriptionDetails {
  level: SubscriptionLevel;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  renewalDate: Date | null;
}

export class SubscriptionService {
  /**
   * Get user's current subscription plan
   */
  async getCurrentPlan(userId: string): Promise<Plan> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionLevel: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return getPlan(user.subscriptionLevel as SubscriptionLevel);
  }

  /**
   * Get user's subscription details
   */
  async getSubscriptionDetails(userId: string): Promise<SubscriptionDetails> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionLevel: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get the latest active subscription
    const latestSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'past_due'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      level: user.subscriptionLevel as SubscriptionLevel,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate,
      status: latestSubscription?.status || 'unknown',
      renewalDate: user.subscriptionEndDate || latestSubscription?.endDate || null,
    };
  }

  /**
   * Check if user can access a feature based on their subscription limits
   */
  async checkSubscriptionLimit(
    userId: string,
    feature: 'skills' | 'businessModels' | 'apiAccess'
  ): Promise<boolean> {
    const plan = await this.getCurrentPlan(userId);
    const usageMetrics = await this.getUsageMetrics(userId);

    switch (feature) {
      case 'skills':
        const skillLimit = plan.features.maxSkills;
        return skillLimit === null || usageMetrics.skills.used < skillLimit;

      case 'businessModels':
        const modelLimit = plan.features.maxBusinessModels;
        return modelLimit === null || usageMetrics.businessModels.used < modelLimit;

      case 'apiAccess':
        return plan.features.apiAccess;

      default:
        return false;
    }
  }

  /**
   * Get user's usage metrics
   */
  async getUsageMetrics(userId: string): Promise<UsageMetrics> {
    const plan = await this.getCurrentPlan(userId);

    // Count skills
    const skillsUsed = await prisma.skill.count({
      where: { userId },
    });

    // Business models counted as a type of skill for now
    // TODO: Add separate BusinessModel model
    const businessModelsUsed = await prisma.skill.count({
      where: {
        userId,
        category: 'business-model',
      },
    });

    // API calls - currently not tracked, 0 for all plans
    const apiCallsUsed = 0;

    return {
      skills: {
        used: skillsUsed,
        limit: plan.features.maxSkills,
      },
      businessModels: {
        used: businessModelsUsed,
        limit: plan.features.maxBusinessModels,
      },
      apiCalls: {
        used: apiCallsUsed,
        limit: null,
      },
    };
  }

  /**
   * Calculate remaining counts for user
   */
  async getRemainingCounts(userId: string): Promise<{
    skills: number | null;
    businessModels: number | null;
  }> {
    const usageMetrics = await this.getUsageMetrics(userId);

    return {
      skills:
        usageMetrics.skills.limit === null
          ? null
          : Math.max(0, usageMetrics.skills.limit - usageMetrics.skills.used),
      businessModels:
        usageMetrics.businessModels.limit === null
          ? null
          : Math.max(0, usageMetrics.businessModels.limit - usageMetrics.businessModels.used),
    };
  }

  /**
   * Record usage when user creates a resource
   */
  async recordUsage(userId: string, feature: 'skills' | 'businessModels' | 'apiCalls'): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        usageMetrics: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentMetrics = (user.usageMetrics as any) || {
      skills: 0,
      businessModels: 0,
      apiCalls: 0,
    };

    currentMetrics[feature] = (currentMetrics[feature] || 0) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: {
        usageMetrics: currentMetrics,
      },
    });
  }

  /**
   * Change user's subscription plan
   */
  async changePlan(
    userId: string,
    targetLevel: SubscriptionLevel,
    billingCycle: BillingCycle = 'monthly'
  ): Promise<{
    success: boolean;
    proratedAmount: number;
    effectiveDate: Date;
    message: string;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentLevel = user.subscriptionLevel as SubscriptionLevel;
    const targetPlan = PLANS[targetLevel];

    // Calculate prorated amount and effective date
    const now = new Date();
    let proratedAmount = 0;
    let effectiveDate: Date;

    // For FREE plan, no billing
    if (targetLevel === SubscriptionLevel.FREE) {
      effectiveDate = now;
    } else {
      effectiveDate = now;
      const cycleMonths = getBillingCycleMonths(billingCycle);
      const cyclePrice = targetPlan.pricing[billingCycle];

      // TODO: Calculate actual prorated amount based on current cycle
      proratedAmount = cyclePrice;
    }

    // Create subscription record for paid plans
    if (targetLevel !== SubscriptionLevel.FREE) {
      const startDate = now;
      const endDate = new Date(now);

      switch (billingCycle) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      await prisma.subscription.create({
        data: {
          userId,
          level: targetLevel,
          startDate,
          endDate,
          status: 'active',
          amount: proratedAmount,
          currency: 'CNY',
          billingCycle,
        },
      });

      // Update user subscription dates
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionLevel: targetLevel,
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
        },
      });
    } else {
      // Downgrade to FREE - keep current end date
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionLevel: targetLevel,
        },
      });
    }

    return {
      success: true,
      proratedAmount,
      effectiveDate,
      message: `订阅已从 ${PLANS[currentLevel].name} 更改为 ${targetPlan.name}`,
    };
  }

  /**
   * Get renewal date for user's subscription
   */
  async getRenewalDate(userId: string): Promise<Date | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionEndDate: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.subscriptionEndDate;
  }

  /**
   * Get subscription history
   */
  async getSubscriptionHistory(userId: string) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return subscriptions;
  }

  /**
   * Get invoice history
   */
  async getInvoiceHistory(userId: string) {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return invoices;
  }

  /**
   * Record subscription history
   */
  async recordSubscriptionHistory(
    userId: string,
    action: 'upgrade' | 'downgrade' | 'cancel' | 'renew',
    fromLevel?: SubscriptionLevel,
    toLevel?: SubscriptionLevel
  ): Promise<void> {
    // This will be expanded with proper audit log model in future stories
    const historyEntry = {
      userId,
      action,
      fromLevel,
      toLevel,
      timestamp: new Date(),
    };

    // TODO: Store in audit log
    console.log('Subscription history:', historyEntry);
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
