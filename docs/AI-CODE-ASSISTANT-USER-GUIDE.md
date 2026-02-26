# AI 代码助手用户指南

## 概述

AI 代码助手是 AuraForce 代码编辑器的智能功能，通过 Claude AI 帮助您改善、优化和重构代码。它提供自然语言命令、即时预览和一键应用功能。

## 快速开始

### 启用 AI 助手

1. 在代码编辑器中，点击工具栏上的 "🤖 AI 助手" 按钮
2. AI 面板会在编辑器右侧打开
3. 开始使用 AI 辅助功能！

### 基本工作流程

```
1. 选择代码（可选）→ 2. 输入指令或点击快捷按钮 → 3. 查看 Diff 预览 → 4. 决定应用或拒绝
```

## 功能

### 快捷操作按钮

AI 助手提供四个常用快捷操作：

| 按钮 | 功能 | 说明 |
|------|------|------|
| ✨ 改善这个函数 | Improve this function | 提升代码质量、可读性和可维护性 |
| 💬 添加注释 | Add comments | 为代码添加清晰的注释和文档 |
| 🔧 重构代码 | Refactor code | 重构代码结构，消除重复，改进组织 |
| ⚡ 优化性能 | Optimize performance | 优化代码性能，改进算法和数据结构 |

### 自然语言命令

您可以使用自然语言与 AI 交流，例如：

**中文指令示例：**
- "简化这个函数"
- "添加 TypeScript 类型"
- "把这个改成异步的"
- "提取重复的逻辑"
- "优化这个循环"
- "添加错误处理"

**英文指令示例：**
- "Simplify this function"
- "Add TypeScript types"
- "Make this async"
- "Extract repeated logic"
- "Optimize this loop"
- "Add error handling"

### Diff 预览

AI 生成建议后，您会看到：
- **绿色高亮**：新增的代码行
- **红色高亮**：删除的代码行
- **普通文本**：未修改的代码行

Diff 预览让您清楚地了解所有更改，然后再决定是否应用。

### 安全检查

AI 自动检查代码安全性，包括：
- XSS 攻击防护
- SQL 注入检测
- 有害 API 调用（eval() 等）
- 硬编码密钥检测
- 代码混淆检测

**安全评分：**
- 🟢 **90-100**：非常安全
- 🟡 **70-89**：相对安全，有轻微警告
- 🔴 **<70**：存在安全隐患

**注意：** 存在安全隐患的建议无法直接应用。

### 置信度

AI 为每个建议提供置信度评分，反映建议的质量和可靠程度：
- **≥80%**：高质量建议，通常可以直接应用
- **50-79%**：中等质量，需要人工审核
- **<50%**：低质量或不确定，谨慎使用

## 使用场景

### 场景 1：改善函数质量

**原始代码：**
```javascript
function f(a,b,c){
  if(a>b){
    return a*c
  }
  return b*c
}
```

**操作：**
1. 点击 "✨ 改善这个函数"
2. 查看 AI 建议的改进版本
3. 审查 Diff 预览
4. 应用建议

**结果：**
```javascript
function multiplyLarger(first, second, multiplier) {
  if (first > second) {
    return first * multiplier;
  }
  return second * multiplier;
}
```

### 场景 2：添加注释

**原始代码：**
```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

**操作：**
1. 选择代码
2. 点击 "💬 添加注释"
3. 查看添加的注释
4. 应用建议

**结果：**
```javascript
/**
 * Creates a debounced function that delays invoking func until after wait milliseconds.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} - The debounced function.
 */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 场景 3：性能优化

**原始代码：**
```javascript
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}
```

**操作：**
1. 选择代码
2. 点击 "⚡ 优化性能"
3. 查看优化建议
4. 应用建议

**结果：**
```javascript
function findDuplicates(arr) {
  // Use Set for O(n) complexity instead of O(n^2)
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}
```

## 最佳实践

### 1. 逐步改进
- 不要一次性要求 AI 改进大量代码
- 针对特定函数或代码块进行改进
- 分步骤进行重构

### 2. 审核建议
- 始终查看 Diff 预览
- 理解为什么 AI 建议这些更改
- 确保更改符合您的需求

### 3. 保持上下文
- 在相同的会话中连续提问
- AI 会记住之前的改进
- 利用上下文获得更好的结果

### 4. 安全第一
- 注意安全警告
- 不要盲目应用高风险更改
- 对生产代码进行额外审查

### 5. 测试很重要
- 应用改进后运行测试
- 确保功能仍然正常
- 使用代码审查流程

### 6. 学习和成长
- 从 AI 的建议中学习
- 了解最佳实践
- 提升您的编码技能

## 常见问题 (FAQ)

**Q: AI 代码助手支持哪些编程语言？**
A: 目前支持 JavaScript、TypeScript、Python、Java、Go、Rust、PHP、SQL 等多种语言。

**Q: AI 会删除我的代码吗？**
A: 不会。所有更改都会显示在 Diff 预览中，您可以完全控制是否应用。

**Q: 如果 AI 建议不正确怎么办？**
A: 点击 "拒绝" 按钮即可忽略建议。您也可以尝试更具体的指令。

**Q: AI 能否根据特定编码标准优化代码？**
A: 可以！在指令中指定编码标准，例如："使用 Airbnb 风格指南优化代码"。

**Q: AI 生成的代码安全吗？**
A: AI 有内置安全检查，但仍建议您在进行生产部署前进行人工审查。

**Q: 可以在离线状态下使用吗？**
A: 不可以，AI 助手需要网络连接才能访问 Claude API。

**Q: 有使用次数限制吗？**
A: 这取决于您的 API 配额和定价计划。

**Q: AI 建议能否撤销？**
A: 可以。编辑器的撤销功能（Ctrl+Z / Cmd+Z）也可以撤销 AI 的更改。

**Q: 如何报告问题或反馈？**
A: 请通过项目 GitHub 仓库提交 Issue 或联系支持团队。

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + S` | 保存代码 |
| `Ctrl/Cmd + /` | 注释/取消注释 |
| `Escape` | 关闭 AI 面板 |

## 技术支持

如遇到问题或需要帮助：
- 📧 Email: support@auraforce.com
- 💬 Discord: [AuraForce 社区]
- 📖 文档: [AuraForce 文档中心]
- 🐛 Bug 报告: [GitHub Issues]

## 版本历史

### v1.0.0 (2025-01-XX)
- ✨ 初始发布
- ✨ AI 代码生成和 refactor
- ✨ Diff 预览
- ✨ 安全检查
- ✨ 快捷操作按钮

## 许可证

AI 代码助手是 AuraForce 的一部分，遵循 AuraForce 许可条款。
