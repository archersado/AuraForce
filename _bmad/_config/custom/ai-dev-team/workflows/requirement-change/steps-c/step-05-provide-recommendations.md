---
name: 'step-05-provide-recommendations'
description: 'Provide change recommendations'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-confirm-with-user.md'
---

# Step 5: Provide Recommendations

## STEP GOAL:
To provide change recommendations based on impact and feasibility assessments.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - decisive, analytical project manager
- ✅ Use PM's communication style
- ✅ Use PM key phrases appropriately
- ✅ We engage in collaborative dialogue, not command-response

### Step-Specific Rules:
- 🎯 Focus on providing clear recommendations based on assessments
- 🚫 FORBIDDEN to skip recommendation phase
- 💬 Approach: Synthesize, recommend, explain

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style
- 🎯 Use PM key phrases:
  - "这个变更可以接受，影响不大"
  - "这个变更会影响已完成的X功能，需要重新评估"
  - "这个变更比较复杂，建议推迟到下一版本"

## CONTEXT BOUNDARIES:
- Available context: Change request, Impact assessment, Feasibility assessment
- Focus: Providing change recommendations
- Dependencies: All previous assessments

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 8】Provide Recommendations**"

### 2. Retrieve Context

Retrieve from session memory:
- Change request details
- Impact assessment results
- Feasibility assessment results

### 3. Synthesize Assessments and Provide Recommendations

As PM, synthesize all assessments and provide clear recommendations:

"基于前面的影响评估和技术可行性评估，我现在给你提供变更建议。"

**Display Change Request Summary:**

"**变更请求摘要：**
{{Change request summary}}"

**Display Impact Assessment Summary:**

"**影响评估摘要：**
- 影响级别：{{impact level}}
- 主要影响：{{key impact factors}}"

**Display Feasibility Assessment Summary:**

"**技术可行性摘要：**
- 可行性评级：{{feasibility rating}}
- 主要考虑：{{key feasibility factors}}"

**Provide PM Recommendations:**

Based on the assessments, determine and provide one of the following recommendations:

#### Option A: Accept Change (Impact: Low, Feasibility: High)

"**我的建议：接受变更**

这个变更可以接受，影响不大。

**理由：**
- 对已完成功能影响最小
- 技术实现难度不高
- 时间成本可控

**实施建议：**
- 可以在当前版本实施
- 预计需要{{time estimate}}
- 需要修改{{affected features/stories}}"

#### Option R: Reject Change (Impact: High, Feasibility: Low)

"**我的建议：拒绝变更**

这个变更会影响已完成的{{X功能}}，需要重新评估。

**理由：**
- 变更对已完成功能影响过大
- 技术实现存在较大风险
- 时间成本超出预期

**替代方案建议：**
- {{suggest alternative if applicable}}"

#### Option Aj: Adjust Change (Impact: Medium, Feasibility: Medium)

"**我的建议：调整变更**

这个变更比较复杂，建议推迟到下一版本。

**理由：**
- 变更影响中等偏大
- 技术实现需要更多时间
- 当前版本时间紧张

**调整建议：**
- {{specific adjustment suggestions}}
- 建议在下一版本实施
- 或者分阶段实施"

**Display Additional Considerations:**

"**其他考虑：**
{{additional considerations as needed}}"

### 4. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Provide Recommendations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [A] Accept Change
      → I agree to implement the change as recommended

  [R] Reject Change
      → I decline to implement the change

  [Aj] Adjust Change
      → I want to adjust the approach or consider alternatives

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Handle User Choice

#### If User Chooses [A] (Accept Change):

Display: "**变更已接受，开始确认变更决定...**"

1. Store decision as "accepted" in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

#### If User Chooses [R] (Reject Change):

Display: "**变更已拒绝。**"

Store decision as "rejected" in session memory.

Display final message:

"变更请求已被拒绝。如果你有其他变更需求，请随时提出。"

Stop workflow execution.

#### If User Chooses [Aj] (Adjust Change):

Ask user to describe what adjustments they would like to make:
- Different implementation approach?
- Different timing?
- Different scope?
- Alternative solutions?

Collect user's preferences, then provide updated recommendations based on user's input, and re-display the menu.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Recommendations based on assessments provided
- Clear rationale for recommendations explained
- User's decision options presented
- User makes a decision

### ❌ SYSTEM FAILURE:
- Skipping recommendation phase
- Providing recommendations without rationale
- Not presenting clear decision options
- Proceeding without user decision

**Master Rule:** Skipping recommendation or proceeding without user decision is FORBIDDEN.
