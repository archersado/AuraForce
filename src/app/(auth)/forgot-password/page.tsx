import { Metadata } from 'next';
import Link from 'next/link';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: '忘记密码 - AuraForce',
  description: '重置您的 AuraForce 账户密码',
};

export default function ForgotPasswordPage() {
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
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">忘记密码?</h1>
          <p className="text-gray-600">
            输入您的邮箱地址，我们将向您发送重置密码的链接
          </p>
        </div>

        {/* Forgot password card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <ForgotPasswordForm />
        </div>

        {/* Security note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>安全提示：</strong>重置链接将在 1 小时后失效。如果您没有收到邮件，请检查垃圾邮件文件夹。
          </p>
        </div>
      </div>
    </div>
  );
}
