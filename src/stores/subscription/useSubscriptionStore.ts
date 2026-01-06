/**
 * Subscription Store
 *
 * Manages subscription state, plan information, and usage metrics.
 */

import { create } from 'zustand';
import { SubscriptionLevel, Plan } from '@/lib/subscription/plans';

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

interface SubscriptionState {
  // State
  currentPlan: Plan | null;
  subscriptionDetails: SubscriptionDetails | null;
  usageMetrics: UsageMetrics | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentPlan: (plan: Plan | null) => void;
  setSubscriptionDetails: (details: SubscriptionDetails | null) => void;
  setUsageMetrics: (metrics: UsageMetrics | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  currentPlan: null,
  subscriptionDetails: null,
  usageMetrics: null,
  isLoading: false,
  error: null,
};

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  ...initialState,

  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setSubscriptionDetails: (details) => set({ subscriptionDetails: details }),
  setUsageMetrics: (metrics) => set({ usageMetrics: metrics }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));
