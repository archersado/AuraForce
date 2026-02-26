---
name: 'step-03b-gather-change'
description: 'Gather specific change requirements through collaborative dialogue'

# File references (ONLY variables used in this step)
nextStepFile: './step-04b-generate-change.md'
templateChange: '{project-root}/_bmad/ai-dev-team/workflows/project-create-requirement/templates/template-change.md'
outputFolder: '{output_folder}/prd/'
brainstormingTask: '{project-root}/_bmad/bmb/tasks/brainstorming.xml'
---

# Step 3B: Gather Change Requirements

## STEP GOAL:
To gather specific change requirements through first-principles dialogue for change mode.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - experienced, organized, proactive project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring project management expertise, first principles thinking, requirement analysis
- ✅ Use open-ended questions to understand the core change needed

### Step-Specific Rules:
- 🎯 Focus on gathering concise change requirements
- 🚫 FORBIDDEN to create/finalize the document yet
- 💬 Approach: First-principles exploration - understand what change and why
- 🧠 Offer brainstorming if user is stuck or wants to explore alternatives

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🧠 Brainstorming task available via [P] option
- 🚫 This is a gathering step - collect info, don't generate output yet

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Focus: Collecting change requirement info (name, description, scope)
- Limits: Don't create the document yet, just gather information
- Dependencies: Step 02 selected 'change' mode, mode = 'change'

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Display Current Progress

Display: "**【Step 3 of 6】Gather Change Requirements**"

### 2. Apply Template and Start Dialogue

Load `templateChange` and start gathering requirements. Use first-principles open-ended questions:

"这个问题我理解，让我来协调一下。

**现在我们来收集改动需求。** 前面你说想做一个改动，我们来确认一下具体细节。

**首先，这个改动我们叫什么名字？** 比如一个简短的描述，像「登录页面优化」这样。"

### 3. Gather Requirements Section by Section

Use PM's first-principles approach - ask "why" to understand root needs:

**Section 1: 需求名称**
- Ask: 给这个改动起个名字吧

**Section 2: 描述**
- Ask: 你具体想改什么？能详细描述一下吗？
- Ask: 现在的情况是怎样的？预期的变化是什么？
- Ask: 你希望改完之后达到什么效果？

**Section 3: 范围**
- Ask: 这个改动会涉及到哪些部分？
- Ask: 有哪些东西是你明确不想改的？
- Ask: 需要注意什么边界条件吗？

After collecting each section, confirm with user:
"我理解是这样...对吗？还有其他需要补充的吗？"

### 4. Present Interactive Menu

After gathering initial information, display menu:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 3B] Change Requirements Gathering
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Requirements Status:
  ✓ 需求名称: {{collected or pending}}
  ✓ 描述: {{collected or pending}}
  ✓ 范围: {{collected or pending}}

Options:

  [A] Add More Information
      → Add or update any section

  [P] Brainstorm Ideas
      → Explore alternative approaches

  [C] Continue to Generate Document
      → Move to the next step to create requirements document

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Handle User Choice

#### If User Chooses [A] (Add More Information):

Ask which section they want to update or add to:

"你想更新哪个部分？
- 需求名称
- 描述
- 范围"

Collect the information using first-principles questions, then redisplay menu.

#### If User Chooses [P] (Brainstorm):

Load and execute `brainstormingTask`.

After brainstorming completes, ask:

"要不要把刚才 brainstorming 的想法加到需求里？想加到哪个部分？"

Collect any additions, then redisplay menu.

#### If User Chooses [C] (Continue):

Display: "**Proceeding to generate change requirements document...**"

1. Store collected requirements in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- All change requirement sections collected through first-principles dialogue
- User confirms information accuracy
- Option to add/update information before proceeding
- Brainstorming offered and available
- Clear requirements status displayed

### ❌ SYSTEM FAILURE:
- Not asking first-principles "why" questions
- Using fixed options/checkboxes instead of open dialogue
- Proceeding with missing critical sections
- Not confirming user understanding

**Master Rule:** Forcing users into fixed option lists instead of first-principles dialogue is FORBIDDEN.
