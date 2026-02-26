---
name: 'step-02-identify-features'
description: 'Identify features that need to be implemented'

# File references (ONLY variables used in this step)
nextStepFile: './step-03-create-stories.md'
---

# Step 2: Identify Features

## STEP GOAL:
To identify features that need to be implemented based on requirements analysis.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, analytical project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus only on identifying features
- 🚫 FORBIDDEN to create stories yet
- 💬 Approach: Break down into logical features, group appropriately

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"

## CONTEXT BOUNDARIES:
- Available context: Requirements analysis from step-01
- Focus: Identifying features from requirements
- Limits: Don't create stories yet, just identify features
- Dependencies: Step 01 complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 2 of 7】Identify Features**"

### 2. Identify Features

Based on requirements from Step 1, identify features:

"这个问题我理解，让我来协调一下。

**根据需求分析，我识别出以下功能：**

**核心功能（必须）：**
- {{列出核心功能}}

**次要功能（可选）：**
- {{列出次要功能}}

**技术功能（基础设施等）：**
- {{列出技术功能}}

**按模块分组：**

**前端功能：**
- {{列出前端功能}}

**后端功能：**
- {{列出后端功能}}

**共享功能：**
- {{列出共享功能}}

这个功能列表完整吗？需要调整吗？"

### 3. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 2] Feature Identification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [A] Approve & Continue
      → Features are correct, proceed to create stories

  [S] Split Features
      → Further break down features

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Handle User Choice

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to create stories...**"

1. Store feature list in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [S] (Split Features):

Ask which features need to be split. Collect refinements, update feature list, then redisplay menu.

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Features identified clearly
- Features grouped appropriately (Frontend/Backend/Shared)
- Feature scope estimated
- User approves feature list

### ❌ SYSTEM FAILURE:
- Features not broken down properly
- Not grouping features by module
- Proceeding without user confirmation

**Master Rule:** Proceeding without feature grouping or confirmation is FORBIDDEN.
