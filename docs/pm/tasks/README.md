# Tasks - 项目任务拆解

本目录包含 AuraForce 项目的完整任务拆解文档，从产品设计到技术研发的全流程任务分解。

## 📋 任务拆解层次

### Level 1: Epic（史诗）
大的功能模块或项目目标，需要多个 Sprint 完成的任务。

### Level 2: Story（故事）
具体的功能或产品特性，一个 Story 包含具体的交付物。

### Level 3: Task（任务）
具体的技术实现任务，可分配给开发人员。

---

## 🎯 任务拆解流程

```mermaid
需求 Story (pm/requirements/)
    ↓
产品设计 (product/prd/)
    ↓
技术架构设计 (architecture/design/)
    ↓
Epic 拆解 (development/epic/)
    ↓
Story 拆解 (pm/tasks/)
    ↓
Task 拆解 (pm/tasks/)
```

---

## 📚 任务文档类型

### 1. 产品设计任务
- 产品需求文档 (PRD)
- UI/UX 设计文档
- 用户流程图

**位置：** [product/prd/](../../product/prd/)

### 2. 技术架构设计任务
- 技术架构设计文档
- API 设计文档
- 数据库设计文档
- 技术选型文档

**位置：** [architecture/design/](../../architecture/design/)

### 3. 技术研发任务
- 前端开发任务
- 后端开发任务
- 测试任务
- 部署任务

**位置：**
- [pm/tasks/stories/](./stories/) - 功能 Story
- [development/tasks/](../../development/tasks/) - 开发任务

---

## 📝 任务拆解模板

### Epic 模板

```markdown
# Epic-[序号]: [史诗标题]

## 概述
[Epic 的整体描述和目标]

## 背景
[为什么需要这个 Epic]

## 目标
1. [目标 1]
2. [目标 2]
3. [目标 3]

## 范围
- ✅ 包含：[包含的内容]
- ❌ 不包含：[不包含的内容]

## 依赖项
- 前置 Epic：[Epic ID]
- 后续 Epic：[Epic ID]

## Story 列表
1. [Story ID] - [Story 标题]
2. [Story ID] - [Story 标题]

## 时间规划
- 开始日期：YYYY-MM-DD
- 预计完成：YYYY-MM-DD
- 预估工作量：X Story Points

## 风险
- [风险 1]
- [风险 2]
```

### Story 模板

```markdown
# Story-[序号]: [故事标题]

## 类型
- 类型: 功能 / 优化 / 修复 / 文档
- 优先级: P0 / P1 / P2 / P3
- 状态: 待开发 / 开发中 / 测试中 / 已完成
- 父 Epic: [Epic ID]

## 描述
[Story 的详细描述]

## 接受标准 (Acceptance Criteria)
- [ ] AC 1
- [ ] AC 2
- [ ] AC 3

## 技术设计
[简要的技术实现方案]

## 任务列表
- [ ] [Task] 搭建基础框架 (2h)
- [ ] [Task] 实现核心功能 (4h)
- [ ] [Task] 编写测试 (2h)
- [ ] [Task] 代码审查 (1h)

## 依赖项
- 前置任务：[Task ID]
- 相关任务：[Task ID]

## 估算
- 开发：X 天
- 测试：X 天
- 总计：X 天
```

### Task 模板

```markdown
# Task-[序号]: [任务标题]

## 基础信息
- **关联 Story**: [Story ID]
- **类型**: 开发 / 测试 / 部署 / 文档
- **优先级**: P0 / P1 / P2
- **状态**: 待开始 / 进行中 / 已完成
- **负责人**: [姓名]
- **预估时间**: X 小时

## 描述
[任务的详细描述]

## 实现步骤
1. [步骤 1]
2. [步骤 2]
3. [步骤 3]

## 验收标准
- [ ] 标准 1
- [ ] 标准 2

## 备注
[其他注意事项]
```

---

## 🚀 创建新任务

### 创建 Epic
1. 在 [pm/tasks/epics/](./epics/) 创建新 Epic
2. 文件命名：`EPIC-[序号]-[标题].md`
3. 填写 Epic 模板内容
4. 创建相关的 Story

### 创建 Story
1. 在 [pm/tasks/stories/](./stories/) 创建新 Story
2. 文件命名：`STORY-[序号]-[标题].md`
3. 填写 Story 模板内容
4. 包含详细的 Task 列表

### 创建 Task
1. 在 [development/tasks/](../../development/tasks/) 创建新 Task
2. 文件命名：`TASK-[序号]-[标题].md`
3. 填写 Task 模板内容

---

## 📊 任务统计

| 类别 | 总数 | 待开发 | 开发中 | 已完成 |
|------|------|--------|--------|--------|
| Epic | 0 | 0 | 0 | 0 |
| Story | 0 | 0 | 0 | 0 |
| Task | 0 | 0 | 0 | 0 |

*统计实时更新*

---

## 🔗 相关链接

- [需求 Story](../requirements/README.md) - 查看需求和背景
- [产品设计](../../product/prd/README.md) - 产品设计文档
- [技术架构](../../architecture/design/README.md) - 技术架构设计
- [开发任务](../../development/tasks/README.md) - 开发任务列表
- [项目追踪](../tracking/README.md) - 追踪任务进度

---

**最后更新：** 2025-02-02
