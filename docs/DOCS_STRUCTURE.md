# 📚 AuraForce 文档结构

**更新时间：** 2025-02-02
**文档总数：** 75 个
**目录层级：** 3-4 层

---

## 📂 目录结构总览

```
docs/
├── 📄 README.md                                    # 主文档索引（本文件）
│
├── 📖 guides/                                     # 开发指南
│   ├── README.md                                 # 指南目录索引
│   └── 📧 email-setup.md                        # 邮件服务配置
│
├── 💻 development/                               # 开发文档
│   ├── README.md                                 # 开发文档索引
│   └── 📋 EPIC-14-WORKSPACE-EDITOR.md          # Workspace 编辑器史诗
│
├── 🔄 migration/                                  # 迁移文档
│   ├── README.md                                 # 迁移文档索引
│   │
│   ├── 🍒 cherry-markdown/                      # Cherry Markdown 指南
│   │   ├── README.md                            # 指南索引
│   │   ├── cherry-markdown-intro.md             # 简介
│   │   ├── cherry-markdown-installation.md      # 安装指南
│   │   ├── cherry-markdown-features.md          # 功能列表
│   │   ├── cherry-vs-tiptap-comparison.md       # 功能对比
│   │   └── cherry-quick-reference.md            # 快速参考
│   │
│   ├── 🎨 editor-migration/                     # 编辑器迁移记录
│   │   ├── README.md                            # 迁移记录索引
│   │   ├── CHERRY_MARKDOWN_MIGRATION.md         # 迁移计划
│   │   ├── MARKDOWN_EDITOR_ANALYSIS.md          # 组件分析
│   │   ├── MIGRATION_COMPLETE.md                # 迁移完成报告
│   │   └── migration-checklist.md               # 检查清单
│   │
│   └── 📊 resources/                            # 迁移资源
│       ├── README.md                            # 资源索引
│       ├── migration-technical-analysis.md      # 技术分析
│       ├── migration-resources-overview.md       # 资源概览
│       ├── package-migration-reference.md       # 包迁移参考
│       └── cherry-documentation-summary.md      # 文档摘要
│
├── 🗂️ _bmad-output/                             # 项目输出文档（归档）
│   ├── README.md                                 # 输出文档索引
│   ├── 分析文档 (epics.md, prd.md, architecture.md, etc.)
│   ├── 设计资产 (excalidraw-diagrams/, UX files)
│   └── 项目文档 (MVP 总结, 战略蓝图, etc.)
│
└── 🏢 team/                                      # 团队文档
```

---

## 🎯 按类别查找文档

### 快速开发展发指南
👉 查看 **[Guides](./guides/README.md)** 目录

- 邮件服务配置
- 开发环境设置
- 常用命令
- 代码规范

### 项目开发文档
👉 查看 **[Development](./development/README.md)** 目录

- 组件分析和设计
- 开发记录
- 技术栈说明

### 迁移相关文档
👉 查看 **[Migration](./migration/README.md)** 目录

#### 🍒 Cherry Markdown 指南
- Cherry Markdown 简介
- 安装和配置
- 功能对比
- 快速参考

#### 🎨 Editor Migration
- 迁移计划
- 组件分析
- 迁移报告
- 检查清单

#### 📊 迁移资源
- 技术分析
- 资源概览
- 包迁移参考

### 项目分析和设计
👉 查看 **[_bmad-output](./_bmad-output/README.md)** 目录

- 产品需求文档 (PRD)
- Epics（功能史诗）
- 系统架构
- 设计资产

---

## 📊 文档统计表

| 类别 | 子类别 | 文档数 | 说明 |
|------|--------|--------|------|
| **Guides** | 开发指南 | 2 | 配置、开发流程 |
| **Development** | 开发文档 | 2 | 组件分析、开发记录 |
| **Migration** | 迁移文档 | 16 | 迁移相关文档 |
| │ | └ cherry-markdown | 6 | Cherry Markdown 指南 |
| │ | └ editor-migration | 5 | 编辑器迁移记录 |
| │ | └ resources | 5 | 迁移资源分析 |
| **_bmad-output** | 项目输出 | 55 | 项目分析、设计资产 |
| **team** | 团队文档 | 1 | 团队指南（待补充） |
| **总计** | - | **76** | - |

---

## 🔍 快速搜索

### 按主题查找

**Cherry Markdown:**
- 🍒 [Cherry Markdown Guide](./migration/cherry-markdown/README.md)

**编辑器迁移:**
- 🎨 [Editor Migration](./migration/editor-migration/README.md)
- 📊 [Migration Resources](./migration/resources/README.md)

**项目概览:**
- 📋 [AuraForce MVP 总结](./_bmad-output/AuraForce-MVP构建完成总结.md)
- 📋 [PRD](./_bmad-output/prd.md)
- 🏗️ [架构](./_bmad-output/architecture.md)

**开发配置:**
- 📧 [邮件设置](./guides/email-setup.md)
- 📘 [开发指南](./guides/README.md)

---

## 📝 更新记录

### 2025-02-02
- ✅ 文档结构重组完成
- ✅ 按类别分组文档（Guides, Development, Migration）
- ✅ 创建各目录的 README.md 索引
- ✅ Cherry Markdown 文档整理
- ✅ 迁移文档分类整理
- ✅ 75+ 个文档归档和整理

---

**文档维护者：** Clawdbot Docs Engineer & Dev Team
**最后更新：** 2025-02-02
**文档版本：** v2.0
