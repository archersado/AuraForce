---
stepsCompleted: ['step-01-discovery', 'step-02-classification', 'step-03-requirements', 'step-04-tools', 'step-05-plan-review', 'step-06-design', 'step-07-foundation', 'step-08-build-step-01', 'step-09-build-remaining-steps']
created: '2026-02-03'
status: WORKFLOW_COMPLETE
approvedDate: '2026-02-03'
---

# Workflow Creation Plan

## Discovery Notes

**User's Vision:**
为 ai-dev-team 模块创建 worklow，支持用户与 PM（项目经理）对话来创建项目需求。workflow 需要处理两种模式：完整产品需求（大型、结构化）和特定改动需求（小型、轻量化），通过开放式对话引导用户填写对应模板，生成需求文档，并使用 Linear MCP 创建项目管理结构。

**Who It's For:**
- 触发者：项目中的用户
- 主要交互：用户与 PM 对话
- 后续流程：自动转到 product-design-review workflow

**What It Produces:**
- 需求文档（Markdown格式）
- Linear 项目/Epic/Story（如果MCP可用）

**Key Insights:**
- PM 首先确认需求模式（新模式 vs 改动）
- 两种不同的需求文档模板
- PM 具有第一性原理思维，用开放式问题引导
- Linear 集成是必选的（如可用）
- PM 的口头禅："这个问题我理解，让我来协调一下"

## Requirements

**Flow Structure:**
- Pattern: Branching（分支 - 根据需求模式选择两条不同路径）
- Phases:
  1. 确认需求模式（完整产品需求 vs 特定改动需求）
  2. 开放式对话收集需求内容
  3. 生成需求文档
  4. Linear MCP 创建项目/Epic/Story
  5. 汇报状态
- Estimated steps: 6

**User Interaction:**
- Style: Highly Collaborative（高度协作）- PM 在每一步引导用户
- Decision points: 用户必须选择需求模式（完整产品需求 vs 特定改动需求）
- Checkpoint frequency: 每步都检查

**Inputs Required:**
- Required: 用户的产品需求想法（口头描述）
- Optional: 技术约束、时间约束、其他限制条件
- Prerequisites: 用户是项目成员、Linear MCP 可用

**Output Specifications:**
- Type: document（需求文档 + Linear 项目/Epic/Story）
- Format: Semi-structured（两种模板有固定的必需部分）
- Sections:
  - 完整产品需求模板：需求名称、背景、目标、范围、用户故事
  - 特定改动需求模板：需求名称、描述、范围
- Frequency: single（单次输出）

**Success Criteria:**
- 需求文档已生成并保存到 `{dev_docs_folder}/prd/`
- Linear 项目、Epic、Story 已创建（如 Linear MCP 可用）
- PM 向用户汇报项目初始化状态成功
- 用户确认需求内容满意

**Instruction Style:**
- Overall: Intent-Based（意图导向）- 步骤描述目标和原则，AI 自然适应对话
- Notes: PM 使用第一性原理思维、开放式问题引导，而不是固定选项

---

## Classification Decisions

**Workflow Name:** project-create-requirement
**Target Path:** {project-root}/src/modules/ai-dev-team/workflows/project-create-requirement/

**4 Key Decisions:**
1. **Document Output:** true (Document-Producing - 生成需求文档)
2. **Module Affiliation:** ai-dev-team (Module-Based)
3. **Session Type:** single-session (相对简短的对话流程)
4. **Lifecycle Support:** create-only (steps-c/ only)

**Structure Implications:**
- 需要两种需求文档模板（完整产品需求 vs 特定改动需求）
- 属于 ai-dev-team 模块，有模块特定变量访问
- 单次会话完成，不需要继续逻辑
- 仅创建模式，只有 steps-c/ 文件夹

---

## Tools Configuration

**Core BMAD Tools:**
- **Party Mode:** excluded - 对于这种结构化需求收集不太适合
- **Advanced Elicitation:** excluded - PM 使用开放式问题引导已经很充分
- **Brainstorming:** included - 在需求收集阶段（Phase 3）帮助扩展和深化想法

**LLM Features:**
- **Web-Browsing:** excluded - 不需要实时信息
- **File I/O:** included - 创建和保存需求文档到 `{dev_docs_folder}/prd/`
- **Sub-Agents:** excluded - 不需要
- **Sub-Processes:** excluded - 不需要

**Memory:**
- Type: single-session
- Tracking: 简单状态追踪

**External Integrations:**
- **Linear MCP:** included - 创建项目、Epic、Story（如可用）

**Installation Requirements:**
- 无额外安装需求（Brainstorming、File I/O 都是默认可用）
- Linear MCP 如用户已安装

---

## Workflow Structure Design

### Step Structure

**Total Steps:** 6 (with branching at step 2)

**Step Outline:**
1. **step-01-init** (Init Step - Non-Continuable)
   - Goal: 初始化 workflow，创建输出文档
   - Pattern: Auto-proceed

2. **step-02-confirm-mode** (Branch Step)
   - Goal: 确认需求模式（完整产品需求 vs 特定改动需求）
   - Pattern: Branching (L=完整, R=改动)

   Path A - 完整产品需求:
   3. **step-03a-gather-full** (Middle Step - Standard)
      - Goal: 收集完整产品需求内容
      - Menu: A/P/C (P=Brainstorming)
   4. **step-04a-generate-full** (Middle Step - Simple)
      - Goal: 生成完整产品需求文档
      - Menu: C Only

   Path B - 特定改动需求:
   3. **step-03b-gather-change** (Middle Step - Standard)
      - Goal: 收集改动需求内容
      - Menu: A/P/C (P=Brainstorming)
   4. **step-04b-generate-change** (Middle Step - Simple)
      - Goal: 生成改动需求文档
      - Menu: C Only

5. **step-05-linear-setup** (Middle Step - Simple)
   - Goal: Linear MCP 集成（两条路径汇合后）
   - Menu: C Only

6. **step-06-report-status** (Final Step)
   - Goal: PM 汇报项目初始化状态
   - Pattern: Final Step

### Interaction Patterns

- **Input Points:** Step 02 模式选择，Step 03A/03B 需求内容
- **Menu Patterns:**
  - Step 01: Auto-proceed
  - Step 02: Branching (L/R/C)
  - Step 03A/03B: A/P/C (P=Brainstorming)
  - Step 04A/04B/05: C Only
  - Step 06: No menu

- **Progress Indication:** 每步显示当前步骤
- **Confirmation Points:** Step 02 模式选择确认

### Data Flow Design

```
Step 01 → 创建空文档 → set mode variable
Step 02 → 收集 mode → route to 03A or 03B
Step 03A/03B → 收集需求 → append to document
Step 04A/04B → 生成文档 → save to {dev_docs_folder}/prd/
Step 05 → Linear MCP → save IDs to document
Step 06 → 汇报状态 → complete

State Tracking:
- outputFile: {dev_docs_folder}/prd/{project_name}-requirements.md
- mode: 'full' or 'change'
- linearIds: [project_id, epic_id, story_ids...]
```

### File Structure Design

```
project-create-requirement/
├── workflow.md
├── steps-c/
│   ├── step-01-init.md
│   ├── step-02-confirm-mode.md
│   ├── step-03a-gather-full.md
│   ├── step-03b-gather-change.md
│   ├── step-04a-generate-full.md
│   ├── step-04b-generate-change.md
│   ├── step-05-linear-setup.md
│   └── step-06-report-status.md
└── templates/
    ├── template-full.md
    └── template-change.md
```

**Templates:**
- `template-full.md`: 需求名称、背景、目标、范围、用户故事
- `template-change.md`: 需求名称、描述、范围

### Role and Persona Definition

**AI Role:** PM (项目经理)

**Expertise:**
- 项目管理经验
- 第一性原理思维
- 需求分析和拆解
- Linear MCP 使用

**Communication Style:**
- 专业且温暖，像对待老板一样汇报
- 口头禅："这个问题我理解，让我来协调一下"
- 主动汇报进度，给用户可靠感和控制感

**Collaboration Approach:** Intent-Based
- 开放式问题引导
- 不使用固定选项列表
- 帮助用户思考第一性原理

### Validation and Error Handling

**Validation Checkpoints:**
- Step 02: 确认模式选择
- Step 03A/03B: 确认需求内容完整
- Step 04A/04B: 确认文档保存
- Step 05: Linear MCP 可用性检查

**Error Handling:**
- 未选择模式：提示并重新询问
- 需求内容不完整：PM 引导补充
- 文档保存失败：错误消息和建议
- Linear MCP 不可用：警告但继续（标记跳过）

**Success Criteria:**
- 需求文档生成
- 用户确认需求内容
- PM 汇报完成

### Special Features Design

**Workflow Chaining:**
- **Previous:** 无（第一个 workflow）
- **Next:** 自动转到 `product-design-review`

**Conditional Logic:**
- Step 02: Branch (L → 03A/04A, R → 03B/04B)
- Step 05: Linear MCP 可用性（可用→创建，不可用→跳过）

---

## Foundation Build Complete

**Created:**
- Folder structure at: {output}/bmb-creations/workflows/project-create-requirement/
- workflow.md
- Main templates: template-full.md, template-change.md

**Configuration:**
- Workflow name: project-create-requirement
- Continuable: no
- Document output: yes (semi-structured - 两种模板)
- Mode: create-only

**Next Steps:**
- Step 8: Build step-01 (init) ✓ 完成现在
- Step 9+: Build remaining steps (step-02 to step-06)

---

## Step 01 Build Complete

**Created:**
- steps-c/step-01-init.md

**Step Configuration:**
- Type: non-continuable
- Input Discovery: no
- Next Step: step-02-confirm-mode

---

## Step 02 Build Complete

**Created:**
- steps-c/step-02-confirm-mode.md

**Step Configuration:**
- Type: branching (L=full, R=change)
- Menu: L/R/C
- Next Steps: step-03a-gather-full (L) or step-03b-gather-change (R)

---

## Step 03A Build Complete

**Created:**
- steps-c/step-03a-gather-full.md

**Step Configuration:**
- Type: standard gather
- Menu: A/P/C (P=Brainstorming)
- Template: template-full.md
- Next Step: step-04a-generate-full

---

## Step 03B Build Complete

**Created:**
- steps-c/step-03b-gather-change.md

**Step Configuration:**
- Type: standard gather
- Menu: A/P/C (P=Brainstorming)
- Template: template-change.md
- Next Step: step-04b-generate-change

---

## Step 04A Build Complete

**Created:**
- steps-c/step-04a-generate-full.md

**Step Configuration:**
- Type: simple document generation
- Menu: C Only
- Template: template-full.md
- Next Step: step-05-linear-setup

---

## Step 04B Build Complete

**Created:**
- steps-c/step-04b-generate-change.md

**Step Configuration:**
- Type: simple document generation
- Menu: C Only
- Template: template-change.md
- Next Step: step-05-linear-setup

---

## Step 05 Build Complete

**Created:**
- steps-c/step-05-linear-setup.md

**Step Configuration:**
- Type: simple integration
- Menu: C Only
- Integration: Linear MCP (optional)
- Next Step: step-06-report-status

---

## Step 06 Build Complete

**Created:**
- steps-c/step-06-report-status.md

**Step Configuration:**
- Type: final step
- Menu: None
- Purpose: Report project initialization status

---

## Workflow Build Complete

**All Steps Created:**
- step-01-init.md ✓
- step-02-confirm-mode.md ✓
- step-03a-gather-full.md ✓
- step-03b-gather-change.md ✓
- step-04a-generate-full.md ✓
- step-04b-generate-change.md ✓
- step-05-linear-setup.md ✓
- step-06-report-status.md ✓

**Templates Created:**
- template-full.md ✓
- template-change.md ✓

**Workflow Configuration:**
- Name: project-create-requirement
- Total Steps: 6 (with branching)
- Branch Points: Step 02 (mode selection)
- Document Output: Yes (semi-structured)
- Linear MCP Integration: Yes (optional)
- Session Type: single-session
- Lifecycle Mode: create-only

**Status: WORKFLOW COMPLETE - Ready for validation and deployment**
