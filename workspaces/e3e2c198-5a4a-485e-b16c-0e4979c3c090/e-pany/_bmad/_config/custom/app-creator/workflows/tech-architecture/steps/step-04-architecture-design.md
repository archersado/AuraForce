---
name: 'step-04-architecture-design'
description: 'Design overall system architecture'

# Path Definitions
workflow_path: '{bmad_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
---

# Step 4: Architecture Design

Design the overall system architecture, including module decomposition, data flow, and communication patterns.

## DIALOGUE SECTIONS:

### 1. Architecture Overview
"**🏗️ 系统架构设计**

我将基于技术选型设计整体系统架构，包括模块划分、职责定义和交互方式。"

### 2. Load Architecture Patterns Reference

Use `architecture-patterns.md` sidecar for:
- Architectural pattern options
- Design principles
- MVP architecture recommendations
- Security, performance, and scalability patterns

### 3. Architecture Style Selection
"**📐 架构风格选择**

基于MVP需求和团队规模，选择合适的架构风格："

Evaluate and recommend:

#### Options for MVP
1. **Monolithic Architecture** (Recommended for MVP)
   - Single application containing all functionality
   - Simple to develop, test, and deploy
   - Good for small teams and rapid iteration
   - Can refactor to microservices later

2. **Layered Architecture**
   - Clear separation of concerns (View, Logic, Data)
   - Easy to understand and maintain
   - Well-established pattern
   - Good balance of structure and simplicity

3. **Component-Based Monolith**
   - Modular structure within single application
   - Clear component boundaries
   - Enables future service extraction
   - Best for growing applications

Recommend and justify choice for this project.

### 4. Module Decomposition
"**🧩 模块划分**

将系统分解为清晰的模块："

Design module structure based on:
- Business domains (Bounded Contexts)
- Functional requirements
- Separation of concerns
- Reusability

#### Frontend Modules
Define component/module structure:
- **Core Layout**: Shell, navigation, routing
- **Feature Modules**: UI components per business feature
- **Shared Components**: Reusable UI components
- **State Management**: Redux/Zustand stores if needed
- **API Layer**: API client, data fetching logic

#### Backend Modules
Define service/function structure:
- **API Layer**: Controllers, request/response handling
- **Business Logic**: Domain logic, services
- **Data Access**: Database queries, repositories
- **Common**: Utilities, helpers, middleware
- **External Integrations**: Third-party service clients

### 5. System Architecture Diagram
"**🎨 系统架构图**

让我描述系统整体架构："

Create detailed architecture description:

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Browser    │  │  Mobile App  │  │  External    │ │
│  │  (React/Vue) │  │  (optional)  │  │  Systems     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Frontend Application                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │     UI       │  │   State      │  │    API       │ │
│  │ Components   │  │  Management  │  │   Client     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │ HTTP/HTTPS/WebSocket
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend Application                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   API Layer  │  │   Business   │  │    Data      │ │
│  │  (Controllers)│  │   Services   │  │    Access    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐         ┌──────────────┐              │
│  │   Auth       │         │  External    │              │
│  │  Module      │         │ Integrations │              │
│  └──────────────┘         └──────────────┘              │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Primary   │  │     Cache    │  │    File      │
│   Database   │  │   (Redis)    │  │   Storage    │
│  (PostgreSQL)│  │              │  │   (S3/CDN)   │
└──────────────┘  └──────────────┘  └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Services   │
                    │ (Auth, Email │
                    │   Storage)   │
                    └──────────────┘
```

### 6. Component Responsibilities
"**📋 组件职责定义**

明确定义每个核心模块的职责："

Document each major component:

#### Frontend Components
- **Shell Component**: Application layout, navigation
- **Auth Module**: Login, registration, session management
- **[Feature Module]**: Specific feature UI and logic
- **API Client**: HTTP requests, error handling, caching

#### Backend Components
- **API Controllers**: Request validation, response formatting
- **Business Services**: Domain logic, business rules
- **Data Access Layer**: Database queries, ORM operations
- **Authentication Service**: User auth, token management
- **Validation Middleware**: Input validation, sanitization

### 7. Data Flow Design
"**🔄 数据流设计**

规划系统内的数据流转："

Design data flows for key scenarios:

#### User Login Flow
1. User enters credentials → Frontend
2. Frontend calls `/api/auth/login` → Backend
3. Backend validates credentials → Database
4. Backend generates JWT token → Database (optional)
5. Backend returns token → Frontend
6. Frontend stores token → LocalStorage/Cookie
7. Frontend includes token in headers → API calls

#### Data Fetching Flow
1. User triggers action → Frontend component
2. Component dispatches action → State management
3. State management calls API service → API client
4. API client makes HTTP request → Backend
5. Backend processes request → Business service
6. Business service queries data → Database
7. Database returns data → Business service
8. Backend formats response → Frontend
9. Frontend updates state → UI re-renders

### 8. Communication Patterns
"**📡 通信模式**

定义组件间的通信方式："

Specify:
- **Frontend-Back-end**: REST API, WebSocket if needed for real-time
- **Intra-backend**: Direct function calls (monolith) or service communication
- **External Services**: HTTP/REST calls to third-party APIs
- **Client-Server**: State synchronization, optimistic updates

### 9. Error Handling Strategy
"**⚠️ 错误处理策略**

设计全面的错误处理机制："

Define error handling:
- **Client Errors**: Validation errors, user feedback
- **API Errors**: HTTP status codes, error responses
- **Server Errors**: Try-catch blocks, error logging
- **Network Errors**: Retries, timeouts, offline handling
- **Data Errors**: Validation, constraint violations

## DOCUMENTATION:

Update output file `{outputFile}`:

Add section:
```markdown
## 4. 系统架构设计

### 4.1 架构风格
[Chosen architecture style with rationale]

### 4.2 模块划分

#### 前端模块
[Frontend module structure]

#### 后端模块
[Backend module structure]

### 4.3 系统架构图

[Architecture diagram description]

### 4.4 组件职责
[Detailed responsibilities for each component]

### 4.5 数据流设计

#### 关键场景数据流
[Data flow descriptions for key scenarios]

### 4.6 通信模式
[Communication patterns between components]

### 4.7 错误处理策略
[Comprehensive error handling approach]
```

Update frontmatter:
```yaml
stepsCompleted: [1, 2, 3, 4]
lastStep: 'architecture-design'
```

## NEXT:

"**✅ 系统架构设计完成**

我们设计了清晰的模块结构和职责分工。

**📋 架构亮点**:
- 架构风格: `[selected style]`
- 模块数: `[X] 前端模块, [Y] 后端模块`
- 通信方式: `[defined patterns]`

**下一步**: 数据模型设计 - 我们将设计数据库Schema和数据实体关系。"

## CRITICAL NOTES:

- Use `architecture-patterns.md` for proven patterns and principles
- Keep architecture simple for MVP, but design extension points
- Ensure clear separation of concerns
- Design for testability
- Document architectural decisions for future reference
- Consider how architecture can evolve from MVP to production
- Use sidecar knowledge for best practices
