---
name: 'step-02-requirements-analysis'
description: 'Analyze technical requirements and constraints'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
---

# Step 2: Requirements Analysis

Analyze technical requirements, constraints, and quality attributes from product requirements and design specifications.

## DIALOGUE SECTIONS:

### 1. Review Input Documents
"**📄 文档审查**

让我分析提供的产品需求和设计文档，提取技术相关信息..."

Review the PRD and design documents to identify:
- Core functional requirements
- User interaction patterns
- Data flow requirements
- System dependencies

### 2. Functional Requirements Analysis
"**🔧 功能性需求分析**

基于PRD，识别关键技术需求："

Create comprehensive functional requirements list:
- **Core Business Logic**: Essential business rules and logic
- **User Management**: Authentication, authorization, profiles
- **Data Operations**: CRUD operations, data validation
- **Integration Requirements**: External APIs, third-party services
- **Content Handling**: Upload, storage, serving files/media
- **Communication Features**: Messaging, notifications, real-time updates

### 3. Non-Functional Requirements
"**⚡ 非功能性需求**

这些是影响系统架构的核心质量属性："

Define and document each non-functional requirement:

#### Performance Requirements
- **Response Time**: API response targets (e.g., <200ms for most operations)
- **Throughput**: Concurrent user capacity (e.g., handle 1000+ concurrent users)
- **Scalability**: Horizontal/vertical scaling requirements
- **Resource Usage**: Memory, CPU, storage limits

#### Security Requirements
- **Authentication**: Required auth mechanisms (JWT, OAuth, session-based)
- **Authorization**: Access control levels (RBAC, ABAC)
- **Data Protection**: Encryption at rest and in transit
- **Compliance**: Regulatory requirements (GDPR, HIPAA, etc.)
- **Audit**: Logging and monitoring requirements

#### Reliability Requirements
- **Availability**: uptime targets (e.g., 99.9% uptime)
- **Failure Handling**: Error recovery mechanisms
- **Data Consistency**: Transaction requirements
- **Backup Strategy**: Backup frequency, recovery time

#### Usability Requirements
- **Browser Support**: Target browsers and versions
- **Mobile Support**: Responsive vs native app requirements
- **Accessibility**: WCAG compliance level
- **Internationalization**: Multi-language support

#### Maintainability Requirements
- **Code Quality**: Coding standards, documentation requirements
- **Testing Coverage**: Unit, integration, E2E test expectations
- **Deployment**: CI/CD requirements
- **Monitoring**: Logging, metrics, alerting needs

### 4. Technical Constraints
"**🔒 技术约束**

识别和记录技术限制条件："

Document constraints:
- **Budget Constraints**: Infrastructure costs, licensing fees
- **Timeline Constraints**: Development deadlines, phased delivery
- **Team Constraints**: Team size, skills, availability
- **Technology Constraints**: Existing tech stack, integration requirements
- **Regulatory Constraints**: Legal, compliance, industry requirements
- **Infrastructure Constraints**: Existing infrastructure, hosting restrictions

### 5. Architectural Drivers
"**🎯 架构驱动因素**

这些因素将主导架构设计决策："

Identify and prioritize architectural drivers:
1. **Cost Efficiency**: Minimize development and operational costs
2. **Time to Market**: Speed of development and deployment
3. **Scalability**: Support future growth
4. **Performance**: Meet performance requirements
5. **Security**: Ensure data and system security
6. **Maintainability**: Long-term code maintainability

### 6. MVP Scoping for Architecture
"**📦 MVP技术范围**

基于需求分析，确定MVP的技术范围："

Define MVP technical scope:
- **In Scope for MVP**: Core features to implement
- **Out of Scope for MVP**: Deferred technical features
- **Technical Debt Acceptable**: Areas where shortcuts are acceptable for MVP
- **Extension Points**: Where to build flexibility for future features

## DOCUMENTATION:

Update output file `{outputFile}` with complete requirements analysis:

Add section:
```markdown
## 2. 需求分析

### 2.1 功能性需求
[Documented functional requirements]

### 2.2 非功能性需求

#### 性能需求
[Performance requirements]

#### 安全需求
[Security requirements]

#### 可靠性需求
[Reliability requirements]

#### 可用性需求
[Usability requirements]

#### 可维护性需求
[Maintainability requirements]

### 2.3 技术约束
[Documented constraints]

### 2.4 架构驱动因素
[Architectural drivers prioritized]

### 2.5 MVP技术范围
- **包含范围**: [Core features]
- **排除范围**: [Deferred features]
- **可接受的技术债务**: [Areas accepting shortcuts]
- **扩展点**: [Flexibility points]
```

Update frontmatter:
```yaml
stepsCompleted: [1, 2]
lastStep: 'requirements-analysis'
```

## NEXT:

"**✅ 需求分析完成**

我们已识别并记录了所有关键的技术需求和约束。

**📊 需求摘要**:
- 功能性需求: X 项
- 非功能性需求: X 项
- 技术约束: X 项
- MVP范围已明确

**下一步**: 技术选型 - 基于这些需求，我们将选择最适合的技术栈。"

## CRITICAL NOTES:

- Use sidecar knowledge (`tech-stack-knowledge.md`) for tech considerations
- Prioritize requirements based on MVP scope
- Document assumptions and decisions for architectural decisions later
- Ensure requirements are testable and measurable
- Reference architecture patterns from sidecar when applicable
