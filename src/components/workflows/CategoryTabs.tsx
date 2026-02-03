'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CategoryTab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface CategoryTabsProps {
  tabs: CategoryTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function CategoryTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: CategoryTabsProps) {
  return (
    <div
      className={cn(
        // 桌面端：flex-wrap 居中；移动端：横向滚动
        'flex items-center gap-2 md:gap-3',
        'md:flex-wrap md:justify-center',
        'overflow-x-auto md:overflow-x-visible',
        'py-4',
        'no-scrollbar', // 隐藏滚动条但保持可滚动
        '-mx-4 px-4 md:mx-0 md:px-0', // 移动端添加负边距以允许滚动
        'scroll-smooth', // 平滑滚动
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'relative inline-flex items-center gap-2 flex-shrink-0',
              'px-4 py-2 rounded-full',
              'text-sm font-medium',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
              // Active state
              isActive
                ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-purple-300',
              // Dark mode
              'dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300',
              isActive && 'dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700'
            )}
          >
            {/* Icon */}
            {tab.icon && (
              <span className={cn('flex items-center justify-center', 'h-4 w-4')}>
                {tab.icon}
              </span>
            )}

            {/* Label */}
            <span>{tab.label}</span>

            {/* Count Badge */}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold',
                  isActive
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                )}
              >
                {tab.count}
              </span>
            )}

            {/* Active indicator */}
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-full bg-purple-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}
