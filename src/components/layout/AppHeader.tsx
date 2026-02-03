'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
  Brain,
  FolderOpen,
  FileCode,
  User,
  LogOut,
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

// 简化接口，将 showBackButton 隐含在 backHref 的存在性中
interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  // Workspace 紧凑模式：用于 workspace 页面，显示内嵌导航
  compact?: boolean;
  // 市场模式：用于市场页面，显示子标题和特定导航
  market?: boolean;
  // 右侧操作项配置
  user?: {
    name?: string;
    settingsHref?: string;
  };
}

const workspaceNavigation = [
  { name: 'Dashboard', href: '/workspace', icon: LayoutDashboard },
  { name: '技能提取', href: '/skill-builder', icon: Brain },
];

const mainNavigation = [
  { name: '工作流市场', href: '/market/workflows', icon: FolderOpen },
];

const marketNavigation = [
  { name: '工作流', href: '/market/workflows', icon: FileCode },
];

export function AppHeader({
  title = 'AuraForce',
  subtitle,
  backHref,
  compact = false,
  market = false,
  user,
}: AppHeaderProps) {
  const pathname = usePathname();

  // 获取当前激活的导航项
  const checkActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  // 获取市场标签
  const getMarketActiveTab = () => {
    if (pathname?.includes('workflows')) return 'workflows';
    return 'workflows';
  };

  const marketActiveTab = getMarketActiveTab();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Left: Logo + Back + Navigation (compact mode) */}
          {compact ? (
            // Compact Header for Workspace pages
            <div className="flex items-center gap-4">
              <Link href="/workspace" className="flex items-center gap-2">
                {/* Unified Logo Design: Rounded square with gradient */}
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </span>
              </Link>

              {/* Inline Navigation for Workspace */}
              <nav className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-4">
                {workspaceNavigation.map((item) => {
                  const isActive = pathname === item.href || checkActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ) : (
            // Standard Header
            <div className="flex items-center gap-4">
              {/* Back Button (optional) */}
              {backHref && (
                <Link
                  href={backHref}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">返回</span>
                </Link>
              )}

              {/* Separator (only if back button exists) */}
              {backHref && (
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              )}

              {/* Logo + Title */}
              <Link href="/" className="flex items-center gap-2">
                {/* Unified Logo Design: Rounded square with gradient */}
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                    {title}
                  </span>
                  {subtitle && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block">
                      {subtitle}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          )}

          {/* Right: Navigation + User Actions */}
          <nav className="flex items-center gap-2">
            {/* Market-specific navigation */}
            {market && (
              <>
                {marketNavigation.map((item) => {
                  const isActive = marketActiveTab === 'workflows' && item.href.includes('workflows');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.name}</span>
                    </Link>
                  );
                })}

                {/* Workspace Link for Market pages */}
                <Link
                  href="/skill-builder"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">技能提取</span>
                </Link>
              </>
            )}

            {!market && !compact && mainNavigation.map((item) => {
              const isActive = checkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}

            {/* Workspace navigation for non-market pages */}
            {compact && checkActive('/workspace') && (
              <Link
                href="/market/workflows"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                <span className="hidden sm:inline">工作流市场</span>
              </Link>
            )}

            {/* User Actions */}
            {user && (
              <>
                <Link
                  href={user.settingsHref || '/profile/settings'}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="用户设置"
                >
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {user.name || '设置'}
                  </span>
                </Link>

                <button
                  onClick={async () => {
                    await apiFetch('/api/auth/signout', { method: 'POST' });
                    window.location.href = '/auraforce/login';
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">退出</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
