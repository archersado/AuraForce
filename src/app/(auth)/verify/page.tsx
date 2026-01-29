/**
 * Email Verification Page
 *
 * Page for users to enter their email verification token.
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, CheckCircle2, Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-client';

/**
 * Form validation schema
 */
const verifySchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  token: z.string().min(1, '请输入验证码'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

function VerifyForm({ defaultEmail }: { defaultEmail: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: defaultEmail || '',
      token: '',
    },
  });

  /**
   * Handle verification form submission
   */
  const onSubmit = async (data: VerifyFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiFetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          token: data.token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '验证失败');
      }

      setSuccess('邮箱验证成功！正在跳转到登录页面...');

      // Redirect to login page after delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败，请检查验证码后重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle resend verification email
   */
  const handleResend = async () => {
    const emailValue = watch('email');
    if (!emailValue) {
      setError('请先输入邮箱地址');
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const response = await apiFetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue.toLowerCase(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '发送失败');
      }

      setResendSuccess('验证邮件已发送！请检查您的邮箱（包括垃圾邮件）');
      setTimeout(() => setResendSuccess(''), 5000);

    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败，请稍后重试');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回登录
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">验证邮箱</h1>
              <p className="text-gray-600">请输入您的邮箱地址和验证码</p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-800">
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Resend success message */}
          {resendSuccess && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              {resendSuccess}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Token field */}
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                验证码
              </label>
              <input
                {...register('token')}
                type="text"
                id="token"
                placeholder="请输入验证码"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-center font-mono text-lg tracking-widest"
              />
              {errors.token && (
                <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  验证中...
                </>
              ) : (
                '验证邮箱'
              )}
            </Button>
          </form>

          {/* Resend link */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              没有收到验证码？
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || !watch('email')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  重新发送
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            已有账户？{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function VerifyPageWrapper() {
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get('email') || '';

  return <VerifyForm defaultEmail={defaultEmail} />;
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <VerifyPageWrapper />
    </Suspense>
  );
}
