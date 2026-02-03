# AuraForce 项目

**技能沉淀平台 MVP**

---

## 📋 项目概述

AuraForce 是一个基于 Claude Code 扩展资产生成的技能沉淀平台。

### 技术栈

- **前端：** Next.js 16, React 18, TypeScript, TailwindCSS, Radix UI
- **后端：** Next.js API Routes, Node.js
- **数据库：** Prisma ORM, MySQL/MariaDB
- **身份验证：** NextAuth 5
- **测试：** Jest, Playwright, @testing-library/react
- **编辑器：** Cherry Markdown

---

## 🚀 快速开始

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
```

### 数据库迁移
```bash
npx prisma migrate dev
```

---

## 📚 项目管理

### PM 研发管理快速入口

👉 **[docs/pm/README.md - PM 研发管理快速入口](./docs/pm/README.md)** ⭐️

这是 AuraForce 项目使用的标准化研发管理体系的快速入口。

**核心文档：**
- 🚀 [docs/pm/PM_QUICK_START.md](./docs/pm/PM_QUICK_START.md) - 5 分钟快速启动
- 📘 [docs/pm/PM_WORKFLOW_GUIDE.md](./docs/pm/PM_WORKFLOW_GUIDE.md) - 完整工作流程
- 📋 [docs/pm/PM_TEMPLATES.md](./docs/pm/PM_TEMPLATES.md) - 文档模板参考

---

## 📁 项目结构

```
AuraForce/
├── record/                       # 过程信息文档 ⭐️
│   └── README.md                 # 过程信息文档说明
├── docs/                         # 项目文档
│   └── pm/                       # 项目管理文档
│       ├── requirements/          # 需求文档
│       ├── tasks/                # 任务拆解 (Epic/Story/Task)
│       ├── tracking/             # 项目追踪 (Sprint/里程碑/风险)
│       └── archived/             # 已归档项目
├── product/                      # 产品设计
│   ├── prd/                      # 产品需求文档
│   ├── design/                   # UI/UX 设计
│   └── specs/                    # 规格说明
├── architecture/                 # 技术架构
│   ├── design/                   # 系统架构设计
│   ├── api/                      # API 文档
│   └── database/                 # 数据库设计
├── development/                  # 技术研发
│   ├── epic/                     # 功能史诗
│   ├── tasks/                    # 开发任务
│   └── technical/                # 技术文档
├── src/                          # 源代码
│   ├── app/                      # Next.js App Router
│   ├── components/               # React 组件
│   └── lib/                      # 工具库
└── tests/                        # 测试文件
```

---

## 🎯 开始使用 PM 管理

### 第一步：检查团队状态
```bash
sessions_list()
```
应该看到 PM 和 Product Designer 都在运行。

### 第二步：提出第一个需求
向 PM agent 提出需求，PM 会创建需求文档并管理项目进度。

### 第三步：查看工作进展
查看 docs/pm/tracking/ 目录下的项目追踪文档。

---

## 📖 详细文档

### PM 研发管理
完整的研发管理体系文档：
- [docs/pm/README.md](./docs/pm/README.md) - 快速入口 ⭐️
- [docs/pm/PM_QUICK_START.md](./docs/pm/PM_QUICK_START.md) - 快速启动
- [docs/pm/PM_WORKFLOW_GUIDE.md](./docs/pm/PM_WORKFLOW_GUIDE.md) - 完整指南
- [docs/pm/PM_TEMPLATES.md](./docs/pm/PM_TEMPLATES.md) - 模板参考
- [docs/pm/PM_GUIDE_INDEX.md](./docs/pm/PM_GUIDE_INDEX.md) - 文档目录

### 过程信息文档
项目开发过程中的记录和归档：
- [record/README.md](./record/README.md) - 过程信息文档说明

### 项目文档
技术文档和设计文档：
- [docs/](./docs/) - 完整的项目文档体系

### 开发指南
- Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
- Prisma: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- TailwindCSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 👥 团队

- **PM (Project Manager):** 负责项目管理
  - Session Key: `e60692a8-f099-4d8f-aaca-2e6c38a68ec6`

- **Product & UX Designer:** 负责产品设计和交互设计
  - Session Key: `f52ddf31-2667-435a-aa2c-dc1bf0843437`

- **Development Team:** 技术开发团队
  - Frontend Lead, Backend Engineer, Database Architect, QA Engineer

---

## 🤝 贡献

欢迎提出需求、建议和反馈：
- 向 PM 提出技术或功能需求
- 向 Product Designer 提出产品改进建议

---

## 📄 许可证

MIT License

---

**开始使用：** [docs/pm/README.md](./docs/pm/README.md)
