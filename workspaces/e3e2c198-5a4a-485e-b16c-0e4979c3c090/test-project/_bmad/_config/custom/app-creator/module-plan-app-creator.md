---
stepsCompleted: ["step-01-init", "step-02-concept", "step-03-components", "step-04-structure", "step-05-config"]
createdBy: Archersado
createdDate: "2025-01-07"
moduleName: app-creator
inputDocuments: []
---

# Module Plan: app-creator

## Module Concept

**Module Name:** MVP App Creator
**Module Code:** app-creator
**Category:** Business/创业
**Type:** Complex Module

**Purpose Statement:**

为独立开发者、创作者和创业者提供端到端MVP应用构建解决方案，从初始想法系统性地指导到可验证产品的完整实现，包含完整的产品开发过程文档和代码交付物。

**Target Audience:**

- Primary: 独立开发者/创作者，具备基础技术理解但需要结构化产品开发流程
- Secondary: 产品经理、初创企业创始人

**Scope Definition:**

**In Scope:**

- 想法到产品的推演和初步验证流程
- 市场调研分析和调研报告PPT制作
- 项目计划书生成（基于市场调研结果）
- 产品需求文档(PRD)和图表创建
- UX/UI交互设计指导和输出
- 技术架构设计和文档
- MVP代码实现指导
- 市场验证策略

**Out of Scope:**

- 完整产品的生产级开发（仅MVP）
- 复杂企业级架构（专注轻量级解决方案）
- 详细的市场营销执行（仅验证策略）

**Success Criteria:**

- 用户获得专业的市场调研报告和PPT
- 基于数据驱动的项目决策依据
- 完整的产品开发文档链条
- 从想法到MVP的系统性交付物
- 具备融资路演所需的核心材料

## Component Architecture

### Agents (5 planned)

1. **Product Strategist (产品策略师)** - 主协调者和流程指导
   - Type: Primary
   - Role: 协调整个MVP构建流程，从想法验证到最终交付的全程指导，整合各个专业领域的输出

2. **Market Research Analyst (市场调研分析师)** - 市场洞察专家
   - Type: Specialist
   - Role: 专注市场调研和竞品分析，生成专业的调研报告和PPT，提供数据驱动的市场洞察

3. **Business Analyst (业务分析师)** - 业务需求专家
   - Type: Specialist
   - Role: 项目计划书和PRD文档生成，业务需求分析和规格定义，验证策略制定

4. **UX/UI Designer (用户体验设计师)** - 设计体验专家
   - Type: Specialist
   - Role: 用户体验设计和界面规划，交互设计稿和设计系统，以用户为中心的设计思维

5. **Technical Architect (技术架构师)** - 技术实现专家
   - Type: Specialist
   - Role: 技术选型和系统架构设计，MVP代码实现指导，可扩展的技术方案

### Workflows (9 planned)

1. **MVP Builder Master** - 端到端MVP构建主工作流
   - Type: Interactive
   - Primary user: 所有用户类型
   - Key output: 完整的MVP交付物集合

2. **Idea Validation** - 想法验证和概念整理
   - Type: Interactive
   - Primary user: 创业者和产品创新者
   - Key output: 验证后的产品概念文档

3. **Market Research** - 市场调研和分析
   - Type: Document
   - Primary user: 需要市场洞察的用户
   - Key output: 市场调研报告PPT

4. **Project Planning** - 项目计划书生成
   - Type: Document
   - Primary user: 项目管理者和创业者
   - Key output: 详细项目计划书

5. **Product Definition** - 产品需求定义
   - Type: Document
   - Primary user: 产品管理者
   - Key output: 产品PRD和需求图表

6. **Design Sprint** - UX/UI设计工作流
   - Type: Action
   - Primary user: 设计关注者
   - Key output: 交互设计稿和设计系统

7. **Tech Architecture** - 技术架构设计
   - Type: Document
   - Primary user: 技术负责人
   - Key output: 技术架构文档和架构图

8. **MVP Implementation** - MVP代码实现指导
   - Type: Action
   - Primary user: 开发者
   - Key output: MVP代码和实现指南

9. **Validation Strategy** - 市场验证策略
   - Type: Document
   - Primary user: 商业验证者
   - Key output: 市场验证计划和策略

### Tasks (4 planned)

1. **Format Validator** - 验证文档格式和完整性
   - Used by: 所有文档生成工作流

2. **Progress Tracker** - 检查MVP构建进度状态
   - Used by: MVP Builder Master工作流

3. **Template Generator** - 快速生成标准模板
   - Used by: 所有文档工作流

4. **Export Helper** - 导出不同格式的交付物
   - Used by: 所有工作流

### Component Integration

- **Agents collaborate via**: Product Strategist作为主协调者调用其他专业代理；Market Research Analyst将调研结果传递给Business Analyst；Technical Architect与UX/UI Designer协调技术可行性与设计
- **Workflow dependencies**: Idea Validation → Market Research → Project Planning → Product Definition，Design Sprint和Tech Architecture可并行进行，最后汇聚到MVP Implementation
- **Task usage patterns**: 所有工作流使用验证和格式化任务；主工作流调用进度追踪任务；文档工作流使用模板生成和导出任务

### Development Priority

**Phase 1 (MVP):**

- Agents: Product Strategist, Market Research Analyst, Business Analyst
- Workflows: MVP Builder Master, Market Research, Project Planning, Product Definition
- Tasks: Format Validator, Progress Tracker

**Phase 2 (Enhancement):**

- Agents: UX/UI Designer, Technical Architect
- Workflows: Idea Validation, Design Sprint, Tech Architecture, MVP Implementation, Validation Strategy
- Tasks: Template Generator, Export Helper

## Configuration Planning

### Required Configuration Fields

1. **mvp_output_path**
   - Type: INTERACTIVE
   - Purpose: 控制MVP项目输出保存位置
   - Default: `_app_creator_output`
   - Input Type: text
   - Prompt: "请指定MVP项目输出保存路径 (相对于当前目录):"

2. **document_format**
   - Type: INTERACTIVE
   - Purpose: 控制文档输出格式
   - Default: `MD`
   - Input Type: single-select
   - Prompt: "选择文档输出格式:"

3. **experience_level**
   - Type: INTERACTIVE
   - Purpose: 调整指导详细程度和术语使用
   - Default: `intermediate`
   - Input Type: single-select
   - Prompt: "你的产品开发经验水平:"

4. **industry_focus**
   - Type: INTERACTIVE
   - Purpose: 定制行业特定的模板和建议
   - Default: `SaaS`
   - Input Type: single-select
   - Prompt: "你的主要行业焦点:"

5. **team_size**
   - Type: INTERACTIVE
   - Purpose: 调整工作流和资源分配建议
   - Default: `Solo`
   - Input Type: single-select
   - Prompt: "你的团队规模:"

6. **ai_service_api_key**
   - Type: INTERACTIVE
   - Purpose: 启用AI驱动的设计和代码生成功能
   - Default: `""`
   - Input Type: text
   - Prompt: "AI服务API密钥 (可选，用于增强设计/代码生成):"

7. **market_research_sources**
   - Type: INTERACTIVE
   - Purpose: 定制市场调研数据来源
   - Default: `web_research`
   - Input Type: single-select
   - Prompt: "偏好的市场调研数据源:"

8. **include_design_assets**
   - Type: INTERACTIVE
   - Purpose: 控制是否生成详细的设计资产
   - Default: `true`
   - Input Type: single-select
   - Prompt: "是否生成设计资产 (UI原型、图标等):"

9. **code_generation_level**
   - Type: INTERACTIVE
   - Purpose: 控制代码生成的深度
   - Default: `framework`
   - Input Type: single-select
   - Prompt: "代码生成深度:"

10. **presentation_style**
    - Type: INTERACTIVE
    - Purpose: 定制PPT演示的视觉风格
    - Default: `business`
    - Input Type: single-select
    - Prompt: "PPT演示风格偏好:"

### Installation Questions Flow

1. 输出路径配置
2. 文档格式选择
3. 经验水平设置
4. 行业焦点选择
5. 团队规模确认
6. AI服务配置(可选)
7. 市场调研偏好
8. 设计资产选项
9. 代码生成级别
10. 演示风格选择

### Result Configuration Structure

The module.yaml will generate:
- Module configuration at: _bmad/app-creator/config.yaml
- User settings stored as: 键值对格式，支持模板变量替换
- Output path resolved to: {project-root}/{mvp_output_path}

## Module Structure

**Module Type:** Complex
**Location:** /Users/archersado/workspace/neural-nexus/cc-workflow/_bmad-output/bmb-creations/app-creator

**Directory Structure Created:**
- ✅ agents/
- ✅ workflows/ (with 9 subdirectories for each workflow)
- ✅ tasks/
- ✅ templates/
- ✅ data/
- ✅ _module-installer/
- ✅ README.md (placeholder)

**Rationale for Type:**
This is classified as a Complex Module due to having 5 specialized agents, 9 comprehensive workflows, and 4 supporting tasks. The module involves complex interdependencies between market research, business analysis, design, and technical architecture components, requiring sophisticated coordination between multiple domain experts to deliver end-to-end MVP creation capabilities.

## 遗留参考

本模块计划基于BMAD框架的模块创建最佳实践，将采用工作流驱动的方法来确保系统性和可重复性的MVP开发过程。