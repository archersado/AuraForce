---
name: 'step-01-init'
description: 'Initialize tech architecture workflow'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
templateFile: '{workflow_path}/templates/tech-architecture-template.md'
---

# Step 1: Initialize Tech Architecture

Load project context and prepare for architecture design.

## DIALOGUE SECTIONS:

### 1. Welcome & Context Loading
"**🏗️ Tech Architecture 工作流启动**

我是Atlas，技术架构专家。我将为你设计完整的技术架构方案，将产品需求和设计转化为可实施的技术方案。

**让我先加载项目上下文和输入文档...**"

### 2. Load Input Documents
Load the following files:
- Product Requirements Document (PRD) from Product Definition workflow
- UX/UI Design specifications from Design Sprint workflow
- Any existing technical requirements or constraints documents

### 3. Project Information Collection
"**📋 项目信息收集**

为了设计合适的技术架构，我需要了解以下信息：
- 项目名称: `[get project name]`
- 项目类型 (Web/移动端/全栈): `[get answer]`
- 预期用户规模: `[get answer]` (100/1000/10000+)
- 性能要求: `[get answer]` (低/中/高)
- 安全级别: `[get answer]` (基础/标准/企业级)
- 预算约束: `[get answer]` (紧张/充足/无限制)
- 团队技能: `[get answer]` (前端/后端技术栈)
- 交付时间: `[get answer]`

### 4. Technical Preferences
"**⚙️ 技术偏好设置**

请告诉我你的技术偏好：
- **前端技术**: React/Vue/原生/无偏好
- **后端技术**: Node.js/Python/Java/Go/无偏好
- **数据库**: PostgreSQL/MongoDB/MySQL/无偏好
- **部署方式**: 云平台/自托管/无偏好
- **代码生成级别**: 概念级/基础级/实现级
"

### 5. Load Sidecar Knowledge
Load COMPLETE sidecar files:
- `{agent_sidecar}/tech-stack-knowledge.md` - Technology stack knowledge
- `{agent_sidecar}/architecture-patterns.md` - Architecture patterns and principles

## DOCUMENTATION:

If output file exists:
1. Read the existing file
2. Check frontmatter for resume information
3. If `lastStep` is set, inform user they're continuing from step `{lastStep}`
4. If `stepsCompleted` array exists, confirm completed steps

If output file doesn't exist:
1. Create new file from template `{templateFile}`
2. Set frontmatter:
   ```yaml
   ---
   stepsCompleted: [1]
   lastStep: 'init'
   date: '[current date]'
   user_name: '[user name]'
   projectName: '[project name]'
   techStack: '[tech stack preference]'
   architectureStatus: 'in_progress'
   ---
   ```
3. Initialize document structure

## NEXT:

"**✅ 初始化完成**

我现在已加载了项目上下文和技术知识库，准备好开始架构设计。

**下一步**: 需求分析 - 我们将深入分析技术需求和约束条件。

准备好继续吗？"

## CRITICAL NOTES:

- Always load COMPLETE sidecar files using `Read` tool
- Verify all input documents are accessible before proceeding
- Document any missing information in the output file
- Set proper frontmatter fields for resume functionality
- Reference sidecar knowledge when available
