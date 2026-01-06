'use client';

import { useState } from 'react';
import { Lock, Key, CheckCircle } from 'lucide-react';
import { validatePassword, passwordsMatch } from '@/lib/auth/password-validation';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
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
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
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
      setError('两次输入的新密码不一致');
      return;
    }

    // Validate new password is different from current
    if (formData.currentPassword === formData.newPassword) {
      setError('新密码不能与当前密码相同');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || '密码修改失败');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Change password error:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.newPassword
    ? validatePassword(formData.newPassword)
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">修改密码</h2>
        <p className="text-gray-600 mt-1">为您的账户设置一个新的安全密码</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <p className="text-sm text-green-800">密码修改成功</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            当前密码
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords(prev => ({ ...prev, current: !prev.current }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={loading}
            >
              {showPasswords.current ? (
                <div className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

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
              <Key className="w-5 h-5" />
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

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            确认新密码
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {loading ? (
            <>
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
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              修改密码
            </>
          )}
        </button>
      </form>

      {/* Password Requirements */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">密码要求</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-2 text-gray-400" />
            至少 8 个字符
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-2 text-gray-400" />
            至少包含一个字母
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-2 text-gray-400" />
            至少包含一个数字
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-2 text-gray-400" />
            新密码不能与当前密码相同
          </li>
        </ul>
      </div>
    </div>
  );
}
