---
name: 'step-04-estimate-complexity'
description: 'Estimate complexity for each story from technical perspective'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-estimate-time.md'
---

# Step 4: Estimate Complexity

## STEP GOAL:
To estimate complexity for each story from technical perspective.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - collaborative project manager
- ✅ Frontend Dev and Backend Dev provide complexity assessments
- ✅ We engage in collaborative dialogue with technical team
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus only on complexity estimation
- 🚫 FORBIDDEN to estimate time yet
- 💬 Approach: Frontend Dev assesses frontend stories, Backend Dev assesses backend stories

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 👥 Frontend Dev and Backend Dev provide their assessments

## CONTEXT BOUNDARIES:
- Available context: Story list from step-03
- Focus: Complexity estimation for each story
- Limits: Don't estimate time yet
- Dependencies: Steps 01-03 complete

## COMPLEXITY RATING SCALE
- **Low (简单)**: Straightforward implementation, minimal dependencies
- **Medium (中等)**: Moderate complexity, some dependencies/technical challenges
- **High (复杂)**: Complex implementation, many dependencies, significant technical challenges

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 7】Estimate Complexity**"

### 2. Estimate Complexity for Each Story

"这个问题我理解，让我来协调一下。

**现在我们要评估每个 Story 的复杂度。**

前端和后端开发团队会从技术角度给出他们的评估。

**前端开发评估（Frontend Stories）：**

*前端开发:*
"让我看看前端 Stories..."

**STORY-FE-001: {{标题}}**
- **复杂度:** Low / Medium / High
- **理由:** {{为什么是这个复杂度}}

{{继续其他前端 Stories}}

---

**后端开发评估（Backend Stories）：**

*后端开发:*
"让我看看后端 Stories..."

**STORY-BE-001: {{标题}}**
- **复杂度:** Low / Medium / High
- **理由:** {{为什么是这个复杂度}}

{{继续其他后端 Stories}}

---

**复杂度评估汇总：**

| Story ID | 标题 | 复杂度 | 负责人 |
|----------|------|--------|--------|
| STORY-FE-001 | {{标题}} | Low | Frontend Dev |
| STORY-BE-001 | {{标题}} | Medium | Backend Dev |

这些复杂度评估准确吗？"

### 3. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4] Complexity Estimation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
  Low Complexity: {{count}}
  Medium Complexity: {{count}}
  High Complexity: {{count}}

Options:

  [F] Finalize & Continue
      → Complexity estimates are correct

  [B] Back to Create Stories
      → Make changes to stories

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Handle User Choice

#### If User Chooses [B] (Back to Create Stories):

Display: "**Returning to story creation...**"

1. Load, read entire `./step-03-create-stories.md`
2. Execute that step (allows revision of stories)

#### If User Chooses [F] (Finalize & Continue):

Display: "**Proceeding to time estimation...**"

1. Store complexity assessments in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Complexity estimated for all stories
- Complexity ratings documented
- Technical team input incorporated
- Complexity reasoning provided

### ❌ SYSTEM FAILURE:
- Stories without complexity assessment
- No complexity reasoning provided
- Not consulting technical team

**Master Rule:** Proceeding without complexity assessment for all stories is FORBIDDEN.
