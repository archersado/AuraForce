# Linear Issue 格式快速参考

**项目：** AuraForce | **最后更新：** 2025-02-02

---

## ✅ 正确的 Description 格式

### 关键规则
- **段落之间使用 `\n\n`（两个换行符）**
- **标题和内容之间用空行分隔**
- **列表使用 `*` 或 `-`**
- **不要将所有内容放在一行**

---

## 📋 常用模板

### Epic Issue 描述模板

```bash
description: "**Epic XX: Epic Title**

### 概述

Epic 概述和目标

### Stories 已完成 (N个)

* STORY-XX-1: Story Title
* STORY-XX-2: Story Title

### 完成日期

YYYY-MM-DD

### 交付物

* 交付物 1
* 交付物 2"
```

### Story Subissue 描述模板

```bash
description: "**Story XX.Y**

### 目标

Story 目标和价值

### 接受标准

* AC 1
* AC 2
* AC 3

### 分配信息

* **执行 Agent**: [agent-name]
* **创建日期**: YYYY-MM-DD

### 完成日期

YYYY-MM-DD"
```

---

## 🚀 mcporter 快速命令

### 创建 Epic Issue

```bash
mcporter call linear.create_issue \
  title: "[EPIC-XX] Epic Title" \
  description: "**Epic XX: Epic Title**

### 概述

Epic 概述和目标

### Stories 等待创建" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  state: "In Progress" \
  priority: "3"
```

### 创建 Story Subissue

```bash
mcporter call linear.create_issue \
  title: "STORY-XX-Y: Story Title" \
  description: "**Story XX.Y**

### 目标

Story 目标

### 接受标准

* AC 1

### 分配信息

* **执行 Agent**: [agent-name]
* **创建日期**: YYYY-MM-DD

### 完成日期

YYYY-MM-DD" \
  team: "7964a781-528b-43cf-8b8c-0acbb479dd0a" \
  project: "auraforce" \
  parentId: "Epic Issue ID" \
  assignee: "me" \
  state: "Done" \
  priority: "4"
```

### 更新 Issue Description（修复格式）

```bash
mcporter call linear.update_issue \
  id: "ARC-XX" \
  description: "**Story XX.Y**

### 目标

目标内容

### 接受标准

* 标准 1"
```

---

## ⚠️ 常见错误

| ❌ 错误 | ✅ 正确 |
|---------|---------|
| `description: "**Title** ### H Content"` | `description: "**Title**\n\n### H\n\nContent"` |
| 所有内容在一行 | 使用 `\n\n` 分隔段落 |
| 标题紧接内容 | 标题和内容之间加空行 |
| 列表没有分隔符 | 使用 `*` 或 `-` |

---

## 📊 验证步骤

创建 Issue 后：

1. ✅ 在 Linear 网页界面查看 Issue
2. ✅ 确认列表正确渲染
3. ✅ 确认标题层级正确
4. ✅ 确认段落清晰可读
5. ✅ 如有问题，使用 `linear.update_issue` 修复

---

## 📚 相关文档

- [Linear PM 同步模式文档](./LINEAR_PM_SYNC_MODE.md)
- [Markdown 格式修复报告](./tracking/LINEAR_MARKDOWN_FIX_2025-02-02.md)
- [Linear 同步完成报告](./tracking/LINEAR_SYNC_COMPLETION.md)

---

**提示：** 创建 Issue 前，先复制模板并替换内容！📋
