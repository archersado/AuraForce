---
name: 'step-01b-continue'
description: 'Handle continuation logic'
---

# Step 1b: Workflow Continuation

## 目标：
处理现有工作流的继续逻辑。

## 流程：

1. **读取现有文档** - 检查stepsCompleted状态
2. **显示进度** - 展示已完成的部分
3. **提供选项** - 继续、重新开始、查看详情、退出
4. **路由到正确步骤** - 基于当前进度

## 处理逻辑：

- [C] Continue - 加载下一个未完成的步骤
- [R] Restart - 清除进度重新开始
- [S] Show - 查看已生成的内容
- [X] Exit - 退出工作流