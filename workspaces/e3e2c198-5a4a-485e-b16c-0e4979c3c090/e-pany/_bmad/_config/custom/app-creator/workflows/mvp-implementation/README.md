# MVP Implementation Workflow

## 工作流概述

MVP Implementation工作流由Atlas主导，基于技术架构设计文档，引导开发团队构建完整的MVP产品。这个工作流提供具体的代码实现指导、项目结构搭建和最佳实践。

## 主导代理

**Atlas (Technical Architect)** 💻
- 全栈开发专家，精通前后端实现
- 提供代码级的技术指导和最佳实践
- 确保代码质量和可维护性

## 工作流目标

- 搭建完整的项目结构
- 实现核心功能模块
- 设置开发环境和工具链
- 编写高质量、可维护的代码
- 建立测试基础
- 配置部署流程

## 工作流步骤

### 1. 初始化项目结构 (Project Setup)
- 创建前端项目结构
- 创建后端项目结构
- 配置开发和构建工具
- 设置代码规范和linting

### 2. 数据库实现 (Database Implementation)
- 设置数据库连接
- 创建数据库迁移
- 实现Repository层
- 配置数据库索引和约束

### 3. 实现认证系统 (Authentication)
- 用户注册功能
- 用户登录功能
- JWT token生成和验证
- 中间件和路由保护

### 4. 服务层实现 (Service Layer)
- Business logic实现
- Data validation
- Error handling
- External service integrations

### 5. API实现 (API Implementation)
- RESTful API controllers
- Request validation middleware
- Response formatting
- Error handling middleware

### 6. 前端实现 (Frontend Implementation)
- UI组件结构
- State management
- API client implementation
- Routing configuration

### 7. 测试设置 (Testing Setup)
- 单元测试配置
- 集成测试示例
- E2E测试框架
- Test utilities

### 8. 部署配置 (Deployment Configuration)
- 环境配置
- Docker配置
- CI/CD pipeline
- Production optimization

## 输入要求

- **技术架构文档** - 来自Tech Architecture工作流
- **API规范** - 完整的API端点定义
- **数据库Schema** - 数据库表结构设计
- **代码生成级别** - 概念级/基础级/实现级

## 输出交付物

### 代码实现
1. **项目结构**
   - 前端项目初始化
   - 后端项目初始化
   - 配置文件
   - .gitignore设置

2. **Backend代码**
   - Database connection setup
   - Migration scripts
   - Repository implementations
   - Service layer
   - API controllers
   - Middleware
   - Error handlers

3. **Frontend代码**
   - Component structure
   - State management
   - API client
   - Routing
   - UI components

### 配置文件
1. **开发配置**
   - ESLint配置
   - Prettier配置
   - TypeScript配置
   - 环境变量模板

2. **部署配置**
   - Docker compose
   - CI/CD config
   - Production environment variables
   - Build scripts

### 测试
1. **测试配置**
   - Jest/Vitest配置
   - Testing utilities
   - Mock setup
   - Test examples

## 代码生成级别

### 概念级 (Conceptual Level)
- 伪代码和算法描述
- 函数签名和接口定义
- 实现思路和模式说明
- 不提供完整实现代码

适合：
- 学习目的
- 自定义实现
- 特殊技术栈

### 基础级 (Basic Level)
- 核心函数实现
- 基本组件代码
- 标准模式示例
- 注释详细，解释原理

适合：
- 团队有经验
- 需要灵活性
- 学习最佳实践

### 实现级 (Implementational Level)
- 完整可运行的代码
- 包含错误处理
- 生产环境就绪
- 完整的测试用例

适合：
- 快速原型
- 团队技能不足
- 时间紧张的MVP

## 支持的技术栈

### 前端
- React + TypeScript
- Vue 3 + TypeScript
- Next.js
- 其他现代框架

### 后端
- Node.js (Express/Fastify/NestJS)
- Python (FastAPI/Django)
- Java (Spring Boot)

### 数据库
- PostgreSQL
- MongoDB
- MySQL

## 工作流特性

### 支持的功能
- ✅ 暂停和继续
- ✅ 自动保存进度
- ✅ 分步代码生成
- ✅ 多语言支持
- ✅ 代码片段库
- ✅ 最佳实践参考

### Code Snippets库

位于 `code-snippets/` 目录，包含:
- 认证实现代码
- API模式代码
- 数据库连接代码
- 前端组件代码
- 测试辅助代码
- 通用工具函数

## 与其他工作流的协作

### 前置工作流
- **Tech Architecture** (Atlas) - 提供技术架构设计
- **Design Sprint** (Luna) - 提供UI组件需求

### 协作代理
- **Luna** - 确认UI组件实现细节
- **Alex** - 澄清业务逻辑

### 后续工作流
- **Project Planning** - 基于实现评估工作量
- **Testing Strategy** - 完善测试策略

## 使用指南

### 开始工作流
在工作流菜单中选择 `MI` (MVP Implementation)

### 代码输出位置
默认输出到: `{output_folder}/mvp-implementation-{project_name}/`

### 查看进度
在输出文件的frontmatter中查看进度

## 质量保证

### 代码质量检查清单
参见 `validation/code-quality-checklist.md`
- ✓ 代码规范遵循
- ✓ 类型安全
- ✓ 错误处理全面
- ✓ 测试覆盖
- ✓ 文档完整

### 最佳实践
- SOLID原则
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)

## 常见问题

**Q: 我需要什么编程经验？**
A: 需要基础的编程知识。实现级代码可以直接使用，其他级别需要根据情况调整。

**Q: 代码可以直接使用吗？**
A: 实现级代码可以直接使用。基础级可能需要根据你的需求做调整。概念级需要自己实现。

**Q: 如何选择代码生成级别？**
A:
- 新手团队 → 实现级
- 有经验的团队 → 基础级
- 学习目的 → 概念级

**Q: 支持哪些框架？**
A: 主要支持React、Vue、Next.js、Node.js、Python。其他框架可以参考模式进行适配。

**Q: 如何处理特殊需求？**
A: 在工作流过程中可以提出特殊需求，我会提供定制化的代码方案。

## 状态

✅ **实现完成** - 所有步骤、模板、代码片段已创建

---

**创建日期**: 2024-01-07
**最后更新**: 2024-01-07
**版本**: 1.0.0
