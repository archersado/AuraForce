---
name: 'step-04-receive-updates'
description: 'Receive document update content and reason from user'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-validate-updates.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/doc-view-update/workflow.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
---

# Step 4: Receive Updates

## STEP GOAL:
To collect document update content and reason from the user for subsequent validation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📝 COLLECT actual update content, do NOT generate or improvise

### Role Reinforcement:
- ✅ You are the **Routed Agent** based on document type:
  - PM / Product Designer for PRD documents
  - UX Designer for interaction design documents
  - Technical Architect for technical design documents
  - QA Engineer for test case documents
- ✅ If you already have been given communication_style and identity, continue to use those while playing this role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Bring domain expertise for validating document updates

### Step-Specific Rules:
- 🎯 Focus on collecting clear, specific update content
- 📝 Collect both the change description AND the reason
- 🚫 FORBIDDEN to apply updates yet
- 💬 Approach: Collaborative update collection with domain guidance

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use routed agent's communication style with domain expertise
- ✅ Ask for specific format updates when possible

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Previously stored: document_type, document_name, document_content, agent_role
- Focus: Update content collection
- Limits: Collection only, no validation or application yet
- Dependencies: Step 03 completed with update request

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 7】Receive Updates**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Retrieve Context

Retrieve stored values from previous steps:
- `document_type`: Document type
- `document_name`: Document file name
- `document_content`: Current document content
- `agent_role`: Routed agent role

### 4. Display Update Instructions

Display greeting from routed agent:

"**你好！我是{agent_role}。** 📝

这个问题我理解，让我来协助你。

**您想要更新文档: {document_name}**

为了确保文档更新的质量和清晰度，请提供以下信息：

**1. 更新描述**
请描述您想要进行的修改。可以是：
- 具体段落或章节的修改
- 新增内容
- 删除内容
- 格式调整

**2. 更新原因**
请说明进行这次更新的原因。例如：
- 需求变更
- 发现错误或遗漏
- 产品优化
- 技术方案调整
- 测试覆盖改进"

### 5. Collect Update Content

Ask for update details:

"**请提供您想要的更新（尽可能具体）：**

您可以直接说明修改内容，例如：
- 在'功能描述'部分添加XXX
- 修改第3段为YYY
- 在'技术架构'章节新增关于ZZZ的内容
- 更新'验收标准'中的第2点

或者，如果您有更详细的修改草稿，也可以直接提供修改后的完整内容。"

Listen to and record user's update request.

### 6. Collect Update Reason

After receiving update content, ask for the reason:

"**请说明进行此更新的原因：**"

Listen to and record user's reason.

### 7. Summarize Update Request

Present summary of what was collected:

"**以下是我整理的更新请求摘要：**

**文档:** {document_name}

**更新内容:**
{Summarize the update content clearly}

**更新原因:**
{Summarize the reason clearly}

为了确保更新准确性，我可能需要确认一些细节。"

### 8. Clarify Additional Details (If Needed)

If the update description is unclear or ambiguous:

Ask clarifying questions specific to the document type:

**For PRD documents:**
- "关于{feature}，是新增功能还是修改已有功能？"
- "这个需求变更会影响哪些用户场景？"

**For Interaction Design documents:**
- "关于{interaction}，是修改交互流程还是界面元素？"
- "这个设计变更是否影响其他页面？"

**For Technical Design documents:**
- "关于{technical change}，这是架构级调整还是实现细节？"
- "这个技术变更是否影响其他模块？"

**For Test Cases documents:**
- "关于{test case}, 是新增测试用例还是修改已有用例？"
- "这个测试变更基于的需求是什么？"

Proceed until the update request is clear and specific.

### 9. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4] Update Collection Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document: {document_name}
Type: {document_type_name}

Update Summary:
  Content: {update_summary}
  Reason: {reason_summary}

Options:

  [A] Approve & Continue
      → Update collection complete, proceed to validation

  [P] Provide Additional Information
      → Add more details to update request

  [R] Reset Update Request
      → Start over with update request

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Handle User Choice

#### If User Chooses [A] (Approve & Continue):

Display: "**Proceeding to update validation...**"

Store update_content and update_reason in session memory.
Load, read entire `nextStepFile`
Execute `nextStepFile`

#### If User Chooses [P] (Provide Additional Information):

Ask what additional details are needed.
Update the update summary accordingly.
Re-display menu for confirmation.

#### If User Chooses [R] (Reset Update Request):

Clear stored update_content and update_reason.
Re-display update instructions from step 5.

#### If User Chooses [C] (Cancel Workflow):

Display: "**Workflow cancelled.**"

Exit workflow with status: Cancelled

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Document context retrieved correctly
- Update content collected with sufficient detail
- Update reason collected and recorded
- Clarification provided for ambiguous requests
- User confirmed update request
- Next step initiated with update context

### ❌ SYSTEM FAILURE:
- Proceeding without collecting update content
- Not using routed agent's domain expertise
- Collecting updates without asking for reason
- Proceeding with ambiguous update requests

**Master Rule:** Skipping update content or reason collection is FORBIDDEN. Updates must be clearly understood before proceeding to validation.
