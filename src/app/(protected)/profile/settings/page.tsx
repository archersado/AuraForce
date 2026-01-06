import { Metadata } from 'next';
import Link from 'next/link';
import ProfileForm from '@/components/profile/profile-form';
import ChangeEmailForm from '@/components/profile/change-email-form';
import ChangePasswordForm from '@/components/profile/change-password-form';
import DataExportForm from '@/components/profile/data-export-form';
import PrivacySettingsForm from '@/components/profile/privacy-settings-form';
import { CurrentPlanCard } from '@/components/subscription/usage-display';
import TenantSection from './components/tenant-section';

export const metadata: Metadata = {
  title: '个人设置 - AuraForce',
  description: '管理您的 AuraForce 个人资料和账户设置',
};

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs/Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
            <a
              href="#profile"
              className="flex-1 py-4 px-1 text-center border-b-2 border-purple-600 font-medium text-sm text-purple-600 whitespace-nowrap"
            >
              个人资料
            </a>
            <a
              href="#email"
              className="flex-1 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              邮箱设置
            </a>
            <a
              href="#security"
              className="flex-1 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              安全设置
            </a>
            <a
              href="#privacy"
              className="flex-1 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              隐私设置
            </a>
            <a
              href="#tenant"
              className="flex-1 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              工作空间
            </a>
            <a
              href="#subscription"
              className="flex-1 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              订阅管理
            </a>
            <a
              href="#data"
              className="flex-1 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              数据管理
            </a>
          </nav>
        </div>

        {/* Content */}
        <div className="p-8 space-y-12">
          {/* Profile Section */}
          <div id="profile">
            <ProfileForm />
          </div>

          {/* Email Section */}
          <div id="email" className="pt-12 border-t border-gray-200">
            <ChangeEmailForm />
          </div>

          {/* Security Section */}
          <div id="security" className="pt-12 border-t border-gray-200">
            <ChangePasswordForm />
          </div>

          {/* Privacy Section */}
          <div id="privacy" className="pt-12 border-t border-gray-200">
            <PrivacySettingsForm />
          </div>

          {/* Tenant Section */}
          <div id="tenant" className="pt-12 border-t border-gray-200">
            <TenantSection />
          </div>

          {/* Subscription Section */}
          <div id="subscription" className="pt-12 border-t border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">订阅管理</h2>
              <p className="text-gray-600 text-sm">
                查看当前订阅套餐和使用情况
              </p>
            </div>
            <CurrentPlanCard />
            <div className="mt-4 text-center">
              <Link
                href="/subscription"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                管理订阅 →
              </Link>
            </div>
          </div>

          {/* Data Management Section */}
          <div id="data" className="pt-12 border-t border-gray-200">
            <DataExportForm />
          </div>
        </div>
      </div>
    </div>
  );
}
