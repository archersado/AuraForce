/**
 * AuraForce MVP 主页
 *
 * 功能：欢迎页面,引导用户进入技能提取流程
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, MessageCircle, Eye, User, UserPlus, LogOut, FolderOpen, Workflow, Sparkles } from 'lucide-react';
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
    router.push('/workspace');
  };

  const handleLogout = () => {
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
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                title="退出登录"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">退出</span>
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
              className="mb-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-8">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
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
              <FeatureCard
                icon={<MessageCircle className="w-6 h-6" />}
                title="情景式对话"
                description="像聊天一样轻松分享你的工作经验"
              />
              <FeatureCard
                icon={<Eye className="w-6 h-6" />}
                title="实时可视化"
                description="边聊边看你的技能雷达图生成"
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="一键生成"
                description="自动生成可用的 CC 扩展资产包"
              />
            </motion.div>

            {/* 开始按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
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
                  {' '}
                  <Link href="/login" className="text-gray-600 hover:text-gray-700">
                    已有账号？登录
                  </Link>
                </p>
              )}
            </motion.div>

            {/* 快捷访问入口 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-purple-300"></div>
                <h2 className="mx-4 text-lg font-semibold text-gray-500">快捷访问</h2>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-300"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickAccessCard
                  icon={<FolderOpen className="w-6 h-6" />}
                  title="工作流市场"
                  description="浏览社区共享的 AI 工作流"
                  href="/market/workflows"
                  color="from-purple-500 to-purple-700"
                  delay={0.05}
                />
                <QuickAccessCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="技能提取"
                  description="快速创建自定义 AI 技能"
                  href="/workspace"
                  color="from-blue-500 to-blue-700"
                  delay={0.1}
                />
                <QuickAccessCard
                  icon={<Workflow className="w-6 h-6" />}
                  title="工作空间"
                  description="管理你的项目和工作流"
                  href="/workspace"
                  color="from-indigo-500 to-indigo-700"
                  delay={0.15}
                />
              </div>
            </motion.div>

            {/* 版本信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-gray-500"
            >
              AuraForce MVP v0.1.0 - 技能经济时代的开创者
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center h-full">
      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4 flex-shrink-0">
        <div className="text-purple-600">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-center">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex-grow-0">{description}</p>
    </div>
  );
}

function QuickAccessCard({
  icon,
  title,
  description,
  href,
  color,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  delay: number;
}) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer"
      >
        {/* Gradient icon container */}
        <div className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${color} rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <div className="flex items-center justify-center text-white">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="pt-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowRight className="w-4 h-4 text-purple-600" />
        </div>

        {/* Subtle gradient border on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
      </motion.div>
    </Link>
  );
}
