# AuraForce Documentation

Welcome to the AuraForce documentation hub. This directory contains all project-related documentation.

## 📚 目录结构

### 📊 [Project Management (项目管理)](./pm/)
从需求 Story 到项目归档的完整研发项目管理流程文档体系。

**子目录：**
- 📝 [Requirements](./pm/requirements/) - 需求 Story（用户需求、产品需求、技术需求）
- 📋 [Tasks](./pm/tasks/) - 项目任务拆解（产品设计、技术架构、技术研发任务）
- 🚧 [Tracking](./pm/tracking/) - 项目追踪（进度追踪、里程碑、风险管理）
- 📦 [Archived](./pm/archived/) - 已归档项目（Epic、Story、Sprint 归档）

**快速链接：**
- 👉 [项目管理总览](./pm/README.md)
- 👉 [需求列表](./pm/requirements/README.md)
- 👉 [任务拆解](./pm/tasks/README.md)

---

### 🎨 [Product Design (产品设计)](./product/)
产品设计相关的所有文档。

**子目录：**
- 📄 [PRD](./product/prd/) - 产品需求文档
- 🎨 [Design](./product/design/) - UI/UX 设计文档
- 📏 [Specs](./product/specs/) - 规格说明文档

**快速链接：**
- 👉 [产品设计总览](./product/README.md)
- 👉 [PRD 文档](./product/prd/README.md)

---

### 🏗️ [Architecture (技术架构)](./architecture/)
系统架构、API 和数据库设计文档。

**子目录：**
- 🌐 [System Design](./architecture/design/) - 系统设计文档
- 🔌 [API Documentation](./architecture/api/) - API 文档
- 🗄️ [Database Design](./architecture/database/) - 数据库设计文档

**快速链接：**
- 👉 [架构设计总览](./architecture/README.md)
- 👉 [系统设计](./architecture/design/README.md)
- 👉 [API 文档](./architecture/api/README.md)

---

### 💻 [Development (技术研发)](./development/)
技术研发相关的文档和任务。

**子目录：**
- 🎯 [Epic](./development/epic/) - 功能史诗
- 📝 [Development Tasks](./development/tasks/) - 开发任务
- 🔧 [Technical Docs](./development/technical/) - 技术文档

**快速链接：**
- 👉 [技术研发总览](./development/README.md)
- 👉 [Epic 列表](./development/epic/README.md)
- 👉 [开发任务](./development/tasks/README.md)

---

### 📖 [Guides (开发指南)](./guides/)
项目开发相关的指南、配置和快速入门文档。

**核心文档：**
- [Email Setup](./guides/email-setup.md) - 邮件服务配置

**快速链接：**
- 👉 [开发指南](./guides/README.md)

---

### 🔄 [Migration (迁移文档)](./migration/)
编辑器迁移相关的所有文档。

**子目录：**
- 🍒 [Cherry Markdown 指南](./migration/cherry-markdown/) - Cherry Markdown 完整指南
- 🎨 [Editor Migration](./migration/editor-migration/) - 编辑器迁移记录
- 📊 [Migration Resources](./migration/resources/) - 迁移资源和分析

**快速链接：**
- 👉 [迁移文档总览](./migration/README.md)

---

## 🎯 快速开始

### 1. 项目概览
AuraForce 是一个技能沉淀平台 MVP，基于 Next.js 16、React 18、TypeScript 构建。

**技术栈：**
- 前端：Next.js 16, React 18, TypeScript, TailwindCSS, Radix UI
- 数据库：Prisma ORM, MySQL/MariaDB
- 认证：NextAuth 5
- 测试：Jest, Playwright

### 2. 研发项目管理
查看最新的项目管理文档：
- 👉 [项目管理总览](./pm/README.md) - PM 文档索引
- 👉 [需求 Story](./pm/requirements/README.md) - 查看需求
- 👉 [任务拆解](./pm/tasks/README.md) - 查看任务

### 3. 技术开发
查看技术文档：
- 👉 [架构设计](./architecture/README.md) - 系统架构
- 👉 [技术研发](./development/README.md) - Epic 和任务

---

## 📊 研发生命周期

```
需求 Story (Requirements)
    ↓
产品需求 (PRD) + 技术架构
    ↓
任务拆解 (Epic → Story → Task)
    ↓
项目执行 + 追踪
    ↓
项目归档
```

---

## 📈 文档统计

| 类别 | 子目录数 | 文档数 | 说明 |
|------|---------|--------|------|
| **PM** | 4 | 50+ | 需求、任务、追踪、归档（含 _bmad-output 归档） |
| **Product** | 3 | 7 | PRD、设计、规格（含 UX 设计资产） |
| **Architecture** | 3 | 4 | 系统设计、API、数据库 |
| **Development** | 3 | 5 | Epic、任务、技术文档 |
| **Guides** | 1 | 2 | 开发指南 |
| **Migration** | 3 | 17 | 迁移文档 |
| **总计** | **17 | **85+** | 完整的文档追踪体系（_bmad-output 已归档） |

---

## 🔄 更新记录

- **2025-02-02**: _bmad-output 文档按体系分类归档（PRD → product/prd/, Epic → dev/epic/, 分析 → pm/archived/）
- **2025-02-02**: 建立研发生命周期文档追踪体系（需求→拆解→追踪→归档）
- **2025-02-02**: 创建产品、架构、技术开发的文档结构
- **2025-02-02**: 文档结构重组，按类别分类
- **2025-02-02**: Cherry Markdown 迁移完成

详细归档历史：
- [ARCHIVE.md](../ARCHIVE.md) - 归档历史
- [_bmad-archived.md](./_bmad-archived.md) - _bmad-output 归档详情

---

**最后更新：** 2025-02-02
**文档维护者：** Clawdbot Docs Engineer & Dev Team
**状态：** 🟢 活跃更新中
