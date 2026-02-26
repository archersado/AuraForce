---
name: 'step-07-sync-to-linear'
description: 'Create Linear Story records for tracking and management'

# File references (ONLY variables used in this step)
requirementsFile: '{output_folder}/stories/{feature-name}.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/task-breakdown/workflow.md'
nextWorkflow: 'dev-delivery'
---

# Step 7: Sync to Linear

## STEP GOAL:
To create Linear Story records for tracking and management.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A REPORTER AND INTEGRATOR for this step

### Role Reinforcement:
- ✅ You are PM (Project Manager) - professional, organized, proactive
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Handle Linear MCP integration professionally
- ✅ Inform user about integration status clearly

### Step-Specific Rules:
- 🎯 Focus only on Linear MCP integration
- 🚫 FORBIDDEN to panic if Linear unavailable - gracefully handle
- 📝 Create Linear Stories if MCP available
- ⚠️ Provide manual creation instructions if unavailable

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is the final step - no continuation
- ⚠️ Linear MCP is optional but recommended

## CONTEXT BOUNDARIES:
- Available context: Complete story list from step-06
- Focus: Linear MCP integration for story creation
- Limits: Continue workflow whether Linear succeeds or fails
- Dependencies: Steps 01-06 complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 7】Sync to Linear**"

### 2. Check Linear MCP Availability

Check if Linear MCP is available by attempting to list teams:

Use: `mcp__linear__list_teams()`

#### If Linear MCP is Available:

Display: "这个问题我理解，让我来协调一下。**Linear MCP is available.** Creating Linear Stories..."

Proceed to Linear sync sequence.

#### If Linear MCP is NOT Available:

Display: "这个问题我理解，让我来协调一下。

**⚠️ Linear MCP not available.** No worries - the story list document has been created and saved.

Here are the stories ready for manual entry to Linear:

{{Story list summary}}

You can always set up Linear MCP later.

**Task Breakdown Complete!**

Next: Use `dev-delivery` workflow for actual development execution."

Stop workflow execution.

### 3. Linear Sync Sequence (Only if MCP Available)

#### 3.1 For Each Story, Create Linear Issue

Use: `mcp__linear__create_issue()` with:
- `title`: {{story_title}}
- `description`: Story description with acceptance criteria
- `team`: Default team or from config
- `project`: Related project if available
- `priority`: 3 (Normal)
- `labels`: ['story', 'frontend/backend/qa', 'complexity-level']
- `estimate`: Time estimate (story points or hours)

#### 3.2 Display Sync Results

Display sync summary:

"这个问题我理解，让我来协调一下。

**Linear 同步完成！**

**成功创建的 Stories:**

| Story ID | Linear Issue ID | 标题 | 状态 |
|----------|----------------|------|------|
| STORY-FE-001 | {{linear_id}} | {{标题}} | Created |

**同步统计:**
- 总 Stories: {{count}}
- 成功同步: {{count}}
- 同步失败: {{count}}

**任务拆解完成！**

---

**下一步建议:**
- 使用 `dev-delivery` workflow 进行实际开发执行
- 在 Linear 中跟踪 Story 实施进度
- 前端、后端开发可以开始实施各自的 Stories"

#### 3.3 Update Requirements Document

Add Linear IDs to story list document frontmatter:
```yaml
linear:
  enabled: true
  syncedAt: {{current_date}}
  storiesCreated: {{count}}
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Linear MCP checked for availability
- If available: Linear Stories created successfully
- Sync results displayed clearly
- Next steps suggested clearly
- If unavailable: Graceful handling with manual instructions

### ❌ SYSTEM FAILURE:
- Not checking Linear MCP availability
- Stopping workflow when Linear unavailable
- Not providing clear sync results
- Not suggesting next steps

**Master Rule:** Stopping workflow when Linear is unavailable is FORBIDDEN. Always continue with clear instructions.
