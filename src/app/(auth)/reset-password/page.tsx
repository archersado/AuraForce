import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: '重置密码 - AuraForce',
  description: '重置您的 AuraForce 账户密码',
};

function ResetPasswordWrapper() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="m21 2-9.6 9.6" />
                <path d="m15.4 7.6 3 3" />
                <path d="m9.6 15.4 3 3" />
                <path d="M2 22l7-7" />
                <path d="M2 2l7 7" />
                <path d="M22 22l-7-7" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">设置新密码</h1>
          <p className="text-gray-600">
            输入您的新密码以完成密码重置
          </p>
        </div>

        {/* Reset password card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Suspense fallback={<div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" /></div>}>
            <ResetPasswordWrapper />
          </Suspense>
        </div>

        {/* Security note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>安全提示：</strong>请选择一个强密码，不要与其他网站使用相同的密码。
          </p>
        </div>
      </div>
    </div>
  );
}
