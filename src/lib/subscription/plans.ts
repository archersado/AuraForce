/**
 * Subscription Plan Configuration
 *
 * Defines all available subscription plans, their features, and pricing.
 */

export enum SubscriptionLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface PlanFeatures {
  maxSkills: number | null; // null = unlimited
  maxBusinessModels: number | null;
  apiAccess: boolean;
  communityAccess: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
}

export interface Plan {
  id: SubscriptionLevel;
  name: string;
  description: string;
  features: PlanFeatures;
  pricing: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  currency: string;
}

export const PLANS: Record<SubscriptionLevel, Plan> = {
  [SubscriptionLevel.FREE]: {
    id: SubscriptionLevel.FREE,
    name: '基础版',
    description: '探索一人企业模式，体验核心功能',
    features: {
      maxSkills: 3,
      maxBusinessModels: 1,
      apiAccess: false,
      communityAccess: false,
      prioritySupport: false,
      advancedAnalytics: false,
    },
    pricing: {
      monthly: 0,
      quarterly: 0,
      yearly: 0,
    },
    currency: 'CNY',
  },
  [SubscriptionLevel.PRO]: {
    id: SubscriptionLevel.PRO,
    name: '专业版',
    description: '完整的技能沉淀和商业模式工具',
    features: {
      maxSkills: null,
      maxBusinessModels: 5,
      apiAccess: false,
      communityAccess: true,
      prioritySupport: true,
      advancedAnalytics: true,
    },
    pricing: {
      monthly: 299,
      quarterly: 849,
      yearly: 3199,
    },
    currency: 'CNY',
  },
  [SubscriptionLevel.ENTERPRISE]: {
    id: SubscriptionLevel.ENTERPRISE,
    name: '企业版',
    description: '无限资源、 API接入和专属支持',
    features: {
      maxSkills: null,
      maxBusinessModels: null,
      apiAccess: true,
      communityAccess: true,
      prioritySupport: true,
      advancedAnalytics: true,
    },
    pricing: {
      monthly: 999,
      quarterly: 2799,
      yearly: 9999,
    },
    currency: 'CNY',
  },
};

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

/**
 * Get plan by subscription level
 */
export function getPlan(level: SubscriptionLevel): Plan {
  return PLANS[level];
}

/**
 * Get all available plans
 */
export function getAllPlans(): Plan[] {
  return Object.values(PLANS);
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate savings percentage for different billing cycles
 */
export function calculateSavings(monthlyPrice: number, cyclePrice: number, months: number): number {
  const expectedTotal = monthlyPrice * months;
  const savings = expectedTotal - cyclePrice;
  return Math.round((savings / expectedTotal) * 100);
}

/**
 * Get billing cycle months count
 */
export function getBillingCycleMonths(cycle: BillingCycle): number {
  const months: Record<BillingCycle, number> = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
  };
  return months[cycle];
}

/**
 * Get feature display name
 */
export function getFeatureName(key: keyof PlanFeatures): string {
  const names: Record<keyof PlanFeatures, string> = {
    maxSkills: '技能数量',
    maxBusinessModels: '商业模式',
    apiAccess: 'API访问',
    communityAccess: '社区功能',
    prioritySupport: '优先支持',
    advancedAnalytics: '高级分析',
  };
  return names[key];
}

/**
 * Format feature value for display
 */
export function formatFeatureValue(key: keyof PlanFeatures, value: boolean | number | null): string {
  if (typeof value === 'boolean') {
    return value ? '✓' : '✗';
  }
  if (value === null) {
    return '无限制';
  }
  return value.toString();
}

/**
 * Check if plan is the highest tier
 */
export function isHighestTier(level: SubscriptionLevel): boolean {
  return level === SubscriptionLevel.ENTERPRISE;
}

/**
 * Check if plan is the lowest tier
 */
export function isLowestTier(level: SubscriptionLevel): boolean {
  return level === SubscriptionLevel.FREE;
}

/**
 * Calculate prorated amount for mid-cycle plan change
 */
export function calculateProratedAmount(
  currentMonthlyPrice: number,
  newMonthlyPrice: number,
  daysElapsedInCycle: number,
  totalDaysInCycle: number
): number {
  const currentProrated = (currentMonthlyPrice / totalDaysInCycle) * daysElapsedInCycle;
  const newProrated = (newMonthlyPrice / totalDaysInCycle) * (totalDaysInCycle - daysElapsedInCycle);
  return Math.round(newProrated - currentProrated);
}
