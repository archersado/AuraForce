---
name: 'step-07-update-linear'
description: 'Update Epic and Story in Linear'

# File references (ONLY variables used in this step)
nextStepFile: './step-08-report-results.md'
---

# Step 7: Update Linear

## STEP GOAL:
To update Epic and Story records in Linear based on the approved change request.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR managing Linear updates

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, systematic project manager
- ✅ Use PM's communication style
- ✅ Ensure all changes are properly documented

### Step-Specific Rules:
- 🎯 Focus on updating Linear records based on approved change
- 🚫 FORBIDDEN to skip Linear updates
- 💬 Approach: Update, verify, proceed

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style
- 🔄 Use Linear MCP for all updates
- ✅ Handle Linear MCP unavailability gracefully

## CONTEXT BOUNDARIES:
- Available context: All previous data, confirmed change decision
- Focus: Updating Linear Epic and Story records
- Integration: Linear MCP
- Dependencies: Confirmed change decision from Step 6

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 8】Update Linear**"

### 2. Retrieve Context

Retrieve from session memory:
- Change request details
- Confirmed change decision
- Impact assessment results
- Implementation plan

### 3. Update Linear Records

Use Linear MCP to update Epic and Story records:

Display: "正在更新Linear中的项目状态..."

#### Step 3.1: Identify Records to Update

Based on the impact assessment, identify which records need updates:
- Epics that need modification
- Stories that need modification
- New Stories that need to be created

#### Step 3.2: Update Existing Epic/Story Records

For each Epic/Story that needs modification:

1. **Get the issue details:**
   - Use `mcp__linear__get_issue` with the issue ID

2. **Update the issue description:**
   - Use `mcp__linear__update_issue` to add change request information
   - Add a section to the description noting the change influence
   - Example update to description:
   ```
   ...

   ---
   **最近变更影响：**
   - 变更日期：{{date}}
   - 变更内容：{{change content}}
   - 影响说明：{{impact notes}}
   ```

3. **Update issue status if needed:**
   - Use `mcp__linear__update_issue` to change status if necessary
   - For example: Move affected stories to "待调整" or "重新评估" state

4. **Update labels if needed:**
   - Use `mcp__linear__update_issue` to add labels like "变更影响"

#### Step 3.3: Create New Story Records

For new tasks identified in the implementation plan:

1. **Create new Linear issues:**
   - Use `mcp__linear__create_issue` for each new story
   - Map the story structure to Linear issue fields:
     ```yaml
     title: Story标题
     description: |
       Story描述

       验收标准：
       - {{acceptance criteria}}

       ---
       变更来源：{{change request reference}}
       创建日期：{{date}}
     team: {{team name}}
     project: {{project name}}
     priority: {{priority}}
     state: {{initial state}}
     labels: ["变更任务"]
     ```

2. **Set relationships if needed:**
   - Use `mcp__linear__update_issue` with `blockedBy` or `blocks` for dependencies

#### Step 3.4: Handle Linear MCP Unavailability

If Linear MCP is not available:

Display: "**Linear MCP当前不可用。**"

Inform the user about the situation and provide a manual update guide:

"由于Linear MCP当前不可用，请手动更新Linear记录：

**需要更新的Epic/Story：**
{{List of records to update}}

**需要新建的Story：**
{{List of new stories to create}}

**手动更新指南：**
1. 访问Linear项目
2. 更新受影响的Epic/Story描述，添加变更信息
3. 创建新的Story记录
4. 设置适当的状态和标签

你完成手动更新后，我们继续生成报告吗？"

Wait for user confirmation and proceed to next step.

### 4. Verify Updates

After updating Linear records, display a summary of what was updated:

"**Linear更新完成！**

**更新的记录：**
{{List of updated Epic/Story records}}

**新建的记录：**
{{List of new Story records created}}

**更新摘要：**
- 更新了{{count}}个Epic/Story
- 新建了{{count}}个Story
- 所有变更已记录到Linear"

### 5. Proceed to Next Step

Since this is an automated step, display:

"正在生成变更处理报告..."

1. Store update results in session memory
2. Load, read entire `nextStepFile`
3. Execute `nextStepFile`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Linear records updated based on approved change
- All affected Epic/Story records modified
- New Story records created as needed
- Update summary displayed

### ❌ SYSTEM FAILURE:
- Skipping Linear updates
- Not updating all affected records
- Not updating issue descriptions with change information
- Not handling Linear MCP unavailability gracefully

**Master Rule:** Skipping Linear updates or incomplete updates is FORBIDDEN.
