# Linear Issues 手动创建指南

**根据项目分析，为已完成的 5 个 Epics 在 Linear 项目中创建 Issues**

---

## 🎯 快速开始

1. 打开 https://linear.app/archersado/project/auraforce-d9703902f025/issues
2. 点击 "New issue" 按钮
3. 按照下面的 Issue 创建模板填写

---

## 📊 创建 5 个 Epic Issues

### Epic 0: Team Formation & Project Management

```
创建 Issue → 输入以下信息：
- 标题： [EPIC-00] 团队建设与项目管理
- 描述：
# 团队建设与项目管理 100% 完成

## 团队组建 (6 个角色)
- 🔧 Frontend Lead (React/Next.js)
- ⚙️ Backend Engineer (API/技术架构)
- 🗄️ Database Architect (Prisma/数据库设计)
- 🧪 QA Engineer (Jest/Playwright)
- 🚀 DevOps Specialist (部署/CI/CD)
- 📚 Docs Engineer (技术文档)

## 文档成果
- ✅ 完整的团队工作流
- 📚 76 个文档文件已归档和分类
- 📋 PM 管理文档体系完整
- 🎯 PM 和 Linear 集成完成

## 状态
- 状态: Done
- 完成日期: 2025-01-15

## 技术成果
- ✅ Next.js 16 + App Router 迁移
- ✅ TypeScript strict mode 配置
- ✅ 核心依赖（Prisma, Zustand, Auth.js v5）
- ✅ API 前缀配置（部分完成）

---
标签: Feature
状态: Done
Assignee: (可选，或留空)
```

---

### Epic 1: Project Foundation & Tech Stack Initialization

```
创建 Issue → 输入以下信息：

标题：[EPIC-01] 项目基础与技术栈初始化 (100% 完成)

描述：
### 核心功能 ✅
- Next.js 16 + App Router 迁移 ✅
- TypeScript strict mode 配置 ✅
- 核心依赖安装（Prisma, Zustand, Auth.js v5）✅
- Prisma Database Schema 配置 ✅
- Auth.js v5 集成 ✅
- Zustand Store 初始化 ✅
- API 前缀配置 ✅ (部分/待修复)
- 大文件支持（100MB）✅

### Story 完成情况
- Story 1.1: Initialize Next.js Project ✅
- Story 1.2: Configure TypeScript Strict Mode ✅
- Story 1.3: Install Core Dependencies ✅
- Story 1.4: Setup Prisma Schema ✅
- Story 1.5: Configure Auth.js v5 ✅
- Story 1.6: Initialize Zustand Store ✅
- Story 1.7: API Prefix Configuration ⭐️（部分完成）

### 成果
✅ 完整的技术架构设计
✅ 数据库配置和映射
✅ 认证系统配置（NextAuth 5）
✅ 状态管理（Zustand）

---
标签: Feature
状态: Done
```

---

### Epic 2: User Account & Authentication

```
创建 Issue → 输入以下信息：

标题：[EPIC-02] 用户账户与认证系统 (100% 完成)

描述:
### 核心功能 ✅
- ✅ 用户注册（Email 验证）
- ✅ 用户登录（多方式：邮箱、用户名密码、Google OAuth）
- ✅ 会话管理（JWT + Cookie）
- ✅ 密码重置和邮箱验证
- ✅ 用户档案管理

### Story 完成情况（9个 Story 全部 Done）
- Story 2.1: 用户注册功能 (Email 验证)
- Story 2.2: 用户登录功能
- Story 2.3: 会话管理
- Story 2.4: 密码重置和邮箱验证
- Story 2.5: 用户档案管理
- Story 2.6: 数据库模型
- Stories 2.7: 用户设置界面
- Stories 2.8-2.9: 其他功能

### 技术实现
- Next.js 16 App Router ✅
- Auth.js v5 完整集成 ✅
- Prisma 多租户数据模型 ✅
- WebSocket 会话持久化 ✅

---
标签: Feature
状态: Done
```

---

### Epic 3: Claude Code Graphical Interface

```
创建 Issue → 输入以下信息：

标题：[EPIC-03] Claude Code 图形界面 (100% 完成)

描述：
### 核心功能 ✅
- 🔧 Web GUI 集成 Claude Code CLI 功能
- 📡 实时 WebSocket 连接和通信
- 🖥️ 终端模拟和输出流显示
- 📊 实时监控和可视化
- 🔄 会话管理和持久化

### Story 完成情况（7 个 Story 全部 Done）
- Story 3.1: 初始化项目和 Claude SDK ✅
- Story 3.2: WebSocket 服务器 ✅
- Story 3.3: WebSocket 客户端 ✅
- Story 3.4: 会话管理 ✅
- Story 3.5: 状态管理和持久化 ✅
- Story 3.6: 终端集成 ✅
- Story 3.7: 界面组件 ✅

### 技术实现
- @anthropic-ai/claude-agent-sdk ✅
- xterm.js 终端模拟 ✅
- 多会话管理和状态管理 ✅
- React Hook 集成 ✅

---

标签: Feature
状态: Done
```

---

### Epic 4: Agent SDK Workflow Engine (92% 完成)

```
创建 Issue → 输入以下信息：

标题：[EPIC-04] Agent SDK 工作流引擎 (92% 完成)

描述:
### 核心功能 ✅
- ✅ 工作流上传和管理
- 📊 工作流存储和版本控制
- 📈 工作流图展示
- 🔍 工作流查找和导航
- ⚠️ Story 4.4: Execute 功能部分完成

### 已完成（10 Stories）
- Story 4.1: Workflow Spec Upload ✅
- Story 4.2: Workflow Storage ✅
- Story 4.3: Workflow Graph Gen ✅
- Story 4.5: Real-time Monitoring ✅
- Story 4.6: Error Handling ✅
- Story 4.7: Metadata Editor ✅
- Story 4.8: Version Control ✅
- Stories 4.9-4.13: 其他功能 ✅
- Story 4.12-4.13: 其他功能 ✅

### 待完成 ⚠️
**Story 4.4: Trigger Workflow Execution**
- ⚠️ 缺少 Execute 按钮
- ⚠️ 缺少执行 API 集成
- ⚠️ 缺少参数收集 UI
- ⚠️ 完整状态：完成度 100%

### 技术实现
- 工作流 API（upload, list, delete, sync, graph）✅
- 图形化展示 ✅
- WebSocket 集成（实时监控）✅
- 错误处理和重试 ✅
- 元数据管理和版本控制 ✅

---

标签: Feature
状态: Partial（92% done）
```

---

## 📊 标签说明

根据 Epic 的功能和状态选择标签：

- **Feature** - 新功能/功能增强（Epic 0-3）
- **Bug** - 错误修复
- **Improvement** - 改进优化

**状态：**
- Done - 100% 完成
- In Progress - 进行中
- Partial - 部分完成

---

## 🔄 状态映射表

| PM 状态 | Linear Issue 状态 | 说明 |
|---------|------------------|------|
| Done | Done | Epic 100% 完成 |
| Partial | Partial | Epic 部分完成（如 Story 4.4） |
| Backlog | Backlog | 待开始 |

创建完成后，记录每个 Issue 的 URL 格式：`https://linear.app/archersado/issue/AUR-XXX`

---

## 🎯 工作流程

1. **查看指南：** 阅读 `LINEAR_SYNC_GUIDE.md`
2. **创建 Issues：** 按建议创建步骤创建 5 个 Issues
3. **反馈 URLs：** 记录每个 Issue 的 URL
4. **验证：** 在 Linear 页面确认 Issues 创建成功
5. **更新文档：** 记录到 `docs/pm/` 和相应的文档中

---

**创建完成后：**

1. 将 Issue URLs 反馈给我，我会更新 PM 文档
2. 检查 Issues 的正确性和完整性
3. 准备下一步的开发计划

---

**创建完成时间：** 2025-02-02
**建议创建时间：** 今天完成 5 个 Epics
