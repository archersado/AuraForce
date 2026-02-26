# Progress Report Template

## Template for Project Progress Report

This template provides the structure for generating professional project progress reports like reporting to boss.

---

## Report Structure

### 1. Header Section
```
┌────────────────────────────────────────────────────────┐
│  📋 项目进度汇报 - 给老板                               │
├────────────────────────────────────────────────────────┤
│  🎯 当前里程碑：{{current_milestone}}                   │
│  ✅ 完成进度：{{completion_percentage}}%                │
│  ⏰ 预计完成时间：{{estimated_completion_date}}          │
│  ⚠️  需要您关注的：{{attention_summary}}                 │
│  📝 附：{{relevant_document_link}}                      │
└────────────────────────────────────────────────────────┘
```

### 2. Statistics Section

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

### 3. Status Distribution Section

```
📈 状态分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{status_visualization}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Issues Section

```
⚠️  需要您关注的问题
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{each_issue}}
   - 影响范围：{{impact}}
   - 建议行动：{{recommendation}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Links Section

```
📎 相关链接
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• PRD 文档：{{prd_link}}
• 交互设计：{{ux_link}}
• Linear 项目：{{linear_link}}
• 更多详情：{{more_link}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Footer Section

```
📅 报告生成时间：{{report_timestamp}}
👤 汇报人：项目经理（PM）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template Variables

### Required Variables

| Variable | Description | Format |
|----------|-------------|--------|
| `current_milestone` | Current active milestone name | Text |
| `completion_percentage` | Overall completion percentage | Number with % |
| `estimated_completion_date` | Estimated completion date | Date text |
| `attention_summary` | Brief summary of issues needing attention | Short text |
| `relevant_document_link` | Link to relevant design document | URL |
| `report_timestamp` | Report generation timestamp | ISO format |
| `prd_link` | Link to PRD document | URL |
| `ux_link` | Link to UX/Interaction design | URL |
| `linear_link` | Link to Linear project | URL |
| `more_link` | Link to more details | URL |

### Variables: Epic Statistics

| Variable | Description |
|----------|-------------|
| `epic_total` | Total count of Epics |
| `epic_done` | Completed Epics count |
| `epic_in_progress` | In-progress Epics count |
| `epic_backlog` | Backlog/Unstarted Epics count |

### Variables: Story Statistics

| Variable | Description |
|----------|-------------|
| `story_total` | Total count of Stories |
| `story_done` | Completed Stories count |
| `story_in_progress` | In-progress Stories count |
| `story_todo` | Todo/Unstarted Stories count |

### Variables: Bug Statistics

| Variable | Description |
|----------|-------------|
| `bug_total` | Total count of Bugs |
| `bug_critical` | Critical priority Bugs |
| `bug_high` | High priority Bugs |
| `bug_normal` | Normal/Low priority Bugs |

### Variables: Issues List

For each issue in the issues list:
| Variable | Description |
|----------|-------------|
| `each_issue` | Issue title or description |
| `impact` | Impact scope or description |
| `recommendation` | Recommended action |

### Variable: Status Visualization

| Variable | Description | Format |
|----------|-------------|--------|
| `status_visualization` | Visual representation of status distribution | Bar chart or similar |

---

## Visual Formatting Guide

### Box Drawing Characters

```
┌ ─ ┐  │
└ ─ ┘  │ └ ├ ┤ ┬ ┴ ┼
```

### Section Separators

Use the horizontal line characters:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Icons

Use emoji for visual emphasis:
- 📋 Report title
- 🎯 Milestone
- ✅ Completed
- ⏰ Time/Estimate
- ⚠️ Warning/Attention
- 📝 Note/Reference
- 🔴 Critical
- 🟡 High
- 🟢 Normal
- 📊 Statistics
- 📈 Distribution
- 📎 Links
- 📅 Date
- 👤 Person

---

## Status Visualization Examples

### Text-based Bar Chart

```
Story Status Distribution:

Completed [████████████████████] 45 stories (45%)
In Progress [████████            ] 20 stories (20%)
Todo       [████████████        ] 35 stories (35%)

Total: 100 stories
```

### Completion Meter

```
Overall Progress: ███████████████████░░░░  70%
               0%                      100%
```

---

## Professional Guidelines

### Tone and Style

- Clear and factual presentation
- Respectful and professional language
- Concise but comprehensive
- Action-oriented for issues

### Content Organization

1. **Summary First**: Start with high-level summary
2. **Details Follow**: Provide detailed statistics
3. **Visualization**: Use visual elements for clarity
4. **Issues Highlight**: Clearly mark issues needing attention
5. **Links Provide**: Include relevant document links

### Best Practices

- Use consistent formatting throughout
- Keep sections clearly separated
- Use visual hierarchy (headers, dividers)
- Include timestamps for reference
- Provide contact/coordination offer

---

## Example Output

```
┌────────────────────────────────────────────────────────┐
│  📋 项目进度汇报 - 给老板                               │
├────────────────────────────────────────────────────────┤
│  🎯 当前里程碑：产品设计评审                             │
│  ✅ 完成进度：70%                                       │
│  ⏰ 预计完成时间：本周五                                 │
│  ⚠️  需要您关注的：交互设计有个细节想请示您                │
│  📝 附：设计文档链接                                     │
└────────────────────────────────────────────────────────┘

📊 项目统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Epic 总计：5 个
  ✅ 已完成：2 个  🔄 进行中：2 个  ⏸️ 未开始：1 个

• Story 总计：50 个
  ✅ 已完成：35 个  🔄 进行中：10 个  ⏸️ 待开始：5 个

• Bug 统计：8 个
  🔴 Critical：1 个  🟡 High：2 个  🟢 Normal：5 个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```