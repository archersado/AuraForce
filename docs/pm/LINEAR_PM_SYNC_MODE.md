# Linear PM 同步模式文档（Subissue 结构）

**最后更新：** 2025-02-02
**项目：** AuraForce
**Linear 项目：** auraforce

---

## 🎯 核心同步模式：Epic + Subissues

AuraForce 项目使用 **Epic 作为父 Issue + Stories 作为 Subissues** 的结构来管理需求。

---

## 📊 Linear Issue 层次结构

```
Linear Issue Hierarchy:
├── Epic Issue (Parent)
│   ├── Story Subissue 1
│   ├── Story Subissue 2
│   ├── Story Subissue 3
│   └── ...
└── Epic Issue (Parent)
    ├── Story Subissue 1
    ├── Story Subissue 2
    └── ...
```

---

## 📝 Issue 命名规范

### Epic Issue（父级）

| 属性 | 格式 | 示例 |
|------|------|------|
| **标题** | `[EPIC-XX] Epic Title` | `[EPIC-01] 项目基础与技术栈初始化` |
| **标识符** | Auto | ARC-76 |
| **状态** | Done / In Progress / Backlog | Done |
| **优先级** | 数值 (0-4) | 4 (Low) |

### Story Subissue（子级）

| 属性 | 格式 | 示例 |
|------|------|------|
| **标题** | `STORY-XX-Y: Story Title` | `STORY-1-1: Initialize Next.js Project with App Router` |
| **标识符** | Auto | ARC-80 |
| **父级** | `parentId: "Epic Issue ID"` | `parentId: "4b5f7355-3403-43c2-a359-fbdf78ff1ba2"` |
| **负责人 (assignee)** | Agent 名称或 "me" | `"me"` 或 `"Frontend Dev Agent"` |
| **状态** | Done / In Progress / Todo | Done |
| **优先级** | 数值 (0-4) | 4 (Low) |

---

## 📄 Linear Markdown 格式规范 ✅ **重要**

### 核心规则
Linear 的 markdown 需要**正确的换行符和空行**才能正确渲染。

**关键点：**
- 段落之间使用 `\n\n`（两个换行符）
- 标题和内容之间用 `\n\n` 分隔
- 列表会自动转换为 markdown 格式
- 不要将所有内容放在一行

### ❌ 错误格式示例
```bash
# ❌ 错误：所有内容挤在一起
description: "**Story 1.1** ### 目标 目标内容 ### 接受标准 - 标准 1 - 标准 2"

# ❌ 错误：缺少段落分隔
description: "**Epic 1** ### 概述 概述内容 ### Stories 已完成 (7个) - STORY-1-1 - STORY-1-2"
```

**结果：** Linear 界面所有内容挤在一行，无法正确渲染。

### ✅ 正确格式示例

#### Epic Description 格式
```bash
# ✅ 正确：使用换行符和空行
description: "**Epic 1: Project Foundation and Tech Stack Initialization**

### 概述

提供完整的技术基础环境，支持所有后续功能的开发。

### Stories 已完成 (7个)

* STORY-1-1: Initialize Next.js Project with App Router
* STORY-1-2: Configure TypeScript Strict Mode and @/ Path Aliases
* STORY-1-3: Install Core Dependencies

### 完成日期

2025-01-30

### 交付物

* Next.js 16 App Router 项目结构
* TypeScript strict mode 配置
* Prisma ORM + MySQL 数据库集成"
```

#### Story Subissue Description 格式
```bash
# ✅ 正确：使用换行符和空行
description: "**Story 1.1**

### 目标

使用 create-next-app@latest 创建项目，升级到 Next.js 16 并迁移 Pages Router → App Router 结构

### 接受标准

* Next.js 16 安装完成
* App Router 目录结构迁移完成
* 路由配置正确

### 完成日期

2025-01-25"
```

### mcporter 调用格式规范

**创建 Epic Issue：**
```bash
mcporter call linear.create_issue \
  title: "[EPIC-XX] Epic Title" \
  description: "**Epic XX: Epic Title**

### 概述

Epic 概述和目标

### Stories 等待创建

### 状态

In Progress" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  state: "In Progress" \
  priority: "3"
```

**创建 Story Subissue：**
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

**更新 Issue Description：**
```bash
mcporter call linear.update_issue \
  id: "ARC-XX" \
  description: "**Story XX.Y**

### 目标

目标描述

### 接受标准

* 标准 1"
```

### 快速检查清单

**创建 Issue 前，确认：**
- [ ] 使用 `\n\n` 分隔段落
- [ ] 段落之间有空行
- [ ] 列表使用 `*` 或 `-` 符号
- [ ] 标题使用 `###` 格式
- [ ] 不要将所有内容放在一行

**验证格式：**
- [ ] Linear 网页界面显示正常
- [ ] 列表正确渲染
- [ ] 标题层级正确
- [ ] 段落清晰可读

---

## 🔗 PM 文档 ↔ Linear Issue 映射

### PM 文档结构

```
docs/pm/
├── requirements/
│   └── REQ-XXX-*.md              # 需求 Story
├── tasks/
│   ├── epics/
│   │   └── EPIC-XXX-*.md         # Epic 文档
│   └── stories/
│       └── STORY-XXX-*.md        # Story 文档
└── archived/
    └── implementation-artifacts/
        └── stories/
            └── X-Y-*.md          # Story 实施文档
```

### Linear Issue 结构

```
auraforce Project
├── Epic Issues (父级)
│   ├── ARC-75: [EPIC-0] Team Formation
│   │   └── Subissues (Stories)
│   │       ├── ARC-XX: STORY-0-1: Team Formation
│   │       └── ...
│   ├── ARC-76: [EPIC-1] Project Foundation
│   │   └── Subissues (Stories)
│   │       ├── ARC-80: STORY-1-1: Initialize Next.js
│   │       ├── ARC-81: STORY-1-2: Configure TS
│   │       └── ...
│   └── ...
```

---

## 🔄 同步工作流程

### 阶段 1：需求收集 (PM)

```
用户提出需求
    ↓
PM 创建需求文档 (REQ-XXX)
    ↓
PM 与用户确认需求细节
    ↓
需求评审和优先级排序
```

**输出：**
- `docs/pm/requirements/REQ-XXX-*.md`
- 需求状态: 待评审 / 已评审

---

### 阶段 2：任务拆解 (PM)

```
需求 Story (REQ-XXX)
    ↓
PM 拆解为 Epic → Story → Task
    ↓
创建 Epic 文档和 Story 文档
```

**输出：**
- `docs/pm/tasks/epics/EPIC-XXX-*.md`
- `docs/pm/tasks/stories/STORY-XXX-*.md`
- `docs/development/tasks/TASK-XXX-*.md`

---

### 阶段 3：Linear 同步 (PM)

#### 步骤 3.1：创建 Epic Issue（父级）

```bash
mcporter call linear.create_issue \
  title: "[EPIC-XX] Epic Title" \
  description: "**Epic XX: Title** ### 概述 Epic 概述和目标 ### Stories 等待 Subissues 创建 ### 状态 In Progress" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  state: "In Progress" \
  priority: "3"
```

**参数说明：**
- `title`: Epic 标题，格式 `[EPIC-XX] Title`
- `description`: Epic 描述（简洁）
- `state`: Epic 初始状态（In Progress / Backlog）
- `priority`: Epic 优先级 (0=Urgent, 1=High, 2=Normal, 3=Medium, 4=Low)

**记录信息：**
- Linear Issue ID
- Linear Issue URL
- Epic ID 映射

---

#### 步骤 3.2：为每个 Story 创建 Subissue

```bash
mcporter call linear.create_issue \
  title: "STORY-XX-Y: Story Title" \
  description: "**Story XX.Y** ### 目标 Story 目标 ### 接受标准 - 标准 1 - 标准 2 - 标准 3 ### 完成日期 YYYY-MM-DD" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  parentId: "Epic Issue ID" \
  state: "Done" \
  priority: "4"
```

**参数说明：**
- `title`: Story 标题，格式 `STORY-XX-Y: Title`
- `parentId`: Epic Issue ID（父级）
- `state`: Story 状态（Done / In Progress / Todo）
- `priority`: Story 优先级

**记录信息：**
- Story ID ↔ Linear Issue ID 映射
- Story URL

---

#### 步骤 3.3：更新 PM 文档

在 `docs/pm/tasks/epics/EPIC-XXX-*.md` 中添加：

```markdown
## Linear 集成

### Epic Issue
- **Linear Issue ID**: ARC-XX
- **Linear Issue URL**: https://linear.app/archersado/issue/ARC-XX/xxx
- **状态**: Done / In Progress

### Story Subissues
| Story ID | Linear Issue ID | 标题 | URL | 状态 |
|----------|-----------------|------|-----|------|
| STORY-XX-1 | ARC-XY | Story Title | [查看](https://...) | Done |
| STORY-XX-2 | ARC-XZ | Story Title | [查看](https://...) | Done |
| ... | ... | ... | ... | ... |

### 同步时间
- **创建时间**: YYYY-MM-DD HH:MM
- **最后更新**: YYYY-MM-DD HH:MM
```

---

### 阶段 4：开发和实施 (Dev)

```
Story Subissues 被分配
    ↓
开发人员开发 and 测试
    ↓
Story 完成 → Subissue 更新为 Done
```

---

### 阶段 5：状态同步 (PM)

#### Epic 状态更新

当所有 Stories 完成时：

```bash
mcporter call linear.update_issue \
  id: "Epic Issue ID" \
  state: "Done"
```

#### Story 状态更新

当单个 Story 状态变更时：

```bash
mcporter call linear.update_issue \
  id: "Story Issue ID" \
  state: "In Progress"  # 或 Done / Todo
```

---

## 📊 状态映射规则

### PM 状态 → Linear 状态

| PM 状态 | Epic Linear 状态 | Story Linear 状态 |
|---------|-----------------|-------------------|
| ✅ 已完成 | Done | Done |
| 🔄 进行中 | In Progress | In Progress |
| 📋 待评审 | Backlog | Todo |
| 🔴 已拒绝 | Canceled | Canceled |
| ⚠️ 部分完成 | In Progress | Done / In Progress |

### Linear 状态 → PM 状态

双向同步，确保一致性。

---

## 🎯 最佳实践

### 1. 层次清晰
- Epic Issue 作为父级，包含所有相关信息
- Story Subissues 作为子级，独立管理每个 Story

### 2. 命名一致
- Epic: `[EPIC-XX] Title`
- Story: `STORY-XX-Y: Title`

### 3. 及时同步
- 创建 Epic 后立即创建 Story Subissues
- Story 状态变更后立即更新 Linear

### 4. 双向跟踪
- PM 文档 ↔ Linear Issue 双向映射
- 定期检查同步状态

---

## 📝 Story Subissue 描述模板

### Linear Markdown 格式规范

**关键：** Linear 的 markdown 需要**正确的换行符和空行**才能正确渲染。使用 `\n\n` 作为段落分隔符。

```bash
# ❌ 错误格式（无换行符）
description: "**Story 1.1** ### 目标 目标内容 ### 接受标准 - 标准 1 - 标准 2"

# ✅ 正确格式（使用换行符）
description: '**Story 1.1**

### 目标

目标内容

### 接受标准

* 标准 1
* 标准 2'
```

**mcporter 调用方式：**
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

### 技术要求

* Requirement 1
* Requirement 2

### 分配信息
- **执行 Agent**: [agent-name]
- **创建日期**: YYYY-MM-DD

### 完成日期

YYYY-MM-DD" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  parentId: "Epic Issue ID" \
  assignee: "me" \
  state: "Done" \
  priority: "4"
```

### Story Description 模板

```markdown
**Story XX.Y**

### 目标
[Story 的业务目标和价值]

### 接受标准
- [ ] AC 1
- [ ] AC 2
- [ ] AC 3

### 技术要求
- 技术要求 1
- 技术要求 2

### 依赖项
- 前置 Story: STORY-XX-Z
- 相关 Story: STORY-YY-ZZ

### 分配信息
- **执行 Agent**: [agent-name]
- **创建日期**: YYYY-MM-DD

### 估时
- 开发: X 天
- 测试: X 天
- 总计: X 天

### 完成日期
YYYY-MM-DD
```

### Epic Description 模板

```markdown
**Epic XX: [Title]**

### 概述
Epic 概述和目标

### Stories 已完成 (N个)
- STORY-XX-1: Story Title
- STORY-XX-2: Story Title

### 完成日期
YYYY-MM-DD

### 交付物
- 交付物 1
- 交付物 2
```

**在命令行中创建 Epic 时：**
```bash
mcporter call linear.create_issue \
  title: "[EPIC-XX] Epic Title" \
  description: "**Epic XX: Epic Title**

### 概述

Epic 概述和目标

### Stories 等待创建

### 状态

In Progress" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  state: "In Progress" \
  priority: "3"
```

---

## 🔄 Linear API 调用示例

### 查看 Epic 及其 Subissues

```bash
# 查看 Epic
mcporter call linear.get_issue \
  id: "ARC-76" \
  includeRelations: true

# 查看 Epic 的所有 Subissues
mcporter call linear.list_issues \
  project: "auraforce" \
  parentId: "ARC-76"
```

### 更新 Story 状态

```bash
mcporter call linear.update_issue \
  id: "ARC-80" \
  state: "In Progress"
```

### 删除 Test Issue

```bash
mcporter call linear.update_issue \
  id: "ARC-XX" \
  state: "Canceled"
```

---

## 📊 当前已同步的 Epics 和 Stories

| Epic | Epic Issue ID | Story Issue IDs | Stories 数量 |
|------|--------------|----------------|-------------|
| EPIC-0 | ARC-75 | TBD | 1 |
| EPIC-1 | ARC-76 | ARC-80, ARC-81, ARC-82... | 7 |
| EPIC-2 | ARC-77 | TBD | 9 |
| EPIC-3 | ARC-78 | TBD | 7 |
| EPIC-4 | ARC-79 | TBD | 4 |

*注：正在同步中...*

---

## ✅ 验证检查清单

### Epic Issue 验证
- [ ] Epic Issue 已创建
- [ ] 标题格式正确 `[EPIC-XX]`
- [ ] 包含简短的描述
- [ ] 状态设置正确
- [ ] 项目设置为 "auraforce"

### Story Subissue 验证
- [ ] Story Subissues 已创建
- [ ] 标题格式正确 `STORY-XX-Y`
- [ ] `parentId` 正确指向 Epic
- [ ] 状态设置正确
- [ ] 描述包含目标、接受标准、完成日期

### 同步验证
- [ ] PM 文档已更新
- [ ] 映射表已记录
- [ ] URL 可访问

---

## 🔗 相关文档

- [Linear 同步报告](./tracking/LINEAR_SYNC_REPORT_2025-02-02.md)
- [Issue 映射表](./tracking/LINEAR_ISSUE_MAPPING.md)
- [Linear Integration Guide](./LINEAR_INTEGRATION_GUIDE.md)
- [PM Workflow Guide](./PM_WORKFLOW_GUIDE.md)

---

## 🚀 下一步

1. ✅ 完成所有 Epic 的 Story Subissues 创建
2. ✅ 更新 PM 文档中的 Linear 映射
3. ✅ 同步当前 Epic 和 Story 的状态
4. 📋 建立定期同步机制

---

**文档维护者：** Clawdbot PM
**最后更新：** 2025-02-02
