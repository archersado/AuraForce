# Architecture Design - 技术架构设计

本目录包含 AuraForce 项目的技术架构设计文档，包括系统设计、API 设计和数据库设计。

## 📂 目录结构

### [design/](./design/) - 系统设计
系统架构设计、技术选型、集成方案等。

### [api/](./api/) - API 文档
API 接口设计、API 规范、API 参考等。

### [database/](./database/) - 数据库设计
数据库 schema 设计、ER 图、数据库规范等。

---

## 🎯 技术架构流程

```
产品需求 (product/prd/)
    ↓
技术需求分析
    ↓
技术选型 (architecture/design/)
    ↓
系统架构设计 (architecture/design/)
    ↓
API 设计 (architecture/api/)
    ↓
数据库设计 (architecture/database/)
    ↓
开发实施 (development/)
```

---

## 📚 架构设计文档

### 系统设计文档
应包含以下部分：
- 系统架构图
- 技术栈选择
- 模块划分
- 接口设计
- 技术风险评估
- 性能和安全考虑

### API 设计文档
应包含以下部分：
- API 规范
- 接口列表
- 请求/响应格式
- 错误处理
- API 版本管理

### 数据库设计文档
应包含以下部分：
- ER 图
- 数据库 schema
- 表结构
- 索引设计
- 数据迁移方案

---

## 🏗️ 技术栈

### 前端
- **框架:** Next.js 16, React 18
- **语言:** TypeScript
- **样式:** TailwindCSS, Radix UI
- **状态管理:** Zustand, React Query
- **编辑器:** Cherry Markdown

### 后端
- **运行时:** Node.js
- **框架:** Next.js API Routes
- **认证:** NextAuth 5
- **ORM:** Prisma

### 数据库
- **数据库:** MySQL/MariaDB
- **ORM:** Prisma

### 测试
- **单元测试:** Jest, @testing-library/react
- **E2E 测试:** Playwright

### 部署
- **容器化:** Docker
- **CI/CD:** (计划中)

---

## 🔗 相关链接

- [产品设计](../product/README.md) - 产品需求和设计
- [任务拆解](../pm/tasks/README.md) - 从设计拆解的任务
- [开发文档](../development/README.md) - 开发任务和文档

---

**最后更新：** 2025-02-02
