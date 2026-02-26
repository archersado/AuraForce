---
name: 'step-08-report-results'
description: 'Report change handling results to user'

# File references (ONLY variables used in this step)
workflowComplete: true
---

# Step 8: Report Results

## STEP GOAL:
To generate and present a comprehensive change handling report to the user.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR generating reports

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, proactive project manager
- ✅ Use PM's communication style
- ✅ Active reporting of results

### Step-Specific Rules:
- 🎯 Focus on generating comprehensive change handling report
- 🚫 FORBIDDEN to skip report generation
- 💬 Approach: Report, summarize, celebrate completion

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style - proactive reporting
- 💾 Save report to `{dev_docs_folder}/change-reports/` if needed

## CONTEXT BOUNDARIES:
- Available context: All previous data, Linear update results
- Focus: Generating comprehensive change handling report
- Dependencies: All previous steps completed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 8 of 8】Report Results**"

### 2. Retrieve All Context

Retrieve from session memory:
- Change request details
- Impact assessment results
- Feasibility assessment results
- Change decision
- Implementation plan
- Linear update results

### 3. Generate Change Handling Report

As PM, generate a comprehensive change handling report:

Display: "正在生成变更处理报告..."

**Generate Report Content:**

"**变更处理报告**

---

## 1. 变更请求摘要

**变更内容：**
{{change content}}

**变更原因：**
{{change reason}}

**优先级：**
{{priority}}

**期望时间：**
{{expected time}}

**请求日期：**
{{request date}}

---

## 2. 项目状态分析

**已完成的任务（{{count}}个）：**
{{completed tasks summary}}

**进行中的任务（{{count}}个）：**
{{in-progress tasks summary}}

**待处理的任务（{{count}}个）：**
{{pending tasks summary}}

**当前项目进度：**
{{overall progress summary}}

---

## 3. 影响评估

### 3.1 对已完成功能的影响
{{completed features impact analysis}}

### 3.2 对进行中任务的影响
{{in-progress tasks impact analysis}}

### 3.3 用户体验影响
{{UX impact assessment from Interaction Designer}}

### 3.4 数据影响
{{data impact analysis, if any}}

**影响级别：**
{{impact level}} (低/中/高)

**主要影响因素：**
{{key impact factors}}

---

## 4. 技术可行性评估

### 4.1 技术可行性
{{technical feasibility analysis from Product Designer}}

**可行性评级：**
{{feasibility rating}} (可行/部分可行/不可行)

### 4.2 实现复杂度
{{implementation complexity analysis}}

### 4.3 架构影响
{{architecture impact analysis}}

### 4.4 资源需求
{{additional resource requirements}}

### 4.5 时间估算
{{time estimation breakdown}}

---

## 5. 变更决定

### 5.1 PM建议
**建议：** {{PM recommendation}}

**理由：**
{{recommendation rationale}}

### 5.2 用户决定
**决定：** **接受变更**

**确认日期：** {{ confirmation date }}

---

## 6. 实施计划

### 6.1 实施方式
{{implementation approach}}

### 6.2 时间安排
- 预计开始时间：{{start date}}
- 预计完成时间：{{completion date}}

### 6.3 受影响的任务
{{affected tasks list}}

### 6.4 新增的任务
{{new tasks list, if any}}

### 6.5 资源分配
{{resource allocation}}

---

## 7. Linear更新摘要

### 7.1 更新的记录（{{count}}个）
{{updated Epic/Story records list}}

### 7.2 新建的记录（{{count}}个）
{{new Story records list}}

### 7.3 变更记录
- 更新日期：{{update date}}
- 变更来源：{{change request reference}}

---

## 8. 后续行动计划

1. **通知团队：** 通知相关团队成员变更决定和实施计划
2. **调整排期：** 根据变更调整项目排期
3. **实施变更：** 按照实施计划执行变更
4. **跟踪进度：** 持续跟踪变更实施进度
5. **验收结果：** 变更完成后进行验收

---

## 9. 风险与缓解

**识别的风险：**
{{identified risks}}

**缓解措施：**
{{mitigation strategies}}

---

## 10. 总结

**变更处理状态：** ✅ 完成

**变更影响：** {{impact level}}

**可行性：** {{feasibility rating}}

**实施时间：** {{total time estimate}}

**PM总结：**
{{PM summary with key phrases as appropriate}}

---
**报告生成时间：** {{report generation date}}
**报告生成人：** PM (项目经理)
**项目名称：** {{project name}}

"

### 4. Save Report to File (Optional)

As PM, offer to save the report to a file:

"你希望我把这份报告保存到文件中吗？

报告可以保存到：`{dev_docs_folder}/change-reports/change-report-{{timestamp}}.md`"

If user agrees:
1. Create the change-reports directory if it doesn't exist
2. Save the report to the file with appropriate timestamp

### 5. Display Final Completion Message

Display completion message with PM's proactive communication style:

"变更处理流程全部完成！

**完成摘要：**
- 变更请求已处理
- 影响评估已完成
- 技术可行性已确认
- 变更决定已记录
- Linear已更新
- 报告已生成

**接下来你可以：**
1. 根据实施计划开始执行变更
2. 使用 `task-breakdown` 工作流创建详细的任务分解
3. 使用 `dev-delivery` 工作流开始开发实施

如果你有任何问题或需要进一步的帮助，随时告诉我！

---

**【工作流完成】requirement-change**"

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Comprehensive change handling report generated
- Report includes all assessment results and decisions
- Linear update summary documented
- Final completion message displayed
- Report saved to file if requested

### ❌ SYSTEM FAILURE:
- Skipping report generation
- Incomplete report missing key sections
- Not displaying final completion message

**Master Rule:** Skipping report generation or incomplete reports is FORBIDDEN.
