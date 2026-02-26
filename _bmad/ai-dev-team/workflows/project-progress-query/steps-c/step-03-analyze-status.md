---
name: 'step-03-analyze-status'
description: 'Analyze overall project status'

# File references (ONLY variables used in this step)
nextStepFile: './step-04-generate-report.md'
---

# Step 3: Analyze Status

## STEP GOAL:
To analyze the overall project status from the collected Linear data.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate report or present to user at this step
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a report generator

### Role Reinforcement:
- ✅ You are PM (Project Manager) - professional project manager
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ Use your phrase: "这个问题我理解，让我来协调一下"

### Step-Specific Rules:
- 🎯 Focus only on analyzing project status
- 🚫 FORBIDDEN to generate report or present yet
- 💬 Approach: Analyze, calculate insights, auto-proceed

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's professional communication style
- 🔄 Automatic progression (no menu, proceed after analysis)

## CONTEXT BOUNDARIES:
- Available context: Config from {project-root}/_bmad/bmb/config.yaml
- Available vars: `project_name`, `time_range`, `component_filter` from previous step
- Available vars: `epics_data`, `stories_data`, `bugs_data`, `milestones_data`, `project_details` from step 2
- Focus: Analyzing project status and calculating insights
- Limits: Analysis only, don't generate report yet
- Dependencies: Step 2 provided Linear data

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 3 of 5】Analyze Project Status**"

### 2. Verify Data Availability

Verify that the following data is available from previous step:
- `epics_data`: Epic-level issues
- `stories_data`: Story-level issues
- `bugs_data`: Bug issues
- `milestones_data`: Milestone information
- `project_details`: Project details

Display: "**正在分析项目状态...**"

### 3. Analyze Data

Perform the following analysis on the collected data:

#### 3.1. Epic Analysis

From `epics_data`, calculate:
- Total Epic count
- Count by status (Done, In Progress, Backlog, etc.)
- Epic completion percentage

Store in session memory as:
- `epic_analysis`: { total, by_status, completion_rate }

#### 3.2. Story Analysis

From `stories_data`, calculate:
- Total Story count
- Count by status (Done, In Progress, Todo, etc.)
- Story completion percentage
- Critical/High priority count

Store in session memory as:
- `story_analysis`: { total, by_status, completion_rate, priority_breakdown }

#### 3.3. Bug Analysis

From `bugs_data`, calculate:
- Total Bug count
- Count by status (Done, In Progress, Todo)
- Count by priority (Critical, High, Medium, Low)
- Bug completion percentage

Store in session memory as:
- `bug_analysis`: { total, by_status, by_priority, completion_rate }

#### 3.4. Milestone Analysis

From `milestones_data`, calculate:
- Current active milestone
- Total milestone count
- Completed milestone count
- Milestone completion percentage
- Target dates

Store in session memory as:
- `milestone_analysis`: { current, total, completed, completion_rate, target_dates }

#### 3.5. Issue Identification

Identify issues that need attention:
- Overdue tasks
- High priority bugs not started
- Epics with low completion rate
- Stories blocking progress

Store in session memory as:
- `issues_to_monitor`: List of issues with descriptions

### 4. Generate Insights

From the analysis, generate key insights:

- Overall project health score (0-100)
- Main blockers or risks
- Positive achievements
- Recommendations

Store in session memory as:
- `project_insights`: { health_score, blockers, achievements, recommendations }

### 5. Display Analysis Summary

Display: "**状态分析完成。**"

"这个问题我理解，让我来协调一下。

我已经分析了项目的整体状态：

• Epic 完成率：{{percentage}}%
• Story 完成率：{{percentage}}%
• Bug 完成率：{{percentage}}%
• 整体健康度：{{score}}/100

当前进度：{{summary}}

正在生成进度报告..."

### 6. Auto-Load Next Step

Load, read entire `nextStepFile`
Execute `nextStepFile`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- All data analyzed (Epics, Stories, Bugs, Milestones)
- Insights generated and stored in session memory
- Issues identified for monitoring
- Proceeded to report generation step

### ❌ SYSTEM FAILURE:
- Not performing analysis on collected data
- Not storing analysis results in session memory
- Skipping to report generation without analysis

**Master Rule:** Skipping analysis without processing Linear data is FORBIDDEN.

## ANALYSIS FRAMEWORK

### Metrics to Calculate:

1. **Completion Rate**: (Completed Items / Total Items) * 100

2. **Health Score**: Weighted average of:
   - Epic completion rate (30%)
   - Story completion rate (30%)
   - Bug completion rate (20%)
   - Milestone progress (20%)

3. **Issue Severity Levels**:
   - Critical: Blocks release or major feature
   - High: Significant impact, needs attention
   - Medium: Moderate impact
   - Low: Minor issues

### Insights Framework:

- **Blockers**: Items preventing progress
- **Achievements**: Completed milestones/features
- **Risks**: Potential future issues
- **Recommendations**: Actionable suggestions