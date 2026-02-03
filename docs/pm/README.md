# Project Management - 项目管理

本目录包含 AuraForce 项目从需求到归档的完整项目管理文档体系。

## 📂 目录结构

### [requirements/](./requirements/) - 需求 Story
用户需求、功能需求、技术需求的文档记录。

### [tasks/](./tasks/) - 项目任务拆解
从产品到技术的完整任务拆解文档
  ├── [epics/](./tasks/epics/) - Epic 拆解
  └── [stories/](./tasks/stories/) - Story 拆解
  ├── [milestones/](./tasks/milestones/) - 里程碑追踪
  └── [risks/](./tasks/risks/) - 风险追踪

### [tracking/](./tracking/) - 项目追踪
- [tracking/TRACKING_INDEX.md](./tracking/TRACKING_INDEX.md) - 追踪索引
- [tracking/epic-4-workflow-cross-user-reuse.md](./tracking/epic-4-workflow-cross-user-reuse.md)
- [tracking/epic-4-requirement-project-workflow-decouple.md]（新建）

### [archived/](./archived/) - 已归档项目
已完成项目的文档归档。

### 📄 Linear 项目集成

**核心文档：**
- [LINEAR_FORMAT_QUICK_REFERENCE.md](./LINEAR_FORMAT_QUICK_REFERENCE.md)
- [LINEAR_FORMAT_CHECKLIST.md](./LINEAR_FORMAT_CHECKLIST.md)
- [LINEAR_PM_SYNC_MODE.md](./LINEAR_PM_SYNC_MODE.md)
- [LINEAR_INTEGRATION_GUIDE.md](./LINEAR_INTEGRATION_GUIDE.md)

**Linear 项目：**
- 项目名称：auraforce
- 项目 URL：https://linear.app/archersado/project/auraforce-d9703902f025
- 已同步 Epics：5 个（4 Done + 1 In Progress）
- 已同步 Story Subissues：3 个（测试）

---

## 🎯 研发生命周期

```
需求 Story (requirements/)
    ↓
任务拆解 (tasks/)
    ├── 产品设计 (product/)
    ├── 技术架构设计 (architecture/)
    └── 技术研发任务 (development/)
        ↓
项目追踪 (tracking/)
    │   ├── 追踪索引
    │   ├── Linear 同步状态
    │   ├── Epic 4 追踪记录
    │   └── 旧 Memory 归档
    ↓
项目归档 (archived/)
```

---

## 🚀 快速开始

### 查看需求
👉 [Requirements](./requirements/README.md) - 查看所有需求 Story

### 查看任务
👉 [Tasks](./tasks/) - 查看任务拆解

### 查看进度
👉 **[Tracking Index](./tracking/TRACKING_INDEX.md)** - 追踪文档索引

### 查看归档
└─ → [Archived](./archived/) - 查看已归档项目

---

## 📊 项目状态

### 当前概览
| 阶段 | 状态 | 数量 |
|------|------|------|
| 📝 Requirements | 🟢 待建设 | 0 |
| 📋 Tasks | 🟢 待建设 | 0 |
| 🚧 Tracking | 🟢 进行中 | 0 |
| 📦 Archived | 🟢 完成 | 0 |

---

## 📄 Linear 项目集成

**核心文档：**
- **[LINEAR_FORMAT_QUICK_REFERENCE.md](./LINEAR_FORMAT_QUICK_REFERENCE.md)
- **[LINEAR_FORMAT_CHECKLIST.md](./LINEAR_FORMAT_CHECKLIST.md)
- **[LINEAR_PM_SYNC_MODE.md](./LINEAR_PM_SYNC_MODE.md)
- **[LINEAR_INTEGRATION_GUIDE.md](./LINEAR_INTEGRATION_GUIDE.md)

**Linear 项目：**
- 项目名称：auraforce
- 项目 URL：https://linear.app/archersado/project/auraforce-d9703902f025
- 已同步 Epics：5 个（4 Done + 1 In Progress）
- 已同步 Story Subissues：3 个（测试）

---

## 🎯 重要追踪文档

### Epic 4 相关
- **[Epic-4-workflow-cross-user-reuse.md](./tracking/epic-4-workflow-cross-user-reuse.md)
  - Epic 4 工作流跨用户复用修复
  - 数据库迁移完成
  - API 更新完成
  - 前端 UI 完成
  - 评审完成

### 新增 - 项目与工作流解耦（简化版）
- **[epic-4-requirement-project-workflow-decouple.md](./tracking/epic-4-requirement-project-workflow-decouple.md)
  - 工作流配置对用户不可见
  - 配置文件隐藏在 `.claude/` 目录
  - 不需要运行时锁定
  - 用户已确认不需要

### 旧 Memory 归档
- **[OLD_MEMORY_FILES/README.md](./tracking/OLD_MEMORY_FILES/README.md)
  - 归档 2026-01-31：User Flow Optimization
  - 归档 2026-02-01：HTTP 403 Error

---

## 📂 当前追踪状态

| 项 | 状态 | 数量 |
|------|------|------|
| **Epics** | 14 个 | 总计 |
| **Stories** | 39 个 | 已完成 39 个 |
| **进行中** | 1 个 | Epic 4（部分完成：Story 4.4）|

---

## 🔄 工作流程

```
需求 Story (requirements/)
    ↓
任务拆解 (tasks/)
    ├── 产品设计 (product/)
    ├── 技术架构设计 (architecture/)
    └── 技术研发任务 (development/)
        ↓
项目追踪 (tracking/)
    ├── 追踪索引
    ├── Linear 同步状态
    └── 旧 Memory 归档
        ↓
项目归档 (archived/)
```

---

## 🚀 快速开始

### 查看需求
👉 [Requirements](./requirements/README.md) - 查看所有需求 Story

### 查看任务
👉 [Tasks](./tasks/README.md) - 查看任务拆解

### 追踪进度
👉 [Tracking Index](./tracking/TRACKING_INDEX.md) - 追踪文档索引

### 查看归档
👉 [Archived](./archived/) - 查看已归档项目

---

## 📊 项目进展

### 已完成（4 Epics）
- ✅ Epic 0: Team Formation & Project Management
- ✅ Epic 1: Project Foundation & Tech Stack
- ✅ Epic 2: User Account & Authentication
- ✅ Epic 3: Claude Code Graphical Interface

### 进行中（1 Epic）
- ⚠️ Epic 4: Agent SDK Workflow Engine（Story 4.4 部分完成）

### 待开始（10 Epics）
- Epic 5-14: 待开发

---

**最后更新：** 2025-02-03
**维护者：** Clawdbot Dev Team
**版本：** v2.0
---

**项目名称：** AuraForce
**项目 URL：** https://linear.app/archersado/project/auraforce-d9703902f025
**已同步 Epics：** 5 个（4 Done + 1 In Progress）
**已同步 Story Subissues：** 3 个（测试）