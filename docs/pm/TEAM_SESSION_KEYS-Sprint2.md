# 团队 Session Keys

**更新日期:** 2025-02-02
**PM:** Clawdbot

---

## ✅ 当前活跃团队（Sprint 2）

| 角色 | Session Key | 状态 | 主要任务 |
|------|-------------|------|----------|
| **PM** | `agent:main:subagent:88122afc-c82b-4c5e-930f-a07b5c613b5a` | ✅ 运行中 | Epic 14 管理 |
| **Frontend Lead** | `agent:main:subagent:b7ae09d5-f678-467a-8ce0-84ab651cbd0d` | 🔄 初始 | Sprint 2 开发（File Tree, Tabs, Search）|
| **Backend Engineer** | `agent:main:subagent:002d44ca-9865-4c47-ab56-8bcf09db23a1` | 🔄 初始 | Sprint 2 API 开发（Tree API, Search API）|

---

## 📜 历史任务记录

| 日期 | 角色 | 完成任务 | Session Key |
|------|------|----------|-------------|
| 2025-02-02 | Frontend Lead | STORY-14-2: Code Editor (Sprint 1) | `agent:main:subagent:43754e4f-7cee-41fb-8e3e-a69634d663d2` |
| 2025-02-02 | Backend Engineer | STORY-14-7: File Operations (Sprint 1) | `agent:main:subagent:f0007091-2121-4546-b823-71fa8e4cc056` |
| 2025-02-02 | Product Designer | Sprint 1 UI 设计 | `agent:main:subagent:ca5499d1-9706-440b-9ec1-a3d7bd2d6f27` |
| 2025-02-02 | QA Engineer | Sprint 1 测试 | `agent:main:subagent:69388924-7cd3-4d67-bb71-ea622a195e9e` |

---

## 📋 Sprint 2 任务分配

**当前 Sprint（Sprint 2: 多文件支持）:**
- **STORY-14-6:** Workspace File Tree and Navigation (P1) - Frontend + Backend
- **STORY-14-8:** Multi-file Tab System (P2) - Frontend
- **STORY-14-9:** File Search and Filter (P2) - Frontend + Backend

**团队分配:**
- ✅ Frontend Lead - STORY-14-6, 14-8, 14-9 (前端组件)
- ✅ Backend Engineer - STORY-14-6, 14-9 (API 端点)

---

## 📝 协作指南

### PM → 团队沟通
- PM 通过 `sessions_send` 向角色分配任务
- 查看角色工作历史：`sessions_history(sessionKey)`
- 切换角色：创建新的 subagent session

### 角色职责
- **Frontend Lead:** React 组件、UI/UX 实现、前端状态管理
- **Backend Engineer:** API 端点、数据库操作、文件系统操作
- **Product Designer:** PRD、UI/UX 设计、交互原型
- **QA Engineer:** 测试计划、测试执行、Bug 报告

### Session 管理
- 如 session 失效，立即重新创建
- 记录每个 Sprint 的 session key
- 更新 TEAM_SESSION_KEYS.md

---

**最后更新:** 2025-02-02
**状态:** Sprint 2 团队已就绪
