---
name: 'step-08-documentation-handoff'
description: 'Generate final documentation and prepare for handoff'

# Path Definitions
workflow_path: '{bmad_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
diagramOutputFile: '{output_folder}/diagrams/'
templateFile: '{workflow_path}/templates/architecture-spec-template.md'
---

# Step 8: Documentation & Handoff

Generate comprehensive technical architecture documentation and prepare for developer handoff.

## DIALOGUE SECTIONS:

### 1. Documentation Overview
"**📚 文档与交付**

我将生成完整的技术架构文档，包括架构概览、实施指南、环境配置和交接清单。"

### 2. Architecture Executive Summary
"**📋 架构执行摘要**

为决策者和团队领导提供高层架构概览："

Create executive summary:

```markdown
## 架构执行摘要

### 项目概述
- 项目名称: [Project Name]
- 架构师: Atlas
- 完成日期: [Date]
- 版本: 1.0.0

### 架构亮点

#### 技术栈
- 前端: [Frontend tech stack]
- 后端: [Backend tech stack]
- 数据库: [Database technology]
- 部署: [Deployment platform]

#### 架构模式
采用 [Architecture Pattern] 架构，适合 [use case]，具有以下优势：
- 优势 1: [Description]
- 优势 2: [Description]
- 优势 3: [Description]

#### 核心设计决策

1. **[Decision 1]**
   - Background: [Why this decision was needed]
   - Choice: [What we chose]
   - Impact: [How it affects the system]

2. **[Decision 2]**
   - Background: [Why this decision was needed]
   - Choice: [What we chose]
   - Impact: [How it affects the system]

### 性能目标
- API响应时间: < [X]ms (p95)
- 并发用户: [X]+ concurrent users
- 可用性: [X]% uptime

### 安全等级
- 认证: [JWT with MFA]
- 数据加密: [TLS 1.3 at transit, AES-256 at rest]
- 合规: [GDPR, other relevant regulations]

### 实施建议
- 开发团队规模: [X] developers recommended
- 预计开发时间: [X] weeks for MVP
- 技能要求: [Required tech skills]

### 扩展路径
- Phase 1: MVP完成
- Phase 2: 增加缓存层
- Phase 3: 考虑微服务架构
- Phase 4: 全球化部署
```

### 3. Development Environment Setup
"**🖥️ 开发环境配置**

提供完整的开发环境设置指南："

Create comprehensive setup guide:

```markdown
## 开发环境配置

### 前置要求

#### 必需软件
- Node.js: v18.x or later
- nvm: Version manager for Node.js
- Git: Latest version
- IDE: VS Code (recommended)

#### 可选工具
- Docker: For containerized development
- Postman/Insomnia: API testing
- DBeaver/pgAdmin: Database client

### 安装步骤

#### 1. 克隆代码库
\`\`\`bash
git clone <repository-url>
cd <project-directory>
\`\`\`

#### 2. 安装依赖
\`\`\`bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
\`\`\`

#### 3. 配置环境变量

##### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=My App
\`\`\`

##### Backend (.env)
\`\`\`env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/myapp
JWT_SECRET=your-secret-key-here
REDIS_URL=redis://localhost:6379
\`\`\`

#### 4. 设置数据库
\`\`\`bash
# Start PostgreSQL
# Using Docker
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:14

# Run migrations
cd backend
npm run migrate
npm run seed # Optional: seed database
\`\`\`

#### 5. 启动开发服务器
\`\`\`bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
\`\`\`

### 开发工具配置

#### VS Code Extensions (Recommended)
- ESLint
- Prettier
- GitLens
- Prisma (if using Prisma)
- REST Client

#### Git Hooks (Lint-staged)
\`\`\`bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
\`\`\`

### 数据库管理
\`\`\`bash
# Create migration
npm run migration:generate --name add_new_field

# Run migrations
npm run migrate

# Rollback migration
npm run migrate:rollback

# Open database shell
npm run db:shell
\`\`\`

### 常见问题

#### Port Already in Use
\`\`\`bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
\`\`\`

#### Database Connection Issues
\`\`\`bash
# Check if PostgreSQL is running
ps aux | grep postgres

# Test connection
npm run db:test
\`\`\`
```

### 4. Implementation Roadmap
"**🗺️ 实施路线图**

为开发团队提供明确的开发优先级和时间估算："

Create implementation roadmap:

```markdown
## 实施路线图

### Phase 1: 基础设施搭建 (Week 1)

#### 优先级: Critical
- [ ] 项目初始化和配置
- [ ] 数据库设计和迁移
- [ ] 认证系统实现
- [ ] 基础API框架

#### 交付物
- 可运行的开发环境
- 用户注册/登录功能
- 基础API端点

### Phase 2: 核心功能开发 (Weeks 2-4)

#### 优先级: High
- [ ] 核心业务逻辑实现
- [ ] 主要端点开发
- [ ] 前端页面搭建
- [ ] 状态管理集成

#### 交付物
- 完整的CRUD操作
- 用户界面框架
- 数据流转实现

### Phase 3: 功能完善 (Weeks 5-6)

#### 优先级: Medium
- [ ] 次要功能开发
- [ ] UI/UX优化
- [ ] 错误处理完善
- [ ] 加载状态和空状态

#### 交付物
- 功能完整的MVP
- 良好的用户体验
- 全面的错误处理

### Phase 4: 优化和测试 (Weeks 7-8)

#### 优先级: High
- [ ] 性能优化
- [ ] 安全加固
- [ ] 单元测试和集成测试
- [ ] E2E测试

#### 交付物
- 测试覆盖率 > 80%
- 性能指标达标
- 安全审查通过

### Phase 5: 部署准备 (Week 9)

#### 优先级: Critical
- [ ] 生产环境配置
- [ ] CI/CD pipeline设置
- [ ] 监控和告警配置
- [ ] 文档完善

#### 交付物
- 可部署到生产环境
- 自动化部署流程
- 监控和日志系统
- 完整的文档

### 时间估算总结
- Phase 1: 1 week (Infrastructure)
- Phase 2: 3 weeks (Core Features)
- Phase 3: 2 weeks (Features Polish)
- Phase 4: 2 weeks (Testing & Optimization)
- Phase 5: 1 week (Deployment)
- **Total: 9 weeks for MVP**
```

### 5. Architecture Diagrams
"**🎨 架构图**

创建清晰的架构图表："

Generate ASCII diagrams for key architecture aspects:

```markdown
## 架构图

### 系统架构图

\`\`\`
                    ┌─────────────────────────────────┐
                    │         Client Layer            │
                    │  Browser  │  Mobile  │  External │
                    └─────────────────────────────────┘
                                     │
                                     │ HTTPS
                                     ▼
                    ┌─────────────────────────────────┐
                    │         CDN Layer               │
                    │      (Vercel/Netlify)           │
                    └─────────────────────────────────┘
                                     │
                                     ▼
        ┌──────────────────────────────────────────────┐
        │            Frontend Application             │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
        │  │   UI     │  │  State   │  │  API     │   │
        │  │Components│  │ Management│  │  Client  │   │
        │  └──────────┘  └──────────┘  └──────────┘   │
        └──────────────────────────────────────────────┘
                         │ HTTP/WebSocket
                         ▼
        ┌──────────────────────────────────────────────┐
        │            Backend Application              │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
        │  │   API    │  │ Business │  │   Data   │   │
        │  │ Layer    │  │ Services │  │  Access  │   │
        │  └──────────┘  └──────────┘  └──────────┘   │
        └──────────────────────────────────────────────┘
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐   ┌──────────┐    ┌──────────┐
        │   Auth   │   │ External │    │ Database │
        │  Service │   │ Integr.   │    │(Primary) │
        └──────────┘   └──────────┘    └──────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                        ┌──────────┐   ┌──────────┐   ┌──────────┐
                        │  Cache   │   │   File   │   │ Services │
                        │ (Redis)  │   │ Storage  │   │ External │
                        └──────────┘   └──────────┘   └──────────┘
\`\`\`

### 数据流图

\`\`\`
User Action  →  UI Component  →  Action/Reducer
                                         │
                                         ▼
                                 API Client Call
                                         │
                                         ▼
                              ┌────────────────────┐
                              │   Backend API      │
                              │  (Controller)      │
                              └────────────────────┘
                                         │
                              ┌──────────┴──────────┐
                              ▼                     ▼
                       ┌─────────────┐      ┌─────────────┐
                       │    Auth     │      │   Service   │
                       │ Middleware  │      │   Layer     │
                       └─────────────┘      └─────────────┘
                                                 │
                                                 ▼
                                         ┌──────────────┐
                                         │ Repository   │
                                         │ (Data Access)│
                                         └──────────────┘
                                                 │
                                                 ▼
                                         ┌──────────────┐
                                         │   Database   │
                                         └──────────────┘
\`\`\`

### 部署架构图

\`\`\`
                   ┌──────────────────────┐
                   │    DNS / Load       │
                   │      Balancer       │
                   └──────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
        │  App Node 1 │  │  App Node 2 │  │  App Node N │
        └─────────────┘  └─────────────┘  └─────────────┘
                │               │               │
                └───────────────┴───────────────┘
                                │
                   ┌────────────┬────────────┐
                   ▼            ▼            ▼
            ┌─────────┐  ┌─────────┐  ┌─────────┐
            │Primary DB│  │  Cache  │  │   CDN   │
            │(PostgreSQL)│  │ (Redis) │  │  Assets │
            └─────────┘  └─────────┘  └─────────┘
\`\`\`
```

### 6. Handoff Checklist
"**✅ 交接清单**

确保所有必要的信息已准备好移交给开发团队："

Create comprehensive handoff checklist:

```markdown
## 交接清单

### 文档完整性
- [ ] 架构总览文档
- [ ] 技术选型报告
- [ ] 系统架构图
- [ ] 数据库Schema设计
- [ ] API接口文档
- [ ] 开发环境配置指南
- [ ] 实施路线图
- [ ] 安全策略文档
- [ ] 性能优化指南
- [ ] 监控和日志方案

### 技术资产
- [ ] 数据库迁移脚本
- [ ] 环境变量模板 (.env.example)
- [ ] API规范 (OpenAPI/Swagger)
- [ ] 前端组件文档
- [ ] 后端服务文档
- [ ] CI/CD配置文件
- [ ] Docker配置 (如适用)

### 开发资源
- [ ] 代码仓库访问权限
- [ ] 依赖库列表和版本
- [ ] 第三方服务凭证
- [ ] 数据库访问凭证
- [ ] 部署环境访问
- [ ] 监控系统访问
- [ ] 问题追踪系统

### 知识转移
- [ ] 架构决策记录 (ADR)
- [ ] 关键设计原则
- [ ] 代码规范和约定
- [ ] 测试策略
- [ ] 故障排查指南
- [ ] 常见问题FAQ

### 人员交接
- [ ] 团队成员介绍和角色
- [ ] 联系方式和沟通渠道
- [ ] 会议安排和同步机制
- [ ] 代码审查流程
- [ ] 发布流程说明
```

### 7. Next Steps & Recommendations
"**🚀 后续行动和建议**

为团队提供明确的下一步建议："

```markdown
## 后续行动建议

### 立即行动 (本周)
1. **团队组建** - 招募或分配开发人员
2. **环境准备** - 设置开发环境和基础设施
3. **技术培训** - 团队学习新技术栈 (如需要)
4. **工具配置** - 配置CI/CD、监控等工具

### 短期目标 (1-4周)
1. **Sprint 1** - 基础设施搭建
2. **Sprint 2** - 认证系统
3. **Sprint 3** - 核心功能1
4. **Sprint 4** - 核心功能2

### 中期目标 (2-3月)
1. **MVP完成** - 所有核心功能实现
2. **测试覆盖** - 单元测试 > 80%, E2E测试关键路径
3. **性能优化** - 达到既定性能指标
4. **安全审计** - 通过安全审查

### 长期规划 (3-6月)
1. **1.0发布** - 正式发布产品
2. **用户反馈** - 收集和处理用户反馈
3. **功能迭代** - 基于反馈迭代功能
4. **架构演进** - 根据需要优化架构

### 风险和建议

#### 风险提示
1. **技术风险**: 新技术栈学习曲线
2. **时间风险**: 9周时间可能紧张
3. **资源风险**: 团队规模可能不足
4. **需求风险**: 需求可能变更

#### 建议
1. **定期同步**: 每周架构和产品同步会议
2. **增量交付**: 每2周展示可用的功能
3. **持续改进**: 定期回顾和改进开发流程
4. **文档维护**: 保持文档与代码同步更新

### 联系和支持
- 架构师: Atlas (可通过工作流系统)
- 产品负责人: [Product Owner]
- 技术负责人: [Tech Lead]
- 设计师: Luna (通过Design Sprint工作流)
```

## DOCUMENTATION:

Update output file `{outputFile}`:

Add section:
```markdown
## 8. 文档与交付

### 8.1 架构执行摘要
[Complete executive summary]

### 8.2 开发环境配置
[Complete environment setup guide]

### 8.3 实施路线图
[Implementation roadmap with phases]

### 8.4 架构图
[System architecture diagram]
[Data flow diagram]
[Deployment architecture diagram]

### 8.5 交接清单
[Comprehensive handoff checklist]

### 8.6 后续行动建议
[Immediate, short-term, long-term recommendations]

### 8.7 架构决策记录 (ADR) 总览
[Summarize key architectural decisions]

### 8.8 附录

#### 8.8.1 术语表
[Define technical terms and abbreviations]

#### 8.8.2 参考资料
[Links to documentation, tools, and references]

#### 8.8.3 联系信息
[Team contacts and support channels]
```

Update frontmatter:
```yaml
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 'complete'
architectureStatus: 'complete'
completedDate: '[current date]'
```

## WORKFLOW COMPLETION:

"**🎉 Tech Architecture工作流完成！**

我们成功完成了完整的技术架构设计流程：

**✅ 已完成内容**:
1. 初始化和需求分析
2. 技术栈选型
3. 系统架构设计
4. 数据模型设计
5. API接口定义
6. 安全与性能方案
7. 文档和交付准备

**📦 架构交付物**:
- 完整的技术架构文档
- 技术选型报告和ADR
- 系统架构图和数据流图
- 数据库Schema设计
- API接口规范文档
- 安全架构方案
- 性能优化指南
- 开发环境配置指南
- 实施路线图
- 交接清单

**🏗️ 核心架构亮点**:

1. **技术栈**: [Frontend] + [Backend] + [Database]
2. **架构模式**: [Chosen architecture pattern]
3. **安全特性**: [Security highlights]
4. **性能目标**: [Performance targets]
5. **可扩展性**: [Scalability design]

**🔧 技术决策摘要**:

[Summarize 3-5 key architectural decisions]

**📊 预估工作量**:
- MVP开发周期: [X] 周
- 团队规模建议: [X] 人
- 主要里程碑: [Key milestones]

**💡 实施建议**:

[Top 3-4 implementation recommendations]

**🔄 推荐后续工作流**:
1. MVP Implementation - 基于架构进行代码实现
2. Project Planning - 基于架构细化项目计划

**💾 保存位置**: `{outputFile}`
**📂 图表输出**: `{diagramOutputFile}`

感谢你与我一起设计坚实的技术架构！🏗️✨

作为技术架构师，我已经为你准备了完整的技术蓝图。开发团队现在可以基于这份文档开始实施，构建高质量、可扩展的MVP产品。

如有任何架构问题，随时可以回来咨询我！"

## CRITICAL FINAL NOTES:

Ensure all documentation sections are complete and comprehensive:
- All frontmatter fields properly updated
- All checklist items documented
- Architecture diagrams clearly described
- Implementation roadmap is actionable
- Handoff checklist is complete
- Next steps are clear and prioritized
- Contact information for support is provided
- The document is developer-ready and can be handed off directly
