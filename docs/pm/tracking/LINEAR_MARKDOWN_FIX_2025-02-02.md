# Linear Issues Markdown 格式修复报告

**修复时间：** 2025-02-02 05:54
**修复原因：** 已创建的 Issues 在 Linear 界面显示格式问题（内容挤在一起）
**修复范围：** 所有 Linear Issues（5 个 Epic + 3 个 Story Subissues）

---

## 🔍 问题分析

### 原始问题
创建 Issues 时，description 字段的 markdown 没有**正确的换行符和空行**，导致 Linear 的 markdown 渲染器无法正确识别段落。

### 错误格式示例
```bash
# ❌ 错误格式（单行，无换行）
description: "**Story 1.1** ### 目标 目标内容 ### 接受标准 - 标准 1 - 标准 2"
```

**结果：** Linear 界面所有内容挤在一行，无法阅读。

---

## ✅ 修复方法

### 正确格式示例
```bash
# ✅ 正确格式（使用换行符 \n\n）
description: "**Story 1.1**

### 目标

目标内容

### 接受标准

* 标准 1
* 标准 2"
```

**关键点：**
- 标题和内容之间用 `\n\n`（两个换行符）
- 段落之间用 `\n\n` 分隔
- 列表会自动转换为 markdown 格式

---

## 📊 已修复的 Issues

### Epic Issues (5 个)

| Issue ID | 标题 | 状态 | 修复时间 |
|----------|------|------|---------|
| **ARC-75** | [EPIC-0] Team Formation and Project Management | ✅ Done | 05:52:47 |
| **ARC-76** | [EPIC-1] Project Foundation and Tech Stack Initialization | ✅ Done | 05:52:59 |
| **ARC-77** | [EPIC-2] User Account and Authentication | ✅ Done | 05:53:10 |
| **ARC-78** | [EPIC-3] Claude Code Graphical Interface | ✅ Done | 05:53:49 |
| **ARC-79** | [EPIC-4] Agent SDK Workflow Engine | 🔄 In Progress | 05:54:04 |

### Story Subissues (3 个测试)

| Issue ID | 标题 | 状态 | 修复时间 |
|----------|------|------|---------|
| **ARC-80** | STORY-1-1: Initialize Next.js Project with App Router | ✅ Done | 05:52:00 |
| **ARC-81** | STORY-1-2: Configure TypeScript Strict Mode and @/ Path Aliases | ✅ Done | 05:52:15 |
| **ARC-82** | STORY-1-3: Install Core Dependencies | ✅ Done | 05:52:34 |

---

## 📋 修复后的格式示例

### Epic Description 格式
```markdown
**Epic 1: Project Foundation and Tech Stack Initialization**

### 概述
提供完整的技术基础环境，支持所有后续功能的开发。基于 create-next-app@latest 初始化项目，配置 TypeScript strict mode、Tailwind CSS、Auth.js v5、Prisma ORM 等核心依赖。

### Stories 已完成 (7个)
* STORY-1-1: Initialize Next.js Project with App Router
* STORY-1-2: Configure TypeScript Strict Mode and @/ Path Aliases
* STORY-1-3: Install Core Dependencies
* STORY-1-4: Setup Prisma Schema with Basic Models
* STORY-1-5: Configure Auth.js v5 Foundation
* STORY-1-6: Initialize Zustand Store Structure
* STORY-1-7: API Prefix Configuration (部分完成)

### 完成日期
2025-01-30

### 交付物
* Next.js 16 App Router 项目结构
* TypeScript strict mode 配置
* Prisma ORM + MySQL 数据库集成
* Auth.js v5 认证系统
* Zustand 状态管理
* API 前缀配置系统
```

### Story Subissue Description 格式
```markdown
**Story 1.1**

### 目标
使用 create-next-app@latest 创建项目，升级到 Next.js 16 并迁移 Pages Router → App Router 结构

### 接受标准
* Next.js 16 安装完成
* App Router 目录结构迁移完成
* 路由配置正确

### 完成日期
2025-01-25
```

---

## 🚀 mcporter 调用格式

### 创建 Story Subissue（正确格式）
```bash
mcporter call linear.create_issue \
  title: "STORY-XX-Y: Story Title" \
  description: "**Story XX.Y**

### 目标

Story 目标和价值

### 接受标准

* AC 1
* AC 2
* AC 3

### 完成日期

YYYY-MM-DD" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  parentId: "Epic Issue ID" \
  state: "Done" \
  priority: "4"
```

### 创建 Epic Issue（正确格式）
```bash
mcporter call linear.create_issue \
  title: "[EPIC-XX] Epic Title" \
  description: "**Epic XX: Epic Title**

### 概述

Epic 概述和目标

### Stories 等待创建" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  state: "In Progress" \
  priority: "3"
```

### 更新 Issue Description
```bash
mcporter call linear.update_issue \
  id: "ARC-XX" \
  description: "**Story XX.Y**

### 目标

目标描述

### 接受标准

* 标准 1"
```

---

## 📊 修复统计

| 指标 | 数量 |
|------|------|
| ✅ 修复 Epic Issues | 5/5 |
| ✅ 修复 Story Subissues | 3/3 |
| ✅ 总计修复 Issues | 8 |
| ⏱️ 修复耗时 | ~3 分钟 |
| 📝 更新文档 | 1 个 |

---

## ✅ 验证检查清单

| 检查项 | 状态 |
|--------|------|
| ✅ Epic Issues 格式正确 | 5/5 |
| ✅ Story Subissues 格式正确 | 3/3 |
| ✅ 列表正确显示 | 8/8 |
| ✅ 标题层级正确 | 8/8 |
| ✅ 换行和分段正确 | 8/8 |
| ✅ Linear 界面显示正常 | ✅ 待确认 |
| ✅ PM 文档已更新 | ✅ |

---

## 🎯 后续操作

### 1. 验证 Linear 界面
请在 Linear 网页界面验证以下 Issues 的格式是否正确显示：
- Epic Issues: [ARC-75](https://linear.app/archersado/issue/ARC-75/epic-0-team-formation-and-project-management), [ARC-76](https://linear.app/archersado/issue/ARC-76/epic-1-project-foundation-and-tech-stack-initialization), [ARC-77](https://linear.app/archersado/issue/ARC-77/epic-2-user-account-and-authentication), [ARC-78](https://linear.app/archersado/issue/ARC-78/epic-3-claude-code-graphical-interface), [ARC-79](https://linear.app/archersado/issue/ARC-79/epic-4-agent-sdk-workflow-engine)
- Story Subissues: [ARC-80](https://linear.app/archersado/issue/ARC-80/story-1-1-initialize-nextjs-project-with-app-router), [ARC-81](https://linear.app/archersado/issue/ARC-81/story-1-2-configure-typescript-strict-mode-and-path-aliases), [ARC-82](https://linear.app/archersado/issue/ARC-82/story-1-3-install-core-dependencies)

### 2. 创建剩余 Story Subissues
参考正确的 markdown 格式，为其他 Epic 创建剩余的 Story Subissues：
- EPIC-0: 1 个 Story
- EPIC-1: 4 个 Stories
- EPIC-2: 9 个 Stories
- EPIC-3: 7 个 Stories
- EPIC-4: 4 个 Stories

---

## 📝 经验总结

### 关键要点
1. ✅ Linear 的 markdown 需要**正确的换行符**（`\n\n` 作为段落分隔符）
2. ✅ 使用正确的列表格式（`*` 或 `-`）
3. ✅ 标题层级使用 `###` 三级标题
4. ✅ 段落之间保持两个换行符
5. ✅ 每个新创建的 Issue 都应遵循正确的格式

### 最佳实践
- **创建 Issue 时：** 立即使用正确的 markdown 格式
- **查看 Issue 时：** 在 Linear 网页界面验证格式
- **批量操作时：** 保持格式一致性
- **更新文档时：** 记录正确的格式规范

---

**报告生成者：** Clawdbot PM
**修复完成时间：** 2025-02-02 05:54
**状态：** ✅ 已完成，待用户验证
