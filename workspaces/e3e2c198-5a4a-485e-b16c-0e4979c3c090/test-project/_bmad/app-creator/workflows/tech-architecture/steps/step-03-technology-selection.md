---
name: 'step-03-technology-selection'
description: 'Select appropriate technology stack'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
---

# Step 3: Technology Selection

Evaluate and select the optimal technology stack based on requirements, constraints, and architectural drivers.

## DIALOGUE SECTIONS:

### 1. Technology Selection Framework
"**🛠️ 技术选型框架**

我将基于以下标准进行技术选型：
- 团队技能匹配度
- 社区生态和支持
- 开发效率和速度
- 性能和扩展性
- 成本效益
- 长期维护性"

### 2. Load Sidecar Knowledge Reference

Use `tech-stack-knowledge.md` as reference for available options:
- Frontend ecosystems (React, Vue, Mobile)
- Backend frameworks (Node.js, Python, Java)
- Database technologies
- Cloud platforms and infrastructure
- CI/CD and DevOps tools

### 3. Frontend Technology Selection
"**🎨 前端技术选型**

基于产品需求和设计规范，选择前端技术栈："

Evaluate and recommend:

#### Framework Selection
Compare options based on:
- **React**: Component-based, huge ecosystem, good for complex UIs
- **Vue**: Progressive, easy to learn, good for rapid development
- **Angular**: Opinionated, enterprise-ready, steeper learning curve
- **Next.js**: React-based with SSR/SSG, excellent for SEO

Consider:
- Team experience with each framework
- Available UI component libraries
- Build performance requirements
- SEO requirements (SSR vs CSR)

Recommend primary choice with rationale.

#### CSS Framework / Styling
Evaluate options:
- **Tailwind CSS**: Utility-first, highly customizable
- **Material-UI/Chakra**: Component libraries for React
- **Vuetify**: Component library for Vue
- **SCSS/CSS Modules**: Traditional styling approaches

#### State Management
Determine if complex state management needed:
- **Context API/Zustand**: For React, lightweight solutions
- **Redux Toolkit**: For complex state in React
- **Pinia**: For Vue 3
- **Simple state**: If no complex state needed

#### Mobile Considerations
If mobile required:
- **React Native**: Cross-platform with React
- **Flutter**: High-performance cross-platform
- **PWA**: Progressive Web App for mobile web
- **Native Development**: Best performance, more costly

### 4. Backend Technology Selection
"**⚙️ 后端技术选型**

选择后端技术框架："

Evaluate and recommend:

#### Server Framework
Compare options:
- **Node.js (Express/Fastify/NestJS)**: Fast, JavaScript everywhere, good for real-time
- **Python (FastAPI/Django/Flask)**: Rapid development, great for data-heavy apps
- **Java (Spring Boot)**: Enterprise-grade, robust, type-safe
- **Go**: Excellent performance, compiled, modern syntax

Recommend based on:
- Team backend skills
- Real-time requirements
- Data processing needs
- Performance requirements
- Development speed needs

#### API Design
Choose API style:
- **REST**: Established, simple, widely supported
- **GraphQL**: Flexible, efficient data fetching, more complex
- **gRPC**: High performance, requires specific tools

### 5. Database Selection
"**💾 数据库选择**

选择数据库解决方案："

Evaluate and recommend:

#### Primary Database
Compare options:
- **PostgreSQL**: Advanced features, reliable, great for structured data
- **MySQL**: Popular, mature, good for read-heavy workloads
- **MongoDB**: Flexible schema, good for rapidly changing data
- **SQLite**: Lightweight, no server needed, good for MVP

Consider:
- Data structure requirements
- Query complexity
- ACID transaction requirements
- Scaling requirements

#### Cache/Session Storage
If needed:
- **Redis**: Fast in-memory caching, pub/sub capabilities
- **Memcached**: Simple caching solution

#### Considerations
- Need for full-text search (Elasticsearch)
- Need for analytics (time-series databases)
- Need for multiple database types

### 6. Infrastructure & Deployment
"**☁️ 基础设施和部署**

选择云平台和部署方案："

Evaluate options:

#### Cloud Platform
- **Vercel/Netlify**: Excellent for frontend, great DX
- **Railway/Render**: Simple backend deployment
- **AWS/GCP/Azure**: Full-featured, more complex
- **VPS / DigitalOcean**: Cost-effective, more manual

#### Containerization
- **Docker**: Recommended for consistency
- **Kubernetes**: Only for complex deployments

#### CI/CD
- **GitHub Actions**: Integrated with Git
- **GitLab CI**: Integrated with GitLab
- **Other Jenkins/Travis**: Alternative options

### 7. Third-Party Services
"**🔌 第三方服务**

评估是否需要集成外部服务："

Consider:
- **Authentication**: Auth0, Supabase Auth, Firebase Auth, or custom
- **File Storage**: AWS S3, Cloudinary, Firebase Storage
- **Email**: SendGrid, Mailgun, AWS SES
- **Monitoring**: Sentry, LogRocket, New Relic
- **Analytics**: Google Analytics, Mixpanel, Amplitude

### 8. Technology Selection Summary
"**📋 技术选型总结**

这是推荐的技术栈："

Create a clear summary with technology selection table:

```
Frontend:
- Framework: [Selected framework + version]
- Styling: [CSS framework]
- State Management: [If needed]
- Build Tool: [Vite/Webpack/Next.js built-in]

Backend:
- Runtime: [Node.js/Python/Java]
- Framework: [Selected framework]
- API Style: [REST/GraphQL]

Database:
- Primary: [Selected database]
- Cache: [If needed]

Infrastructure:
- Hosting: [Platform]
- Container: [Docker/None]
- CI/CD: [Selected tool]

Third-party:
- Auth: [Service or custom]
- Storage: [Service or self-hosted]
- Monitoring: [Selected tools]
```

## DOCUMENTATION:

Update output file `{outputFile}`:

Add section:
```markdown
## 3. 技术选型

### 3.1 前端技术栈
#### 框架选择
[Chosen framework with rationale]

#### 样式方案
[CSS framework or styling approach]

#### 状态管理
[State management solution if needed]

#### 移动端方案
[Mobile approach if applicable]

### 3.2 后端技术栈
#### 服务框架
[Chosen backend framework with rationale]

#### API设计
[REST/GraphQL choice]

### 3.3 数据库
#### 主数据库
[Database selection with rationale]

#### 缓存方案
[Cache solution if needed]

### 3.4 基础设施部署
#### 云平台
[Hosting platform choice]

#### 容器化
[Containerization approach]

#### CI/CD
[CI/CD solution]

### 3.5 第三方服务
[Auth, Storage, Monitoring selection]

### 3.6 技术栈总览
[Summary table of all selected technologies]

### 3.7 选型决策记录 (ADR)
1. **[Decision 1]**: [Context, Decision, Consequences]
2. **[Decision 2]**: [Context, Decision, Consequences]
...
```

Update frontmatter:
```yaml
techStack: '[primary tech stack summary]'
stepsCompleted: [1, 2, 3]
lastStep: 'technology-selection'
```

## NEXT:

"**✅ 技术选型完成**

我们已基于需求和约束选择了最优的技术栈组合。

**🎯 技术栈概览**:
- 前端: `[前端技术]`
- 后端: `[后端技术]`
- 数据库: `[数据库]`
- 部署: `[部署方案]`

**下一步**: 架构设计 - 我们将基于选定的技术栈设计系统整体架构。"

## CRITICAL NOTES:

- Always reference `tech-stack-knowledge.md` sidecar for detailed options
- Document architecture decision records (ADRs) for each major choice
- Consider long-term maintainability, not just current needs
- Align selections with team skills and learning objectives
- Be realistic about what can be built in MVP timeframe
- Provide clear rationale for each decision
