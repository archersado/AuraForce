'use client';

import { useState, useEffect } from 'react';

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  skillsVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showProfileCompleted: boolean;
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowMarketingEmails: boolean;
  allowPersonalization: boolean;
  shareUsageMetrics: boolean;
}

const DEFAULT_SETTINGS: PrivacySettings = {
  profileVisibility: 'private',
  skillsVisibility: 'private',
  showEmail: false,
  showProfileCompleted: false,
  allowDataCollection: true,
  allowAnalytics: true,
  allowMarketingEmails: false,
  allowPersonalization: false,
  shareUsageMetrics: true,
};

export default function PrivacySettingsForm() {
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/privacy');
      const data = await response.json();

      if (data.success && data.settings) {
        setSettings(data.settings);
      } else {
        // Use defaults on error
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '隐私设置已更新' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || '更新失败，请稍后重试' });
      }
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      setMessage({ type: 'error', text: '更新失败，请稍后重试' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">隐私设置</h3>
          <p className="text-sm text-gray-600">控制您的个人资料和技能可见性</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Visibility */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            个人资料可见性
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as any })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
          >
            <option value="private">仅自己可见</option>
            <option value="friends">仅好友可见</option>
            <option value="public">所有人可见</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            控制其他用户是否可以看到您的基本资料信息
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            技能可见性
          </label>
          <select
            value={settings.skillsVisibility}
            onChange={(e) => setSettings({ ...settings, skillsVisibility: e.target.value as any })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
          >
            <option value="private">仅自己可见</option>
            <option value="friends">仅好友可见</option>
            <option value="public">所有人可见</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            控制其他用户是否可以看到您创建的技能资产
          </p>
        </div>
      </div>

      {/* Profile Details Visibility */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">资料详细信息</h4>

        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showEmail}
              onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
            <span className="ml-2 text-sm text-gray-700">显示邮箱地址</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showProfileCompleted}
              onChange={(e) => setSettings({ ...settings, showProfileCompleted: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
            <span className="ml-2 text-sm text-gray-700">显示个人资料完成度</span>
          </label>
        </div>
      </div>

      {/* Data Collection & Analytics */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">数据收集与分析</h4>

        <div className="space-y-3">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowDataCollection}
              onChange={(e) => setSettings({ ...settings, allowDataCollection: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
            />
            <div className="ml-2">
              <span className="text-sm text-gray-700 block">允许数据收集</span>
              <p className="text-xs text-gray-500">帮助我们改进产品和服务</p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowAnalytics}
              onChange={(e) => setSettings({ ...settings, allowAnalytics: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
            />
            <div className="ml-2">
              <span className="text-sm text-gray-700 block">允许使用分析</span>
              <p className="text-xs text-gray-500">帮助分析您的使用行为以优化体验</p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowPersonalization}
              onChange={(e) => setSettings({ ...settings, allowPersonalization: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
            />
            <div className="ml-2">
              <span className="text-sm text-gray-700 block">允许个性化推荐</span>
              <p className="text-xs text-gray-500">根据您的使用情况推荐相关内容</p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={settings.shareUsageMetrics}
              onChange={(e) => setSettings({ ...settings, shareUsageMetrics: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
            />
            <div className="ml-2">
              <span className="text-sm text-gray-700 block">分享使用指标</span>
              <p className="text-xs text-gray-500">允许我们分享您的匿名使用指标</p>
            </div>
          </label>
        </div>
      </div>

      {/* Communications */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">通信偏好</h4>

        <div className="space-y-3">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowMarketingEmails}
              onChange={(e) => setSettings({ ...settings, allowMarketingEmails: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
            />
            <div className="ml-2">
              <span className="text-sm text-gray-700 block">接收营销邮件</span>
              <p className="text-xs text-gray-500">接收产品更新、促销和新功能通知</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSaving ? '保存中...' : '保存更改'}
        </button>
      </div>
    </form>
  );
}
