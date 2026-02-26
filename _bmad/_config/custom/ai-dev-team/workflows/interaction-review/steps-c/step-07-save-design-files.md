---
name: 'step-07-save-design-files'
description: 'Save interaction design files to artifacts folder'

# File references (ONLY variables used in this step)
nextStepFile: './step-08-update-linear-status.md'
designFolder: '{artifacts_folder}/designs/interaction'
featureName: '{feature_name}'
---
# Step 7: Save Design Files

## STEP GOAL:
To save the interaction design materials (documents, diagrams, prototypes) to the project artifacts folder at `{artifacts_folder}/designs/interaction/` for permanent reference and future development use.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FILE MANAGER (PM role) for this step
- 🎯 Ensure design materials are properly saved and organized

### Role Reinforcement:
- ✅ You are PM (Project Manager) - file organizer, project documenter
- ✅ If you already have been given communication_style and identity, continue to use those while playing the PM role
- ✅ Organize and save project artifacts systematically
- ✅ Ensure proper file naming and organization

### Step-Specific Rules:
- 🎯 Focus on saving interaction design materials to correct location
- 🚫 FORBIDDEN to skip saving or use incorrect file locations
- 💬 Approach: Systematic file organization, clear file structure

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Use PM's communication style: "我来整理并保存设计文件"
- 🚫 This is a file operation step - save and organize properly

## CONTEXT BOUNDARIES:
- Available context: Interaction design materials from Step 1, feature name
- Focus: Save design files to artifacts folder with proper organization
- Limits: Don't modify content - just save and organize
- Dependencies: Step 06 complete, review decisions documented

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Display Current Progress

Display: "**【Step 7 of 8】Save Design Files**"

### 2. Confirm File Management Role

Display PM role confirmation:

"**✓ PM角色确认: 设计文件归档**"

"**我是PM（项目经理），现在负责整理并保存交互设计文件。**"

Display: "我来整理并保存交互设计文件到项目artifacts目录。"

### 3. Display File Organization Plan

Display file organization structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     设计文件归档计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

目标目录: {artifacts_folder}/designs/interaction/

文件结构:
  {designFolder}/
    ├── {featureName}/
    │   ├── interaction-design.md        # 交互设计文档
    │   ├── user-flow.md                 # 用户流程说明
    │   ├── component-spec.md            # 组件规范
    │   ├── wireframes/                  # 原型截图
    │   │   ├── page-1.png
    │   │   └── page-2.png
    │   └── diagrams/                    # 交互流程图
    │       ├── flowchart.svg
    │       └── user-journey.svg

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Prepare Design Documentation

Display: "**正在准备交互设计文档内容...**"

Create and display the interaction design documentation:

```# 交互设计文档

**功能名称:** {{feature_name}}

**设计日期:** {{当前日期}}

**工作流:** interaction-review

**Interaction Designer:** -

---

## 设计概述

### 设计目标
{{交互设计目标}}

### 核心用户场景
{{核心用户场景描述}}

---

## 交互流程

### 主要用户流程
{{从Step 1获取用户交互流程}}

### 流程图
{{如果有流程图，在此引用或描述}}

---

## 页面交互设计

### 页面列表
| 页面 | 描述 | 关键交互 |
|------|------|----------|
| {{页面1}} | {{描述}} | {{关键交互}} |
| {{页面2}} | {{描述}} | {{关键交互}} |

### 详细交互说明

#### {{页面1}}
- **初始状态:** {{描述}}
- **触发条件:** {{触发条件}}
- **操作流程:** {{操作流程}}
- **反馈机制:** {{反馈机制}}
- **异常处理:** {{异常处理}}

#### {{页面2}}
- **初始状态:** {{描述}}
- **触发条件:** {{触发条件}}
- **操作流程:** {{操作流程}}
- **反馈机制:** {{反馈机制}}
- **异常处理:** {{异常处理}}

---

## 组件规范

### 组件列表
| 组件名称 | 用途 | 状态 |
|----------|------|------|
| {{组件1}} | {{用途}} | {{现有/新建}} |
| {{组件2}} | {{用途}} | {{现有/新建}} |

### 新组件定义

#### {{新组件1}}
- **类型:** {{按钮/输入框/弹窗等}}
- **样式:** {{样式说明}}
- **行为:** {{交互行为}}
- **状态:** {{正常/悬停/按下/禁用}}

#### {{新组件2}}
- **类型:** {{按钮/输入框/弹窗等}}
- **样式:** {{样式说明}}
- **行为:** {{交互行为}}
- **状态:** {{正常/悬停/按下/禁用}}

---

## 设计决策记录

| 决策 | 原因 |
|------|------|
| {{决策1}} | {{原因}} |
| {{决策2}} | {{原因}} |

---

## 设计约束

- **设计系统遵循:** {{设计系统版本或规范}}
- **设备支持:** {{移动端/PC端/响应式}}
- **浏览器兼容性:** {{浏览器要求}}
- **无障碍要求:** {{WCAG级别或其它要求}}

---

## 技术实现参考

- **前端框架:** {{如果指定}}
- **UI组件库:** {{如果指定}}
- **动画库:** {{如果指定}}

---

**文档创建时间:** {{当前时间}}
**基于评审结果:** {{评审结果}}
```

Display: "**交互设计文档内容已准备完成。**"

### 5. Create Directory Structure

Display: "**正在创建目录结构...**"

Display: "**✓ 目录结构已创建**"

```
{designFolder}/{featureName}/
  ├── interaction-design.md
  ├── user-flow.md
  ├── component-spec.md
  ├── wireframes/
  └── diagrams/
```

### 6. Save Design Files

Display: "**正在保存设计文件...**"

Display file save status:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     文件保存状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 已保存:
  ✓ {designFolder}/{featureName}/interaction-design.md
  ✓ {designFolder}/{featureName}/user-flow.md
  ✓ {designFolder}/{featureName}/component-spec.md

📁 已创建目录:
  ✓ {designFolder}/{featureName}/wireframes/
  ✓ {designFolder}/{featureName}/diagrams/

⏳ 待补充 (需要Interaction Designer提供):
  - 原型截图 (wireframes/*.png)
  - 交互流程图 (diagrams/*.svg)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Verify File Locations

Display: "**正在验证文件位置...**"

Display verification summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     文件位置确认
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

交互设计文档:
  {designFolder}/{featureName}/interaction-design.md

用户流程说明:
  {designFolder}/{featureName}/user-flow.md

组件规范:
  {designFolder}/{featureName}/component-spec.md

原型目录:
  {designFolder}/{featureName}/wireframes/

图表目录:
  {designFolder}/{featureName}/diagrams/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Provide Next Steps for Designer

Display additional guidance:

"**设计文件已保存。**"

"** Interaction Designer可以:")
- 将原型截图保存到: {designFolder}/{featureName}/wireframes/
- 将流程图导出保存到: {designFolder}/{featureName}/diagrams/

这些文件将在开发和测试阶段作为参考。"

### 9. Present Continue Menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Step 7] Design Files Saved
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files Created:
  ✅ Interaction design document
  ✅ User flow specification
  ✅ Component specification
  ✅ Directory structure created

Saved Location: {designFolder}/{featureName}/

Ready for Reference:
  ✓ Development teams can access design files
  ✓ QA teams can reference interaction flows
  ✓ All documentation is version-controlled

Next Step:

  [C] Update Linear Status
      → Update Story status in Linear to reflect completion

  [A] Adjust File Organization
      → Modify file structure or content

  [P] Pause Discussion
      → Take a moment to review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 10. Handle User Choice

#### If User Chooses [C] (Update Linear Status):

Display: "**Proceeding to update Linear status...**"

1. Load, read entire `nextStepFile` (step-08-update-linear-status.md)
2. Execute `nextStepFile`

#### If User Chooses [A] (Adjust File Organization):

- Allow user to specify changes to file organization
- Update the file structure as directed
- Re-save with new organization
- Then re-present the continue menu

#### If User Chooses [P] (Pause Discussion):

- Display: "**Taking a moment to review the saved files. Let me know when you're ready to continue.**"
- Wait for user to initiate next step
- Then re-present the continue menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:

### ✅ SUCCESS:
- Design folder structure created
- Interaction design document saved
- User flow specification saved
- Component specification saved
- All files saved to correct location
- Clear path to development reference provided

### ❌ SYSTEM FAILURE:
- Files not saved to correct location
- Incomplete documentation
- Missing required design specifications
- Incorrect directory structure

**Master Rule:** Completing file saving with incorrect structure or location is FORBIDDEN.
