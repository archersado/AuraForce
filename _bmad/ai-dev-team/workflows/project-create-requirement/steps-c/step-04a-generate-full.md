---
name: 'step-04a-generate-full'
description: 'Generate and save the full product requirements document'

# File references (ONLY variables used in this step)
nextStepFile: './step-05-linear-setup.md'
templateFull: '{project-root}/_bmad/ai-dev-team/workflows/project-create-requirement/templates/template-full.md'
outputFolder: '{output_folder}/prd/'
---

# Step 4A: Generate Full Product Requirements Document

## STEP GOAL:
To generate and save the full product requirements (PRD) document with all collected information.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT GENERATOR for this step

### Role Reinforcement:
- ✅ You are PM (Project Manager) - professional, organized, accurate
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Generate accurate, well-formatted documents from collected information
- ✅ Provide professional delivery

### Step-Specific Rules:
- 🎯 Focus only on document generation and file operations
- 🚫 FORBIDDEN to ask more questions - use collected information only
- 📁 Write document to `{outputFolder}/{project_name}-requirements.md`

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 📁 Ensure output folder exists before writing
- 🚫 This is a document generation step - no user choices

## CONTEXT BOUNDARIES:
- Available context: Collected requirements from step-03a, mode = 'full'
- Focus: Generate and save PRD document
- Limits: Use only collected information, don't add details not discussed
- Dependencies: Step 03a complete, mode = 'full'

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 4 of 6】Generate Full Product Requirements Document**"

### 2. Prepare Document Content

Load the template and prepare document with:

**Frontmatter:**
```yaml
---
stepsCompleted: ['step-01-init', 'step-02-confirm-mode', 'step-03a-gather-full', 'step-04a-generate-full']
date: {{current_date}}
user_name: {{user_name}}
mode: 'full'
requirementType: 'full-product'
status: 'draft'
---
```

**Document Body:**
- Use `{{requirement_name}}` as the main title
- Fill in all collected sections: 背景, 目标, 范围, 用户故事
- Use user's exact language and terminology
- Format with proper markdown headings

### 3. Ensure Output Folder Exists

Ensure folder `{output_folder}/prd/` exists (create if needed)

### 4. Write Document File

Write document to: `{output_folder}/prd/{project_name}-requirements.md`

Display: "**Creating requirements document at: {output_folder}/prd/{project_name}-requirements.md**"

### 5. Verify Document Creation

Display document summary:
"**Document Created Successfully!**

- Location: `{output_folder}/prd/{project_name}-requirements.md`
- Type: Full Product Requirements (PRD)
- Mode: full
- Sections Included: 需求名称, 背景, 目标, 范围, 用户故事"

### 6. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 4A] Document Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document Status:
  ✅ PRD document created and saved

Options:

  [C] Continue to Linear Setup
      → Set up Linear project structure (if available)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Handle User Choice

#### If User Chooses [C] (Continue):

Display: "**Proceeding to Linear setup...**"

1. Load, read entire `nextStepFile`
2. Execute `nextStepFile`

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Document created with all collected information
- File written to correct location
- Proper frontmatter included
- Document summary displayed to user

### ❌ SYSTEM FAILURE:
- Document not created or saved
- Wrong file location
- Missing frontmatter metadata
- Not using user's collected information

**Master Rule:** Continuing without creating the document is FORBIDDEN.
