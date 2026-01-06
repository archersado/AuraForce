/**
 * AuraForce MVP 主页
 *
 * 功能：欢迎页面，引导用户进入技能提取流程
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Sparkles, Target, User, UserPlus, LogOut } from 'lucide-react';
import { useUserStore } from '@/stores/user-store';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  const handleStartJourney = () => {
    if (!user) {
      router.push('/login?redirect=/skill-builder');
      return;
    }
    router.push('/skill-builder');
  };

  const handleLogout = () => {
    // Clear user store
    useUserStore.getState().reset();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      {/* Header with auth buttons */}
      <header className="w-full py-4 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AuraForce
            </span>
          </div>

          {!user ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                登录
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                注册
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">

            {/* Logo 和标题 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                AuraForce
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                让每个人的专业技能都能变成 <span className="font-semibold text-purple-600">AI 工具</span>
              </p>
              {user && (
                <div className="mt-4 text-sm text-green-600 bg-green-50 inline-block px-4 py-2 rounded-full">
                  欢迎回来，{user.email}
                </div>
              )}
            </motion.div>

            {/* 功能特性 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">情景式对话</h3>
                <p className="text-sm text-gray-600">通过自然对话提取你的专业技能</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">实时可视化</h3>
                <p className="text-sm text-gray-600">实时展示技能提取和分析过程</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">一键生成</h3>
                <p className="text-sm text-gray-600">自动生成 Claude Code 扩展资产</p>
              </div>
            </motion.div>

            {/* 开始按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={handleStartJourney}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">{user ? '继续你的技能之旅' : '开始你的技能之旅'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              {!user && (
                <p className="mt-4 text-sm text-gray-500">
                  还没有账号？{' '}
                  <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                    免费注册
                  </Link>
                </p>
              )}
            </motion.div>

            {/* 版本信息 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-sm text-gray-500"
            >
              AuraForce MVP v0.1.0 - 技能经济时代的开创者
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
