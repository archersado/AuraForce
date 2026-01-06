'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SubscriptionLevel, BillingCycle, formatPrice } from '@/lib/subscription/plans';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/subscription/useSubscriptionStore';

interface PlanChangeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PlanChangeForm({ onSuccess, onCancel }: PlanChangeFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionLevel | ''>();
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const res = await fetch('/api/subscription/plans');
      if (!res.ok) throw new Error('Failed to fetch plans');
      return res.json();
    },
  });

  const currentPlan = useSubscriptionStore((state) => state.currentPlan);

  const changePlanMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPlan) throw new Error('Please select a plan');

      const res = await fetch('/api/subscription/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPlan: selectedPlan,
          billingCycle: selectedCycle,
        }),
      });

      if (!res.ok) throw new Error('Failed to change plan');
      return res.json();
    },
    onSuccess: (data) => {
      setShowConfirm(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Plan change error:', error);
    },
  });

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const { plans, currentPlan: apiCurrentPlan } = plansData || {};
  const activePlan = currentPlan || apiCurrentPlan;

  const selectedPlanData = selectedPlan ? plans?.find((p: any) => p.id === selectedPlan) : null;
  const proratedAmount = selectedPlanData?.pricing[selectedCycle];
  const isUpgrade = selectedPlan && plans && plans.indexOf(activePlan) < plans.indexOf(selectedPlanData);

  const handleSubmit = () => {
    if (!selectedPlan || !termsAgreed) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    changePlanMutation.mutate();
  };

  if (showConfirm) {
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">确认更改订阅</h3>
          <div className="space-y-2 text-sm text-purple-800">
            <p>
              <span className="font-medium">当前套餐：</span>
              {activePlan?.name}
            </p>
            <p>
              <span className="font-medium">新套餐：</span>
              {selectedPlanData?.name}
            </p>
            <p>
              <span className="font-medium">计费周期：</span>
              {selectedCycle === 'monthly' && '月付'}
              {selectedCycle === 'quarterly' && '季付'}
              {selectedCycle === 'yearly' && '年付'}
            </p>
            <div className="pt-2 border-t border-purple-200 mt-2">
              <p className="font-semibold">
                应付金额：
                <span className="ml-2 text-lg">
                  {formatPrice(proratedAmount)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            注意事项
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 套餐更改将立即生效</li>
            <li>• 升级将立即享有新套餐的功能</li>
            <li>• 降级将在当前周期结束后生效</li>
            <li>• 您可以在任何时候更改套餐</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={changePlanMutation.isPending}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {changePlanMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                处理中...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                确认更改
              </>
            )}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 border border-gray-300 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          选择新套餐
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans?.map((plan: any) => {
            const isSelected = selectedPlan === plan.id;
            const isCurrent = activePlan?.id === plan.id;

            return (
              <button
                key={plan.id}
                onClick={() => !isCurrent && setSelectedPlan(plan.id as SubscriptionLevel)}
                disabled={isCurrent}
                className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50'
                    : isCurrent
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-600 text-white">
                    当前
                  </span>
                )}
                <div className="font-semibold text-gray-900">{plan.name}</div>
                <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                <div className="mt-2 text-purple-600 font-semibold">
                  {formatPrice(plan.pricing.monthly)}/月
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Billing Cycle Selection */}
      {selectedPlan && selectedPlanData?.pricing.monthly > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择计费周期
          </label>
          <div className="grid grid-cols-3 gap-4">
            {([
              { value: 'monthly' as BillingCycle, label: '月付', discount: null },
              { value: 'quarterly' as BillingCycle, label: '季付', discount: '5%' },
              { value: 'yearly' as BillingCycle, label: '年付', discount: '10%' },
            ]).map((cycle) => {
              const isSelected = selectedCycle === cycle.value;
              const price = selectedPlanData?.pricing[cycle.value];

              return (
                <button
                  key={cycle.value}
                  onClick={() => setSelectedCycle(cycle.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="font-medium text-gray-900">{cycle.label}</div>
                  <div className="text-purple-600 font-semibold mt-1">
                    {formatPrice(price)}
                  </div>
                  {cycle.discount && (
                    <div className="text-sm text-green-600 mt-1">
                      省 {cycle.discount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      {selectedPlan && selectedPlanData?.pricing.monthly > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">费用明细</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">月付价格</span>
              <span className="text-gray-900">
                {formatPrice(selectedPlanData.pricing.monthly)}/月
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">计费周期</span>
              <span className="text-gray-900">
                {selectedCycle === 'monthly' && '1 个月'}
                {selectedCycle === 'quarterly' && '3 个月'}
                {selectedCycle === 'yearly' && '12 个月'}
              </span>
            </div>
            {(selectedCycle === 'quarterly' || selectedCycle === 'yearly') && (
              <div className="flex justify-between text-green-600">
                <span>优惠</span>
                <span>-{formatPrice(
                  selectedPlanData.pricing.monthly *
                  getBillingCycleMonths(selectedCycle) -
                  selectedPlanData.pricing[selectedCycle]
                )}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-300 flex justify-between font-semibold">
              <span>应付总额</span>
              <span className="text-purple-600 text-lg">
                {formatPrice(proratedAmount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Terms Agreement */}
      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
          我已阅读并同意《服务条款》和《隐私政策》，确认更改订阅套餐
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!selectedPlan || !termsAgreed}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {selectedPlanData?.pricing.monthly > 0 ? (
            <>
              订阅 {selectedPlanData?.name}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            '降级到基础版'
          )}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </div>
  );
}

function getBillingCycleMonths(cycle: BillingCycle): number {
  const months: Record<BillingCycle, number> = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
  };
  return months[cycle];
}
