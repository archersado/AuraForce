'use client';

import { useRequireAuth } from '@/hooks/useSession';
import Link from 'next/link';
import { LogOut, User, Settings } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading, user } = useRequireAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AuraForce
              </span>
            </Link>

            <nav className="flex items-center space-x-4">
              <Link
                href="/profile/settings"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || '设置'}
                </span>
              </Link>

              <button
                onClick={async () => {
                  await fetch('/api/auth/signout', { method: 'POST' });
                  window.location.href = '/login';
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">退出登录</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
