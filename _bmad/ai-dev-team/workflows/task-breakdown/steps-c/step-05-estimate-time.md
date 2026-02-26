---
name: 'step-05-estimate-time'
description: 'Estimate completion time for each story based on complexity'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-document-stories.md'
---

# Step 5: Estimate Time

## STEP GOAL:
To estimate completion time for each story based on complexity.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, realistic project manager
- ✅ Frontend Dev and Backend Dev provide time estimates
- ✅ We engage in collaborative dialogue with technical team
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus only on time estimation
- 🚫 FORBIDDEN to create documents yet
- 💬 Approach: Time estimates based on complexity + team capability + dependencies

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 👥 Frontend Dev and Backend Dev provide estimates

## CONTEXT BOUNDARIES:
- Available context: Stories with complexity from step-04
- Focus: Time estimation for each story
- Limits: Don't create documents yet
- Dependencies: Steps 01-04 complete

## TIME ESTIMATION GUIDELINES
- Complexity + Team capability + Dependencies
- Include buffer for uncertainties
- Format: hours or days

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 7】Estimate Time**"

### 2. Estimate Time for Each Story

"这个问题我理解，让我来协调一下。

**现在我们要估算每个 Story 的完成时间。**

前端和后端开发团队会基于复杂度和他们的能力给出时间估算，包括一些缓冲应对不确定性。

**前端开发时间估算（Frontend Stories）：**

*前端开发:*
"基于我的能力和这些 Story 的复杂度..."

**STORY-FE-001: {{标题}}**
- **复杂度:** {{Low/Medium/High}}
- **时间估算:** {{X hours / X days}}
- **估算理由:** {{为什么是这个时间}}

{{继续其他前端 Stories}}

---

**后端开发时间估算（Backend Stories）：**

*后端开发:*
"基于我的能力和这些 Story 的复杂度..."

**STORY-BE-001: {{标题}}**
- **复杂度:** {{Low/Medium/High}}
- **时间估算:** {{X hours / X days}}
- **估算理由:** {{为什么是这个时间}}

{{继续其他后端 Stories}}

---

**时间估算汇总：**

| Story ID | 标题 | 复杂度 | 时间估算 | 负责人 |
|----------|------|--------|----------|--------|
| STORY-FE-001 | {{标题}} | Low | 4 hours | Frontend Dev |
| STORY-BE-001 | {{标题}} | Medium | 8 hours | Backend Dev |

**总估算时间:** {{X hours / X days}}

这些时间估算合理吗？"

### 3. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Time Estimation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
  Total Estimated Time: {{total}}
  Frontend Stories: {{count}}, {{total_time}}
  Backend Stories: {{count}}, {{total_time}}
  QA Stories: {{count}}, {{total_time}}

Options:

  [A] Approve & Continue
      → Time estimates are correct

  [S] Split Stories
      → Break down stories further if estimates are too large

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Handle User Choice

#### If User Chooses [S] (Split Stories):

Ask which stories need to be split and why. After splitting, return to complexity estimation (step-04).

Display: "**Returning to complexity estimation for revised stories...**"

1. Load, read entire `./step-04-estimate-complexity.md`
2. Execute that step

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to document stories...**"

1. Store time estimates in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Time estimated for all stories
- Time estimates reasonable for complexity
- Time estimates include buffer for uncertainties
- Time reasoning provided

### ❌ SYSTEM FAILURE:
- Stories without time estimate
- Time estimates unrealistic for complexity
- No buffer included in estimates

**Master Rule:** Proceeding without time estimates for all stories is FORBIDDEN.
