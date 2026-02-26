---
name: 'step-03-assess-impact'
description: 'Assess impact of change on completed work'

# File references (ONLY variables used in this step)
nextStepFile: './step-04-assess-feasibility.md'
---

# Step 3: Assess Impact

## STEP GOAL:
To assess the impact of the change request on completed work and in-progress tasks.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'A', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, analytical project manager
- ✅ Collaborate with Interaction Designer for impact assessment
- ✅ Use PM's communication style
- ✅ We engage in collaborative dialogue, not command-response

### Step-Specific Rules:
- 🎯 Focus on assessing impact on completed features and in-progress tasks
- 🚫 FORBIDDEN to skip impact assessment
- 💬 Approach: Analyze, discuss, confirm

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style
- 👥 Collaborate with Interaction Designer for UX impact

## CONTEXT BOUNDARIES:
- Available context: Change request from Step 1, Current project state from Step 2
- Focus: Assessing impact on completed work and in-progress tasks
- Dependencies: Previous steps data

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 3 of 8】Assess Impact**"

### 2. Retrieve Context

Retrieve from session memory:
- Change request details
- Current project state (completed/in-progress/pending tasks)

### 3. Collaborate with Interaction Designer for Impact Assessment

As PM, work with Interaction Designer to assess the impact on user experience and completed features:

"我现在和交互设计师一起评估这个变更的影响。

**让我们分析一下这个变更会对项目造成什么影响：**"

#### Assess Impact Areas:

**1. Impact on Completed Features:**
- Which completed features will be affected?
- Will any completed features need to be modified or reworked?
- What is the effort to modify affected features?

**2. Impact on In-Progress Tasks:**
- Which in-progress tasks will be affected?
- Will any in-progress tasks need to be modified or reprioritized?
- What is the impact on current development work?

**3. User Experience Impact:**
- How will this change affect the overall user experience?
- Will it create any UX inconsistencies?
- Are there any UX patterns that need to be updated?

**4. Data Impact:**
- Will this change require data migration or changes?
- Are there any backward compatibility concerns?

Display the impact assessment:

"**影响评估结果：**

**对已完成功能的影响：**
{{Analysis of impact on completed features}}

**对进行中任务的影响：**
{{Analysis of impact on in-progress tasks}}

**用户体验影响：**
{{Interaction Designer's UX impact assessment}}

**数据影响：**
{{Analysis of data impact, if any}}

**整体影响评估：**
- 影响级别：[低/中/高]
- 主要影响因素：{{key factors}}"

### 4. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 3] Assess Impact
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [A] Accept Assessment
      → Impact assessment correct, proceed to assess feasibility

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Handle User Choice

#### If User Chooses [A] (Accept Assessment):

Display: "**评估已确认，开始评估技术可行性...**"

1. Store impact assessment in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Impact assessment completed
- Collaboration with Interaction Designer documented
- Assessment summary displayed to user
- User confirms assessment

### ❌ SYSTEM FAILURE:
- Skipping impact assessment
- Not collaborating with Interaction Designer
- Not displaying summary to user
- Proceeding without user confirmation

**Master Rule:** Skipping assessment or proceeding without confirmation is FORBIDDEN.
