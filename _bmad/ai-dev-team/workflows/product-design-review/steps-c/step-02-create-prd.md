---
name: 'step-02-create-prd'
description: 'Create PRD document based on analyzed requirements'

# File references (ONLY variables used in this step)
nextStepFile: './step-03-save-prd-document.md'
templateFile: '{project-root}/_bmad/ai-dev-team/workflows/product-design-review/templates/template-prd.md'
prdTemplateFile: '{project-root}/_bmad/ai-dev-team/templates/template-prd.md'
---

# Step 2: Create PRD

## STEP GOAL:
To create a comprehensive PRD (Product Requirements Document) based on the analyzed requirements from Step 1.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT GENERATOR for this step
- 🎯 Use ONLY collected requirements from Step 1 - do not add or improvise

### Role Reinforcement:
- ✅ You are Product Designer (产品设计) - professional, thorough, structured
- ✅ If you already have been given communication_style and identity, continue to use those while playing the Product Designer role
- ✅ Create structured, comprehensive, well-formatted documents
- ✅ Ensure completeness and clarity in documentation

### Step-Specific Rules:
- 🎯 Focus on creating PRD content - no new requirements gathering
- 🚫 FORBIDDEN to ask new questions or add features not discussed
- 📁 Use template structure as guide for PRD organization
- 💬 Approach: Present PRD content, ask for review and feedback

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use Product Designer's communication style: systematic, clear, professional
- 🚫 This is a document generation step - use collected information only

## CONTEXT BOUNDARIES:
- Available context: Collected requirements from step-01
- Focus: Create PRD document content
- Limits: Use only information collected in Step 1
- Dependencies: Step 01 complete, requirements confirmed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 2 of 7】Create PRD**"

### 2. Display PRD Introduction

Display: "**PRD文档生成阶段**"

"基于需求分析阶段收集的信息，我现在开始编写PRD文档。

**PRD将包含以下章节：**
1. 功能名称
2. 需求背景
3. 功能目标
4. 用户故事
5. 功能范围
6. 非功能需求
7. 验收标准

让我开始生成PRD内容..."

### 3. Generate PRD Content

Create PRD document content using the following structure. Load the template if available:

#### Frontmatter:
```yaml
---
stepsCompleted: ['step-01-analyze-requirements', 'step-02-create-prd']
date: {{current_date}}
user_name: {{user_name}}
feature_name: {{feature_name}}
status: 'draft'
---
```

#### Document Body:

**1. 功能名称**

Use the feature name from step-01

**2. 需求背景**

Include:
- Why this feature is needed
- Problem statement
- Business context
- Current state/situation

**3. 功能目标**

List user goals:
- Primary objectives
- Secondary objectives
- Success criteria
- Expected outcomes

**4. 用户故事**

Format as user stories:
- "As a [user type], I want to [action], so that [benefit]"
- List all identified user stories
- Group by priority if applicable

Example:
- 作为{{user_type}}，我想要{{action}}，以便{{benefit}}

**5. 功能范围**

Clearly define:
- **In Scope (包含内容):**
  - List all features that will be implemented
  - Be specific about what IS included

- **Out of Scope (不包含内容):**
  - List features that will NOT be included
  - Clarify boundaries and assumptions

**6. 非功能需求**

Include as applicable:
- Performance requirements
- Security requirements
- Accessibility requirements
- Usability requirements
- Scalability requirements
- Technical constraints

**7. 验收标准**

Define acceptance criteria for each user story or feature:
- Clear, measurable criteria
- Definition of done for each feature
- Test conditions

Format:
- [Feature]: [Acceptance criteria]

### 4. Display PRD Content

Present the generated PRD content to the user:

Display: "**生成的PRD文档:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRD: {{feature_name}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Display full PRD content here]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Request PRD Review

Ask for review:

"**PRD文档已生成，请审阅。**

以上PRD包含了所有需求分析阶段收集的信息。请检查：

1. ✅ 功能描述是否准确？
2. ✅ 用户故事是否完整？
3. ✅ 范围定义是否清晰？
4. ✅ 验收标准是否明确？

如有需要修改的地方，请告诉我。"

### 6. Present Review Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 2] PRD Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRD Status:
  ✅ PRD document generated
 ✅ All requirements sections included
  ⏳ Awaiting review

Options:

  [R] Revise PRD
      → Make changes to PRD content

  [C] Continue to Save
      → PRD looks good, proceed to save document

  [A] Approve & Continue
      → Approve PRD and skip directly to step-04

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Handle User Choice

#### If User Chooses [R] (Revise PRD):

- Ask what needs to be revised
- Make requested changes to PRD content
- Re-display revised PRD
- Re-display review menu

#### If User Chooses [C] (Continue to Save):

Display: "**Proceeding to save PRD document...**"

Do NOT skip to step-04.
1. Load, read entire `nextStepFile` (step-03-save-prd-document.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Approve & Continue):

Display: "**PRD approved, proceeding directly to product review request...**"

1. Load, read entire `./step-04-request-product-review.md`
2. Execute step-04 (skip step-03 but still save PRD in step-04)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- PRD content generated based on Step 1 requirements
- All required sections included
- Document follows proper structure
- User given opportunity for review
- Properly routed based on user choice

### ❌ SYSTEM FAILURE:
- PRD not generated or incomplete
- Adding features not discussed in Step 1
- Missing required sections
- Not providing review opportunity

**Master Rule:** Creating PRD without using collected Step 1 requirements is FORBIDDEN.
