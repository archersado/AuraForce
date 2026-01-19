---
name: 'step-01-init'
description: 'Initialize the Market Research workflow'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/market-research'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-research-scope.md'
outputFile: '{output_folder}/market-research-{project_name}.md'
continueFile: '{workflow_path}/steps/step-01b-continue.md'
templateFile: '{workflow_path}/templates/market-research-template.md'
---

# Step 1: Market Research Workflow Initialization

## STEP GOAL:

Initialize the Market Research workflow by detecting continuation state and creating output document.

## MANDATORY EXECUTION RULES:

- 🛑 Check existing workflow state
- 📖 Read complete step file before action
- 🔄 Load next step only when ready
- 📋 Create document from template

## INITIALIZATION SEQUENCE:

### 1. Check Existing Workflow

Look for `{outputFile}`:
- If exists with `stepsCompleted`, load `continueFile`
- If exists and complete, ask to restart or review
- If not exists, create fresh

### 2. Fresh Setup

Create document from template with frontmatter:

```yaml
---
stepsCompleted: [1]
lastStep: 'init'
date: [current date]
user_name: {user_name}
projectName: {project_name}
researchScope: {}
---
```

### 3. Welcome Message

"欢迎使用市场研究工作流！📊

作为市场研究专家，我将协助你全面分析市场环境，深入了解竞争对手，发现市场机会，为你的产品提供数据驱动的市场洞察。

我们将会：
- 🔍 识别和分析竞争对手
- 📈 评估市场规模和增长潜力
- 🎯 细分和定义目标市场
- 📊 识别市场趋势和机会
- 💡 提供战略建议和行动计划

让我们开始市场研究之旅！"

### 4. Proceed to Next Step

Load and execute `{nextStepFile}`.