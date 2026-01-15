import { Metadata } from 'next';
import { CurrentPlanCard, UsageDisplay } from '@/components/subscription/usage-display';
import { PlanComparison } from '@/components/subscription/plan-comparison';
import PlanChangeFormWrapper from '@/components/subscription/plan-change-form-wrapper';

export const metadata: Metadata = {
  title: '订阅管理 - AuraForce',
  description: '管理您的 AuraForce 订阅套餐和使用情况',
};

export default function SubscriptionPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">订阅管理</h1>
        <p className="text-gray-600">
          查看和管理您的订阅套餐，追踪使用情况
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Subscription */}
        <div className="lg:col-span-1 space-y-6">
          <CurrentPlanCard />
          <UsageDisplay />
        </div>

        {/* Right Column - Plan Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">可选套餐</h2>
              <p className="text-sm text-gray-600 mt-1">
                选择最适合您需求的套餐
              </p>
            </div>

            <div className="p-6">
              <PlanComparison />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">更改套餐</h2>
              <p className="text-sm text-gray-600 mt-1">
                升级或降级您的订阅计划
              </p>
            </div>

            <div className="p-6">
              <PlanChangeFormWrapper />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
