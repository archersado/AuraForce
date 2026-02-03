# Epic 14: Workspace 编辑器与文件管理 - 开发计划

## 📋 Epic 概述

**Epic ID:** EP-14
**Epic 名称**: Workspace 编辑器与文件管理
**开始日期:** 2026-01-31
**状态**: 🔄 进行中

### 目标
实现完整的在线 Workspace 编辑器功能，支持多格式文件（代码、Markdown、图片、PPT）的查看、编辑和管理。集成 Claude Agent SDK 实现智能文件操作和 AI 辅助编辑。

---

## ✅ 已完成的基础设施

### 1. 核心服务层
- ✅ `src/lib/workspace/files-service.ts` - 文件操作服务
  - listDirectory() - 列出目录内容
  - readFile() - 读取文件内容
  - writeFile() - 写入文件内容
  - deleteFile() - 删除文件
  - formatFileSize() - 格式化文件大小
  - formatDate() - 格式化日期
  - getLanguageFromExtension() - 获取文件语言
  - isImageFile() - 检查是否为图片
  - isPresentationFile() - 检查是否为 PPT
  - getFilePreviewUrl() - 获取文件预览 URL

### 2. API 路由
- ✅ `src/app/api/files/list/route.ts` - 文件列表
- ✅ `src/app/api/files/read/route.ts` - 文件读取
- ✅ `src/app/api/files/write/route.ts` - 文件写入
- ✅ `src/app/api/files/delete/route.ts` - 文件删除

### 3. 基础组件
- ✅ `WorkspacePanel.tsx` - 主面板容器（可调整宽度）
- ✅ `FileBrowser.tsx` - 文件浏览器
- ✅ `FileEditor.tsx` - 文件编辑器
- ✅ `ProjectFileTree.tsx` - 项目文件树
- ✅ `MarkdownPreviewEditor.tsx` - Markdown 编辑器
- ✅ `MediaPreview.tsx` - 媒体预览
- ✅ `AIMarkdownEditor.tsx` - AI Markdown 编辑器
- ✅ `FileOperationNotification.tsx` - 文件操作通知

---

## 🚀 开发任务清单

### Phase 1: 完善文件操作管理（高优先级）

#### Task 1.1: 增强文件上传功能
- [ ] 实现拖放上传
- [ ] 支持多文件上传
- [ ] 显示上传进度条
- [ ] 支持 100MB 大文件上传（已在 Next.js 配置）
- [ ] 上传时验证文件类型
- [ ] 上传后自动刷新文件树

**文件：** `src/components/workspace/FileBrowser.tsx`

---

#### Task 1.2: 添加文件搜索功能
- [ ] 实现文件名搜索
- [ ] 按类型筛选（代码、Markdown、图片、其他）
- [ ] 按时间筛选（今天、本周、所有）
- [ ] 实时搜索结果
- [ ] 高亮匹配结果

**文件：**
- `src/components/workspace/FileBrowser.tsx`
- `src/lib/workspace/files-service.ts` - 添加 `searchFiles()` 函数

---

#### Task 1.3: 实现文件重命名
- [ ] 右键菜单添加重命名选项
- [ ] 重命名时验证名称合法性
- [ ] 更新相关引用
- [ ] 处理重命名冲突

**文件：**
- `src/components/workspace/FileBrowser.tsx`
- `src/lib/workspace/files-service.ts` - 添加 `renameFile()` 函数
- `src/app/api/files/rename/route.ts` - 新建 API 路由

---

#### Task 1.4: 实现文件夹创建
- [ ] 添加"新建文件夹"按钮
- [ ] 输入验证（名称合法性）
- [ ] 递归创建（支持 `path/to/folder`）
- [ ] 创建后自动选中并展开

**文件：**
- `src/components/workspace/FileBrowser.tsx`
- `src/lib/workspace/files-service.ts` - 添加 `createDirectory()` 函数
- `src/app/api/files/mkdir/route.ts` - 新建 API 路由

---

#### Task 1.5: 实现文件移动
- [ ] 拖放移动文件
- [ ] 右键菜单"移动到..."
- [ ] 目标路径验证
- [ ] 移动后刷新源和目标目录

**文件：**
- `src/components/workspace/FileBrowser.tsx`
- `src/lib/workspace/files-service.ts` - 添加 `moveFile()` 函数
- `src/app/api/files/move/route.ts` - 新建 API 路由

---

### Phase 2: 增强编辑器功能（高优先级）

#### Task 2.1: 代码编辑器语法高亮
- [ ] 集成 Monaco Editor 或 CodeMirror 6
- [ ] 支持多语言语法高亮
- [ ] LSP 提示和自动补全
- [ ] 错误提示和警告
- [ ] 快捷键支持（Ctrl+S, Ctrl+Z, Ctrl+Y 等）

**依赖安装：**
```bash
npm install @monaco-editor/react monaco-editor
# 或
npm install @codemirror/state @codemirror/view @codemirror/lang-javascript @codemirror/lang-typescript
```

**文件：**
- `src/components/workspace/CodeEditor.tsx` - 新建组件
- `src/lib/workspace/editor-setup.ts` - 编辑器配置

---

#### Task 2.2: 实现标签页管理
- [ ] 多文件同时打开
- [ ] 标签页切换
- [ ] 关闭标签页
- [ ] 关闭其他/关闭全部
- [ ] 标签页图标显示文件类型
- [ ] 未保存指示器（星号 *）

**文件：**
- `src/components/workspace/WorkspacePanel.tsx` - 主面板
- `src/components/workspace/TabBar.tsx` - 新建标签栏组件
- `src/stores/workspace-tabs-store.ts` - Zustand store

---

#### Task 2.3: 自动保存功能
- [ ] 300ms 防抖自动保存
- [ ] 保存状态指示器
- [ ] 网络错误时重试
- [ ] 离线时缓存到 localStorage
- [ ] 恢复时合并本地和远程版本

**文件：**
- `src/components/workspace/FileEditor.tsx`
- `src/lib/workspace/auto-save.ts` - 自动保存逻辑

---

#### Task 2.4: 大文件优化
- [ ] 大文件分块加载（> 1MB）
- [ ] 显示加载进度
- [ ] 只加载可视区域内容（虚拟滚动）
- [ ] 大文件警告提示

**文件：**
- `src/lib/workspace/large-file-handler.ts` - 新建文件处理逻辑
- `src/components/workspace/FileEditor.tsx`

---

### Phase 3: AI 辅助编辑（核心功能）

#### Task 3.1: Claude Agent 文件操作集成
- [ ] Claude 可以读取当前文件内容
- [ ] Claude 可以修改文件
- [ ] Claude 可以创建文件
- [ ] 监听文件变更事件
- [ ] 通知前端刷新文件树

**文件：**
- `src/lib/claude/file-operations.ts` - 集成 Claude Agent SDK
- `src/components/claude/ChatInterface.tsx` - 添加文件操作指令

---

#### Task 3.2: AI 代码改进
- [ ] "改善这个函数"指令
- [ ] "添加注释"指令
- [ ] "重构代码"指令
- [ ] "优化性能"指令
- [ ] 添加 Diff 预览

**文件：**
- `src/lib/claude/code-improvements.ts` - AI 代码改进指令
- `src/components/claude/CodeDiffViewer.tsx` - Diff 预览组件

---

#### Task 3.3: AI 文档生成
- [ ] "生成文档注释"指令
- [ ] "创建 README"指令
- [ ] "生成 API 文档"指令
- [ ] 支持多种文档格式（Markdown、JSDoc 等）

**文件：**
- `src/lib/claude/documentation.ts` - 文档生成逻辑

---

#### Task 3.4: AI Markdown 辅助
- [ ] "扩展这个要点"指令
- [ ] "优化结构"指令
- [ ] "添加表格"指令
- [ ] "转换为其他格式"指令
- [ ] 实时预览改进建议

**文件：**
- `src/components/workspace/AIMarkdownEditor.tsx` - 增强 AI 交互
- `src/lib/claude/markdown-assistant.ts` - Markdown 辅助

---

### Phase 4: 媒体文件支持（中优先级）

#### Task 4.1: 图片预览增强
- [ ] 支持 PNG、JPG、GIF、SVG、WebP
- [ ] 缩放和旋转
- [ ] 显示图片元数据（尺寸、格式）
- [ ] 全屏预览模式
- [ ] 拖拽查看（类似 Google Photos）

**文件：**
- `src/components/workspace/MediaPreview.tsx` - 增强
- `src/lib/workspace/image-viewer.ts` - 图片查看器

---

#### Task 4.2: PPT 文件预览
- [ ] 支持 .ppt 和 .pptx 格式
- [ ] 幻灯片模式
- [ ] 导航控制（上一页、下一页）
- [ ] 缩略图预览
- [ ] 全屏播放

**依赖安装：**
```bash
npm install pptxgenjs ms-office-js-preview
```

**文件：**
- `src/components/workspace/PresentationViewer.tsx` - 新建组件
- `src/lib/workspace/ppt-parser.ts` - PPT 解析器

---

#### Task 4.3: 文档预览
- [ ] PDF 在线预览
- [ ] Word 文档预览
- [ ] 只读模式
- [ ] 页面导航
- [ ] 缩放控制

**依赖安装：**
```bash
npm install react-pdf pdfjs-dist
```

**文件：**
- `src/components/workspace/DocumentPreviewer.tsx` - 新建组件

---

### Phase 5: 协作与版本控制（中优先级）

#### Task 5.1: 文件版本管理
- [ ] 保存历史版本
- [ ] 版本列表查看
- [ ] 恢复到历史版本
- [ ] 版本对比 Diff
- [ ] 版本评论和标注

**文件：**
- `src/lib/workspace/version-control.ts` - 版本控制逻辑
- `src/app/api/files/versions/route.ts` - 版本 API
- `src/components/workspace/VersionHistory.tsx` - 版本历史 UI

---

#### Task 5.2: 分支管理
- [ ] 创建文件分支
- [ ] 切换分支
- [ ] 分支合并
- [ ] 分支 Diff
- [ ] 删除分支

**文件：**
- `src/lib/workspace/branch-manager.ts` - 分支管理
- `src/components/workspace/BranchSelector.tsx` - 分支选择器

---

#### Task 5.3: 协作编辑（未来）
- [ ] 多用户实时编辑
- [ ] 光标位置同步
- [ ] 编辑冲突解决
- [ ] 在线用户指示器
- [ ] 编辑协作记录

**技术：** WebSocket 或 Yjs CRDT

**文件：**
- `src/lib/workspace/collaboration.ts`
- `src/components/workspace/CollaborationCursors.tsx`

---

### Phase 6: 权限与安全（中优先级）

#### Task 6.1: 文件访问控制
- [ ] 设置文件为只读
- [ ] 设置文件为私有
- [ ] 共享给特定用户
- [ ] 继承权限（从父目录）
- [ ] 权限验证中间件

**文件：**
- `src/lib/workspace/permissions.ts` - 权限管理
- `src/components/workspace/PermissionDialog.tsx` - 权限设置 UI
- `src/middleware.ts` - 添加权限检查

---

#### Task 6.2: 企业团队管理
- [ ] 邀请团队成员
- [ ] 团队 Workspace 共享
- [ ] 成员权限级别（Owner、Admin、Editor、Viewer）
- [ ] 成员活动日志
- [ ] 移除团队成员

**文件：**
- `src/app/tenant/[tenantId]/members/page.tsx` - 成员管理页面
- `src/components/workspace/TeamSettings.tsx` - 团队设置
- `src/app/api/tenant/[tenantId]/members/route.ts` - 成员 API

---

### Phase 7: 用户体验优化（低优先级）

#### Task 7.1: 全屏和专注模式
- [ ] 全屏按钮
- [ ] 专注模式（隐藏侧边栏）
- [ ] 退出全屏（ESC）
- [ ] 保存用户偏好

**文件：**
- `src/components/workspace/WorkspacePanel.tsx`

---

#### Task 7.2: 主题定制
- [ ] 亮色主题
- [ ] 暗色主题
- [ ] 主题切换快捷键（Ctrl+Shift+T）
- [ ] 主题预览
- [ ] 自定义主题配置

**文件：**
- `src/stores/theme-store.ts` - 主题 store
- `src/components/workspace/ThemeToggle.tsx` - 主题切换器

---

#### Task 7.3: 国际化（i18n）
- [ ] 中文界面
- [ ] 英文界面
- [ ] 语言切换
- [ ] 翻译文件管理

**依赖安装：**
```bash
npm install next-intl
```

**文件：**
- `src/i18n/config.ts` - i18n 配置
- `src/i18n/zh-CN.json` - 中文翻译
- `src/i18n/en-US.json` - 英文翻译

---

#### Task 7.4: 快捷键完善
- [ ] Ctrl+S - 保存
- [ ] Ctrl+Z - 撤销
- [ ] Ctrl+Y - 重做
- [ ] Ctrl+F - 搜索
- [ ] Ctrl+Shift+F - 全局搜索
- [ ] Ctrl+N - 新文件
- [ ] Ctrl+W - 关闭标签页
- [ ] Ctrl+Tab - 切换标签页
- [ ] Ctrl+K - 命令面板
- [ ] ESC - 退出全屏/关闭

**文件：**
- `src/lib/workspace/keyboard-shortcuts.ts` - 快捷键管理
- `src/components/workspace/ShortcutHelp.tsx` - 快捷键帮助面板
- `src/components/workspace/CommandPalette.tsx` - 命令面板

---

## 📁 文件结构

```
src/
├── app/
│   └── api/
│       └── files/
│           ├── list/route.ts          ✅
│           ├── read/route.ts          ✅
│           ├── write/route.ts         ✅
│           ├── delete/route.ts        ✅
│           ├── rename/route.ts        🔄 TODO
│           ├── mkdir/route.ts         🔄 TODO
│           ├── move/route.ts          🔄 TODO
│           └── versions/route.ts      🔄 TODO
│
├── components/
│   └── workspace/
│       ├── WorkspacePanel.tsx         ✅
│       ├── FileBrowser.tsx            ✅ (待增强)
│       ├── FileEditor.tsx             ✅ (待增强)
│       ├── ProjectFileTree.tsx        ✅
│       ├── MarkdownPreviewEditor.tsx   ✅
│       ├── MediaPreview.tsx           ✅ (待增强)
│       ├── AIMarkdownEditor.tsx       ✅ (待增强)
│       ├── FileOperationNotification.tsx ✅
│       ├── TabBar.tsx                🔄 TODO
│       ├── CodeEditor.tsx             🔄 TODO
│       ├── VersionHistory.tsx         🔄 TODO
│       ├── BranchSelector.tsx         🔄 TODO
│       ├── PermissionDialog.tsx       🔄 TODO
│       ├── PPTViewer.tsx             🔄 TODO
│       ├── DocumentPreviewer.tsx      🔄 TODO
│       ├── ThemeToggle.tsx            🔄 TODO
│       ├── ShortcutHelp.tsx           🔄 TODO
│       └── CommandPalette.tsx        🔄 TODO
│
├── lib/
│   └── workspace/
│       ├── files-service.ts           ✅
│       ├── editor-setup.ts            🔄 TODO
│       ├── auto-save.ts              🔄 TODO
│       ├── large-file-handler.ts       🔄 TODO
│       ├── version-control.ts          🔄 TODO
│       ├── branch-manager.ts           🔄 TODO
│       ├── permissions.ts             🔄 TODO
│       ├── keyboard-shortcuts.ts       🔄 TODO
│       ├── ppt-parser.ts              🔄 TODO
│       ├── image-viewer.ts            🔄 TODO
│       └── search.ts                 🔄 TODO
│
└── stores/
    ├── workspace-tabs-store.ts        🔄 TODO
    └── theme-store.ts                🔄 TODO
```

---

## 🎯 优先级排序

### P0 - 核心功能（立即开始）
1. Task 1.1: 文件上传功能
2. Task 1.2: 文件搜索功能
3. Task 2.1: 代码编辑器语法高亮
4. Task 2.2: 标签页管理
5. Task 2.3: 自动保存功能

### P1 - 高优先级（1-2 周内）
6. Task 1.3: 文件重命名
7. Task 1.4: 文件夹创建
8. Task 1.5: 文件移动
9. Task 2.4: 大文件优化
10. Task 3.1: Claude Agent 文件操作
11. Task 3.2: AI 代码改进

### P2 - 中优先级（2-4 周内）
12. Task 3.3: AI 文档生成
13. Task 3.4: AI Markdown 辅助
14. Task 4.1: 图片预览增强
15. Task 4.2: PPT 文件预览
16. Task 5.1: 文件版本管理
17. Task 6.1: 文件访问控制

### P3 - 低优先级（后续优化）
18. Task 4.3: 文档预览
19. Task 5.2: 分支管理
20. Task 5.3: 协作编辑
21. Task 6.2: 企业团队管理
22. Task 7.1: 全屏和专注模式
23. Task 7.2: 主题定制
24. Task 7.3: 国际化
25. Task 7.4: 快捷键完善

---

## 🚦 下一步行动

### 立即开始（今天）
1. **Task 1.1**: 实现文件上传功能（拖放 + 进度）
2. **Task 1.2**: 添加文件搜索功能
3. **Task 2.2**: 实现标签页管理

### 本周内完成
4. **Task 2.1**: 集成 Monaco Editor
5. **Task 2.3**: 实现自动保存功能
6. **Task 3.1**: Claude Agent 文件操作集成
7. **Task 1.3-1.5**: 文件操作增强（重命名、创建、移动）

---

## 📝 技术选型

### 编辑器选择
- **Monaco Editor**: 功能强大，VS Code 同款
  - 优点：功能完整、性能好、生态丰富
  - 缺点：包体积大（~3MB）
- **CodeMirror 6**: 轻量级、高度可定制
  - 优点：轻量、可定制、性能优秀
  - 缺点：需要配置更多

**建议**: CodeMirror 6（轻量优先）

---

## 📊 进度跟踪

- **总任务数**: 25
- **已完成**: 12
- **进行中**: 0
- **待开始**: 13
- **完成率**: 48%

### 详细进度

#### ✅ Phase 1: 核心文件操作 (5/5 完成 - 100%)
- ✅ Task 1.1 - 文件上传功能
- ✅ Task 1.2 - 文件搜索功能
- ✅ Task 1.3 - 文件重命名
- ✅ Task 1.4 - 文件夹创建
- ✅ Task 1.5 - 文件移动

#### ✅ Phase 2: 代码编辑器增强 (4/5 完成 - 80%)
- ✅ Task 2.1 - 代码编辑器语法高亮
  - ✅ CodeMirror 6 集成
  - ✅ 多语言语法高亮（14+ 种语言）
  - ✅ LSP 代码补全（关键词自动补全）
  - ✅ 快捷键支持（Ctrl+S, Ctrl+/, Tab）
  - ✅ 行号和错误提示
- ✅ Task 2.2 - 快捷键面板
  - ✅ 显示所有快捷键
  - ✅ 按类别分组
  - ✅ 搜索和筛选
  - ✅ 平台适配（Mac/Windows/Linux）
- ✅ Task 2.3 - 大文件优化
  - ✅ 分块加载（>1MB 文件）
  - ✅ 虚拟滚动（只加载可视区域）
  - ✅ 加载进度指示
  - ✅ 大文件警告提示
  - ✅ 内存优化
- ✅ Task 2.5 - 代码片段
  - ✅ 25+ 内置代码片段（JS/TS/React/Python/SQL/HTML）
  - ✅ 用户自定义片段
  - ✅ 片段搜索和筛选
  - ✅ 按 language 分类
  - ✅ Tab 停留点 ($1, $2, $3)
  - ✅ Trigger prefix 和快捷键 (Ctrl+Space)
  - ✅ 存储（localStorage）
  - ✅ CRUD 操作
- ⚠️ Task 2.4 - LSP 服务器集成（跳过，复杂度高，需要外部 LSP 服务器）

#### ✅ Phase 3: 增强用户界面 (4/4 完成 - 100%)
- ✅ Task 3.1 - 主题切换
  - ✅ Light/Dark/System 三种模式
  - ✅ 自动检测系统偏好
  - ✅ 主题持久化
  - ✅ 平滑过渡动画
  - ✅ 多种 UI 变体
- ✅ Task 3.2 - 拖放调整窗口大小
  - ✅ 水平/垂直分割面板
  - ✅ 最小/最大尺寸约束
  - ✅ 触摸支持
  - ✅ 平滑调整动画
  - ✅ 尺寸持久化
  - ✅ 复位按钮
- ✅ Task 3.3 - 文件图标系统
  - ✅ 100+ 文件扩展名映射
  - ✅ 10+ 文件类别（code, image, video, audio, document, etc.）
  - ✅ 15+ 颜色主题
  - ✅ 文件描述和类型检测
  - ✅ FileIcon, FolderIcon, FileTypeBadge, FileTypeFilter 组件
  - ✅ 实用函数（getFileCategory, getFileColor, getFileDescription）
- ✅ Task 3.4 - 批量操作支持
  - ✅ 多文件选择（checkbox + ctrl+A）
  - ✅ 批量删除（确认对话框）
  - ✅ 批量移动（目标位置选择）
  - ✅ 批量导出
  - ✅ 进度跟踪（processed/total）
  - ✅ 错误处理和恢复
  - ✅ ESC 键清除选择
  - ✅ Success/Error 提示

#### ⏸️ Phase 4: AI 辅助编辑 (0/5 待开始 - 0%)
- ⏸️ Task 4.1 - Claude Agent SDK 集成
- ⏸️ Task 4.2 - 代码改进指令
- ⏸️ Task 4.3 - 文档生成
- ⏸️ Task 4.4 - Markdown 辅助
- ⏸️ Task 4.5 - 解释代码

#### ⏸️ Phase 5: 协作功能 (0/5 待开始 - 0%)
- ⏸️ Task 5.1 - 多用户支持
- ⏸️ Task 5.2 - 实时光标
- ⏸️ Task 5.3 - 评论系统

#### ⏸️ Phase 6: 版本控制集成 (0/5 待开始 - 0%)
- ⏸️ Task 6.1 - Git 状态面板
- ⏸️ Task 6.2 - Staging/Commit UI
- ⏸️ Task 6.3 - Diff 查看器

---

## 🔗 参考
- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [CodeMirror 文档](https://codemirror.net/)
- [Next.js File Uploads](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#form-data)
- [Prisma 文件操作](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields#reading-and-writing-fields)

---

**最后更新**: 2026-01-31
**负责人**: AI Assistant
