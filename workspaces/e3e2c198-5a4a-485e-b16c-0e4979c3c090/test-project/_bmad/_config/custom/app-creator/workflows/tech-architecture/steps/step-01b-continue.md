---
name: 'step-01b-continue'
description: 'Handle workflow continuation logic'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
---

# Step 1b: Continue Logic

Handle resuming the workflow from a paused state.

## DIALOGUE SECTIONS:

### 1. State Detection & Welcome Back
"**🏗️ 欢迎回到 Tech Architecture 工作流**

让我检查当前的工作流状态..."

### 2. Analyze Frontmatter
Read the output file `{outputFile}` and analyze:
- `stepsCompleted`: Array of completed step numbers
- `lastStep`: Last completed step identifier
- `architectureStatus`: Current workflow status
- `projectName`: Project name
- Any other relevant metadata

### 3. Status Check

#### If lastStep is 'complete'
"**📊 工作流已完成**

Tech Architecture工作流已经完成。上次完成于: `[date from frontmatter]`

**已完成内容**:
- [x] 初始化
- [x] 需求分析
- [x] 技术选型
- [x] 架构设计
- [x] 数据模型设计
- [x] 接口设计
- [x] 安全与性能
- [x] 文档与交付

**输出文件**: `{outputFile}`

你可以：
- 查看或修改现有架构文档
- 开始新的技术架构设计
- 继续 MVP Implementation 工作流"

#### If lastStep is not 'complete'
"**📋 工作流进度摘要**

**当前项目**: `{projectName}`
**上一步骤**: `{lastStep}`
**已完成步骤**: `{stepsCompleted.join(', ')}`

**待完成内容**:
`{[Generate list of incomplete steps]}`

你想要：
1. 从上一步继续 (Continue from `{lastStep}`)
2. 跳转到特定步骤 (Jump to specific step)
3. 查看当前文档内容 (Review current content)
4. 重新开始工作流 (Start over)"

### 4. User Decision Handling

#### Option 1: Continue from last step
- Calculate next step number based on `stepsCompleted`
- Direct user to next step file

#### Option 2: Jump to specific step
- Allow user to select step (2-8)
- Load that step file
- Update `stepsCompleted` appropriately

#### Option 3: Review current content
- Display summary of current document content
- Show which sections are complete/incomplete
- Allow editing or continuing

#### Option 4: Start over
- Confirm with user (data will be lost)
- Create new file or overwrite existing
- Go to Step 1: Init

## NEXT:

Based on user decision, provide appropriate guidance:
- Continue → "让我们从 Step `{nextStep}` 继续..."
- Jump → "跳转到 Step `{targetStep}`..."
- Review → "这是当前的工作流完成情况..."
- Start over → "确认重新开始吗？这将清除现有进度。"

## CRITICAL NOTES:

- Always verify output file exists before reading
- Handle case where file is corrupted or incomplete
- Provide user with clear options and consequences
- Update frontmatter appropriately after each decision
- Maintain workflow state integrity
