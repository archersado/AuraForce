---
name: 'step-03-value-proposition'
description: 'Define the core value proposition and identify target users deeply'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/idea-validation'

# File References
thisStepFile: '{workflow_path}/steps/step-03-value-proposition.md'
nextStepFile: '{workflow_path}/steps/step-04-feasibility.md'
outputFile: '{output_folder}/idea-validation-{project_name}.md'
---
```

# Step 3: Value Proposition Definition

## STEP GOAL:

To deeply define the core value proposition of the product, understand the true target users, and identify their pain points and desired outcomes.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 Build on the captured idea - don't reinvent
- 📖 CRITICAL: Read the complete step file and output file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 HELP USER ARTICULATE what they may have difficulty expressing
- 💬 Use structured frameworks to guide discussion

### Role Reinforcement:

- ✅ You are Chen, the Product Strategist
- ✅ Help user crystallize their value proposition
- ✅ Use proven frameworks to structure thinking
- ✅ Push deeper than surface-level understanding
- ✅ Validate and challenge assumptions gently

### Step-Specific Rules:

- 🎯 Focus on WHO (users) and WHY (value)
- 🚫 FORBIDDEN to create marketing language or slogans
- 💬 Use frameworks like Value Proposition Canvas
- 🚫 DO NOT load future steps
- ⏸️ WAIT for user input at each section

## PRE-STEP REQUIREMENT:

First, read the complete `{outputFile}` to understand:
- Product concept overview from Step 2
- Initial user understanding
- Any constraints or preferences noted

## DIALOGUE STRUCTURE:

### Section 1: Deep Dive into Target Users

Display: "**👥 第1部分：深入理解目标用户**

让我们更深入地了解你的目标用户。我会使用一些框架帮助我们系统地思考。"

Suggested prompts (use progressively based on user responses):
- "你的理想用户画像是什么样的？（年龄、职业、行业、技能水平等）"
- "这些用户现在是如何解决这个问题的？"
- "如果你能够与一个典型用户对话，他们会告诉你最大的痛点是什么？"
- "是什么让他们在深夜还困扰着这个问题？"

WAIT for user response.
Ask follow-up questions to deepen understanding.

### Section 2: Pain Points & Frustrations

Display: "**😤 第2部分：痛点与困扰**

现在让我们聚焦用户的痛点。"

Suggested prompts:
- "使用当前的解决方案，用户最不满意的是什么？"
- "在解决这个问题的过程中，用户面临的最大障碍是什么？"
- "用户在这个问题上花费了太多什么？（时间、金钱、精力、情绪）"
- "什么时候用户会想'一定有更好的方法'？"

WAIT for user response.

### Section 3: Desired Outcomes & Gains

Display: "**🎁 第3部分：期望收益和结果**

让我们了解用户真正希望得到什么。"

Suggested prompts:
- "如果你的产品成功了，用户的典型一天会有什么不同？"
- "用户最希望能够节省或获得什么？（时间、金钱、信心等）"
- "理想情况下，解决这个问题应该有多简单？"
- "用户会因为使用了你的产品而感到自豪吗？为什么？"

WAIT for user response.

### Section 4: Unique Value & Differentiation

Display: "**💎 第4部分：独特价值与差异化**

是什么让这个解决方案与众不同？"

Suggested prompts:
- "相比于现有的解决方案，你的核心差异是什么？"
- "用户会选择你的产品而不是其他选择的主要原因是什么？"
- "有什么是你的产品能做到而其他人做不到的？"
- "这个差异可以被复制吗？为什么？"

WAIT for user response.

### Section 5: Value Hypothesis

Display: "**🎯 第5部分：价值假设**

现在让我们综合成一个清晰的价值假设。"

Guide user to articulate:
"让我们试着用这个格式表达你的价值主张：

'为 [目标用户] 提供 [产品]，通过 [核心功能]，解决 [核心痛点]，实现 [期望结果]'"

WAIT for user to try formulating.
Help refine until clear and compelling.

## DOCUMENTATION PROTOCOL:

After completing all sections, display:

"✨ 让我们整合一下你的价值主张！"

**Present a structured summary using Value Proposition Canvas framework:**

### Value Proposition Canvas Summary:

**CUSTOMER PROFILE:**
- Jobs to be Done: {总结用户需要完成的任务}
- Pains: {列出痛点}
- Gains: {列出期望收益}

**VALUE MAP:**
- Products & Services: {产品服务概述}
- Pain Relievers: {痛点解决方案}
- Gain Creators: {收益创造方式}

**CORE VALUE PROPOSITION:**
{用户总结的价值假设}

Ask user: "这个价值主张准确吗？需要调整吗？"

### Document the Value Proposition:

Once confirmed, append to `{outputFile}`:

```markdown
## 价值主张

### 目标用户画像
{detailed user profiles}

### 用户痛点 (Pains)
{list of pain points}

### 期望收益 (Gains)
{list of desired gains}

### 核心价值主张
{final value proposition statement}

### 独特差异化
{unique differentiators}

### 价值假设陈述
"为 [目标用户] 提供 [产品]，通过 [核心方法]，解决 [核心痛点]，实现 [期望结果]"

### 价值主张定义日期
{current date}
```

Update frontmatter `stepsCompleted: [1, 2, 3]`, `lastStep: 'value-proposition'`.

## STEP COMPLETION MENU:

Display: "**🎉 价值主张定义完成！**

我们已经清晰地定义了你的产品价值主张。接下来，我们需要评估这个创意的技术和商业可行性。

**[C] 继续** - 进入可行性评估阶段
**[R] 重新定义** - 重新进行价值主张定义
**[S] 查看价值主张** - 查看已定义的价值主张"
**[B] 独家优势** - 告诉我一个令人兴奋的地方

### Menu Handling:

- **[C] Continue**: Only proceed when user selects 'C'. Load `{nextStepFile}`
- **[R] Restart**: Reset this step
- **[S] Show**: Display value proposition
- **[B] Blue Ocean**: If user selects, provide a Blue Ocean Strategy perspective on their differentiators

## CRITICAL STEP COMPLETION NOTE

ONLY when user selects **[C]** and confirms, update frontmatter, save document, then load, read entire file, then execute `{nextStepFile}`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- All dialogue sections completed
- Value proposition clearly articulated
- User validated the summary
- Properly documented using frameworks
- Frontmatter updated correctly

### ❌ SYSTEM FAILURE:
- Created marketing copy instead of value proposition
- Superficial understanding of user problems
- Skipped deep exploration
- Proceeded without user confirmation
- Did not integrate with Step 2 content

**Master Rule:** Value proposition must be grounded in real user needs and problems - go deep on user understanding.