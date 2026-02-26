---
name: 'step-09-celebration'
description: 'Celebrate successful delivery and report to user'

# File references (ONLY variables used in this step)
nextStepFile: null
---

# Step 9: Celebration

## STEP GOAL:
To celebrate the successful project delivery, provide a comprehensive summary to the user, highlight achievements, and outline next steps.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - project coordinator celebrating success
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus on celebrating success and providing final summary
- 🚫 FORBIDDEN to end without proper celebration message
- 💬 Approach: Celebrate, summarize, outline next steps

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml, All workflow results
- Focus: Final celebration and summary
- Limits: This is the final step - must provide closure
- Dependencies: All previous steps must be complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 9 of 9】Celebration - Final Step**"

### 2. Load Configuration

Load and read full config from `{project-root}/_bmad/bmb/config.yaml` and resolve:
- `project_name`, `output_folder`, `user_name`, `communication_language`, `dev_docs_folder`, `artifacts_folder`

### 3. Retrieve Workflow Summary

Retrieve all session memory details:
- Story completion count
- Test results
- Bug count and status
- Delivery location
- Team contributions

### 4. Present Celebration Message

Display a celebratory message:

"这个问题我理解，让我来协调一下。

🎉🎉🎉 **恭喜！项目交付成功！** 🎉🎉🎉

**{project_name}** 已完成开发、测试、验收，并成功交付！

---

## 项目交付概览

**项目名称：** {project_name}
**交付日期：** {{current_date}}
**用户：** {user_name}

---

## 交付成果

### 开发成果
- **总Story数：** {{count}}
- **前端Stories：** {{count}} 个（全部完成）
- **后端Stories：** {{count}} 个（全部完成）
- **代码行数：** {{estimated lines}}

**实现的主要功能：**
- {{列出主要功能模块}}

### 质量成果
- **测试用例数：** {{count}}
- **测试通过率：** {{percentage}}%
- **Bug数量：** {{count}}（已全部修复）
- **代码质量：** 遵循最佳实践

### 团队协作
- **Frontend Dev：** 实现了{{count}}个前端功能
- **Backend Dev：** 实现了{{count}}个后端API
- **QA：** 设计和执行了{{count}}个测试用例

---

## 交付物清单

✅ **源代码**
- {artifacts_folder}/code/frontend/
- {artifacts_folder}/code/backend/

✅ **文档**
- {dev_docs_folder}/test-cases/
- {dev_docs_folder}/test-reports/

✅ **部署包**
- {output_folder}/delivery-{timestamp}/

✅ **Linear项目**
- 所有Stories已完成
- Bug已全部关闭
- 状态已更新为「已完成 - 已交付」

---

## 团队成就

感谢整个团队的协作努力：

- **PM** 协调项目、管理进度
- **Product Designer** 提供清晰的产品需求
- **Interaction Designer** 设计优秀的用户体验
- **Frontend Dev** 实现美观易用的界面
- **Backend Dev** 构建稳健的API和服务
- **QA** 确保产品质量

---

## 下一步建议

1. **部署上线** - 根据部署指南部署到生产环境
2. **用户培训** - 如需要，可以安排用户培训
3. **持续优化** - 收集用户反馈，规划后续优化
4. **维护支持** - 建立维护和支持流程

---

**有任何问题需要协助吗？或者需要团队处理其他事项？**"

### 5. Offer Additional Support

Ask if the user needs anything else:

"这个问题我理解，让我来协调一下。

**项目交付已完成。是否需要处理以下事项：**

1. 部署支持 - 协助部署到生产环境
2. 文档补充 - 补充更多技术文档
3. 后续优化 - 规划下一轮优化
4. 结束工作流 - 结束当前工作流

请告诉我你的需求。"

### 6. Final Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 9] Celebration - 项目交付成功！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [D] Deployment Support
      → 协助部署到生产环境

  [F] Future Planning
      → 规划下一轮功能优化

  [E] End Workflow
      → 完成当前工作流

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Handle User Choice

#### If User Chooses [D] (Deployment Support):

Offer assistance with deployment:
- Review deployment guide
- Confirm deployment environment
- Provide deployment checklist
- Offer to coordinate with DevOps

After deployment discussed, present final options again.

#### If User Chooses [F] (Future Planning):

Offer to:
- Collect user feedback for improvements
- Identify optimization opportunities
- Create new backlog items
- Plan next iteration

After planning discussed, present final options again.

#### If User Chooses [E] (End Workflow):

Display:

"这个问题我理解，让我来协调一下.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                🎉 工作流完成 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**项目：** {project_name}
**状态：** 已交付
**日期：** {{current_date}}

**感谢使用 AI Dev Team！有任何新需求时，随时启动新的工作流。**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Stop workflow execution. Mark as COMPLETE.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Configuration loaded and resolved
- Workflow summary retrieved
- Comprehensive celebration message presented
- All achievements highlighted
- Delivery summary provided
- Team collaboration acknowledged
- Next steps outlined
- User support offered

### ❌ SYSTEM FAILURE:
- Not providing celebration message
- Not summarizing project completion
- Not acknowledging team contributions
- Ending workflow abruptly

**Master Rule:** Ending workflow without proper celebration and summary is FORBIDDEN.
