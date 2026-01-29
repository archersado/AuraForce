'use client';

import { useQuery } from '@tanstack/react-query';
import { useSubscriptionStore } from '@/stores/subscription/useSubscriptionStore';
import { formatPrice, formatFeatureValue, getFeatureName } from '@/lib/subscription/plans';
import { Crown, CheckCircle, XCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export function PlanComparison({ isUpgradeView = false }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const res = await apiFetch('/api/subscription/plans');
      if (!res.ok) throw new Error('Failed to fetch plans');
      return res.json();
    },
  });

  const currentPlan = useSubscriptionStore((state) => state.currentPlan);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
        加载套餐信息失败，请刷新页面重试
      </div>
    );
  }

  const { plans } = data;
  const currentLevel = currentPlan?.id;

  const features: Array<{
    key: string;
    label: string;
  }> = [
    { key: 'maxSkills', label: '技能数量' },
    { key: 'maxBusinessModels', label: '商业模式' },
    { key: 'apiAccess', label: 'API 访问' },
    { key: 'communityAccess', label: '社区功能' },
    { key: 'prioritySupport', label: '优先支持' },
    { key: 'advancedAnalytics', label: '高级分析' },
  ];

  return (
    <div className="space-y-6">
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[200px]">
                  功能
                </th>
                {plans.map((plan: any) => (
                  <th
                    key={plan.id}
                    className={`text-center py-4 px-6 font-semibold ${
                      currentLevel === plan.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{plan.name}</span>
                      {plan.pricing.monthly === 0 ? (
                        <span className="text-sm">免费</span>
                      ) : (
                        <span className="text-sm">{formatPrice(plan.pricing.monthly)}/月</span>
                      )}
                      {currentLevel === plan.id && (
                        <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          当前套餐
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.key} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">{feature.label}</td>
                  {plans.map((plan: any) => {
                    const value = plan.features[feature.key as keyof typeof plan.features];
                    const isAvailable = value === true || (typeof value === 'number' && value > 0);
                    const displayValue = typeof value === 'boolean'
                      ? (value ? '✓' : '✗')
                      : (value === null ? '无限' : `${value}`);

                    return (
                      <td
                        key={`${plan.id}-${feature.key}`}
                        className={`text-center py-4 px-6 ${
                          currentLevel === plan.id ? 'bg-purple-50' : ''
                        }`}
                      >
                        {isAvailable ? (
                          <span className="text-green-600 font-medium">{displayValue}</span>
                        ) : (
                          <span className="text-gray-400">{displayValue}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view - vertical cards */}
      <div className="md:hidden space-y-4">
        {plans.map((plan: any) => {
          const isCurrent = currentLevel === plan.id;
          return (
            <div
              key={plan.id}
              className={`border-2 rounded-lg p-4 ${
                isCurrent ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.pricing.monthly === 0 ? (
                    <span className="text-gray-600">免费</span>
                  ) : (
                    <span className="text-purple-600 font-semibold">
                      {formatPrice(plan.pricing.monthly)}/月
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white">
                    当前
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {features.map((feature) => {
                  const value = plan.features[feature.key as keyof typeof plan.features];
                  const displayValue = typeof value === 'boolean'
                    ? (value ? '✓' : '✗')
                    : (value === null ? '无限' : `${value}`);

                  return (
                    <div key={`${plan.id}-${feature.key}`} className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{feature.label}</span>
                      <span className={value === true ? 'text-green-600' : 'text-gray-400'}>
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
