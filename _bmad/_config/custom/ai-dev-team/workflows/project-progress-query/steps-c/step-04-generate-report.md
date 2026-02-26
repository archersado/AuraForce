---
name: 'step-04-generate-report'
description: 'Generate formatted progress report'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-present-to-user.md'
templateFile: '../templates/template-progress-report.md'
---

# Step 4: Generate Report

## STEP GOAL:
To generate a formatted project progress report using the analysis results.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER present report to user at this step
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'R', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a presenter

### Role Reinforcement:
- ✅ You are PM (Project Manager) - professional project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus only on generating the formatted report
- 🚫 FORBIDDEN to present or save report yet
- 💬 Approach: Generate, format, ask for save preference

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's professional communication style
- 🔄 Menu-driven progression (ask about save preference)

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Available vars: All from previous steps, including analysis results
- Available templates: `template-progress-report.md`
- Focus: Generating formatted progress report
- Limits: Generate report only, don't present yet
- Dependencies: Step 3 provided analysis results

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 5】Generate Progress Report**"

### 2. Load Report Template

Load and read `templateFile` for report structure reference.

### 3. Generate Report Content

Using the analysis results from step 3, generate the progress report with the following structure:

#### Header Section:
```
┌────────────────────────────────────────────────────────┐
│  📋 项目进度汇报 - 给老板                               │
├────────────────────────────────────────────────────────┤
│  🎯 当前里程碑：{{current_milestone}}                   │
│  ✅ 完成进度：{{overall_completion}}%                   │
│  ⏰ 预计完成时间：{{estimated_completion}}              │
│  ⚠️  需要您关注的：{{summary_title}}                     │
│  📝 附：{{design_doc_link}}                             │
└────────────────────────────────────────────────────────┘
```

#### Statistics Section:
```
📊 项目统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Epic 总计：{{epic_total}} 个
  ✅ 已完成：{{epic_done}} 个  🔄 进行中：{{epic_in_progress}} 个  ⏸️ 未开始：{{epic_backlog}} 个

• Story 总计：{{story_total}} 个
  ✅ 已完成：{{story_done}} 个  🔄 进行中：{{story_in_progress}} 个  ⏸️ 待开始：{{story_todo}} 个

• Bug 统计：{{bug_total}} 个
  🔴 Critical：{{bug_critical}} 个  🟡 High：{{bug_high}} 个  🟢 Normal：{{bug_normal}} 个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Status Distribution Section:
```
📈 状态分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Generate visual bar chart for status distribution]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Issues Section:
```
⚠️  需要您关注的问题
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{issue_1}}
   - 影响范围：{{impact_1}}
   - 建议行动：{{recommendation_1}}

{{issue_2}}
   - 影响范围：{{impact_2}}
   - 建议行动：{{recommendation_2}}

... (list all relevant issues)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Links Section:
```
📎 相关链接
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PRD 文档：{{prd_link}}
• 交互设计：{{ux_link}}
• Linear 项目：{{linear_link}}
• 更多详情：{{more_link}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Footer Section:
```
📅 报告生成时间：{{report_timestamp}}
👤 汇报人：项目经理（PM）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Store Report in Session Memory

Store the generated report content in session memory as:
- `progress_report`: The formatted report content

### 5. Ask About Save Preference

Display: "**报告已生成。**"

"这个问题我理解，让我来协调一下。

项目进度报告已生成完成。

**您希望保存这份报告吗？**"

### 6. Present Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4] Report Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:

  [R] Review Report
      → Review the report before proceeding

  [S] Save Report & Continue
      → Save report to file and proceed to presentation

  [C] Cancel
      → Discard report and exit workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Handle User Choice

#### If User Chooses [R] (Review Report):

Display the full generated report content to user for review, then redisplay menu.

#### If User Chooses [S] (Save Report & Continue):

1. Generate a filename: `{dev_docs_folder}/reports/progress-{project_name}-{timestamp}.md`
2. Ensure the `{dev_docs_folder}/reports/` directory exists, create if needed
3. Save the report content to the file
4. Display: "**报告已保存到：{filepath}**"
5. Load, read entire `nextStepFile`
6. Execute `nextStepFile`

#### If User Chooses [C] (Cancel):

Display: "**Workflow cancelled. Report discarded.**"

Stop workflow execution.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Report generated using template structure
- Report content stored in session memory
- User preference collected (save vs don't save)
- Proceeded to presentation step (or saved before proceeding)

### ❌ SYSTEM FAILURE:
- Not generating structured report
- Not using template structure correctly
- Not storing report in session memory
- Skipping user confirmation on save preference

**Master Rule:** Generating report without proper structure or storing in memory is FORBIDDEN.

## REPORT GENERATION GUIDELINES

### Visual Formatting:
- Use Unicode box-drawing characters for headers
- Use emoji icons for visual emphasis
- Use proper spacing and alignment
- Include clear section separators

### Content Requirements:
- All statistics must be included (Epic, Story, Bug counts and distribution)
- Current milestone must be specified
- Completion percentage must be calculated accurately
- Issues must be listed with impact and recommendations
- Relevant links must be included

### Professional Tone:
- Clear and concise language
- Positive framing for achievements
- Action-oriented recommendations for issues
- Respectful and factual presentation

### Timestamp Format:
Use ISO format: YYYY-MM-DD HH:MM:SS