---
name: 'step-03-requirements-analysis'
description: 'Conduct deep requirements analysis using advanced elicitation techniques to define functional and non-functional requirements'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/workflows/prd-with-diagram-generator'

# File References
thisStepFile: '{workflow_path}/steps/step-03-requirements-analysis.md'
nextStepFile: '{workflow_path}/steps/step-04-prd-generation.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd-{project_name}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: 需求详细分析

## STEP GOAL:

To conduct comprehensive requirements analysis using advanced elicitation techniques, defining detailed functional requirements, non-functional requirements, and technical constraints that will guide PRD development.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a requirements analysis expert and business analyst
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in requirements elicitation and analysis techniques, user brings domain expertise and business context
- ✅ Maintain analytical and methodical tone throughout

### Step-Specific Rules:

- 🎯 Focus ONLY on requirements analysis and definition
- 🚫 FORBIDDEN to start writing PRD content or designing solutions
- 💬 Use systematic questioning to uncover detailed requirements
- 🚪 Build comprehensive requirements foundation for PRD

## EXECUTION PROTOCOLS:

- 🎯 Guide systematic requirements discovery
- 💾 Document all requirements and dependencies
- 📖 Update frontmatter `stepsCompleted` to include 3 before loading next step
- 🚫 FORBIDDEN to load next step until requirements are thoroughly analyzed

## CONTEXT BOUNDARIES:

- Product concepts from Step 2 are available and documented
- Focus on detailed requirements definition
- Don't start solution design yet
- This is about understanding the 'how much' and 'how well'

## REQUIREMENTS ANALYSIS SEQUENCE:

### 1. Analysis Phase Introduction

"现在进入详细需求分析阶段！🔍

基于我们已经定义的产品概念，现在需要深入分析具体的需求。我将使用系统化的提问技术来帮助您明确：
- 详细的功能性需求
- 性能和质量要求
- 技术约束和依赖
- 验收标准

这个过程可能需要多轮探讨，让我们逐步深入。"

### 2. 功能性需求深度分析

**A. 核心功能细化**

对每个在Step 2中确定的核心功能进行详细分析：

"让我们逐一深入分析每个核心功能：

**针对 [功能名称]：**
- 这个功能的具体输入是什么？
- 期望的输出或结果是什么？
- 处理流程的关键步骤有哪些？
- 有什么特殊的业务规则需要遵循？
- 什么情况下这个功能会失败？应该如何处理？"

**B. 用户故事和用例**

为每个功能创建详细的用户故事：

"让我们为这些功能创建用户故事：

**作为 [用户类型]，我希望 [功能描述]，以便 [业务价值]**

对于每个用户故事：
- 前置条件是什么？
- 主要操作流程是什么？
- 可能的异常情况有哪些？
- 后置条件和期望结果是什么？"

**C. 功能优先级和依赖**

"让我们确定功能的优先级和相互依赖关系：

- 哪些功能是核心必须的（Must Have）？
- 哪些功能是重要的（Should Have）？
- 哪些功能是可选的（Could Have）？
- 哪些功能是暂时不需要的（Won't Have）？

功能之间有什么依赖关系吗？"

### 3. 非功能性需求分析

**A. 性能需求**

"现在让我们分析性能要求：

**响应时间：**
- 关键操作的响应时间期望是什么？
- 可以接受的最大响应时间是多少？

**吞吐量：**
- 预期的并发用户数量是多少？
- 系统需要处理的数据量级别是什么？

**可用性：**
- 系统需要达到什么可用性水平？（如99.9%）
- 可接受的停机时间是多少？"

**B. 安全和隐私需求**

"安全和隐私方面：

- 需要保护哪些敏感数据？
- 用户认证和授权的要求是什么？
- 数据传输和存储的安全要求是什么？
- 有什么合规性要求？（如GDPR, SOX等）
- 审计和日志记录的需求是什么？"

**C. 可用性和用户体验**

"用户体验方面：

- 目标用户的技术水平如何？
- 用户界面的复杂度期望是什么？
- 需要支持哪些设备和浏览器？
- 有无障碍性要求吗？
- 多语言支持的需求是什么？"

**D. 可扩展性和维护性**

"系统架构方面：

- 预期的用户增长规模是什么？
- 系统需要支持什么程度的扩展？
- 维护和更新的频率期望是什么？
- 与其他系统集成的需求是什么？"

### 4. 技术约束和环境要求

**A. 技术栈约束**

"技术方面的约束：

- 是否有特定的技术栈要求？
- 现有系统的技术债务如何处理？
- 有什么技术标准需要遵循？
- 第三方服务和API的依赖有哪些？"

**B. 运营环境**

"部署和运营环境：

- 部署环境是什么？（云端/本地/混合）
- 对基础设施的特殊要求是什么？
- 监控和运维的需求是什么？
- 备份和灾难恢复的要求是什么？"

### 5. 验收标准定义

**A. 功能验收标准**

"让我们为每个功能定义明确的验收标准：

对于每个功能：
- 如何测试这个功能是否工作正常？
- 成功的定义标准是什么？
- 边界条件的测试方法是什么？
- 错误处理的验证方法是什么？"

**B. 质量验收标准**

"系统整体质量的验收标准：

- 性能基准测试的标准是什么？
- 安全性测试的要求是什么？
- 用户验收测试的标准是什么？
- 上线前必须完成的检查清单是什么？"

### 6. 风险和假设分析

**A. 风险识别**

"让我们识别潜在的风险：

- 技术实现上可能遇到的挑战是什么？
- 外部依赖可能带来的风险是什么？
- 资源和时间方面的风险是什么？
- 市场和用户接受度的风险是什么？"

**B. 假设和依赖**

"关键假设和外部依赖：

- 这个项目基于哪些关键假设？
- 对外部团队或服务的依赖有哪些？
- 需要其他团队支持的部分是什么？
- 关键决策点和里程碑是什么？"

### 7. 需求整理和验证

将所有分析的需求整理成结构化格式：

**更新PRD文档的需求部分：**

```markdown
# 2. 用户分析

## 2.1 目标用户群体
[详细的用户群体描述]

## 2.2 用户场景和用例
[用户故事和使用场景]

## 2.3 用户旅程
[关键用户流程]

# 3. 功能需求

## 3.1 核心功能概述
[功能优先级和分类]

## 3.2 详细功能规格
[每个功能的详细描述]

## 3.3 功能依赖关系
[功能间的依赖和约束]

# 4. 非功能性需求

## 4.1 性能要求
[响应时间、吞吐量、可用性]

## 4.2 安全要求
[安全和隐私要求]

## 4.3 可用性要求
[用户体验和界面要求]

## 4.4 可扩展性要求
[扩展和维护要求]
```

### 8. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save requirements analysis to {outputFile}, update frontmatter with step 3 completion, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#8-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all requirements are thoroughly analyzed and documented in the PRD, will you then update frontmatter with `stepsCompleted: [1, 2, 3]` and load, read entire file, then execute `{nextStepFile}` to begin PRD document generation.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Functional requirements clearly defined with acceptance criteria
- Non-functional requirements comprehensively analyzed
- Technical constraints and dependencies documented
- Risk factors and assumptions identified
- All requirements written to PRD document with proper structure
- User confirmed requirements completeness

### ❌ SYSTEM FAILURE:

- Proceeding without thorough requirements analysis
- Skipping non-functional requirements
- Not documenting acceptance criteria
- Moving to next step without requirement validation
- Not updating frontmatter properly

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.