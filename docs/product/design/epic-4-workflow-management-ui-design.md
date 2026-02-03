# Epic 4 - Workflow Management UI/UX Design

**版本:** v1.0
**创建日期:** 2025-02-02
**最后更新:** 2025-02-02
**设计师:** Product Designer
**状态:** ✅ 设计完成
**关联 PRD:** `docs/product/prd/PRD-EPIC4-Workflow-Management-Integration.md`

---

## 📋 设计目标

### 核心目标
1. **无缝集成:** 将 Workflow 管理功能深度集成到 Workspace 和 Claude Code 主流程中
2. **设计统一:** 确保所有 Workflow 相关页面与主应用保持一致的视觉风格
3. **体验优化:** 提供直观、流畅的工作流发现、加载和使用体验
4. **性能优化:** 确保快速响应和流畅的交互

### 设计原则
1. **一致性:** 遵循 AuraForce 全局设计规范
2. **简洁性:** 减少认知负担，提供清晰的信息层次
3. **响应性:** 适配多种设备和屏幕尺寸
4. **可访问性:** 支持键盘导航和屏幕阅读器

---

## 🎨 设计规范

### 1. 颜色系统

#### 主色调（与 Claude 页面一致）
```css
/* 主色 - 紫色系 */
--primary-50: #faf5ff;
--primary-100: #f3e8ff;
--primary-200: #e9d5ff;
--primary-300: #d8b4fe;
--primary-400: #c084fc;
--primary-500: #a855f7;
--primary-600: #9333ea;  /* 主色 */
--primary-700: #7c3aed;
--primary-800: #6b21a8;
--primary-900: #581c87;
```

#### 渐变背景（与 Claude 页面一致）
```css
/* 主页面渐变 */
.gradient-bg {
  background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #faf5ff 100%);
}
```

#### 状态颜色
- 成功: `#2e7d32`
- 警告: `#f57c00`
- 错误: `#c62828`
- 信息: `#1565c0`
- 主色: `#9333ea`

### 2. 字体规范
- 标题: Inter, SF Pro, -apple-system (700/600 weight)
- 正文: Inter, SF Pro (400 weight)
- 代码: Fira Code, JetBrains Mono

### 3. 间距系统
- space-1: 4px, space-2: 8px, space-3: 12px, space-4: 16px
- space-5: 20px, space-6: 24px, space-8: 32px, space-10: 40px

### 4. 圆角规范
- radius-sm: 6px (内联元素、徽章)
- radius-md: 8px (按钮、输入框)
- radius-lg: 12px (卡片)
- radius-xl: 16px (大卡片)

### 5. 屏幕尺寸断点
- 手机: < 640px
- 平板: 640px - 1024px
- 桌面: > 1024px

---

## 🎯 页面设计

### Page 1: 工作流市场 2.0

#### 页面布局
```
┌─────────────────────────────────────────────────────────────┐
│  AuraForce > 工作流市场                         [用户菜单] │
├─────────────────────────────────────────────────────────────┤
│  工作流市场                                                 │
│  发现和使用社区创建的精选工作流                             │
│                                                             │
│  [🔍 搜索工作流名称、描述或标签...]                        │
│  [全部] [推荐 ⭐] [最新] [热门 🔥] [我的收藏 ❤️]            │
│                                                             │
│  [工作流卡片网格]                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 工作流1 │ │ 工作流2 │ │ 工作流3 │ │ 工作流4 │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  [分页控件]                                                 │
└─────────────────────────────────────────────────────────────┘
```

#### 设计规格
**页面容器：**
```css
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #faf5ff 100%);
}

.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}
```

**工作流网格（响应式）：**
```css
.workflow-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .workflow-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .workflow-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1280px) {
  .workflow-grid { grid-template-columns: repeat(4, 1fr); }
}
```

**工作流卡片：**
```css
.workflow-card {
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.workflow-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #9333ea;
}

.dark .workflow-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .workflow-card:hover {
  border-color: #a855f7;
}
```

---

### Page 2: Workspace - 新建项目（工作流模板选择）

#### 页面布局
```
┌─────────────────────────────────────────────────────────────┐
│  AuraForce > Workspace > 新建项目           [← 返回] [用户] │
├─────────────────────────────────────────────────────────────┤
│  新建项目                                                   │
│                                                             │
│  项目信息                                                   │
│  [项目名称: ] [描述: ]                                      │
│                                                             │
│  选择工作流模板                                             │
│  ┌─────────────┬───────────────────────────────────────┐   │
│  │ 分类        │  工作流列表                           │   │
│  │ • 推荐 ⭐  │  • 工作流1 [预览] [选择]              │   │
│  │ • 工作    │  • 工作流2 [预览] [选择]              │   │
│  │ • 开发    │  • ...                                │   │
│  └─────────────┴───────────────────────────────────────┘   │
│                                                             │
│  [取消]                                      [创建项目 →] │
└─────────────────────────────────────────────────────────────┘
```

#### 设计规格
**工作流选择器布局：**
```css
.workflow-selector {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.dark .workflow-selector {
  background: #1f2937;
  border-color: #374151;
}

@media (max-width: 1024px) {
  .workflow-selector {
    grid-template-columns: 1fr;
  }
}
```

**左侧分类导航：**
```css
.category-sidebar {
  padding: 1rem;
  border-right: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.dark .category-sidebar {
  border-right-color: #374151;
  background-color: #111827;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.category-item:hover {
  background-color: rgba(147, 51, 234, 0.1);
  color: #9333ea;
}

.category-item.active {
  background-color: #9333ea;
  color: #ffffff;
}
```

---

### Page 3: Claude - 工作流选择面板

#### 交互模式 1: 工具栏按钮触发展开面板（右侧滑出，最大宽度 280px，带遮罩）

```
用户点击右侧工具栏按钮（FolderOpen 图标）
    ↓
右侧滑出工作流选择面板
    ↓
搜索框 + 筛选器 + 工作流列表（可滚动）
    ↓
选择工作流 → 显示详情 → 点击 "加载"
    ↓
面板关闭，Claude 通知："工作流 X 已部署到 Workspace"
```

#### 面板规格
```css
.panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  transition: opacity 0.2s;
}

.panel-content {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  max-width: 90vw;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 51;
  transition: transform 0.3s ease;
}

.dark .panel-content {
  background: #1f2937;
}

@media (max-width: 640px) {
  .panel-content {
    width: 100%;
    max-width: 100%;
  }
}
```

---

## 🎭 组件设计

### 组件 1: 工作流卡片（WorkflowsCard）

**用途:** 在市场页面和列表中展示工作流

**规格：**
- 宽度: 100%（响应式， Grid 布局中按列宽）
- 最小高度: 280px
- 圆角: 0.75rem
- 边框: 1px solid #e5e7eb
- 内边距: 1rem
- 间距: gap-1.5rem（网格中）

**结构：**
```
.card
  └─ .card-image (160px 高度，渐变背景或缩略图)
  └─ .card-content
       └─ .card-title
       └─ .card-description (2 行截断)
       └─ .card-meta (作者、版本、日期)
       └─ .card-tags (徽章列表)
       └─ .card-stats (加载次数、评分)
  └─ .card-actions
       └─ [详情] 按钮（次要）
       └─ [加载] 按钮（主要）
       └─ [♥] 收藏按钮（图标）
```

**按钮样式：**
```css
.button-primary {
  background-color: #9333ea;
  color: #ffffff;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.button-primary:hover {
  background-color: #7c3aed;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
}

.button-secondary {
  background-color: #f9fafb;
  color: #374151;
  border: 1px solid #e5e7eb;
}
```

---

### 组件 2: 工作流选择器项（WorkflowSelectableItem）

**用途:** 在列表中显示可选择的工作流项

**规格：**
- 宽度: 100%
- 高度: auto
- 圆角: 0.5rem
- 边框: 1px solid #e5e7eb
- 内边距: 0.875rem
- 间距: gap-4（列表中）

**选中状态：**
```css
.workflow-item.selected {
  border-color: #9333ea;
  background-color: rgba(147, 51, 234, 0.05);
}

.dark .workflow-item.selected {
  border-color: #a855f7;
  background-color: rgba(168, 85, 247, 0.1);
}
```

---

### 组件 3: 搜索框（SearchBox）

**规格：**
```css
.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  background-color: #ffffff;
  color: #1f2937;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}
```

**图标：** Search (lucide-react) - absolute 定位，left: 1rem

---

### 组件 4: 分类标签（CategoryTabs）

**规格：**
```css
.category-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.category-tab {
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab.active {
  background-color: #9333ea;
  color: #ffffff;
  border-color: #9333ea;
}
```

---

### 组件 5: 徽章（Badge）

**状态徽章：**
```css
.badge {
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.badge-public {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-private {
  background-color: #f3f4f6;
  color: #374151;
}

.badge-deployed {
  background-color: #dcfce7;
  color: #166534;
}

.badge-error {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-pending {
  background-color: #fef3c7;
  color: #92400e;
}

/* Dark mode */
.dark .badge-public {
  background-color: rgba(30, 64, 175, 0.2);
  color: #93c5fd;
}

.dark .badge-private {
  background-color: rgba(75, 85, 99, 0.3);
  color: #d1d5db;
}
```

---

## 🔄 交互设计

### 交互 1: 在 Workspace 创建项目
```
用户访问 Workspace
    ↓
点击 "New Project" 按钮
    ↓
导航到 /workspace/new 页面
    ↓
填写项目信息（名称、描述）
    ↓
从左侧分类选择工作流
    ↓
从右侧列表选择工作流
    ↓
点击 "创建项目" 按钮
    ↓
显示加载状态
    ↓
成功后跳转到项目详情页
    ↓
Claude 通知："项目已创建，工作流已部署"
```

### 交互 2: 在 Claude 加载工作流
```
方式 A: 工具栏按钮
1. 点击工具栏 "Workflows" 按钮（FolderOpen 图标）
2. 右侧滑出工作流选择面板（320px 宽度）
3. 显示搜索框、筛选器、工作流列表
4. 选择工作流卡片
5. 点击 "加载" 按钮
6. 显示加载进度
7. 加载完成后通知并在对话中确认

方式 B: 命令输入
1. 在消息输入框输入 "/workflow"
2. 弹出命令面板（居中模态框）
3. 显示可用的工作流
4. 选择工作流
5. 自动加载
```

### 交互 3: 工作流市场浏览
```
用户访问工作流市场
    ↓
默认显示 "推荐" 分类
    ↓
可切换分类：全部、推荐、最新、热门、我的收藏
    ↓
使用搜索框搜索工作流
    ↓
点击工作流卡片查看详情
    ↓
点击 "加载" 按钮
    ↓
跳转到 Workspace，创建新项目
```

---

## 📱 响应式设计

### 断点设计
```css
/* 手机 (< 640px) */
@media (max-width: 639px) {
  .workflow-grid { grid-template-columns: 1fr; }
  .workflow-selector { grid-template-columns: 1fr; }
  .category-sidebar { order: 0; }
  .panel-content { width: 100%; }
}

/* 平板 (640px - 1024px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .workflow-grid { grid-template-columns: repeat(2, 1fr); }
  .workflow-selector { grid-template-columns: 1fr; }
  .panel-content { width: 320px; }
}

/* 桌面 (> 1024px) */
@media (min-width: 1024px) {
  .workflow-grid { grid-template-columns: repeat(3, 1fr); }
  .workflow-selector { grid-template-columns: 240px 1fr; }
}
```

---

## ♿ 可访问性设计

### 键盘导航
- Tab 键在可交互元素间导航
- Enter/Space 键激活按钮和链接
- Escape 键关闭模态框和面板
- 方向键在列表和网格中导航

### ARIA 标签
```html
<!-- 按钮 -->
<button aria-label="加载工作流" aria-pressed="false">
  加载
</button>

<!-- 按钮（图标） -->
<button aria-label="收藏工作流">
  <Heart />
</button>

<!-- 搜索框 -->
<input
  type="text"
  aria-label="搜索工作流"
  placeholder="搜索工作流名称、描述或标签..."
/>

<!-- 工作流卡片 -->
<article
  role="article"
  aria-label="工作流: 工作流名称"
>
  <!-- 卡片内容 -->
</article>
```

### 色彩对比度
- 所有文本满足 WCAG AA 标准（4.5:1）
- 关键元素满足 WCAG AAA 标准（7:1）
- 重要信息不仅依赖颜色传达

---

## 🎬 动画效果

### 页面加载动画
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-content {
  animation: fadeInUp 0.3s ease-out;
}
```

### 卡片悬停动画
```css
.workflow-card {
  transition: all 0.2s ease;
}

.workflow-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### 面板滑入动画
```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.panel-content {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

.panel-content.closing {
  animation: slideOutRight 0.3s ease-out;
}
```

### 按钮点击反馈
```css
.button-primary:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(147, 51, 234, 0.3);
}
```

---

## 📐 设计系统总结

### 共享原则
1. **紫色主题：** 主色 #9333ea（light）/#a855f7（dark）
2. **圆角设计：** 统一使用 0.5rem / 0.75rem
3. **渐变背景：** 蓝色 → 白色 → 紫色
4. **阴影层次：** 使用微妙的阴影提供深度
5. **动画时长：** 150-300ms，使用 ease-out

### 组件库
- **WorkflowsCard:** 工作流市场卡片
- **WorkflowSelectableItem:** 可选的工作流列表项
- **SearchBox:** 搜索输入框
- **CategoryTabs:** 分类标签导航
- **Badge:** 状态/标签徽章
- **WorkflowPanel:** Claude 右侧滑出面板
- **WorkflowSelector:** Workspace 工作流选择器

### 设计 Token
```javascript
const tokens = {
  colors: {
    primary: '#9333ea',
    primaryDark: '#a855f7',
    success: '#2e7d32',
    warning: '#f57c00',
    error: '#c62828',
    info: '#1565c0',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  transition: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
};
```

---

## ✅ 验收检查表

### 设计完整性
- [x] 完整的颜色系统定义
- [x] 字体和字号规范
- [x] 间距和圆角规范
- [x] 动画效果定义
- [x] 响应式断点设计
- [x] 可访问性要求

### 页面设计
- [x] 工作流市场 2.0 页面设计
- [x] Workspace 新建项目页面设计
- [x] Claude 工作流选择面板设计
- [x] 所有页面的响应式设计

### 组件设计
- [x] WorkflowsCard 组件设计
- [x] WorkflowSelectableItem 组件设计
- [x] SearchBox 组件设计
- [x] CategoryTabs 组件设计
- [x] Badge 组件设计
- [x] WorkflowPanel 组件设计
- [x] WorkflowSelector 组件设计

### 交互设计
- [x] Workspace 创建项目流程
- [x] Claude 加载工作流流程（两种方式）
- [x] 工作流市场浏览流程
- [x] 错误处理定义

### 设计统一性
- [x] 所有页面使用统一的设计 Token
- [x] 颜色与主应用一致（紫色主题）
- [x] 组件样式与主应用一致
- [x] 布局和间距与主应用一致
- [x] 深色模式完整支持

---

## 📚 相关文档

- **PRD:** `docs/product/prd/PRD-EPIC4-Workflow-Management-Integration.md`
- **主流程设计:** `docs/product/design/code-editor-ui-design.md`
- **文件操作设计:** `docs/product/design/file-operations-ui-design.md`
- **设计优先流程:** `docs/pm/DESIGN_FIRST_FLOW_v1-1.md`
- **Tailwind 配置:** `tailwind.config.js`
- **全局样式:** `src/app/globals.css`

---

## 🎯 下一步

1. **设计评审：** 组织全员参加设计评审会议
2. **反馈收集：** 收集 Frontend、Backend、QA 的反馈
3. **设计调整：** 根据反馈调整设计
4. **开发交付：** 交付最终设计给开发团队
5. **开发支持：** 在开发过程中提供设计支持

---

**设计状态:** ✅ 完成
**待评审:** 是
**评审日期:** TBD
