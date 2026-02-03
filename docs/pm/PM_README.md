# AuraForce PM 研发管理快速入口

**版本：** v1.0 | **最后更新：** 2025-02-02

---

## 🚀 直接快速启动

### 1. 第一次使用
👉 阅读 **[PM_QUICK_START.md](./PM_QUICK_START.md)** 开始 5 分钟快速上手

### 2. 了解完整体系
👉 查看 **[PM_WORKFLOW_GUIDE.md](./PM_WORKFLOW_GUIDE.md)** 了解完整工作流程

### 3. 开始第一个需求
```bash
sessions_send("agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6",
  "你的需求描述")
```

---

## 📚 完整指南集合

| 文档 | 用途 | 阅读 |
|------|------|------|
| **[PM_QUICK_START.md](./PM_QUICK_START.md)** 🚀 | 快速启动 | ⭐️ 必须 |
| **[PM_WORKFLOW_GUIDE.md](./PM_WORKFLOW_GUIDE.md)** 📘 | 完整指南 | 🔍 参考 |
| **[PM_TEMPLATES.md](./PM_TEMPLATES.md)** 📋 | 模板参考 | 📝 使用 |
| **[PM_GUIDE_INDEX.md](./PM_GUIDE_INDEX.md)** 📖 | 文档目录 | 📂 浏览 |

---

## 🎯 两种启动方式

### 方式 1: 首次详细学习
1. 阅读 [PM_QUICK_START.md](./PM_QUICK_START.md)
2. 阅读 [PM_WORKFLOW_GUIDE.md](./PM_WORKFLOW_GUIDE.md)
3. 查看文档目录 [PM_GUIDE_INDEX.md](./PM_GUIDE_INDEX.md)
4. 开始提出第一个需求

### 方式 2: 快速开始
1. 直接查看 [PM_QUICK_START.md](./PM_QUICK_START.md)
2. 向 PM 发送需求
3. 需要时查看其他文档

---

## 📖 文档结构

```
AuraForce/
├── PM_GUIDE_INDEX.md              # 📖 文档索引
├── PM_QUICK_START.md              # 🚀 快速启动
├── PM_WORKFLOW_GUIDE.md           # 📘 完整指南
├── PM_TEMPLATES.md                # 📋 模板参考
└── PM_PRODUCT_DESIGNER_SETUP.md   # ⚙️ 设置指南

docs/
├── pm/                            # 项目管理工作区
├── product/                       # 产品设计工作区
└── ...                            # 其他文档
```

---

## 💡 常用场景

### 我需要提出新需求
👉 查看 [PM_QUICK_START.md#步骤-2向-pm-提出需求](./PM_QUICK_START.md#步骤-2向-pm-提出需求)

### 我想知道 PM 如何工作
👉 查看 [PM_WORKFLOW_GUIDE.md#工作流程](./PM_WORKFLOW_GUIDE.md#工作流程)

### 我需要创建项目文档
👉 查看 [PM_TEMPLATES.md](./PM_TEMPLATES.md)

### 我想了解团队协作
👉 查看 [PM_WORKFLOW_GUIDE.md#核心角色](./PM_WORKFLOW_GUIDE.md#核心角色)

---

## ⚡ 快速命令

### 检查团队状态
```bash
sessions_list()
```

### 发送需求给 PM
```bash
sessions_send("agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6",
  "需求描述")
```

### 查看 PM 历史工作
```bash
sessions_history("agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6")
```

---

## 🆘 遇到问题？

### FAQ 快速链接

**PM 不运行了？** → [PM_WORKFLOW_GUIDE.md#常见问题](./PM_WORKFLOW_GUIDE.md#常见问题)

**PM 没有创建文档？** → [PM_WORKFLOW_GUIDE.md#常用命令](./PM_WORKFLOW_GUIDE.md#常用命令)

**如何修改需求？** → [PM_WORKFLOW_GUIDE.md#对于项目负责人](./PM_WORKFLOW_GUIDE.md#对于项目负责人)

---

**📌 创建一个书签或快捷方式，方便以后访问这些文档！**

---

**开始使用这套管理体系：** [🚀 快速启动](./PM_QUICK_START.md)
