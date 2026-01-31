'use client';

import { useState, useEffect } from 'react';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { validatePassword, passwordsMatch } from '@/lib/auth/password-validation';
import { apiFetch } from '@/lib/api-client';

interface ResetPasswordFormData {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    token: tokenFromUrl,
    email: emailFromUrl,
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

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
    if (!formData.token || !formData.email || !formData.newPassword || !formData.confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join('，'));
      return;
    }

    // Validate passwords match
    if (!passwordsMatch(formData.newPassword, formData.confirmPassword)) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || '密码重置失败');
        if (data.code === 'INVALID_TOKEN') {
          setError('重置链接无效，请重新申请密码重置');
        } else if (data.code === 'TOKEN_EXPIRED') {
          setError('重置链接已过期，请重新申请密码重置');
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.newPassword
    ? validatePassword(formData.newPassword)
    : null;

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">密码重置成功</h2>
        <p className="text-gray-600">您现在可以使用新密码登录了</p>
        <p className="text-sm text-gray-500 mt-4">即将跳转到登录页面...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Token Input (only show if not in URL) */}
      {!tokenFromUrl && (
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
            重置令牌
          </label>
          <input
            id="token"
            name="token"
            type="text"
            value={formData.token}
            onChange={handleChange}
            placeholder="请输入从邮件中获取的重置令牌"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            通常包含在重置链接中，如果链接无法访问，请手动输入
          </p>
        </div>
      )}

      {/* Email Input (only show if not in URL) */}
      {!emailFromUrl && (
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
        </div>
      )}

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
          新密码
        </label>
        <div className="relative">
          <input
            id="newPassword"
            name="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords(prev => ({ ...prev, new: !prev.new }))
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
        {passwordStrength && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 flex-1 rounded-full ${
                  passwordStrength.strength === 'strong'
                    ? 'bg-green-500'
                    : passwordStrength.strength === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  passwordStrength.strength === 'strong'
                    ? 'text-green-600'
                    : passwordStrength.strength === 'medium'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {passwordStrength.strength === 'strong'
                  ? '强'
                  : passwordStrength.strength === 'medium'
                  ? '中等'
                  : '弱'}
              </span>
            </div>
            {!passwordStrength.isValid && passwordStrength.errors.length > 0 && (
              <ul className="text-xs text-red-600 mt-1">
                {passwordStrength.errors.map((err, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-1">•</span>
                    {err}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          确认新密码
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
        {formData.confirmPassword && !passwordsMatch(formData.newPassword, formData.confirmPassword) && (
          <p className="text-xs text-red-600 mt-1">两次输入的密码不一致</p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            处理中...
          </span>
        ) : (
          '重置密码'
        )}
      </button>

      <div className="text-center">
        <Link
          href="/auraforce/login"
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回登录
        </Link>
      </div>
    </form>
  );
}
