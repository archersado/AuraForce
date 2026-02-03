# PM 研发管理完整指南

**AuraForce 项目研发管理完整参考**

---

## 📚 指南文档集

本目录包含 AuraForce 项目的完整研发管理指南和规范。

### 核心文档

1. **[PM_WORKFLOW_GUIDE.md](./PM_WORKFLOW_GUIDE.md)** ⭐️
   - 完整的工作流程指南
   - 角色、流程、规范、最佳实践
   - 适合第一次了解或有疑问时查看

2. **[PM_QUICK_START.md](./PM_QUICK_START.md)** 🚀
   - 5 分钟快速启动
   - 日常工作参考
   - 常用命令和示例

3. **[PM_TEMPLATES.md](./PM_TEMPLATES.md)** 📋
   - 所有文档模板参考
   - 文档命名规范
   - 模板使用指南

4. **[PM_PRODUCT_DESIGNER_SETUP.md](./PM_PRODUCT_DESIGNER_SETUP.md)** ⚙️
   - PM 和 Product Designer 设置指南
   - 团队协作流程
   - 建立新团队的参考

---

## 🎯 第一次使用

### 步骤 1: 阅读快速启动指南
👉 [PM_QUICK_START.md](./PM_QUICK_START.md)

### 步骤 2: 了解工作流程
👉 [PM_WORKFLOW_GUIDE.md](./PM_WORKFLOW_GUIDE.md)

### 步骤 3: 参考模板文档
👉 [PM_TEMPLATES.md](./PM_TEMPLATES.md)

### 步骤 4: 开始使用
向 PM 发送你的第一个需求：
```bash
sessions_send("agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6",
  "你的需求描述...")
```

---

## 🔄 日常使用

### 日常快速参考

**提出新需求 →** 查看 [PM_QUICK_START.md](./PM_QUICK_START.md)

**创建新文档 →** 查看 [PM_TEMPLATES.md](./PM_TEMPLATES.md)

**遇到问题 →** 查看 [PM_WORKFLOW_GUIDE.md](./PM_WORKFLOW_GUIDE.md#常见问题)

---

## 📂 文档组织

### 项目文档
```
docs/
├── pm/                    # 项目管理
│   ├── requirements/       # 需求文档
│   ├── tasks/              # 任务拆解
│   ├── tracking/           # 项目追踪
│   └── archived/           # 已归档
├── product/               # 产品设计
│   ├── prd/               # PRD 文档
│   ├── design/            # UI/UX 设计
│   └── specs/             # 规格说明
└── development/           # 技术研发
    ├── epic/              # Epic
    ├── tasks/             # 开发任务
    └── technical/         # 技术文档
```

---

## 👥 团队信息

### 核心角色

**PM (Project Manager):**
- Session Key: `e60692a8-f099-4d8f-aaca-2e6c38a68ec6`
- 职责：需求管理、任务拆解、项目追踪

**Product & UX Designer:**
- Session Key: `f52ddf31-2667-435a-aa2c-dc1bf0843437`
- 职责：产品设计、UI/UX 设计、规格说明

**Development Team:**
- Frontend Lead, Backend Engineer, Database Architect, QA Engineer

---

## ⚡ 快速命令

### 查看团队状态
```bash
sessions_list()
```

### 向 PM 提出需求
```bash
sessions_send("agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6",
  "需求描述")
```

### 查看历史工作
```bash
sessions_history("session_key")
```

---

## 📖 文档阅读建议

### 新手（第 1 周）
1. 阅读 [PM_QUICK_START.md](./PM_QUICK_START.md)
2. 提出第一个需求
3. 查看处理流程

### 进阶（第 2-4 周）
1. 阅读 [PM_WORKFLOW_GUIDE.md](./PM_WORKFLOW_GUIDE.md)
2. 使用 [PM_TEMPLATES.md](./PM_TEMPLATES.md)
3. 建立自己的工作习惯

### 熟练（1 月+）
1. 参考各个文档
2. 根据需要调整
3. 反馈改进建议

---

## 🔄 工作流程回顾

完整的从需求到归档的流程：

```
用户提出需求
    ↓
PM 接收并分析
    ↓
创建需求 Story (REQ-XXX)
    ↓
拆解 Epic → Story → Task
    ↓
Product Designer 编写 PRD
    ↓
Product Designer 创建 UI/UX 设计
    ↓
Product Designer 编写规格说明
    ↓
技术团队实施开发
    ↓
PM 项目追踪和验收
    ↓
PM 项目归档
```

---

## 💡 最佳实践

### 对于项目负责人

1. ✅ 需求要清晰明确
2. ✅ 按优先级排序
3. ✅ 及时反馈
4. ✅ 明确验收标准

### 对于 PM

1. ✅ 深入理解需求
2. ✅ 合理拆分任务
3. ✅ 持续追踪进度
4. ✅ 及时归档

### 对于 Product Designer

1. ✅ 用户为中心
2. ✅ 设计可实现
3. ✅ 文档清晰
4. ✅ 协作顺畅

---

## 📞 支持

### 文档位置
- **主指南:** `PM_WORKFLOW_GUIDE.md`
- **快速启动:** `PM_QUICK_START.md`
- **模板参考:** `PM_TEMPLATES.md`
- **设置指南:** `PM_PRODUCT_DESIGNER_SETUP.md`

### 在线帮助
- 向 PM 寻求帮助
- 查看 `docs/pm/` 目录的指南

### 反馈
- 向 PM 提出改进建议
- 帮助完善这套管理体系

---

**开始使用这套管理体系吧！** 🚀

查看 [PM_QUICK_START.md](./PM_QUICK_START.md) 开始第一步。

---

**文档版本：** v1.0
**创建日期：** 2025-02-02
**维护者：** Clawdbot
