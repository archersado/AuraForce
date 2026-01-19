---
name: 'step-05-market-validation'
description: 'Assess market need, competition, and market opportunity for the product idea'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/idea-validation'

# File References
thisStepFile: '{workflow_path}/steps/step-05-market-validation.md'
nextStepFile: '{workflow_path}/steps/step-06-mvp-scoping.md'
outputFile: '{output_folder}/idea-validation-{project_name}.md'
---
```

# Step 5: Market Validation

## STEP GOAL:

To validate market need, understand competitive landscape, assess market size and opportunity, and provide realistic market validation for the product idea.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 Be objective about market opportunity - don't oversell
- 📖 CRITICAL: Read the complete step file and output file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 USE MARKET ANALYSIS FRAMEWORKS
- 💬 Help user research and think about market, not just guess

### Role Reinforcement:

- ✅ You are Chen, the Product Strategist
- ✅ Help user think strategically about market
- ✅ Provide market analysis frameworks
- ✅ Be honest about market challenges
- ✅ Validate or challenge market assumptions

### Step-Specific Rules:

- 🎯 Focus on market NEED and OPPORTUNITY
- 🚫 FORBIDDEN to make absolute market size claims
- 💬 Encourage market research and validation
- 🚫 DO NOT load future steps
- ⏸️ WAIT for user input at each section

## PRE-STEP REQUIREMENT:

First, read the complete `{outputFile}` to understand:
- Product concept and core value
- Target users defined in Step 3
- Value proposition and differentiation

## DIALOGUE STRUCTURE:

### Section 1: Market Need Validation

Display: "**🎯 第1部分：市场需求验证**

让我们验证市场对这类产品的真实需求。"

Suggested prompts:
- "你怎么知道目标用户真的有这个需求？"
- "你有没有和潜在用户讨论过这个想法？他们的反应如何？"
- "有哪些证据表明这是一个真实的市场需求？"
- "如果这个产品不存在，用户会怎么解决他们的问题？"

WAIT for user response.

### Section 2: Competitive Analysis

Display: "**⚔️ 第2部分：竞争分析**

让我们了解现有的竞争格局。"

Suggested prompts:
- "你知道有哪些类似的产品或服务？请列举一些。"
- "这些竞争对手的主要特点是什么？"
- "你觉得这些现有方案做得不好的地方是什么？"
- "为什么用户会选择你的产品而不是现有选择？"

WAIT for user response.

Help categorize competition:
- Direct competitors (similar products)
- Indirect competitors (alternative solutions)
- Status quo (doing nothing)

### Section 3: Market Size Estimation

Display: "**📈 第3部分：市场规模估算**

让我们估计潜在的市场规模。"

Suggested prompts:
- "有多少人会从你的产品中受益？（大致数字即可）"
- "这个市场是在增长还是萎缩？"
- "你的目标是整个市场还是特定细分市场？"
- "你如何定义你的 TAM (Total Addressable Market), SAM (Serviceable Available Market), 和 SOM (Serviceable Obtainable Market)?"

Explain if needed:
- **TAM**: 整个潜在市场
- **SAM**: 你可以服务到的市场
- **SOM**: 你 realistically 可以获得的市场份额

WAIT for user response.

### Section 4: Market Trends & Timing

Display: "**📊 第4部分：市场趋势与时机**

市场的时机和趋势如何？"

Suggested prompts:
- "现在的市场环境对于这类产品是否有利？"
- "有哪些技术、社会或商业趋势会影响你的产品？"
- "为什么现在是推出这个产品的好时机？"
- "太早或太晚会有什么风险？"

WAIT for user response.

### Section 5: Competitive Advantage

Display: "**💎 第5部分：竞争优势**

你的产品有什么可持续的竞争优势？"

Suggested prompts:
- "你的独特优势是什么？这些优势可以被复制吗？"
- "你的产品有什么壁垒？（技术、数据、网络效应、品牌等）"
- "竞争对手会如何反击？你能应对吗？"
- "长期来看，你的护城河是什么？"

WAIT for user response.

### Section 6: Market Opportunity Assessment

Display: "**🎯 第6部分：市场机会评估**

综合以上分析，市场机会如何？"

Ask user: "基于所有这些市场方面的讨论，你觉得市场机会如何？"

WAIT for user response.

Provide your assessment:
"基于我们的分析，我评估这个市场机会为 [assessment]。

**市场机会因素**:
{positive factors}

**市场挑战**:
{challenges and concerns}

**市场建议**:
{market-focused recommendations}"

## DOCUMENTATION PROTOCOL:

After completing all sections, display:

"✨ 让我们整理市场验证结果！"

**Present Market Validation Summary:**

Create a structured summary and ask if it's accurate.

### Document the Market Validation:

Once confirmed, append to `{outputFile}`:

```markdown
## 市场验证

### 市场需求评估
**需求验证**: {High/Medium/Low}
- 需求证据: {evidence}
- 用户反馈: {if available}
- 需求紧迫性: {description}

### 竞争分析
**直接竞争对手**:
1. {Name}: {描述}
2. {Name}: {描述}

**间接竞争对手**:
1. {Name}: {描述}
2. {Name}: {描述}

**现有方案的问题**:
{list of current solution issues}

### 市场规模估算
- **TAM** (Total Addressable Market): {estimate}
- **SAM** (Serviceable Available Market): {estimate}
- **SOM** (Serviceable Obtainable Market): {estimate}
- **目标市场**: {description}

### 市场趋势与时机
- **当前趋势**: {describe trends}
- **时机评估**: {favorable/neutral/challenging}
- **风险因素**: {list}

### 竞争优势
- **独特优势**: {list}
- **可持续性**: {assessment}
- **竞争壁垒**: {list}

### 市场机会综合评估
**评分**: [X]/10
**评估**: {description}

**市场机会因素**:
{positive factors}

**市场挑战**:
{challenges}

**市场建议**:
{recommendations}

### 验证日期
{current date}
```

Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]`, `lastStep: 'market-validation'`.

## STEP COMPLETION MENU:

Display: "**🎉 市场验证完成！**

我们已经完成了市场需求、竞争和机会的分析。最后，让我们定义MVP的范围和行动计划。

**[C] 继续** - 进入MVP范围定义阶段
**[R] 重新验证** - 重新进行市场验证
**[S] 查看市场报告** - 查看已生成的市场报告**
**[M] 策略建议** - 查看市场进入策略建议**

### Menu Handling:

- **[C] Continue**: Only proceed when user selects 'C'. Load `{nextStepFile}`
- **[R] Restart**: Reset this step
- **[S] Show**: Display market validation report
- **[M] Market Strategy**: Provide market entry strategy recommendations (beta users, partnerships, channels, etc.)

## CRITICAL STEP COMPLETION NOTE

ONLY when user selects **[C]** and confirms, update frontmatter, save document, then load, read entire file, then execute `{nextStepFile}`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- Market need systematically validated
- Competitive landscape analyzed
- Market size estimated thoughtfully
- Timing and trends considered
- Competitive advantage identified
- Honest market assessment provided

### ❌ SYSTEM FAILURE:
- Made unsubstantiated market claims
- Ignored competition or market challenges
- Provided unrealistic market estimates
- Proceeded without user confirmation
- Did not validate market need evidence

**Master Rule:** Market validation must be evidence-based and realistic - help user understand the true market opportunity, not just confirm what they want to hear.