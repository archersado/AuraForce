---
name: 'step-04-prd-generation'
description: 'Generate comprehensive PRD document with structured chapters based on analyzed requirements'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/workflows/prd-with-diagram-generator'

# File References
thisStepFile: '{workflow_path}/steps/step-04-prd-generation.md'
nextStepFile: '{workflow_path}/steps/step-05-diagram-creation.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd-{project_name}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: PRD文档生成

## STEP GOAL:

To generate comprehensive and professional PRD document content by transforming analyzed requirements into structured chapters, ensuring enterprise-grade documentation quality and completeness.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a product documentation specialist and technical writer
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in PRD writing and documentation standards, user brings requirements validation and business context
- ✅ Maintain professional and structured tone throughout

### Step-Specific Rules:

- 🎯 Focus ONLY on PRD content generation and refinement
- 🚫 FORBIDDEN to create diagrams or visual elements in this step
- 💬 Generate content collaboratively with user approval for each major section
- 🚪 Ensure each chapter meets enterprise documentation standards

## EXECUTION PROTOCOLS:

- 🎯 Generate PRD content section by section
- 💾 Get user approval for each completed section
- 📖 Update frontmatter `stepsCompleted` to include 4 before loading next step
- 🚫 FORBIDDEN to load next step until all PRD sections are completed and approved

## CONTEXT BOUNDARIES:

- Product concepts and detailed requirements from previous steps are available
- Focus on transforming analysis into professional documentation
- Follow the structured PRD format defined in workflow design
- Prepare content for diagram creation in next step

## PRD GENERATION SEQUENCE:

### 1. PRD生成阶段介绍

"现在进入PRD文档生成阶段！📝

基于前面收集的产品概念和详细需求分析，我将协助您创建结构化的专业PRD文档。

我们将按照企业标准格式，逐章节生成内容：
1. 产品概览 - 产品目标、愿景、背景
2. 用户分析 - 目标用户、用例、用户旅程
3. 功能需求 - 核心功能、规格、优先级
4. 非功能性需求 - 性能、安全、可用性
5. 验收标准 - 成功指标、验收条件
6. 附录 - 术语表、参考资料

每完成一个章节，我们将一起审查确认后再继续下一章节。准备好开始了吗？"

### 2. 第一章：产品概览

**生成产品概览章节**

基于Step 2收集的产品概念，生成专业的产品概览：

```markdown
# 1. 产品概览

## 1.1 产品概述

### 产品名称
[产品名称]

### 产品定位
[基于用户输入的产品定位描述]

### 核心价值主张
[产品的独特价值和竞争优势]

## 1.2 产品目标

### 业务目标
[产品要实现的业务目标]

### 用户目标
[产品为用户解决的核心问题]

### 成功指标
[可衡量的成功指标]

## 1.3 产品范围

### 功能范围
[第一版本包含的核心功能]

### 边界定义
[明确不包含的功能和限制]

## 1.4 项目背景

### 市场需求
[市场机会和需求分析]

### 技术背景
[相关技术趋势和可行性]
```

**生成后确认：**
"我已经根据我们之前讨论的概念生成了产品概览章节。请审查以下内容：

[显示生成的内容]

这个产品概览是否准确反映了您的产品愿景？需要修改或补充什么内容吗？"

### 3. 第二章：用户分析

**生成用户分析章节**

基于Step 3的用户需求分析，创建详细的用户分析：

```markdown
# 2. 用户分析

## 2.1 目标用户群体

### 主要用户群体
[主要用户类型的详细描述]

### 次要用户群体
[次要用户类型的描述]

### 用户特征
- 技术水平：[用户技术背景]
- 使用场景：[主要使用环境]
- 使用频率：[预期使用频率]

## 2.2 用户痛点和需求

### 当前痛点
[用户面临的主要问题]

### 需求分析
[用户的具体需求]

### 解决方案期望
[用户对解决方案的期望]

## 2.3 用户场景和用例

### 主要使用场景
[详细的用户使用场景]

### 用户故事
[关键用户故事集合]

### 用户旅程
[典型用户从发现到使用的完整旅程]
```

**章节确认流程：**
每完成一个主要章节后：
1. 展示生成的内容
2. 征求用户反馈和修改意见
3. 根据反馈调整内容
4. 确认章节完成后继续下一章节

### 4. 第三章：功能需求

**生成功能需求章节**

将详细的功能分析转化为结构化的需求文档：

```markdown
# 3. 功能需求

## 3.1 功能概述

### 核心功能模块
[功能模块分类和概述]

### 功能优先级
- Must Have（核心必需）：[列表]
- Should Have（重要）：[列表]
- Could Have（可选）：[列表]
- Won't Have（不包含）：[列表]

## 3.2 详细功能规格

### [功能模块1]
**功能描述：**[详细描述]
**输入：**[输入规格]
**输出：**[输出规格]
**业务规则：**[业务逻辑规则]
**异常处理：**[错误处理逻辑]

### [功能模块2]
[重复上述格式]

## 3.3 功能依赖和集成

### 内部功能依赖
[功能间的依赖关系]

### 外部系统集成
[需要集成的外部系统]

### API和接口要求
[对外接口的规格要求]
```

### 5. 第四章：非功能性需求

**生成非功能性需求章节**

```markdown
# 4. 非功能性需求

## 4.1 性能需求

### 响应时间要求
- 页面加载时间：[具体指标]
- API响应时间：[具体指标]
- 数据处理时间：[具体指标]

### 吞吐量要求
- 并发用户数：[具体数量]
- 数据处理量：[具体数量]
- 事务处理能力：[具体指标]

### 可用性要求
- 系统可用性：[如99.9%]
- 计划停机时间：[维护窗口]
- 故障恢复时间：[RTO指标]

## 4.2 安全需求

### 数据安全
- 数据加密要求：[加密标准]
- 数据备份要求：[备份策略]
- 访问控制：[权限管理规则]

### 系统安全
- 身份验证：[认证机制]
- 授权管理：[权限体系]
- 审计日志：[日志要求]

### 合规性要求
- 法规遵循：[相关法规]
- 标准符合：[行业标准]

## 4.3 可用性需求

### 用户界面要求
- 界面设计原则：[设计标准]
- 交互体验要求：[UX标准]
- 响应式设计：[多设备支持]

### 可访问性要求
- 无障碍标准：[WCAG等级]
- 多语言支持：[国际化要求]
- 设备兼容性：[支持设备]

## 4.4 技术需求

### 技术架构要求
- 架构模式：[架构选择]
- 技术栈限制：[技术约束]
- 扩展性要求：[扩展策略]

### 运维要求
- 部署要求：[部署环境]
- 监控要求：[监控指标]
- 维护要求：[维护标准]
```

### 6. 第五章：验收标准

**生成验收标准章节**

```markdown
# 5. 验收标准

## 5.1 功能验收标准

### [功能模块1]验收标准
**测试场景：**[测试情况]
**验收条件：**[通过条件]
**测试数据：**[测试用例]

### [功能模块2]验收标准
[重复格式]

## 5.2 性能验收标准

### 性能基准测试
- 负载测试标准：[具体指标]
- 压力测试标准：[极限指标]
- 稳定性测试标准：[持续性指标]

## 5.3 质量验收标准

### 代码质量标准
- 代码覆盖率：[覆盖率要求]
- 代码规范：[编码标准]
- 安全扫描：[安全检查]

### 用户验收标准
- 用户测试通过率：[通过标准]
- 用户满意度：[满意度指标]
- 可用性测试：[可用性指标]

## 5.4 上线标准

### 技术准备就绪标准
[技术就绪检查清单]

### 业务准备就绪标准
[业务就绪检查清单]

### 运营准备就绪标准
[运营就绪检查清单]
```

### 7. 第六章：附录

**生成附录章节**

```markdown
# 6. 附录

## 6.1 术语表
[项目相关术语定义]

## 6.2 参考资料
[参考文档和标准]

## 6.3 变更记录
| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0 | [日期] | 初始版本 | [姓名] |

## 6.4 图表索引
[将在下一步骤中添加图表引用]
```

### 8. PRD整体审查

完成所有章节后，进行整体审查：

"PRD文档的所有主要章节已经完成。让我们进行最终审查：

**文档完整性检查：**
✅ 产品概览 - 清晰的产品定位和目标
✅ 用户分析 - 详细的用户群体和需求分析
✅ 功能需求 - 完整的功能规格和优先级
✅ 非功能性需求 - 全面的性能和质量要求
✅ 验收标准 - 明确的成功和质量标准
✅ 附录 - 支持信息和参考资料

**内容质量检查：**
- 信息是否完整和一致？
- 语言是否专业和清晰？
- 结构是否逻辑合理？
- 是否符合企业文档标准？

请审查整个PRD文档，确认所有内容符合您的期望。下一步我们将创建配套的专业图表。"

### 9. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Finalize PRD content in {outputFile}, update frontmatter with step 4 completion, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#9-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and complete PRD document is finalized and approved, will you then update frontmatter with `stepsCompleted: [1, 2, 3, 4]` and load, read entire file, then execute `{nextStepFile}` to begin diagram creation.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete PRD document with all required chapters
- Professional enterprise-grade content quality
- All sections approved by user
- Consistent formatting and structure
- Ready for diagram creation phase
- Frontmatter properly updated

### ❌ SYSTEM FAILURE:

- Incomplete or missing PRD sections
- Poor content quality or unprofessional writing
- Proceeding without user approval of sections
- Inconsistent formatting or structure
- Not updating frontmatter properly

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.