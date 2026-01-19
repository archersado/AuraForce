---
name: 'step-02-design-brief'
description: 'Establish design objectives and context'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/design-sprint'
nextStepFile: '{workflow_path}/steps/step-03-user-journey.md'
outputFile: '{output_folder}/design-sprint-{project_name}.md'
---

# Step 2: Design Brief

## DIALOGUE SECTIONS:

### 1. Design Goals
"**🎯 设计目标**

 定义设计要达成的核心目标。"

Collect:
- Primary design objectives
- User experience goals
- Visual style aspirations
- Success metrics

### 2. Design Context
"**📋 设计背景**

 了解产品的背景和上下文。"

Collect:
- Product vision
- Target platforms (web/mobile/both)
- Target devices
- Technical constraints

### 3. Brand & Style Preferences
"**🎨 品牌和风格**

 了解品牌要求和风格偏好。"

Collect:
- Brand colors (if any)
- Style preferences (minimal/playful/professional)
- Tone and personality
- Visual inspirations

### 4. Design Scope
"**📐 设计范围**

 确定需要设计的页面和功能。"

Collect:
- List of required screens/pages
- Priority order for design
- Out of scope items

DOCUMENT: Design brief with all collected information.

Update: `stepsCompleted: [1, 2]`, `lastStep: 'design-brief'`.

MENU: "[C] Continue to User Journey [R] Redefine [S] Show Brief"