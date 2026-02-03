---
stepsCompleted: [1, 2, 3]
inputDocuments: [
  "/Users/archersado/workspace/mygit/AuraForce/_bmad-output/prd.md",
  "/Users/archersado/workspace/mygit/AuraForce/_bmad-output/architecture.md",
  "/Users/archersado/workspace/mygit/AuraForce/_bmad-output/project-planning-artifacts/ux-design-specification.md"
]
workflowType: 'epics-and-stories'
lastStep: 3
project_name: 'AuraForce'
user_name: 'Archersado'
date: '2026-01-30'
---

# AuraForce - Epic Breakdown

This document provides a complete epic and story breakdown for AuraForce, decomposing requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

#### User Experience & Journey Management
- FR1: 新用户可以完成引导流程并选择适合其背景的体验路径
- FR2: 用户可以查看和跟踪其在四大板块间的进展状态
- FR3: 用户可以在任何阶段暂停并稍后恢复其旅程
- FR4: 用户可以获得基于当前阶段的个性化指导和建议
- FR5: 用户可以查看其完整的学习和成长历史记录

#### Success Case Experience System
- FR6: 用户可以从多个垂直领域选择并体验完整的成功案例
- FR7: 用户可以在30分钟内完成沉浸式"附身"案例体验
- FR8: 用户可以在体验过程中与AI实时交互并获得解释
- FR9: 用户可以基于个人背景定制案例体验的相关性
- FR10: 用户可以重复体验案例并比较不同的策略路径

#### AI-Powered Skill Processing
- FR11: 用户可以通过多轮对话描述其技能和经验
- FR12: 系统可以从用户描述中提取和识别核心技能DNA
- FR13: 用户可以审查、修改和完善提取的技能资产
- FR14: 系统可以将技能转换为可执行的Claude Code资产
- FR15: 用户可以测试和验证生成的技能资产的有效性

#### Business Model Design & Automation
- FR16: 用户可以使用数字化OPB画布工具创建商业模式
- FR17: AI可以基于用户背景生成个性化的商业模式建议
- FR18: 用户可以接收基于其技能的多轨道发展路径
- FR19: 用户可以配置和启动AI驱动的自动化运营工作流
- FR20: 用户可以监控和调整其商业模式的自动化执行

#### Community & Commerce Platform
- FR21: 用户可以在社区中分享其技能资产和成功经验
- FR22: 用户可以浏览和购买其他用户的技能包
- FR23: 用户可以评价和反馈使用的技能资产质量
- FR24: 用户可以参与技能资产的协作改进和版本迭代
- FR25: 用户可以查看技能资产的使用统计和收益数据

#### User & Account Management
- FR26: 用户可以创建账户并完成个人档案设置
- FR27: 用户可以管理其订阅级别和计费偏好
- FR28: 企业用户可以管理多个子账号和团队权限
- FR29: 用户可以控制其数据隐私和技能资产共享设置
- FR30: 用户可以导出其数据和迁移到其他平台

#### AI Engine & Integration Platform
- FR31: 系统可以与Claude Code实例进行实时通信
- FR32: 用户可以安装和配置MCP工具扩展其AI能力
- FR33: 系统可以维护多轮对话的上下文和状态
- FR34: 用户可以访问多种AI生成服务（文本、图像、视频）
- FR35: 开发者可以通过API集成平台功能

#### Workflow Engine Core Requirements
- FR36: 系统提供基于claude-agent-sdk的可配置工作流引擎
- FR37: 用户可以创建、保存和执行自定义AI工作流
- FR38: 工作流支持多步骤序列执行和条件分支
- FR39: 系统提供工作流执行状态的实时可视化监控
- FR40: 工作流支持错误处理和重试机制

#### Claude Code GUI Requirements
- FR41: 用户可以通过Web界面访问完整的Claude Code CLI功能
- FR42: 界面支持实时流式输出和会话管理
- FR43: 用户可以启动、暂停、恢复和终止Claude Code会话
- FR44: 系统保存会话历史并支持会话恢复
- FR45: 界面支持多会话并发和切换

#### Analytics & Performance Monitoring
- FR46: 系统可以跟踪用户在转化漏斗中的进展和转化率
- FR47: 用户可以查看其技能资产的质量评分和使用分析
- FR48: 运营团队可以监控AI工作流的成功率和性能指标
- FR49: 用户可以接收基于数据的改进建议和优化方案
- FR50: 平台可以生成用户成功和商业模式执行的综合报告

### NonFunctional Requirements

#### Performance
- **AI响应时间**: Claude Code AI对话响应必须在2秒内完成,成功率≥95%
- **页面加载性能**: 所有核心页面(体验中心、技能沉淀、OPB画布)必须在3秒内完成首次加载
- **技能沉淀实时性**: 技能DNA提取过程每轮对话反馈必须在5秒内完成,确保流畅的用户体验
- **并发处理能力**: 系统必须支持1000+并发用户同时进行AI交互,性能降级<10%
- **30分钟体验完整性**: 成功案例体验全程不得出现超过5秒的响应延迟,中断率<1%
- **工作流执行性能**:
  - 工作流初始化时间 < 3秒
  - 工作流步骤切换响应 < 2秒
  - 工作流状态更新延迟 < 1秒
  - 支持至少50个并发工作流执行
- **Claude Code界面性能**:
  - 终端输出流更新延迟 < 100ms
  - 会话切换响应 < 500ms
  - 历史会话加载 < 2秒
- **API配置灵活性**: 支持 API 前缀配置(NEXT_PUBLIC_API_PREFIX)，方便 nginx 反向代理部署

#### Security
- **数据加密**: 所有用户数据(技能资产、商业模式、个人信息)必须采用AES-256加密存储,传输使用TLS 1.3
- **访问控制**: 实施基于角色的权限控制(RBAC),确保用户只能访问授权的技能资产和功能模块
- **多租户隔离**: 企业租户数据必须完全隔离,技能资产在租户间不可见,防止数据泄露
- **支付安全**: 支付处理必须符合PCI DSS标准,敏感支付信息不得存储在应用服务器
- **API安全**: 所有API调用必须使用身份验证令牌,实施速率限制防止滥用

#### Scalability
- **用户增长支持**: 系统架构必须支持从千级用户平滑扩展到十万级用户,无需重大重构
- **Claude Code弹性伸缩**: AI引擎实例必须能够基于负载自动扩缩,响应时间变化<20%
- **数据库可扩展性**: 多租户数据架构必须支持水平分片,单租户数据增长不影响其他租户性能
- **MCP工具动态扩展**: 系统必须支持新MCP工具的热加载,无需系统重启
- **全球化部署准备**: 技术架构必须支持多地域部署,为未来国际化扩展做准备

#### Integration
- **Claude Code集成可靠性**: 与Claude Code的通信必须有容错机制,失败时自动重试最多3次,超时设置10秒
- **MCP生态兼容性**: 必须支持标准MCP协议,与第三方MCP工具保持向后兼容性
- **社交平台API稳定性**: 与微博、小红书、抖音等平台的API集成必须有降级机制,单平台故障不影响整体功能
- **支付网关容错**: 支付系统必须支持多个支付渠道,主渠道故障时自动切换备用渠道
- **数据导出标准**: 必须提供标准格式的用户数据导出功能,支持平台迁移和数据可携性

#### Reliability
- **系统可用性**: 平台总体可用性必须达到99.5%,计划维护时间除外
- **AI工作流成功率**: 商业模式自动化工作流执行成功率必须≥85%,失败时有自动恢复机制
- **数据备份与恢复**: 用户技能资产和商业模式数据必须每日备份,灾难恢复时间目标(RTO)≤4小时
- **错误监控与告警**: 系统必须实时监控关键指标,异常情况下15分钟内发出告警
- **技能资产版本控制**: 用户技能资产必须有版本管理,支持回滚到任意历史版本

### Additional Requirements

#### Technology Stack & Architecture
- **Frontend Framework**: Next.js 16.1.1 with App Router (migrate from current Pages Router)
- **Language**: TypeScript 5.2.2 with **strict mode REQUIRED** (current config has strict: false, 已更新为 true)
- **Styling**: Tailwind CSS 3.3.5 + PostCSS 8.4.31 + Autoprefixer 10.4.16
- **Authentication**: Auth.js v5 with Prisma adapter (NEW - not currently implemented)
- **Database**: MySQL 8.0+ with Prisma ORM (NEW - not currently implemented)
- **State Management**: Zustand v5.0.9 (NEW - replace current ad-hoc patterns)
- **Claude Integration**: @anthropic-ai/claude-agent-sdk (REPLACE current @anthropic-ai/sdk 0.9.1)
- **Starter Template**: Official create-next-app@latest with TypeScript + Tailwind + ESLint + App Router

#### Critical Migration Requirements
- **Pages Router → App Router**: Use `src/app/` directory structure
- **No auth → Auth.js v5**: All protected routes need middleware
- **No database → Prisma + MySQL**: Use @@map() for snake_case tables
- **Ad-hoc state → Zustand**: Feature-based store organization
- **Direct Anthropic SDK → Claude Agent SDK**: Session management patterns change

#### WolfGaze Technology Visual System
- **Deep Space Blue**: #0F172A → #1E293B → #334155 → #475569
- **Titanium Silver**: #71717A → #A1A1AA → #D4D4D8 → #E4E4E7
- **AI Neural Network Gradient**: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- **Titanium Glow Gradient**: linear-gradient(135deg, #A1A1AA 0%, #71717A 100%)
- **Typography**: Orbitron (titles), Inter (UI), JetBrains Mono (code)
- **4px Grid System**: Pixel-perfect alignment

#### Project Structure Rules
- **Database Tables**: Use snake_case with @@map() directives for MySQL
- **API Endpoints**: REST endpoints using plural resource names + camelCase query parameters
- **Code Naming**: PascalCase components, camelCase functions, SCREAMING_SNAKE_CASE constants
- **Import Paths**: Use `@/*` import alias for all internal imports
- **Feature Organization**: Components organized by domain (skill/, claude/, auth/)
- **API 路径管理**: 实现统一的 api-client.ts 客户端，自动处理 API 前缀配置

#### CC GUI & Workflow Engine Implementation
- **Terminal Emulation**: node-pty + xterm.js for Claude Code CLI web interface
- **Real-time Communication**: WebSocket bidirectional streaming with /auraforce 前缀支持
- **Session Management**: Multi-concurrent sessions with persistence and recovery
- **Workflow Engine**: Based on @anthropic-ai/claude-agent-sdk for configurable AI workflows
- **Workflow Visualization**: Real-time monitoring interface for workflow execution
- **Error Handling**: Automatic retry with configurable timeout and recovery mechanisms
- **文件上传配置**: Next.js body size limit 提升至 100MB，支持大文件上传

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | 用户引导与路径选择 |
| FR2 | Epic 1 | 进展状态跟踪 |
| FR3 | Epic 1 | 旅程暂停与恢复 |
| FR4 | Epic 1 | 个性化指导建议 |
| FR5 | Epic 1 | 学习成长历史记录 |
| FR6 | Epic 1 | 选择体验成功案例 |
| FR7 | Epic 1 | 完成30分钟沉浸体验 |
| FR8 | Epic 1 | AI实时交互与解释 |
| FR9 | Epic 1 | 定制案例相关性 |
| FR10 | Epic 1 | 比较不同策略路径 |
| FR11 | Epic 6 | 多轮对话描述技能 |
| FR12 | Epic 6 | 技能DNA提取识别 |
| FR13 | Epic 6 | 审查修改技能资产 |
| FR14 | Epic 6 | 转换为CC资产 |
| FR15 | Epic 6 | 测试验证技能资产 |
| FR16 | Epic 7 | 数字化OPB画布工具 |
| FR17 | Epic 7 | AI生成商业模式建议 |
| FR18 | Epic 7 | 多轨道发展路径 |
| FR19 | Epic 8 | 配置AI自动化工作流 |
| FR20 | Epic 8 | 监控调整自动化执行 |
| FR21 | Epic 9 | 分享技能资产 |
| FR22 | Epic 9 | 浏览购买技能包 |
| FR23 | Epic 9 | 评价反馈技能质量 |
| FR24 | Epic 9 | 协作改进技能资产 |
| FR25 | Epic 9 | 查看使用统计收益 |
| FR26 | Epic 2 | 创建账户与档案设置 |
| FR27 | Epic 2 | 管理订阅与计费 |
| FR28 | Epic 2 | 企业子账号管理 |
| FR29 | Epic 2 | 数据隐私与共享控制 |
| FR30 | Epic 2 | 数据导出与迁移 |
| FR31 | Epic 3 | Claude Code实时通信 |
| FR32 | Epic 11 | MCP工具安装配置 |
| FR33 | Epic 3 | 多轮对话状态管理 |
| FR34 | Epic 11 | 多种AI生成服务访问 |
| FR35 | Epic 12 | 开发者API集成 |
| FR36 | Epic 4 | Agent SDK工作流引擎 |
| FR37 | Epic 4 | 创建执行自定义工作流 |
| FR38 | Epic 4 | 多步骤执行与条件分支 |
| FR39 | Epic 4 | 工作流可视化监控 |
| FR40 | Epic 4 | 错误处理与重试机制 |
| FR41 | Epic 3 | Web界面访问CC功能 |
| FR42 | Epic 3 | 流式输出与会话管理 |
| FR43 | Epic 3 | 启动暂停恢复终止会话 |
| FR44 | Epic 3 | 会话历史保存恢复 |
| FR45 | Epic 3 | 多会话并发切换 |
| FR46 | Epic 12 | 转化漏斗跟踪 |
| FR47 | Epic 12 | 技能资产质量分析 |
| FR48 | Epic 12 | AI工作流性能监控 |
| FR49 | Epic 12 | 数据改进建议 |
| FR50 | Epic 12 | 综合报告生成 |

## Epic List

### Epic 1: 项目基础架构与技术栈初始化
提供完整的技术基础环境,支持所有后续功能的开发。基于create-next-app@latest初始化Next.js项目,配置TypeScript strict mode、Tailwind CSS、Auth.js v5、Prisma ORM等核心依赖。

### Steps Completed:
- ✅ Story 1.1: Initialize Next.js Project with App Router
   - 使用 create-next-app@latest 创建项目
   - 升级到 Next.js 16 并迁移 Pages Router → App Router 结构
- ✅ Story 1.2: Configure TypeScript Strict Mode and @/ Path Aliases
   - 在 tsconfig.json 中设置 `"strict": true`
   - 配置 @/* 路径别名以统一导入
- ✅ Story 1.3: Install Core Dependencies
   - 安装 Prisma、Zustand、Auth.js v5 等核心依赖
- ✅ Story 1.4: Setup Prisma Schema with Basic Models
   - 同步数据库 schema 并生成 Prisma Client
- ✅ Story 1.5: Configure Auth.js v5 Foundation
   - 集成 Auth.js v5 认证系统到项目
   - 配置开发环境变量 AUTH_SECRET
- ✅ Story 1.6: Initialize Zustand Store Structure
   - 创建全局状态管理方案
   - 配置开发环境变量

### In Progress:
- 🔄 API 前缀配置系统 (部分完成)
   - 创建统一的 api-client.ts 客户端，自动处理 `/auraforce` 前缀
   - 配置 next.config.js 的 basePath 和 assetPrefix 为 `/auraforce`
   - 更新 .env 添加 NEXT_PUBLIC_API_PREFIX 环境变量
   - 正在修复各个前端组件中的 API 调用以使用 apiFetch：
     * src/app/(protected)/project/[id]/page.tsx
     * src/components/workflows/WorkflowUpload.tsx (添加 credentials: 'include')
     * src/lib/workspace/files-service.ts (使用 buildApiUrl)
     * src/types/slash-commands.ts (使用 buildApiUrl)
     * src/lib/claude/websocket-manager.ts (WS URL 添加 /auraforce 前缀)
     * src/components/claude/ChatInterface.tsx (2 处 fetch 调用)
     * src/lib/store/claude-store.ts (3 处 fetch 调用)
   - 修复文件上传大小限制到 100MB

### Notes:
- Next.js 16 已启用，Pages Router 迁移完成
- TypeScript strict mode 已配置 (计划中)
- Auth.js v5 已集成
- Prisma Client 已重新生成并与数据库同步
- API 前缀配置正在全面修复中，支持 nginx 反向代理 /auraforce 路径部署
- 由于项目是从零开始重构，部分原有结构正在逐步迁移和调整

---

## Other Epic Definitions

（保持原有的 Epic 2 - Epic 12 定义不变）
---
stepsCompleted: []
inputDocuments: [
  "/Users/archersado/workspace/mygit/AuraForce/_bmad-output/prd.md",
  "/Users/archersado/workspace/mygit/AuraForce/_bmad-output/architecture.md",
  "/Users/archersado/workspace/mygit/AuraForce/_bmad-output/project-planning-artifacts/ux-design-specification.md"
]
workflowType: 'epics-and-stories'
lastStep: 3
project_name: 'AuraForce'
user_name: 'Archersado'
date: '2026-01-30'
---

# AuraForce - Epic 聚系

## Overview

实现完整的在线 Workspace 编辑器功能，支持多格式文件（代码、Markdown、图片、PPT）的查看、编辑和管理。集成 Claude Agent SDK 实现智能文件操作和 AI 辅助编辑。

## Requirements Inventory

### Functional Requirements

#### 文件格式支持
- FR1: 用户可以在 Workspace 中查看和编辑多种格式的文件
- FR2: 系统支持代码文件（.ts, .js, .json, .yaml等）的语法高亮
- FR3: 系统支持 Markdown 文件的实时预览和编辑
- FR4: 系统支持图片文件（.png, .jpg, .gif, .svg等）的预览和显示
- FR5: 系统支持文档文件（.doc, .docx, .pdf）的在线编辑
- FR6: 系统支持 PPT 文件的播放幻灯片模式的预览

#### 智能编辑与 AI 辅助
- FR7: 用户可以通过 Claude Agent 发送文件编辑请求
- FR8: 用户可以使用 Claude 改进代码、重写代码段或添加注释
- FR9: 用户可以让 Claude 帮助撰写 Markdown 文档内容
- FR10: 用户可以让 Claude 辅助调整文档结构和格式
- FR11: 用户可以请 Claude 分析代码质量并提出优化建议
- FR12: 用户可以让 Claude 帮助生成代码文档的注释

#### Claude Agent SDK 集成
- FR13: Claude Agent 可以监听 Workspace 目录的文件变更事件
- FR14: Claude Agent 可以在文件被修改时通知前端刷新目录树
- FR15: Claude Agent 可以根据变更类型智能定位到对应的文件并打开
- FR16: 系统支持通过 Claude Agent 读取和编辑文件内容

#### 文件操作
- FR17: 用户可以在 Workspace 中创建新文件和文件夹
- FR18: 用户可以重命名文件或文件夹
- FR19: 用户可以删除文件或文件夹
- FR20: 用户可以上传文件到 Workspace
- FR21: 用户可以下载文件或整个文件夹
- FR22: 用户支持文件搜索，按名称、类型、修改时间筛选
- FR23: 用户可以复制文件内容到剪贴板

#### 协作与版本控制
- FR24: 用户可以查看文件的编辑历史记录
- FR25: 系统保留文件版本，支持回滚到历史版本
- FR26: 用户可以比较两个文件版本的差异
- FR27: 用户可以创建文件的编辑分支
- FR28: 用户可以恢复之前的文件版本

#### 界面与交互
- FR29: 用户可以通过侧边栏的文件树快速导航和定位文件
- FR30: 用户可以在主编辑区域查看和编辑当前选中的文件
- FR31: 系统支持标签页签同时打开多个文件进行对比编辑
- FR32: 支持 Markdown 渲染的实时预览模式（分屏显示）
- FR33: 支持代码文件的 LSP（语言服务器协议）提示和自动补全
- FR34: 系统支持编辑器的全屏模式和专注模式
- FR35: 编辑器支持快捷键操作（保存、撤销/重做、搜索等）
- FR36: 系统自动保存编辑进度，防止意外关闭丢失数据

#### 用户与权限管理
- FR37: 系统基于 RBAC 模型控制用户对 Workspace 文件的访问权限
- FR38: 企业用户可以邀请团队成员访问共享的 Workspace
- FR39: 文件所有者可以设置共享文件为只读或受限编辑
- FR40: 企业管理员可以控制成员对 Workspace 的读写权限

### NonFunctional Requirements

#### 性能要求
- **文件加载速度**：点击文件后 1 秒内完成加载和渲染
- **编辑响应延迟**：代码输入到显示响应 < 100ms
- **大文件支持**：支持 ≥ 50MB 的文件编辑，加载时显示进度
- **多文件并发**：支持同时打开编辑 ≥ 5 个文件标签页
- **导出性能**：导出整个 Workspace 为 ZIP 压缩包时间 < 10 秒

#### 安全要求
- **文件加密**：所有 Workspace 文件内容采用 AES-256 加密存储
- **访问日志**：记录所有文件访问和编辑操作用户日志
- **权限验证**：每次文件操作都验证用户权限
- **数据备份**：Workspace 每日自动备份，保留最近 30 天的版本历史

#### 可扩展性要求
- **API 扩展**：提供 REST API 供第三方集成 Workspace 文件操作
- **插件架构**：支持第三方开发 编辑器插件扩展功能
- **主题定制**：用户可以选择或自定义编辑器主题
- **国际化**：界面支持中文、英文等多语言切换

### Epic Definition

- **Epic ID:** EP-14
- **Epic Name:** Workspace 编辑器与文件管理
- **Epic Description:** 实现完整的在线 Workspace 编辑器功能，支持多格式文件（代码、Markdown、图片、PPT）的查看、编辑和管理。集成 Claude Agent SDK 实现智能文件操作和 AI 辅助编辑。

---

## Epic Stories Summary

由于篇幅限制，本 Epic 的详细 stories 将在后续设计阶段逐一创建。预计包含约 25-30 个 stories，涵盖：

1. 文件格式支持相关 stories（代码/Markdown/图片/文档）
2. Claude Agent 集成相关 stories
3. 文件操作管理相关 stories
4. 界面与交互相关 stories（文件树/编辑器/标签页）
5. 协作与版本控制相关 stories
6. AI 辅助编辑相关 stories
7. 用户权限管理相关 stories

### Tasks Reference (BMAD CLI)

```bash
# 创建 Epic
bmad:bmm:workflows:create-epic   --epic-title "Workspace 编辑器与文件管理"   --epic-description "实现完整的在线 Workspace 编辑器功能，支持多格式文件（代码、Markdown、图片、PPT）的查看、编辑和管理。集成 Claude Agent SDK 实现智能文件操作和 AI 辅助编辑。"   --epic-number "14"
```

### Notes
- 这是一个全新 Epic，需要后续与产品团队确认每个 story 的优先级和排期
- Claude Agent SDK 集成需要参考现有的 Claude Chat 集成方式