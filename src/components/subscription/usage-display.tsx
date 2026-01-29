'use client';

import { useQuery } from '@tanstack/react-query';
import { useSubscriptionStore } from '@/stores/subscription/useSubscriptionStore';
import { apiFetch } from '@/lib/api-client';

interface UsageDisplayProps {
  compact?: boolean;
}

export function UsageDisplay({ compact = false }: UsageDisplayProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['subscription-current'],
    queryFn: async () => {
      const res = await apiFetch('/api/subscription/current');
      if (!res.ok) throw new Error('Failed to fetch subscription');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-4 rounded" />;
  }

  if (error || !data?.usage) {
    return null;
  }

  const { usage } = data;

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">技能：</span>
          <span className="font-medium">
            {usage.skills.used}
            {usage.skills.limit !== null && ` / ${usage.skills.limit}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">商业模式：</span>
          <span className="font-medium">
            {usage.businessModels.used}
            {usage.businessModels.limit !== null && ` / ${usage.businessModels.limit}`}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">使用情况</h3>
      <div className="space-y-4">
        {/* Skills usage bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">技能</span>
            <span className="text-sm text-gray-600">
              {usage.skills.used}
              {usage.skills.limit !== null ? ` / ${usage.skills.limit}` : ' (无限制)'}
            </span>
          </div>
          {usage.skills.limit !== null && (
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{
                  width: `${Math.min((usage.skills.used / usage.skills.limit) * 100, 100)}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* Business models usage bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">商业模式</span>
            <span className="text-sm text-gray-600">
              {usage.businessModels.used}
              {usage.businessModels.limit !== null ? ` / ${usage.businessModels.limit}` : ' (无限制)'}
            </span>
          </div>
          {usage.businessModels.limit !== null && (
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${Math.min((usage.businessModels.used / usage.businessModels.limit) * 100, 100)}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* Warning for approaching limits */}
        {(usage.skills.limit !== null && usage.skills.used >= usage.skills.limit * 0.8) ||
        (usage.businessModels.limit !== null && usage.businessModels.used >= usage.businessModels.limit * 0.8) ? (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ 您即将达到使用上限，请考虑升级套餐以继续创建更多内容。
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface CurrentPlanCardProps {
  onChangePlan?: () => void;
}

export function CurrentPlanCard({ onChangePlan }: CurrentPlanCardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['subscription-current'],
    queryFn: async () => {
      const res = await apiFetch('/api/subscription/current');
      if (!res.ok) throw new Error('Failed to fetch subscription');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        加载订阅信息失败，请刷新页面重试
      </div>
    );
  }

  const { plan, details } = data;
  const isFree = plan.id === 'FREE';

  const renewalText = details.renewalDate
    ? new Date(details.renewalDate).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            {isFree && (
              <span className="px-2 py-0.5 bg-white/20 rounded text-sm">免费</span>
            )}
          </div>
          <p className="text-purple-100 mb-4">{plan.description}</p>

          {details.renewalDate && !isFree && (
            <div className="flex items-center gap-2 text-sm text-purple-100">
              <span>续费日期:</span>
              <span className="font-semibold">{renewalText}</span>
            </div>
          )}
        </div>

        {!isFree && onChangePlan && (
          <button
            onClick={onChangePlan}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            更改套餐
          </button>
        )}
      </div>

      {isFree && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm">
            升级到专业版或企业版，解锁更多功能和无限资源
          </p>
        </div>
      )}
    </div>
  );
}
