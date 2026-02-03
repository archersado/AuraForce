# Linear Issue 格式检查清单

**项目：** AuraForce | **创建时间：** 2025-02-02

---

## ✅ 创建 Issue 前的检查清单

### Step 1: 准备 Description 内容
- [ ] 使用正确的 markdown 格式
- [ ] 段落之间有 `\n\n` 换行符
- [ ] 标题和内容之间有空行
- [ ] 列表使用 `*` 或 `-*` 符号
- [ ] 不要将所有内容放在一行

### Step 2: 验证 mcporter 命令
- [ ] title 格式正确
  - Epic: `[EPIC-XX] Title`
  - Story: `STORY-XX-Y: Title`
- [ ] description 使用正确的格式
- [ ] **assignee 已设置（Story 需要）**
  - 使用 "me" 表示自分
  - 或使用具体的 agent 名称
- [ ] parentId 正确设置（Story 需要设置）
- [ ] state 参数正确
- [ ] priority 参数正确

### Step 3: 执行创建
- [ ] 运行 mcporter 命令
- [ ] 等待命令完成
- [ ] 记录返回的 Issue ID 和 URL

---

## ✅ 创建 Issue 后的验证步骤

### Step 1: 访问 Linear 网页
- [ ] 浏览器打开 Linear Issue URL
- [ ] 登录 Linear 账户

### Step 2: 检查显示格式
- [ ] 标题正确显示
- [ ] 段落清晰可读
- [ ] 列表正确渲染
- [ ] 标题层级正确
- [ ] 内容没有挤在一起

### Step 3: 检查 Issue 信息
- [ ] Issue 状态正确
- [ ] Issue 优先级正确
- [ ] 项目设置为 "auraforce"
- [ ] **assignee 正确设置（Story 需要）**
- [ ] 父子关系正确（Story 需要）

### Step 4: 如有问题
- [ ] 使用 `linear.update_issue` 修复
- [ ] 更新 description 内容
- [ ] 记录修复内容

---

## ❌ 常见错误和解决方法

### 问题 1: 内容挤在一起
**症状：** Linear 界面所有内容在一行显示

**原因：** description 没有使用 `\n\n` 换行符

**解决方法：**
```bash
mcporter call linear.update_issue \
  id: "ARC-XX" \
  description: "**Story XX.Y**

### 目标

新内容

### 接受标准

* 标准 1"
```

---

### 问题 2: 列表不渲染
**症状：** 列表没有渲染成 bullet points

**原因：** 列表格式不正确或列表项不在单独一行

**解决方法：**
```bash
# ❌ 错误
* Item 1 * Item 2

# ✅ 正确
* Item 1

* Item 2
```

---

### 问题 3: 标题不显示
**症状：** ### 标题没有显示为三级标题

**原因：** 标题前没有空行

**解决方法：**
```bash
# ❌ 错误
**Title** ### Header Content

# ✅ 正确
**Title**

### Header

Content
```

---

### 问题 4: Subissue 不显示
**症状：** Story Subissue 没有显示在 Epic 下

**原因：** parentId 参数错误或 Epic Issue ID 不对

**解决方法：**
```bash
# 1. 获取 Epic Issue ID
mcporter call linear.get_issue id: "ARC-76"

# 2. 创建时使用正确的 parentId
mcporter call linear.create_issue \
  title: "STORY-1-1: Story Title" \
  description: "..." \
  parentId: "Epic Issue ID"
```

---

## 📋 快速格式模板

### Epic Description

```
**Epic XX: Epic Title**

### 概述

Epic 概述和目标

### Stories 已完成 (N个)

* STORY-XX-1: Story Title
* STORY-XX-2: Story Title

### 完成日期

YYYY-MM-DD

### 交付物

* 交付物 1
* 交付物 2
```

### Story Description

```
**Story XX.Y**

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

YYYY-MM-DD
```

---

## 🚀 总结

**记住这 4 点：**

1. ⚠️ **段落之间使用 `\n\n`**
2. ⚠️ **标题和内容之间加空行**
3. ⚠️ **Story 必须设置 assignee**
4. ✅ **创建后在 Linear 网页验证**

---

**相关文档：**
- [Linear 格式快速参考](./LINEAR_FORMAT_QUICK_REFERENCE.md)
- [Linear PM 同步模式文档](./LINEAR_PM_SYNC_MODE.md)
- [Markdown 格式修复报告](./tracking/LINEAR_MARKDOWN_FIX_2025-02-02.md)
