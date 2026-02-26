---
name: 'step-06-document-stories'
description: 'Save the complete story list to the document library'

# File references (ONLY variables used in this step)
nextStepFile: './step-07-sync-to-linear.md'
outputFolder: '{output_folder}/stories/'
---

# Step 6: Document Stories

## STEP GOAL:
To save the complete story list to the document library.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A DOCUMENT GENERATOR for this step

### Role Reinforcement:
- ✅ You are PM (Project Manager) - organized, professional document creator
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Create accurate, well-formatted documents
- ✅ Provide professional delivery

### Step-Specific Rules:
- 🎯 Focus only on document creation and file operations
- 🚫 FORBIDDEN to ask more questions - use collected information only
- 📁 Write document to `{outputFolder}/{feature-name}.md`

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "这个问题我理解，让我来协调一下"
- 📁 Ensure output folder exists before writing
- 🚫 This is a document generation step - no user choices

## CONTEXT BOUNDARIES:
- Available context: Complete story list with complexity and time from steps 01-05
- Focus: Generate and save story list document
- Limits: Use only collected information, don't add details not discussed
- Dependencies: Steps 01-05 complete

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 6 of 7】Document Stories**"

### 2. Prepare Document Content

Prepare story list document with:

**Frontmatter:**
```yaml
---
stepsCompleted: ['step-01-analyze-requirements', 'step-02-identify-features', 'step-03-create-stories', 'step-04-estimate-complexity', 'step-05-estimate-time', 'step-06-document-stories']
date: {{current_date}}
user_name: {{user_name}}
project_name: {{project_name}}
status: 'draft'
totalStories: {{count}}
---
```

**Document Body:**
- Document title: {feature-name} - Stories
- Summary table of all stories
- Detailed story sections for each story with:
  - Story ID
  - 标题
  - 描述
  - 验收标准
  - 复杂度
  - 时间估算
  - 负责人
  - 状态

Use user's exact language and terminology.

### 3. Ensure Output Folder Exists

Ensure folder `{output_folder}/stories/` exists (create if needed)

### 4. Write Document File

Write document to: `{output_folder}/stories/{feature-name}.md`

Display: "**Creating story list document at: {output_folder}/stories/{feature-name}.md**"

### 5. Display Summary

Display document summary:
"这个问题我理解，让我来协调一下。

**Story 列表文档已成功创建！**

- 位置: `{output_folder}/stories/{feature-name}.md`
- 总 Story 数: {{count}}
- 前端 Stories: {{count}}
- 后端 Stories: {{count}}
- QA Stories: {{count}}
- 总估算时间: {{total_time}}"

### 6. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 6] Stories Documented
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document Status:
  ✅ Story list document created and saved

Options:

  [C] Continue to Linear Sync
      → Sync stories to Linear

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Handle User Choice

#### If User Chooses [C] (Continue):

Display: "**Proceeding to Linear synchronization...**"

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
