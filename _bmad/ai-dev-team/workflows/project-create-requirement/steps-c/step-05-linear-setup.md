---
name: 'step-05-linear-setup'
description: 'Set up Linear project structure using Linear MCP (if available)'

# File references (ONLY variables used in this step)
nextStepFile: './step-06-report-status.md'
requirementsFile: '{output_folder}/prd/{project_name}-requirements.md'
---

# Step 5: Linear Setup

## STEP GOAL:
To set up Linear project, Epic, and Story structures using Linear MCP if available, and save the IDs to the requirements document.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR AND INTEGRATOR for this step

### Role Reinforcement:
- ✅ You are PM (Project Manager) - professional, organized, proactive
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Handle Linear MCP integration professionally
- ✅ Inform user about integration status clearly

### Step-Specific Rules:
- 🎯 Focus only on Linear MCP integration
- 🚫 FORBIDDEN to panic if Linear unavailable - gracefully skip with warning
- 📝 Save Linear IDs to requirements document if successful
- ⚠️ Mark as skipped if Linear unavailable

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 🚫 This is an integration step - no user choices
- ⚠️ Linear MCP is optional but recommended

## CONTEXT BOUNDARIES:
- Available context: Collected requirements, saved document, mode
- Focus: Linear MCP integration for project setup
- Limits: Continue workflow whether Linear succeeds or fails
- Dependencies: Step 04a or 04b complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 5 of 6】Linear Setup**"

### 2. Check Linear MCP Availability

Check if Linear MCP is available by attempting to list teams:

Use: `mcp__linear__list_teams()`

#### If Linear MCP is Available:

Display: "这个问题我理解，让我来协调一下。**Linear MCP is available.** Setting up project structure..."

Proceed to Linear setup sequence.

#### If Linear MCP is NOT Available:

Display: "这个问题我理解，让我来协调一下。

**⚠️ Linear MCP not available.** No worries - the requirements document has been created and saved.

You can always set up the Linear project manually or configure Linear MCP later.

Proceeding to final status report..."

Skip to step 4 (Continue Menu).

### 3. Linear Setup Sequence (Only if MCP Available)

#### 3.1 Create Linear Project

Use: `mcp__linear__create_project()` with:
- `name`: {{requirement_name}} or {{project_name}}
- `description`: Brief summary from requirements
- `team`: Default team or ask user (but suggest default)

Display: "**Created Linear project: {{project_id}} - {{project_name}}**"

#### 3.2 Create Epic

Use: `mcp__linear__create_issue()` with:
- `title`: {{requirement_name}}
- `description`: Full description from requirements document
- `team`: Same team as project
- `project`: Created project
- `priority`: 3 (Normal)
- `labels`: Add appropriate labels (e.g., 'requirement', 'project-init')

Display: "**Created Epic: {{epic_id}} - {{requirement_name}}**"

#### 3.3 Update Requirements Document with Linear IDs

Update `requirementsFile` frontmatter to add:
```yaml
linear:
  enabled: true
  projectId: {{project_id}}
  projectName: {{project_name}}
  epicId: {{epic_id}}
  epicName: {{requirement_name}}
  createdAt: {{current_date}}
```

Display: "**Updated requirements document with Linear IDs**"

### 4. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 5] Linear Setup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear Status:
  {{Linear setup status - Success or Skipped}}

Options:

  [C] Continue to Status Report
      → Finalize and report project initialization status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Handle User Choice

#### If User Chooses [C] (Continue):

Display: "**Proceeding to final status report...**"

1. Load, read entire `nextStepFile`
2. Execute `nextStepFile`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Linear MCP checked for availability
- If available: Project and Epic created successfully
- Linear IDs saved to requirements document
- If unavailable: Workflow continues with clear warning
- User informed of status

### ❌ SYSTEM FAILURE:
- Not checking Linear MCP availability
- Stopping workflow when Linear unavailable
- Not saving Linear IDs to document when successful
- Not informing user clearly about Linear status

**Master Rule:** Stopping workflow when Linear is unavailable is FORBIDDEN. Always continue with warning.
