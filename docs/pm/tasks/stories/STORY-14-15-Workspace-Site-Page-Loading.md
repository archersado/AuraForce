# STORY-14-15: Workspace Site Page Loading

**Story ID:** STORY-14-15
**创建日期:** 2025-02-02
**Epic:** EPIC-14: Workspace Editor & File Management
**Priority:** P2 (Medium)
**Status:** 📋 待开始

---

## 📋 需求描述

在右侧工作空间中添加站点页面加载和预览能力，允许用户在 Workspace 中直接浏览和预览 Web 页面，提供便捷的网页预览体验。

---

## 🎯 功能范围

### 核心功能

#### 1. Site Page Loader 组件

**功能描述：**
- 在右侧工作区添加 Site Page Loader 页面
- 支持通过 URL 加载和预览网页
- 提供基础导航控制（前进、后退、刷新）

**UI/UX 要求：**
- URL 输入框（带历史记录）
- 导航工具栏（前进、后退、刷新、主页）
- 预览容器（iframe 或自定义预览组件）
- 加载状态指示器
- 全屏模式切换

---

#### 2. 安全性防护

**防护措施：**
- 白名单域名限制
- 拒绝加载危险协议（`javascript:`, `data:`, `file:`）
- HTTP/HTTPS 协议验证
- 提示用户访问外部站点

**实现方式：**
```typescript
const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const BLOCKED_DOMAINS = []; // 可配置的阻止列表

function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol as any);
  } catch {
    return false;
  }
}
```

---

#### 3. 预览模式

**可选的预览功能：**
- 桌面视图预览（默认）
- 移动端视图预览（调整宽度）
- 平板视图预览
- 自定义尺寸预览

---

#### 4. 与文件系统集成

**关联功能：**
- 在文件树中可直接打开 `.html` 文件为预览
- 支持从外部链接直接加载网页
- 保存常用 URL 到收藏夹

---

## 🛠️ 技术方案

### 前端实现

**组件结构：**
```
src/components/workspace/SitePageLoader/
  ├── index.ts
  ├── SitePageLoader.tsx        // 主组件
  ├── UrlInput.tsx              // URL 输入框组件
  ├── NavigationToolbar.tsx     // 导航工具栏
  ├── PreviewContainer.tsx      // 预览容器
  └── types.ts                 // TypeScript 类型定义
```

**技术栈：**
- React 18
- iframe 或 react-iframe (站点加载)
- Next.js API (可选的代理加载)
- Tailwind CSS (样式)

**关键实现点：**
```tsx
interface SitePageLoaderProps {
  initialUrl?: string;
  readOnly?: boolean;
  onUrlChange?: (url: string) => void;
}

export function SitePageLoader({
  initialUrl,
  readOnly = false,
  onUrlChange,
}: SitePageLoaderProps) {
  const [url, setUrl] = useState(initialUrl || 'https://example.com');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUrlSubmit = () => {
    if (validateUrl(url)) {
      setIsLoading(true);
      onUrlChange?.(url);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* URL 输入栏 */}
      <UrlInput value={url} onChange={setUrl} onSubmit={handleUrlSubmit} />
      
      {/* 导航工具栏 */}
      <NavigationToolbar
        onBack={() => iframeRef.current?.contentWindow?.history.back()}
        onForward={() => iframeRef.current?.contentWindow?.history.forward()}
        onRefresh={() => setUrl(`${url}?t=${Date.now()}`)}
      />
      
      {/* 预览容器 */}
      <iframe
        ref={iframeRef}
        src={url}
        className="flex-1 w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
```

---

### Page 扩展

```tsx
// src/app/site-preview/page.tsx
import { SitePageLoader } from '@/components/workspace/SitePageLoader';

export default function SitePreviewPage() {
  return (
    <div className="h-screen w-full">
      <SitePageLoader initialUrl="https://example.com" />
    </div>
  );
}
```

---

## ✅ 验收标准

### 功能验收

- [x] 支持通过 URL 加载网页
- [x] 提供 URL 输入框和历史记录
- [x] 导航工具栏（前进、后退、刷新）正常工作
- [x] 加载状态指示器正常显示
- [ ] 支持全屏模式切换
- [ ] 支持移动端视图预览

### 安全性验收

- [x] 拒绝加载危险协议（`javascript:`, `data:`）
- [x] HTTP/HTTPS 协议验证
- [x] iframe sandbox 属性配置正确
- [ ] 白名单域名限制功能

### 性能验收

- [ ] 页面加载时间 < 2s
- [ ] 导航响应时间 < 300ms
- [ ] 同时加载多个页面无性能问题

### 用户体验验收

- [x] UI 界面简洁清晰
- [x] 错误提示友好
- [x] 支持键盘快捷键（Ctrl+L 聚焦 URL）

---

## 🎨 UI/UX 设计要求

**布局设计：**
- 顶部：URL 输入框 + 导航工具栏
- 中间：预览容器（iframe）
- 可选：侧边栏（收藏夹、历史记录）

**样式要求：**
- 与现有 Workspace 风格一致
- 使用 Tailwind CSS
- 响应式设计
- 支持暗黑模式

**交互设计：**
- URL 输入后按 Enter 或点击 Go 按钮加载
- 支持拖拽 URL 文本到输入框
- 支持右键菜单刷新页面

---

## 📊 工作量估算

| 任务 | 工作量 | 角色 |
|------|--------|------|
| SitePageLoader 组件开发 | 2 人天 | Frontend Lead |
| URL 验证和安全性 | 0.5 人天 | Frontend Lead |
| 导航工具栏开发 | 1 人天 | Frontend Lead |
| 响应式和暗黑模式 | 0.5 人天 | Frontend Lead |
| 测试和 QA | 1 人天 | QA Engineer |

**总计:** 约 2-3 人天

---

## 🧪 测试计划

### 功能测试

- [ ] URL 输入和验证
- [ ] 导航工具栏功能
- [ ] 加载状态显示
- [ ] 错误处理（无效 URL）

### 安全性测试

- [ ] 危险协议拦截
- [ ] iframe sandbox 配置
- [ ] 白名单验证

### 性能测试

- [ ] 页面加载速度
- [ ] 多页面同时加载
- [ ] 内存占用

### 兼容性测试

- [ ] 静态站点加载
- [ ] SPA (单页应用) 加载
- [ ] 跨域问题处理

---

## 🚨 风险与依赖

### 技术风险

- **iframe 限制：**
  - 某些网站拒绝 iframe 加载（X-Frame-Options: DENY）
  - 解决方案：提示用户在新标签页打开

- **跨域问题：**
  - 某些跨域资源可能加载失败
  - 解决方案：使用 CORS 代理

### 依赖

- 无特殊依赖，使用标准 Web API

---

## 📝 备注

- 优先实现基础功能（URL 加载 + 导航）
- 后续可扩展高级功能（保存常用 URL、收藏夹等）
- 考虑使用 Next.js API 代理访问特定站点

---

**创建日期:** 2025-02-02
**创建人:** Clawdbot
**状态:** 📋 待开始
