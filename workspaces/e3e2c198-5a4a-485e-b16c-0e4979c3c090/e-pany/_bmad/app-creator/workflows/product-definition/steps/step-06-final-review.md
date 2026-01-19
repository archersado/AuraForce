---
name: 'step-06-final-review'
description: 'Conduct final review, quality assurance, and organize complete deliverable package'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/workflows/prd-with-diagram-generator'

# File References
thisStepFile: '{workflow_path}/steps/step-06-final-review.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd-{project_name}.md'
diagramsFolder: '{output_folder}/diagrams'
deliverableFolder: '{output_folder}/prd-{project_name}-deliverable'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: 最终审查和输出

## STEP GOAL:

To conduct comprehensive final review, quality assurance, and organize the complete deliverable package containing PRD document, professional diagrams, and supporting materials ready for development team collaboration.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When completing workflow, ensure all deliverables are finalized
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a quality assurance specialist and delivery manager
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in document quality control and project delivery, user brings final validation and approval authority
- ✅ Maintain professional and thorough tone throughout

### Step-Specific Rules:

- 🎯 Focus ONLY on review, quality assurance, and delivery preparation
- 🚫 FORBIDDEN to create new content unless fixing identified issues
- 💬 Conduct systematic review with user validation
- 🚪 Ensure complete deliverable package meets all requirements

## EXECUTION PROTOCOLS:

- 🎯 Conduct systematic quality review of all components
- 💾 Organize final deliverable package with proper structure
- 📖 Mark workflow as COMPLETED in frontmatter
- 🚫 FORBIDDEN to leave workflow incomplete

## CONTEXT BOUNDARIES:

- Complete PRD document and diagrams from previous steps are available
- Focus on quality validation and delivery preparation
- Ensure all requirements from original plan are fulfilled
- Prepare materials for immediate use by development teams

## FINAL REVIEW AND DELIVERY SEQUENCE:

### 1. 最终审查阶段介绍

"欢迎来到最终审查和交付阶段！🎯

我们即将完成整个PRD创建流程。在这个阶段，我将协助您进行：

**完整性审查：**
✅ PRD文档内容完整性和质量检查
✅ 图表专业性和一致性验证
✅ 文档格式和结构标准化检查

**交付准备：**
📦 创建完整的交付包
📋 生成项目总结和使用说明
🔍 确保所有文件可以直接用于开发协作

**质量保证：**
🎨 企业级视觉标准验证
📝 内容专业性和准确性检查
🔗 所有链接和引用完整性验证

让我们开始系统化的最终审查过程！"

### 2. PRD文档完整性审查

**2.1 内容完整性检查**

"首先进行PRD文档的全面审查：

**章节完整性检查：**"

检查PRD文档是否包含所有必需章节：

```markdown
检查清单：
□ 1. 产品概览 - 产品定位、目标、范围
□ 2. 用户分析 - 目标用户、痛点、用例
□ 3. 功能需求 - 详细功能规格、优先级
□ 4. 非功能性需求 - 性能、安全、可用性
□ 5. 验收标准 - 测试标准、质量要求
□ 6. 附录 - 术语表、图表索引、参考资料
```

**2.2 内容质量评估**

对每个章节进行质量评估：

"**内容质量检查：**

**产品概览章节：**
- 产品定位是否清晰明确？
- 目标和价值主张是否具体可衡量？
- 产品范围边界是否明确定义？

**用户分析章节：**
- 目标用户描述是否具体详细？
- 用户需求和痛点是否准确识别？
- 用户故事是否完整可操作？

**功能需求章节：**
- 功能描述是否详细具体？
- 优先级划分是否合理清晰？
- 验收条件是否明确可测试？

**非功能性需求章节：**
- 性能指标是否具体可衡量？
- 安全要求是否全面合规？
- 技术约束是否现实可行？

**验收标准章节：**
- 测试标准是否明确具体？
- 质量要求是否可验证？
- 上线标准是否完整实用？"

### 3. 图表质量和一致性审查

**3.1 图表内容审查**

"接下来审查所有创建的图表：

**图表完整性检查：**"

验证所有必需图表是否已创建：

```markdown
图表检查清单：
□ 用户-系统交互图 - JSON + PNG格式
□ 系统边界图 - JSON + PNG格式
□ 产品模块图 - JSON + PNG格式
□ 数据流转图 - JSON + PNG格式
```

**3.2 视觉质量标准验证**

"**视觉质量检查：**

**企业级外观标准：**
- 色彩方案是否统一专业？
- 字体大小和样式是否一致？
- 布局是否整洁规范？
- 图例和标注是否清晰易读？

**技术规格验证：**
- Excalidraw JSON文件是否可以正常编辑？
- PNG图片分辨率是否适合打印？
- 文件命名是否遵循规范？
- 图表在PRD中的引用是否正确？"

### 4. 文档格式和结构标准化

**4.1 Markdown格式检查**

"进行文档格式的标准化检查：

**格式一致性：**
- 标题层级是否正确使用？
- 列表格式是否统一？
- 表格结构是否规范？
- 代码块和引用是否正确格式化？

**链接和引用验证：**
- 内部链接是否有效？
- 图表引用是否正确？
- 外部链接是否可访问？
- 文档交叉引用是否准确？"

### 5. 创建完整交付包

**5.1 组织文件结构**

创建标准化的项目交付包：

```
prd-{project_name}-deliverable/
├── README.md                           # 项目总览和使用指南
├── prd-{project_name}.md               # 主PRD文档
├── diagrams/                           # 图表文件夹
│   ├── user-system-interaction.json    # 可编辑格式
│   ├── user-system-interaction.png     # 展示格式
│   ├── system-boundary.json
│   ├── system-boundary.png
│   ├── product-modules.json
│   ├── product-modules.png
│   ├── data-flow.json
│   └── data-flow.png
├── templates/                          # 模板文件
│   └── prd-template.md                 # PRD模板
└── metadata/                           # 元数据
    ├── project-info.json               # 项目信息
    └── creation-log.md                 # 创建日志
```

**5.2 生成README文档**

创建项目使用指南：

```markdown
# [项目名称] PRD 交付包

## 项目概述
[项目基本信息和目标]

## 文档结构
- `prd-{project_name}.md` - 完整的产品需求文档
- `diagrams/` - 所有图表文件（JSON可编辑 + PNG展示）
- `templates/` - 文档模板
- `metadata/` - 项目元数据

## 使用指南

### 开发团队使用
1. 阅读主PRD文档了解完整需求
2. 参考图表理解系统架构
3. 根据验收标准进行开发和测试

### 图表编辑
- 使用 Excalidraw.com 打开 .json 文件进行编辑
- PNG文件可直接用于演示和文档

### 文档维护
- 使用提供的模板保持格式一致性
- 更新时同步修改文档和图表

## 质量标准
本文档包严格遵循企业级文档标准，可直接用于：
- 开发团队技术规划
- 项目管理和进度跟踪
- 业务沟通和决策支持
- 质量保证和测试验收
```

**5.3 生成项目元数据**

创建项目信息文件：

```json
{
  "projectName": "{project_name}",
  "creationDate": "[current_date]",
  "workflowVersion": "prd-with-diagram-generator-v1.0",
  "userName": "{user_name}",
  "documentVersion": "1.0",
  "totalPages": "[document_length]",
  "diagramCount": 4,
  "completionStatus": "completed",
  "qualityLevel": "enterprise-grade"
}
```

### 6. 最终质量保证检查

**6.1 交付标准验证**

"进行最终的质量保证检查：

**企业级标准验证：**

**文档质量：**
✅ PRD结构完整，内容专业
✅ 语言表达清晰准确
✅ 格式统一，符合企业标准
✅ 所有章节逻辑连贯

**图表质量：**
✅ 视觉设计专业统一
✅ 技术规格符合要求
✅ 内容准确反映需求
✅ 可编辑性和展示性兼备

**可用性验证：**
✅ 开发团队可直接使用
✅ 业务团队可理解沟通
✅ 质量团队可据此测试
✅ 管理团队可用于决策"

**6.2 用户最终确认**

"PRD项目现已完全完成！让我们进行最终确认：

**完整交付清单：**
📄 专业PRD文档 - 企业级结构和内容
🎨 配套专业图表 - 4个类型，双格式
📁 完整项目包 - 标准化文件组织
📋 使用指南 - 详细操作说明
🔍 质量保证 - 企业标准验证

**即可使用场景：**
- 开发团队技术实现
- 产品团队需求管理
- 设计团队用户体验
- 测试团队质量验证
- 管理层项目决策

您对这个完整的PRD交付包满意吗？还需要调整或补充什么内容？"

### 7. 工作流完成标记

**更新最终状态**

更新PRD文档frontmatter标记工作流完成：

```yaml
---
stepsCompleted: [1, 2, 3, 4, 5, 6]
workflowStatus: "completed"
completionDate: [current_date]
deliverableLocation: "{deliverableFolder}"
totalDiagrams: 4
qualityLevel: "enterprise-grade"
---
```

### 8. 成功完成确认

**工作流完成祝贺**

"🎉 恭喜！PRD和图表生成工作流已成功完成！

**您现在拥有：**
✨ 完整的企业级PRD文档
✨ 专业的可视化图表套件
✨ 标准化的项目交付包
✨ 开箱即用的协作材料

**交付包位置：** `{deliverableFolder}`

这套完整的PRD文档和图表可以直接用于：
- 启动开发项目
- 团队协作沟通
- 项目管理跟踪
- 质量验收测试

感谢您使用PRD生成工作流！祝您的产品开发顺利成功！🚀"

### 9. Present COMPLETION OPTIONS

Display: **Workflow Completed Successfully!** [R] Review Deliverables [N] New PRD Project

#### EXECUTION RULES:

- Workflow is now complete
- All deliverables are ready
- User can review or start new project

#### Menu Handling Logic:

- IF R: Display detailed summary of all created files and their locations
- IF N: Suggest starting a new PRD project workflow
- IF Any other comments or queries: Provide support and guidance

## CRITICAL STEP COMPLETION NOTE

Workflow is COMPLETED. All deliverables have been created, organized, and are ready for immediate use by development teams and stakeholders.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete PRD document with all required chapters
- All diagrams created in both JSON and PNG formats
- Professional enterprise-grade quality throughout
- Complete deliverable package organized and ready
- All files properly named and structured
- Workflow status marked as completed
- User satisfaction with final deliverables

### ❌ SYSTEM FAILURE:

- Incomplete or missing deliverables
- Poor quality documentation or diagrams
- Disorganized file structure
- Not marking workflow as completed
- User dissatisfaction with quality or completeness

**Master Rule:** All deliverables must meet enterprise-grade quality standards and be immediately usable by development teams.