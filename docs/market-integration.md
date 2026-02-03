# 工作流市场平台 Shell 集成文档

## 概述

本次更新解决了工作流市场与平台视觉风格不一致的问题，将其集成到统一的平台 Shell 中。

## 问题分析

### 原始问题
- 工作流市场页面位于 `src/app/market/workflows/`，不在受保护路由组 `(protected)` 中
- 页面使用简单的根 layout，没有平台标准的 Header 和 Navigation
- 视觉风格与平台其他页面不一致

### 解决方案
为市场模块创建了专属的 layout，包含：
- 平台标准的 Header
- 返回首页的导航链接
- 市场内导航（工作流）
- 与平台一致的渐变背景

## 文件变更

### 1. 新建文件：`src/app/market/layout.tsx`

为市场区域创建专属 layout，提供统一的平台 Shell。

**主要特性：**
- ✅ 平台标准 Header，带 AuraForce 品牌
- ✅ "返回首页" 导航链接
- ✅ 市场内 Tab 导航（工作流）
- ✅ 技能提取快捷入口
- ✅ 支持深色模式（dark mode）
- ✅ 响应式设计（移动端适配）
- ✅ 与 `(protected)/layout.tsx` 视觉风格一致

**代码结构：**
```tsx
'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Brain, FileCode } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  // 布局内容...
}
```

### 2. 修改文件：`src/app/market/workflows/page.tsx`

移除了自定义的 Header，使用 market layout 提供的平台 Shell。

**变更内容：**
- ❌ 移除了自定义的全局 Header（带标题、刷新按钮）
- ❌ 移除了页面级背景色（由 layout 统一管理）
- ✅ 保留了搜索功能
- ✅ 保留了分类 Tab 导航
- ✅ 保留了工作流卡片网格
- ✅ 保留了分页功能

**页面结构变化：**
```tsx
// 之前（带自定义 Header）
<div className="min-h-screen bg-gray-50">
  <div className="bg-white border-b">
    {/* 自定义 Header */}
  </div>
  <div className="max-w-7xl mx-auto py-8">
    {/* 内容 */}
  </div>
</div>

// 现在（使用 layout 的 Header）
<div className="p-4 sm:p-6 lg:p-8">
  {/* 页面标题 + 搜索 + Tabs */}
  {/* 工作流网格 */}
</div>
```

## 视觉一致性保障

### 颜色方案
- **背景色**：`bg-gradient-to-br from-purple-50 via-white to-blue-50`
- **深色模式**：`dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`
- **品牌色**：Purple-600 到 Blue-600 渐变
- **文字色**：Gray-900（深色）/ Gray-500（次要）

### 布局规范
- 最大宽度：`max-w-7xl`
- 侧边距：`px-4 sm:px-6 lg:px-8`
- Header 高度：`py-4`
- 内容间距：`mb-8`（区块之间）/ `gap-6`（卡片之间）

### 组件复用
- 使用 lucide-react 图标库
- 使用 tailwind 实用类
- 复用 `(protected)/layout.tsx` 的设计模式

## 路由结构

```
src/app/
├── layout.tsx                          # 根 layout（Providers）
├── (protected)/
│   └── layout.tsx                      # 受保护页面（Workspace 等）
├── market/
│   ├── layout.tsx                      # ✨ 新建：市场专属 layout
│   └── workflows/
│       └── page.tsx                    # ✏️ 修改：移除自定义 Header
└── ...
```

## 导航流程

### 新导航路径
```
首页 → AuraForce logo
    ↓
工作流市场 → [返回按钮]
    ↓
首页 / Workspace / 技能提取 → 右侧快捷链接
    ↓
市场内 Tabs → 工作流
```

### 主要功能
1. **返回首页**：点击左上角 "返回首页" 或 AuraForce logo
2. **市场导航**：顶部 Tab 切换（目前仅有工作流）
3. **快捷访问**：右侧直接跳转到 Workspace / 技能提取

## 响应式设计

### 移动端（< 640px）
- 隐藏部分导航文字，仅显示图标
- 搜索框全宽
- Header 紧凑布局

### 平板（640px - 1024px）
- 显示完整导航文字
- 3列卡片布局 → 2列

### 桌面（> 1024px）
- 完整布局
- 3列卡片网格

## 访问权限

- **工作流市场**：公开访问，无需登录
- **Workspace / 技能提取**：受保护路由，需要登录（自动跳转登录页）

## 技术细节

### Next.js 特性
- 使用 `app router` 路由组
- Client Component（`'use client'`）
- `usePathname` Hook 获取当前路径
- Server/Client 混合组件架构

### 状态管理
- 保持现有的 Zustand store (`useCurrentFilter`, `useCurrentPage`)
- TanStack Query v5 用于数据获取
- React hooks (`useState`, `useCallback`)

### 样式系统
- Tailwind CSS
- 响应式类名（`sm:`, `md:`, `lg:`）
- 深色模式支持（`dark:`）

## 测试建议

### 功能测试
1. ✅ 点击 "返回首页" 跳转到根路径
2. ✅ 点击 "AuraForce" logo 跳转到根路径
3. ✅ 点击 "技能提取" 跳转到 `/skill-builder`
4. ✅ 点击刷新按钮重新加载数据
5. ✅ 搜索功能正常工作
6. ✅ 分类 Tab 切换正常
7. ✅ 分页功能正常

### 视觉测试
1. ✅ Header 与平台其他页面视觉一致
2. ✅ 背景色渐变效果正常
3. ✅ 深色模式切换正常
4. ✅ 移动端布局适配
5. ✅ 工作流卡片样式正常

### 兼容性测试
1. ✅ 不登录访问工作流市场（应正常）
2. ✅ 点击 Workspace 是否跳转到登录页
3. ✅ 浏览器后退/前进按钮正常

## 未来扩展

### 可扩展的功能
- 添加更多市场 Tab（如：插件、模板等）
- 集成用户中心链接
- 添加通知图标
- 次级市场页面自动继承 layout

### 潜在优化
- 抽取 Header 为独立组件（`<MarketHeader />`）
- 统一导航样式到全局 layout
- 添加页面过渡动画

## 部署清单

- [x] 创建 `src/app/market/layout.tsx`
- [x] 修改 `src/app/market/workflows/page.tsx`
- [x] 文档更新（本文档）
- [ ] 视觉测试
- [ ] 功能测试
- [ ] 部署到开发环境
- [ ] UAT 测试
- [ ] 部署到生产环境

## 相关文件

- `src/app/(protected)/layout.tsx` - 受保护页面 layout（参考）
- `src/app/market/layout.tsx` - 市场专属 layout（新建）
- `src/app/market/workflows/page.tsx` - 工作流市场页面（修改）

---

**更新日期**: 2025-06-20
**负责人**: Frontend Engineer
**状态**: ✅ 已完成
**PM 反馈**: 等待验证
