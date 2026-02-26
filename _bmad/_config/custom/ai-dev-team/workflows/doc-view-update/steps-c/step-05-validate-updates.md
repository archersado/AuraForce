---
name: 'step-05-validate-updates'
description: 'Validate document update content and reason for reasonability'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-update-document.md'
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/doc-view-update/workflow.md'
configFile: '{project-root}/_bmad/bmb/config.yaml'
---

# Step 5: Validate Updates

## STEP GOAL:
To validate the document update content and reason for reasonability, completeness, and consistency with the rest of the document.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- ✅ VALIDATE updates against document context and domain best practices

### Role Reinforcement:
- ✅ You are the **Routed Agent** based on document type:
  - PM / Product Designer for PRD documents
  - UX Designer for interaction design documents
  - Technical Architect for technical design documents
  - QA Engineer for test case documents
- ✅ If you already have been given communication_style and identity, continue to use those while playing this role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use domain expertise to validate update quality

### Step-Specific Rules:
- 🎯 Focus on validating update quality and reasonableness
- ✅ ANALYZE update content against document best practices
- ✅ IDENTIFY potential issues or gaps
- 🚫 FORBIDDEN to apply updates yet
- 🤝 Request PM or document owner confirmation for approval

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use routed agent's communication style with domain expertise
- ✅ Validation requires PM or document owner role confirmation

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Previously stored: document_type, document_name, document_content, update_content, update_reason, agent_role
- Focus: Update validation
- Limits: Validation only, no application yet
- Dependencies: Step 04 completed with update request

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 7】Validate Updates**"

### 2. Load Configuration

Load and read full config from `{configFile}` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`

### 3. Retrieve Context

Retrieve stored values from previous steps:
- `document_type`: Document type
- `document_name`: Document file name
- `document_content`: Current document content
- `update_content`: Proposed update content
- `update_reason`: Update reason
- `agent_role`: Routed agent role

### 4. Display Validation Context

Display greeting from routed agent:

"**你好！我是{agent_role}。** ✅

这个问题我理解，让我来验证一下。

**您提出的更新请求：**

**文档:** {document_name}

**更新内容:**
{display_update_content}

**更新原因:**
{display_update_reason}

我将从以下几个方面验证这些更新：
1. **合理性** - 更新内容是否符合文档目的
2. **完整性** - 更新是否足够详细和具体
3. **一致性** - 更新是否与文档其他部分协调
4. **最佳实践** - 是否符合{document_type_name}文档的最佳实践

**注意:** 最终应用更新需要得到PM或{agent_role}的确认。"

### 5. Perform Validation Analysis

Analyze the update request based on document type:

#### Validation Criteria by Document Type:

**PRD Documents:**
- [ ] Feature change aligned with product goals
- [ ] User story format appropriate
- [ ] Acceptance criteria clear and measurable
- [ ] No conflicts with existing requirements
- [ ] Reason for change is valid

**Interaction Design Documents:**
- [ ] User flow makes logical sense
- [ ] UI elements follow design system
- [ ] Interaction patterns are user-friendly
- [ ] No conflicts with other screens/flows
- [ ] Design change addresses user pain points

**Technical Design Documents:**
- [ ] Architecture decision is sound
- [ ] Implementation approach is feasible
- [ ] Technical considerations addressed
- [ ] No breaking changes to existing system
- [ ] Technical rationale is well-founded

**Test Case Documents:**
- [ ] Test case covers the scenario properly
- [ ] Expected outcome is clear
- [ ] Test steps are reproducible
- [ ] Links to requirements/features correct
- [ ] Test scenario is relevant

### 6. Present Validation Findings

Display validation results:

"**验证结果:**

**✅ 通过的检查项:**
{List validation criteria that pass}

**⚠️ 需要注意的问题:**
{List any issues or concerns found, if any}

**💡 建议:**
{Provide any suggestions for improving the update, if applicable}

如果有任何问题或建议，请确认是否需要调整更新内容。"

If there are major concerns:

 "**⚠️ 根据验证结果，我发现了以下需要解决的问题：**

{List critical issues}

建议在应用更新前先解决这些问题。"

### 7. Request Approval from PM or Document Owner

Update permissions require confirmation:

"**更新权限确认:**

根据文档权限规则，应用此更新需要以下角色的确认：
- PM（项目经理）- 可以确认所有文档类型
- {agent_role} - 可以确认{document_type_name}文档

**请确认您是否具有相应的更新权限？**"

#### If User Has Permission:

"**作为PM或{agent_role}，请您确认是否批准此更新：**"

Present approval menu.

#### If User Does Not Have Permission:

"**您当前没有直接确认此更新的权限。**

您可以：
1. 联系PM或{agent_role}进行确认
2. 我可以记录此更新请求，供后续审批

您希望如何进行？"

Handle accordingly.

### 8. Present Approval Menu (For Authorized Users)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Update Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document: {document_name}
Type: {document_type_name}

Validation Status:
  ✅ Reasonability: PASS
  ✅ Completeness: PASS
  ✅ Consistency: PASS
  ✅ Best Practices: PASS

Options:

  [V] Validated & Approve
      → Update looks good, approve and proceed to apply

  [R] Request Changes
      → Update needs modifications before approval

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If validation found issues:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Update Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document: {document_name}
Type: {document_type_name}

Validation Status:
  ✅ Reasonability: PASS
  ⚠️ Completeness: ISSUES FOUND
  ⚠️ Consistency: ISSUES FOUND
  ✅ Best Practices: PASS

Issues Found:
  {List specific issues}

Options:

  [M] Modify Update
      → Adjust update content to address issues

  [R] Request Changes
      → Update needs more significant modifications

  [X] Apply Despite Issues
      → Proceed anyway (not recommended)

  [C] Cancel Workflow
      → Exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Handle User Choice

#### If User Chooses [V] (Validated & Approve):

Display: "**Update approved. Proceeding to apply changes...**"

Store update_status="APPROVED".
Load, read entire `nextStepFile`
Execute `nextStepFile`

#### If User Chooses [M] (Modify Update):

Ask what modifications are needed.
Update the update_content accordingly.
Re-run validation analysis.
Re-display menu.

#### If User Chooses [R] (Request Changes):

Ask what changes are needed.
Guide user to provide more detailed or different update.
Return to previous step if major changes needed.

#### If User Chooses [X] (Apply Despite Issues):

Confirm warning: "**⚠️ 您确认要对存在问题的更新应用修改吗？这可能影响文档质量。**"

If confirmed:
Store update_status="APPROVED_WITH_WARNINGS".
Load, read entire `nextStepFile`
Execute `nextStepFile`

#### If User Chooses [C] (Cancel Workflow):

Display: "**Workflow cancelled.**"

Exit workflow with status: Cancelled

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Document context retrieved correctly
- Update validation performed with domain expertise
- Validation findings clearly presented
- PM or document owner approval obtained
- Update status confirmed
- Next step initiated with approval

### ❌ SYSTEM FAILURE:
- Proceeding without performing validation
- Not using routed agent's domain expertise
- Applying updates without PM or document owner confirmation
- Proceeding with critical validation issues

**Master Rule:** Applying updates without PM or document owner confirmation is FORBIDDEN. Validation must be completed before update application.
