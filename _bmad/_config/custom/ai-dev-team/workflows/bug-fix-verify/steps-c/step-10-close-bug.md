---
name: 'step-10-close-bug'
description: 'PM closes the bug in Linear'

# File references (ONLY variables used in this step)
workflowFile: '{project-root}/_bmad/ai-dev-team/workflows/bug-fix-verify/workflow.md'
---

# Step 10: Close Bug

## STEP GOAL:
As PM, to close the Bug Story in Linear with a final status update and complete the bug fix workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A COORDINATOR (PM role) for this step
- 🎯 Close Bug Story and complete workflow

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, closing-focused, completion-driven
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Close Bug Story in Linear
- ✅ Complete workflow successfully

### Step-Specific Rules:
- 🎯 Focus on properly closing Bug Story and documenting completion
- 🚫 FORBIDDEN to close without updating documentation
- 💬 Approach: Professional closure, documentation complete
- 🔌 Use Linear MCP for actual Bug closure

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "Bug修复完成并验证通过，我来关闭这个Bug"
- 🔌 ACTUALLY USE Linear MCP to close the Bug Story
- 🚫 This is a closure step - complete all documentation

## CONTEXT BOUNDARIES:
- Available context: Bug Story ID, successful verification result
- Focus: Close bug and complete workflow
- Limits: Don't complete without proper closure
- Dependencies: Successful verification approval

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 10 of 10】Close Bug**"

### 2. Role Switch to PM

Display role transition:

"**✓ 角色切换: PM (项目经理)**"

Display PM greeting:

"**你好！我是PM（项目经理）。** 📋

Bug修复完成并验证通过，我来关闭这个Bug。

**Bug关闭**现在开始。

我的职责是：
- 关闭Bug Story
- 更新最终状态
- 记录修复总结
- 完成工作流程"

Display PM communication style reminder:
- Phrase: "Bug修复完成并验证通过，我来关闭这个Bug"
- Approach: Professional closure, complete documentation

### 3. Display Current Workflow Status

Display workflow overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             Bug修复验证工作流
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 发现Bug                      ✓ 完成
Step 2: 创建Bug环境                  ✓ 完成
Step 3: 记录Bug详情                  ✓ 完成
Step 4: 确定受影响组件               ✓ 完成
Step 5: 创建Bug Story                ✓ 完成
Step 6: 分配Bug给开发                ✓ 完成
Step 7: 开发修复Bug                  ✓ 完成
Step 8: QA验证修复                   ✓ 完成
Step 9: 确定修复结果                 ✓ 完成并验证通过
Step 10: 关闭Bug                     ← 当前

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流完成！
```

### 4. Display Bug Closure Summary

Display bug summary for closure:

"**Bug关闭信息汇总:**"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug修复完成摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug信息:
  ├─ Bug标题:                     {{Bug标题}}
  ├─ Bug ID:                      {{Bug ID}}
  ├─ Bug Story ID:                {{Bug Story ID}}
  ├─ Bug类型:                     {{Frontend Bug / Backend Bug}}
  └─ 优先级:                       {{优先级}}

生命周期时间线:
  ├─ 发现时间:                     {{发现时间}}
  ├─ 创建时间:                     {{Story创建时间}}
  ├─ 分配时间:                     {{分配时间}}
  ├─ 修复完成时间:                 {{修复完成时间}}
  └─ 验证通过时间:                 {{验证通过时间}}

修复详情:
  ├─ 负责开发:                     {{开发人员名称}}
  ├─ 修复方案:                     {{修复方案摘要}}
  └─ 修改文件:                     {{修改文件数}} 个

验证状态:
  ├─ 验证人:                       {{QA名称}}
  ├─ 验证时间:                     {{验证时间}}
  └─ 验证结果:                     通过

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Display Closure Checklist

Display closure checklist:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug关闭检查清单
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

检查项:
─────────────────────────────────────────────────────────────
  [✓] Bug已修复完成
  [✓] QA验证测试通过
  [✓] 修复代码已提交
  [✓] Bug Story信息完整
  [✓] 修复说明已记录
  [✓] 验证结果已记录
  [✓] 相关文档已更新

关闭准备:                    ✓ 全部完成

状态更新:
  当前状态:                    In Review
  目标状态:                    Done / Closed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Update Bug Report with Final Status

Display bug report update:

"**更新Bug报告的最终状态...**"

Display final bug report summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug报告最终状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bug ID:                        {{Bug ID}}
Bug标题:                       {{Bug标题}}
─────────────────────────────────────────────────────────────

修复记录:
  开发人员:                     {{开发人员名称}}
  修复时间:                     {{修复完成时间}}
  修复方案:                     {{修复方案}}

验证记录:
  验证人:                       {{QA名称}}
  验证时间:                     {{验证时间}}
  验证结果:                     通过

最终状态:                      已关闭 ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Close Bug Story Using Linear MCP

Display Linear closure status:

"**正在使用Linear MCP关闭Bug...**"

**ACTUALLY USE Linear MCP to close the Bug Story:**

```
Use Linear MCP: update_issue
Parameters:
  id: "{{Bug Story ID}}"
  state: "Done" or "Closed"
```

Display closure result:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug关闭结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

关闭状态:                      [✓ 成功] / [✗ 失败]

成功信息:
  Bug Story ID:                {{Bug Story ID}}
  Bug标题:                     {{Bug标题}}
  关闭时间:                    {{当前时间}}
  状态已更新为:                Done / Closed

通知信息:
  → Bug Story已关闭
  → 相关人员已收到通知
  → Bug从待办列表中移除

失败处理:
  如果Linear MCP不可用或关闭失败：
  1. 记录关闭失败原因
  2. 提供手动关闭指导
  3. 标记工作流为完成状态

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IF Linear closure successful:**
Display: "**✓ Bug已成功关闭！**"

**IF Linear MCP unavailable or fails:**
Display: "**⚠ Linear关闭失败，请手动关闭...**"

Provide manual closure instructions:
1. 打开Linear中的Bug Story
2. 点击状态下拉菜单
3. 选择 "Done" 或 "Closed" 状态
4. 保存更改

### 8. Display Workflow Completion Summary

Display final workflow summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Bug修复验证工作流完成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工作流名称:                    bug-fix-verify
完成时间:                      {{当前时间}}
─────────────────────────────────────────────────────────────

Bug概要:
  Bug标题:                     {{Bug标题}}
  Bug ID:                      {{Bug ID}}
  Bug类型:                     {{Frontend Bug / Backend Bug}}

参与者:
  发现人:                       {{发现人}}
  开发人员:                     {{开发人员名称}}
  验证人:                       {{QA名称}}

生命周期:
  发现 → 开辟环境 → 记录 → 识别 → 创建Story
  → 分配 → 修复 → 验证 → 结果 → 关闭

耗时统计:
  发现到关闭:                   {{总耗时}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Bug修复验证工作流全部完成！

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

"**🎉 Bug修复验证工作流完成！**"

### 9. Display Next Steps Guidance

Display next steps options:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      后续事项
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

已完成的任务:
  ✓ Bug已修复并验证
  ✓ Bug Story已关闭
  ✓ Bug报告已更新

可选后续任务:
─────────────────────────────────────────────────────────────
  [1] 释放关联的开发资源
  [2] 更新相关项目文档
  [3] 通知相关干系人
  [4] 启动新的Bug修复流程（如果有其他Bug）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Present Final Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 10] Bug Closed - Workflow Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workflow Status: ✅ COMPLETE

Bug Closure Summary:
  Bug Title: {{Bug标题}}
  Bug Story ID: {{Bug Story ID}}
  Status: Done / Closed
  Fixed By: {{开发人员名称}}
  Verified By: {{QA名称}}

Workflow Metrics:
  Steps Completed: 10
  Total Time: {{总耗时}}
  Loop Iterations: {{循环次数}}

Deliverables:
  ✅ Bug Report Document
  ✅ Linear Bug Story (Closed)

Thank you for using the Bug Fix Verify workflow!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [N] Start New Bug Fix Workflow
      → Begin a new bug fix verification cycle

  [R] Review Workflow Summary
      → Review complete workflow summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 11. Handle User Choice

#### If User Chooses [N] (Start New Bug Fix Workflow):

Display: "**Starting new Bug Fix Verify workflow...**"

1. Return to workflow entry point
2. Reset workflow state for new bug

#### If User Chooses [R] (Review Workflow Summary):

- Display complete workflow summary
- Show all metrics and deliverables
- Allow final review
- Then present final menu again

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- PM role successfully maintained
- Linear MCP used (or fallback documented)
- Bug Story closed properly:
  - Status updated to "Done" or "Closed"
  - Timestamp recorded
- Bug report updated with final status
- Complete workflow summary provided
- All deliverables confirmed

### ❌ SYSTEM FAILURE:
- Not maintaining PM role
- Not using Linear MCP or implementing fallback
- Not closing Bug Story
- Missing final documentation

**Master Rule:** Workflow cannot be marked complete without proper Bug Story closure.
