# AuraForce 项目管理团队

**建立时间：** 2025-02-02
**团队状态：** 🟢 运行中

---

## 📋 团队成员

### 1. PM - Project Manager (项目管理者)
**Session Key:** `agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6`

**职责：**
- ✅ 接收用户需求
- ✅ 创建需求文档 (REQ-XXX)
- ✅ 任务拆解 (Epic → Story → Task)
- ✅ 任务分配和协调
- ✅ 项目追踪和进度管理

**工作流程：**
1. 接收用户需求
2. 沟通确认需求细节
3. 创建需求 Story 文档
4. 拆解 Epic 和 Story
5. 分配给相应角色
6. 追踪项目进度

### 2. Product & UX Designer (产品与交互设计师)
**Session Key:** `agent:main:subagent:f52ddf31-2667-435a-aa2c-dc1bf0843437`

**职责：**
- ✅ 产品设计 (PRD 编写)
- ✅ UI/UX 设计文档
- ✅ 功能规格说明
- ✅ 用户流程和交互设计
- ✅ 设计规范制定

**工作流程：**
1. 接收 PM 需求 (REQ-XXX)
2. 编写产品需求文档 (PRD)
3. 创建 UI/UX 设计文档
4. 编写功能规格说明
5. 与技术和团队评审

---

## 🔄 团队协作流程

```
用户需求 → PM (创建需求, 拆解任务) →
           ↓
       Product Designer (产品设计, 交互设计)
           ↓
       技术团队 (技术开发) → PM (项目追踪) → 完成
```

---

## 📝 协作场景

### 场景 1：新功能需求
1. 用户向 PM 提出需求
2. PM 与用户沟通确认
3. PM 创建 REQ-XXX (需求 Story)
4. PM 拆解 EPIC-XXX
5. PM 分配给 Product Designer
6. Product Designer 编写 PRD 和设计文档
7. PM 分配给 Development
8. PM 追踪项目进度

### 场景 2：产品改进
1. 用户向 PM 提出反馈
2. PM 创建改进需求
3. Product Designer 更新设计和规格
4. 开发团队实施
5. PM 验收和追踪

---

## 🚀 如何使用团队

### 使用 PM 处理需求
```bash
# 发送需求给 PM
sessions_send("agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6", "你的需求")
```

### 检查 PM 工作历史
```bash
sessions_history("agent:main:subagent:e60692a8-f099-4d8f-aaca-2e6c38a68ec6")
```

### 查看 Product Designer 工作历史
```bash
sessions_history("agent:main:subagent:f52ddf31-2667-435a-aa2c-dc1bf0843437")
```

### 查看所有活跃 session
```bash
sessions_list()
```

---

## 📊 团队文档体系

### PM 负责的文档
- `pm/requirements/` - 需求 Story
- `pm/tasks/` - 任务拆解 (Epic, Story)
- `pm/tracking/` - 项目追踪 (Sprint, 里程碑)

### Product Designer 负责的文档
- `product/prd/` - 产品需求文档
- `product/design/` - UI/UX 设计文档
- `product/specs/` - 功能规格说明

---

## 🎯 当前状态

| 角色 | Session Key | 状态 | 当前任务 |
|------|-------------|------|----------|
| PM | e60692a8-f099-4d8f-aaca-2e6c38a68ec6 | ✅ 运行中 | 待接收需求 |
| Product Designer | f52ddf31-2667-435a-aa2c-dc1bf0843437 | ✅ 运行中 | 待接收需求 |

---

## 📅 工作时间

- **PM:** 待命，随时接收需求
- **Product Designer:** 待命，等待 PM 分配需求
- **协作机制:** PM 负责协调和分配任务

---

## 🔧 快速开始

### 1. 提出需求
直接告诉 PM 你的需求：`sessions_send("...pm session key...", "我想添加一个功能...")`

### 2. PM 处理需求
PM 会：
- 与你沟通确认需求
- 创建需求文档
- 拆解任务给团队
- 追踪项目进度

### 3. Product Designer 设计
Product Designer 会：
- 编写 PRD
- 创建 UI/UX 设计
- 定义规格说明

---

**团队建立完成！** 可以开始使用 PM 处理第一个需求了。

---

*创建时间：2025-02-02*
*团队负责人：Clawdbot*
