# TOOLS.md - AuraForce 项目工具配置

**版本：** v1.0
**最后更新：** 2025-02-03
**项目：** AuraForce - 技能沉淀平台 MVP

---

## 📂 本地工具配置

此文件用于记录 AuraForce 项目特定的工具配置和环境信息。

---

## 🤖 Discord 角色映射配置

### Discord Channels Mapping

| 角色相关 | Label 前缀 | Discord Account ID | Channel ID | @Mention 触发 |
|----------|-----------|-------------------|------------|--------------|
| **主会话/PM** | - | `default` | `1466261277809836215` | `@AuraForce`, `@主bot` |
| **PM** | `pm-*` | `pm-bot` | `PM_CHANNEL_ID` | `@PM` |
| **Product Designer** | `designer-*` | `designer-bot` | `1466261277809836215` | `@Designer`, `@designer-bot` |
| **Frontend Lead** | `frontend-*` | `dev-bot` | `DEV_CHANNEL_ID` | `@Frontend` |
| **Backend Engineer** | `backend-*` | `dev-bot` | `DEV_CHANNEL_ID` | `@Backend` |
| **Dev Team** | `dev-*` | `dev-bot` | `DEV_CHANNEL_ID` | `@Dev` |
| **QA Engineer** | `qa-*` | `qa-bot` | `QA_CHANNEL_ID` | `@QA` |

### Channel IDs

**📌 请填入实际 Discord Channel ID：**

| Channel 名称 | Channel ID | 说明 |
|-------------|-----------|------|
| **Aurora 主群组** | `1466261277809836215` | 👈 已配置 - 主群组和通知频道 |
| **PM Channel** | `YOUR_PM_CHANNEL_ID` | PM 专用频道 |
| **Design Channel** | `1466261277809836215` | 👈 已配置 - Designer 专用频道 |
| **Dev Channel** | `YOUR_DEV_CHANNEL_ID` | 开发团队频道 |
| **QA Channel** | `YOUR_QA_CHANNEL_ID` | QA 专用频道 |

**如何获取 Channel ID：**

1. Discord 设置 → 高级 → 开启"开发者模式"
2. 右键目标频道 → "复制频道 ID"
3. 替换上表中的 `YOUR_XXX_CHANNEL_ID`

---

## 🔄 Sub-Agent Bot 选择规则

### Label → Bot Account Matching Rules

Sub-Agents 根据其 label 前缀自动选择对应的 Discord bot：

```javascript
// Label → Bot Account 映射规则
- label starting with "pm-"        → use accountId: "pm-bot"
- label starting with "designer-"  → use accountId: "PD"  ✅ 已配置
- label starting with "frontend-"  → use accountId: "dev-bot"
- label starting with "backend-"   → use accountId: "dev-bot"
- label starting with "dev-"       → use accountId: "dev-bot"
- label starting with "qa-"        → use accountId: "qa-bot"
- any other label                  → use accountId: "default"
```

### 实现示例

```javascript
// Sub-Agent 发送 Discord 消息
async function sendToDiscord(tool, context, message) {
  const label = context.label || "";
  let accountId = "default";
  let channel = "YOUR_AURORA_CHANNEL_ID"; // 默认主群组

  // 根据 label 选择 accountId 和 channel
  if (label.startsWith("pm-")) {
    accountId = "pm-bot";
    channel = "YOUR_PM_CHANNEL_ID";
  } else if (label.startsWith("designer-")) {
    accountId = "PD";
    channel = "YOUR_DESIGN_CHANNEL_ID";
  } else if (label.startsWith("frontend-") ||
             label.startsWith("backend-") ||
             label.startsWith("dev-")) {
    accountId = "dev-bot";
    channel = "YOUR_DEV_CHANNEL_ID";
  } else if (label.startsWith("qa-")) {
    accountId = "qa-bot";
    channel = "YOUR_QA_CHANNEL_ID";
  }

  await tool.message({
    action: "send",
    channel: "discord",
    accountId: accountId,  // 指定 bot
    target: channel,       // 指定 channel
    message: message
  });
}
```

---

## 🤖 Discord Bot 配置参考

### 主配置文件位置

```bash
~/.clawdbot/clawdbot.json
```

### 配置文件结构

```json
{
  "channels": {
    "discord": {
      "accounts": {
        "default": {
          "token": "YOUR_AURAFORCE_BOT_TOKEN",
          "description": "主 bot - 一般消息和通知"
        },
        "pm-bot": {
          "token": "YOUR_PM_BOT_TOKEN",
          "description": "PM 专用 bot - 需求管理和任务分配"
        },
        "PD": {
          "token": "YOUR_DESIGNER_BOT_TOKEN",
          "description": "Designer 专用 bot - PRD 和 UI/UX 设计"
        },
        "dev-bot": {
          "token": "YOUR_DEV_BOT_TOKEN",
          "description": "开发团队 bot - Frontend/Backend 开发"
        },
        "qa-bot": {
          "token": "YOUR_QA_BOT_TOKEN",
          "description": "QA 专用 bot - 测试和报告"
        }
      }
    }
  }
}
```

---

## 📋 角色与 Sub-Agent Label 对照

### 当前已定义的角色

| 角色 | Session Key | Label 规则 | Discord Bot |
|------|-------------|------------|-------------|
| **PM** | `e60692a8-f099-4d8f-aaca-2e6c38a68ec6` | `pm-*` | `pm-bot` |
| **Product Designer** | `f52ddf31-2667-435a-aa2c-dc1bf0843437` | `designer-*` | `PD` ✅ |
| **Frontend Lead** | `8b8db2aa-59a3-46e0-b9bc-b2d305def5c4` | `frontend-*` | `dev-bot` |
| **Backend Engineer** | `d344baed-6bb2-4036-b8c5-5fd9a3958ddd` | `backend-*` | `dev-bot` |
| **QA Engineer** | (待创建) | `qa-*` | `qa-bot` |

---

## 🚀 创建 Sub-Agent 时的 Label 命名

### Label 命名规范

使用 `角色名-项目名-任务名` 的格式：

```bash
# PM sub-agent
label: "pm-aurora-main"

# Product Designer sub-agent
label: "designer-aurora-uiux"

# Frontend Lead sub-agent
label: "frontend-aurora-react"

# Backend Engineer sub-agent
label: "backend-aurora-api"

# QA Engineer sub-agent
label: "qa-aurora-testing"
```

### 创建示例

```javascript
// 创建 Designer sub-agent
await tool.sessions_spawn({
  label: "designer-aurora-uiux",  // 自动映射到 designer-bot
  task: "Product Designer 职责：编写 PRD、创建 UI/UX 设计文档",
  thinking: "low",
  timeoutSeconds: 3600
});

// 创建 PM sub-agent
await tool.sessions_spawn({
  label: "pm-aurora-main",  // 自动映射到 pm-bot
  task: "PM 职责：需求管理、任务拆解、进度追踪",
  thinking: "medium",
  timeoutSeconds: 3600
});
```

---

## 💬 Discord 消息格式示例

### Designer Bot 消息格式

```markdown
🎨 **PRD 已完成**

- **PRD ID:** PRD-001
- **对应需求:** REQ-001
- **标题:** 用户认证功能
- **状态:** 待开发
- **下一步:** 分配给 Frontend

👉 [查看 PRD](链接)
```

### PM Bot 消息格式

```markdown
📋 **需求文档已创建**

- **需求 ID:** REQ-001
- **标题:** 用户认证功能
- **优先级:** P0
- **状态:** 待设计
- **分配给:** Product Designer

📅 **创建时间:** 2025-02-03
```

### Dev Bot 消息格式

```markdown
💻 **代码已提交**

- **角色:** Frontend
- **Story:** STORY-14-2
- **任务:** Code Editor 实现
- **提交:** abc1234
- **状态:** 开发中

👉 [查看代码](链接)
```

---

## 🔔 Discord @Mention 路由配置

### @Mention 响应规则

在 Discord 群组中，通过 @mention 触发特定角色：

| @Mention | 触发的角色 | Session Key |
|----------|-----------|-------------|
| `@AuraForce`, `@主bot` | PM (主会话) | - |
| `@Designer`, `@designer-bot` | Product Designer | `c92e403e-4db8-4b2a-81db-aa4d5a4458f2` |
| `@Frontend` | Frontend Lead | (待创建) |
| `@Backend` | Backend Engineer | (待创建) |
| `@QA` | QA Engineer | (待创建) |

### 主会话责任

主会话负责：
1. 监听 Discord 群组消息
2. 检测消息中的 @mentions
3. 根据 @mention 路由到对应的 sub-agent
4. 将 sub-agent 的响应发回 Discord

### 配置文件位置

- **主配置:** `~/.clawdbot/clawdbot.json`
- **详细配置文档:** `/Users/archersado/clawd/projects/AuraForce/docs/discord-mention-routing-config.md`

### 当前实现状态

| 功能 | 状态 |
|------|------|
| Designer bot token | ✅ 已配置 |
| Designer sub-agent | ✅ 已创建 |
| Channel ID | ✅ 已配置 |
| @Mention 检测 | ❌ 待实现 |
| 消息转发 | ❌ 待实现 |
| 响应回传 | ❌ 待实现 |

### 详细文档

👉 **完整配置文档:** `docs/discord-mention-routing-config.md`

---

## 🔍 调试和测试

### 验证 Discord Bot 配置

```bash
# 查看所有活跃 session
sessions_list()

# 创建测试 sub-agent
sessions_spawn({
  label: "test-designer-bot",
  task: "测试 designer bot 消息发送"
})

# 查看测试 sub-agent 历史工作
sessions_history("agent:main:subagent:YOUR_SESSION_KEY")
```

### 检查消息路由

创建 sub-agent 后，检查 Discord 频道是否收到对应 bot 的消息。

---

## 📝 其他工具配置

### 数据库

- **类型:** MySQL/MariaDB
- **ORM:** Prisma
- **可视化工具:** Prisma Studio

### 开发环境

- **Node.js:** v24.13.0
- **包管理器:** npm
- **开发服务器:** Next.js dev mode on port 3000

### 测试

- **单元测试:** Jest
- **E2E 测试:** Playwright
- **测试覆盖率:** Jest Coverage

---

## 📚 相关文档

- [AGENTS.md](./AGENTS.md) - 角色定义和职责
- [README.md](./README.md) - 项目概述
- [docs/pm/README.md](./docs/pm/README.md) - PM 管理文档

---

## 🔄 配置更新日志

| 日期 | 更新内容 |
|------|----------|
| 2025-02-03 | 创建 TOOLS.md，添加 Designer bot 配置 |
| 待更新 | PM, Dev, QA bot 配置 |

---

**最后更新：** 2025-02-03
**维护者：** Clawdbot
**项目：** AuraForce
