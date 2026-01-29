'use client';

import { useState } from 'react';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useSession';
import { apiFetch } from '@/lib/api-client';

interface ChangeEmailFormData {
  newEmail: string;
  currentPassword: string;
}

export default function ChangeEmailForm() {
  const { session, user } = useRequireAuth();
  const [formData, setFormData] = useState<ChangeEmailFormData>({
    newEmail: '',
    currentPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate all fields
    if (!formData.newEmail || !formData.currentPassword) {
      setError('请填写所有必填字段');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.newEmail)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    // Check if same as current email
    if (formData.newEmail === user?.email) {
      setError('新邮箱地址不能与当前邮箱相同');
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch('/api/user/change-email/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || '邮箱更改请求失败');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setSentEmail(formData.newEmail);
      setFormData({ newEmail: '', currentPassword: '' });
    } catch (err) {
      console.error('Change email error:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">验证邮件已发送</h3>
            <p className="text-sm text-green-800 mt-1">
              我们已向 <strong>{sentEmail}</strong> 发送了验证邮件
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">接下来的步骤：</h4>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>检查 <strong>{sentEmail}</strong> 的邮箱（包括垃圾邮件）</li>
            <li>点击邮件中的验证链接</li>
            <li>验证完成后，您的邮箱将更新为新地址</li>
          </ol>
          <p className="text-xs text-blue-700 mt-3">
            验证链接将在 24 小时后失效
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">更改邮箱地址</h3>
        <p className="text-sm text-gray-600">
          更改您的邮箱地址需要验证，以确保账户安全
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Email (Read-only) */}
        <div>
          <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700 mb-2">
            当前邮箱地址
          </label>
          <input
            id="currentEmail"
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* New Email */}
        <div>
          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
            新邮箱地址
          </label>
          <div className="relative">
            <input
              id="newEmail"
              name="newEmail"
              type="email"
              autoComplete="email"
              value={formData.newEmail}
              onChange={handleChange}
              placeholder="new@email.com"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            当前密码
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            需要输入当前密码以确认您的身份
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {loading ? '处理中...' : '发送验证邮件'}
        </button>
      </form>

      {/* Security Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
          <Lock className="w-4 h-4 mr-2" />
          安全提示
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 更改邮箱需要验证新邮箱地址</li>
          <li>• 当前邮箱不会立即更改，直到验证完成</li>
          <li>• 我们会向两个邮箱发送通知</li>
        </ul>
      </div>
    </div>
  );
}
