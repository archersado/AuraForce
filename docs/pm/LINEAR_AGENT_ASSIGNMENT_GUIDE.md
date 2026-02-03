# Linear Story Agent 分配规范

**项目：** AuraForce | **创建时间：** 2025-02-02 | **最后更新：** 2025-02-02

---

## 🎯 规范概述

在创建和更新 Linear Story Issues 时，**必须注明分配执行的 agent 是谁**。这有助于：

1. ✅ 明确每个 Story 的执行责任
2. ✅ 便于追踪和管理各个 agent 的工作
3. ✅ 提高 team 之间的协作效率
4. ✅ 确保 accountability 和透明度

---

## 📋 强制字段

### Story Issue 必需字段

| 字段 | 是否必需 | 说明 | 示例 |
|------|---------|------|------|
| **assignee** | ✅ 必需 | 执行 Agent 的名称或 "me" | `"me"`, `"Frontend Dev Agent"` |
| **执行 Agent (description)** | ✅ 必需 | 在 description 中标注执行 agent | `* **执行 Agent**: Main PM` |

### Epic Issue 字段

| 字段 | 是否必需 | 说明 |
|------|---------|------|
| assignee | 可选 | Epic 可以不设置具体执行 agent |

---

## 🎨 assignee 参数值规范

### 常用的 assignee 值

| 值 | 说明 | 使用场景 |
|----|------|---------|
| `"me"` | 当前创建者自分 | 当自分负责执行此 Story 时 |
| `"Frontend Dev Agent"` | Frontend 开发 agent | 前端相关的 Story |
| `"Backend Dev Agent"` | Backend 开发 agent | 后端相关的 Story |
| `"Database Agent"` | 数据库管理 agent | 数据库相关的 Story |
| `"QA Agent"` | 测试 agent | 测试相关的 Story |
| `"DevOps Agent"` | DevOps agent | 部署和运维相关的 Story |
| `"Docs Agent"` | 文档 agent | 文档编写相关的 Story |
| `"Product Designer"` | 产品设计 agent | UI/UX 设计相关的 Story |

### 命名规范

- Agent 名称应该**清晰、简洁、一致**
- 使用英文，避免特殊字符
- 首字母应该大写
- 可以使用连字符 `-` 连接多个单词

**示例：**
- ✅ `"Frontend Dev Agent"`
- ✅ `"Backend Dev Agent"`
- ✅ `"Database Agent"`
- ❌ `"frontend-dev-agent"` (小写)
- ❌ `"Frontend_Dev_Agent"` (使用下划线)

---

## 📝 Story Description 模板（带 Agent 分配）

### 完整模板

```markdown
**Story XX.Y**

### 目标

Story 目标和价值说明

### 接受标准

* AC 1
* AC 2
* AC 3

### 技术要求

* 技术要求 1
* 技术要求 2

### 依赖项

* 前置 Story: STORY-XX-Z
* 相关 Story: STORY-YY-ZZ

### 分配信息

* **执行 Agent**: [agent-name]
* **创建日期**: YYYY-MM-DD

### 估时

* 开发: X 天
* 测试: X 天
* 总计: X 天

### 完成日期

YYYY-MM-DD
```

### 实际示例

```markdown
**Story 1-1**

### 目标

使用 create-next-app@latest 创建项目，升级到 Next.js 16 并迁移 Pages Router → App Router 结构

### 接受标准

* Next.js 16 安装完成
* App Router 目录结构迁移完成
* 路由配置正确

### 技术要求

* 使用 create-next-app@latest
* 迁移到 src/app/ 目录结构
* 更新所有路由配置

### 分配信息

* **执行 Agent**: Frontend Dev Agent
* **创建日期**: 2025-02-02

### 完成日期

2025-01-25
```

---

## 🚀 mcporter 创建 Story 时的命令规范

### 命令格式

```bash
mcporter call linear.create_issue \
  title: "STORY-XX-Y: Story Title" \
  description: "**Story XX.Y**

### 目标

Story 目标

### 接受标准

* AC 1

### 分配信息

* **执行 Agent**: [agent-name]
* **创建日期**: YYYY-MM-DD

### 完成日期

YYYY-MM-DD" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  parentId: "Epic Issue ID" \
  assignee: "[agent-name]" \
  state: "Done" \
  priority: "4"
```

### 关键注意事项

**⚠️ assignee 参数和 description 中的执行 Agent 必须一致**

```bash
# ❌ 错误：参数和描述不一致
assignee: "Frontend Dev Agent"
description: "...**执行 Agent**: Backend Dev Agent..."

# ✅ 正确：参数和描述一致
assignee: "Frontend Dev Agent"
description: "...**执行 Agent**: Frontend Dev Agent..."
```

---

## ✅ 检查清单

### 创建 Story 前

- [ ] 确定执行此 Story 的 agent
- [ ] 准备好 agent 名称
- [ ] 在 description 中添加"分配信息"部分
- [ ] 设置 assignee 参数

### 创建 Story 后

- [ ] 在 Linear 网页检查 assignee 是否正确设置
- [ ] 检查 description 中的"执行 Agent"字段
- [ ] 确认 assignee 参数和 description 一致

---

## 🔄 更新 Story 时的规范

### 更新 assignee

当需要更改 Story 的执行 agent 时，需要同时更新：

1. **assignee 参数**
2. **description 中的执行 Agent 字段**

```bash
# 更新 assignee
mcporter call linear.update_issue \
  id: "ARC-XX" \
  assignee: "New Agent Name"

# 同时更新 description
mcporter call linear.update_issue \
  id: "ARC-XX" \
  description: "**Story XX.Y**

### 目标

...

### 分配信息

* **执行 Agent**: New Agent Name
* **创建日期**: YYYY-MM-DD
* **更新日期**: YYYY-MM-DD"
```

### 记录变更历史

在 description 中添加"更新历史"部分：

```markdown
### 更新历史

| 日期 | 变更 | 执行 Agent |
|------|------|-----------|
| 2025-02-02 | 初始创建 | Original Agent |
| 2025-02-05 | 更新执行 agent | New Agent |
```

---

## 📊 Agent 工作分配示例

### Epic 1: Project Foundation & Tech Stack Initialization

| Story ID | 标题 | 执行 Agent | 状态 |
|----------|------|-----------|------|
| STORY-1-1 | Initialize Next.js Project | Frontend Dev Agent | ✅ Done |
| STORY-1-2 | Configure TypeScript | Frontend Dev Agent | ✅ Done |
| STORY-1-3 | Install Core Dependencies | Backend Dev Agent | ✅ Done |
| STORY-1-4 | Setup Prisma Schema | Database Agent | ✅ Done |
| STORY-1-5 | Configure Auth.js | Backend Dev Agent | ✅ Done |
| STORY-1-6 | Initialize Zustand | Frontend Dev Agent | ✅ Done |
| STORY-1-7 | API Prefix Configuration | Backend Dev Agent | ✅ Done |

### Epic 2: User Account & Authentication

| Story ID | 标题 | 执行 Agent | 状态 |
|----------|------|-----------|------|
| STORY-2-1 | User Registration | Backend Dev Agent | ✅ Done |
| STORY-2-2 | Login Session | Backend Dev Agent | ✅ Done |
| STORY-2-3 | Password Reset | Backend Dev Agent | ✅ Done |
| STORY-2-4 | Email Change | Backend Dev Agent | ✅ Done |
| STORY-2-5 | Account Deletion | Backend Dev Agent | ✅ Done |
| STORY-2-6 | Team Management | Backend Dev Agent | ✅ Done |
| STORY-2-7 | Member Rights | Backend Dev Agent | ✅ Done |
| STORY-2-8 | Enterprise Tenant | Backend Dev Agent | ✅ Done |
| STORY-2-9 | Data Privacy | Backend Dev Agent | ✅ Done |

---

## 🎯 最佳实践

### 1. 一致性
- ✅ assignee 参数和 description 中的执行 Agent 必须一致
- ✅ 使用标准化的 agent 名称
- ✅ 保持命名风格统一

### 2. 明确性
- ✅ 每个 Story 必须有明确的执行 agent
- ✅ 避免使用模糊的 agent 名称
- ✅ 清晰标注创建日期和更新日期

### 3. 可追踪性
- ✅ 记录 agent 分配的历史变更
- ✅ 在 Linear 网页验证 assignee 设置
- ✅ 定期检查 agent 分配的正确性

### 4. 协作性
- ✅ agent 名称应该反映其职责
- ✅ 便于团队成员理解和识别
- ✅ 促进团队之间的沟通

---

## 📚 相关文档

- [Linear PM 同步模式文档](./LINEAR_PM_SYNC_MODE.md)
- [Linear 格式快速参考](./LINEAR_FORMAT_QUICK_REFERENCE.md)
- [Linear 格式检查清单](./LINEAR_FORMAT_CHECKLIST.md)
- [Linear PM 工作总结](./LINEAR_PM_WORK_SUMMARY.md)

---

**规范制定者：** Clawdbot PM
**生效日期：** 2025-02-02
**状态：** ✅ 已生效

**备注：**
- 所有后续创建的 Story 必须设置 assignee
- assignee 参数和 description 中的执行 Agent 必须一致
- 更新 Story 时需要同步更新 agent 信息
