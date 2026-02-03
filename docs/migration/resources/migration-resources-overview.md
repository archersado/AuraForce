# 🍒 Cherry Markdown 迁移资源整合

> AuraForce 项目从 Tiptap 迁移到 Cherry Markdown 的完整资源包

---

## 📚 文档列表

### 1. 📦 [依赖安装指南](./cherry-markdown-installation.md)
**用途**: 详细说明如何安装和配置 Cherry Markdown

**内容**:
- 需要移除的 13 个 Tiptap 依赖
- Cherry Markdown 三种版本的安装方案（完整版/Core版/Stream版）
- 可选依赖（Mermaid、ECharts）
- 包大小对比分析
- TypeScript 类型定义
- Next.js 集成配置
- 基础组件框架代码

**适合**: 第一次安装时阅读

---

### 2. 🛠️ [迁移技术分析](./migration-technical-analysis.md)
**用途**: 深度分析现有组件和迁移方案

**内容**:
- AIMarkdownEditor 详细分析（497行代码）
- MarkdownPreviewEditor 详细分析（500+行代码）
- 功能对比矩阵
- Cherry Markdown 特性分析
- 迁移风险评估
- 技术方案设计
- Props 接口映射表
- 3周实施计划

**适合**: 技术负责人、架构师

---

### 3. 📋 [包迁移参考](./package-migration-reference.md)
**用途**: package.json 变更的详细参考

**内容**:
- 需要移除的 13 个 Tiptap 包完整列表
- 需要添加的包
- package.json 变更示例（迁移前后对比）
- 包大小对比表格
- 手动编辑步骤
- 验证命令
- 常见问题
- 备份和回滚说明

**适合**: 手动执行迁移时查阅

---

### 4. ✅ [迁移检查清单](./migration-checklist.md)
**用途**: 10 个阶段的完整迁移步骤

**内容**:
- ✅ Phase 1: 前置准备（Day 1）
- ✅ Phase 2: 依赖迁移（Day 1-2）
- ✅ Phase 3: 配置设置（Day 2）
- ✅ Phase 4: 基础组件开发（Day 3-4）
- ✅ Phase 5: 编辑器迁移（Day 5-7）
- ✅ Phase 6: 测试验证（Day 8-9）
- ✅ Phase 7: 优化和清理（Day 10）
- ✅ Phase 8: 文档更新（Day 10）
- ✅ Phase 9: 上线准备（Day 11）
- ✅ Phase 10: 生产上线（Day 12+）

**包含**:
- 200+ 个检查项
- 每个阶段的具体任务
- 阅读时长: 10-12 个工作日

**适合**: 项目经理、开发者追踪进度

---

### 5. 🎯 [快速参考卡](./cherry-quick-reference.md)
**用途**: 迁移过程中的速查表

**内容**:
- 常用命令（安装、验证、清理）
- 包导入方式（完整版/Core版/Stream版）
- 基础配置模板
- 常用 API
- 工具栏按钮完整列表
- 事件回调对比
- React Hook 和组件模板
- 常见问题解答
- 功能对比表

**适合**: 打印放在键盘旁边

---

### 6. 📜 [Cherry 简介](./cherry-markdown-intro.md)
**用途**: 简短的 Cherry Markdown 介绍

**内容**:
- Cherry Markdown 是什么
- 与 Tiptap 的对比
- 官方资源链接
- 核心功能列表

**适合**: 初步了解 Cherry

---

## 🚀 工具和脚本

### 迁移脚本
**位置**: `/migrate-to-cherry.sh`

**功能**:
- ✅ 自动备份 package.json
- ✅ 自动卸载所有 Tiptap 依赖
- ✅ 自动安装 Cherry Markdown
- ✅ 可选安装 Mermaid 和 ECharts
- ✅ 可选清理和重建 node_modules
- ✅ 彩色输出和进度提示

**使用**:
```bash
./migrate-to-cherry.sh
```

---

## 📊 迁移数据总结

### 依赖变更

| 类型 | 数量 | 包大小（未压缩） | 包大小（Gzip） |
|------|------|----------------|---------------|
| 移除（Tiptap） | 13 个 | ~500 KB | ~152 KB |
| 添加（Cherry 完整版） | 1 个 | ~600 KB | ~200 KB |
| 添加（Cherry Stream版） | 1 个 | ~200 KB | ~70 KB |
| **净变化（完整版）** | -13 + 1 | +100 KB | +48 KB |
| **净变化（Stream版）** | -13 + 1 | **-300 KB** | **-82 KB** |

### 功能增强

| 功能 | Tiptap | Cherry |
|------|--------|--------|
| WYSIWYG | ✅ | ✅ |
| 实时预览 | ⚠️ 需扩展 | ✅ 原生 |
| 源码模式 | ❌ | ✅ |
| 表格编辑 | ✅ | ✅ |
| 数学公式 | ❌ | ✅ KaTeX |
| 流程图 | ❌ | ✅ Mermaid |
| 快捷键 | ✅ | ✅ |
| 拖拽上传 | ⚠️ 需扩展 | ✅ |
| 导出 PDF | ❌ | ✅ |
| 全屏模式 | ❌ | ✅ |

### 预期收益

- ✅ 功能增强（+5 个新功能）
- ✅ 包体积减少 20-40%（使用 Stream 版）
- ✅ 更好的用户体验
- ✅ 更少的配置代码
- ✅ 统一的编辑器实现

---

## 🎯 快速开始

### 方式 1: 自动化脚本（推荐）

```bash
# 1. 进入项目目录
cd /Users/archersado/clawd/projects/AuraForce

# 2. 运行迁移脚本
./migrate-to-cherry.sh

# 3. 根据提示选择选项
# 脚本会自动完成所有依赖迁移
```

---

### 方式 2: 手动迁移

```bash
# 1. 备份
cp package.json package.json.backup

# 2. 卸载 Tiptap
npm uninstall @tiptap/core @tiptap/react @tiptap/starter-kit \
  @tiptap/markdown @tiptap/extension-*

# 3. 安装 Cherry
npm install cherry-markdown

# 4. 清理（可选）
rm -rf node_modules package-lock.json .next
npm install
```

---

## 📖 按角色阅读建议

### 👨‍💻 前端开发者
1. 先读 [快速参考卡](./cherry-quick-reference.md) - 了解基础
2. 读 [安装指南](./cherry-markdown-installation.md) - 按步骤安装
3. 读 [技术分析](./migration-technical-analysis.md) - 了解代码迁移
4. 随时查阅 [快速参考卡](./cherry-quick-reference.md)

### 🏗️ 技术负责人
1. 先读 [技术分析](./migration-technical-analysis.md) - 全面了解
2. 读 [包迁移参考](./package-migration-reference.md) - 依赖变更
3. 审查 [检查清单](./migration-checklist.md) - 制定计划
4. 监控迁移进度

### 📋 项目经理
1. 读 [检查清单](./migration-checklist.md) - 了解阶段和时间
2. 读 [包迁移参考](./package-migration-reference.md) - 了解风险
3. 使用检查追踪进度
4. 评估是否需要延期

### 🧪 测试工程师
1. 读 [技术分析](./migration-technical-analysis.md) - 功能对比
2. 读 [检查清单](./migration-checklist.md) - 测试阶段
3. 根据检查清单测试所有功能
4. 测试浏览器兼容性

---

## 🔗 官方资源

- [Cherry Markdown GitHub](https://github.com/Tencent/cherry-markdown)
- [Cherry 官方文档](https://tencent.github.io/cherry-markdown/examples/)
- [配置项全解](https://github.com/Tencent/cherry-markdown/wiki/%E9%85%8D%E7%BD%AE%E9%A1%B9%E5%85%A8%E8%A7%A3)
- [API 文档](https://tencent.github.io/cherry-markdown/examples/api.html)
- [Demo 示例](https://tencent.github.io/cherry-markdown/examples/index.html)

---

## 🚨 关键注意事项

### 安全性
- ⚠️ 备份 package.json 后再修改
- ⚠️ 每个阶段完成后进行 Git 提交
- ⚠️ 准备回滚方案（保留备份标签）
- ⚠️ 分阶段迁移（先开发后生产）

### 兼容性
- ⚠️ Cherry 返回 Markdown，Tiptap 返回 HTML
- ⚠️ 事件回调名称不同
- ⚠️ 需要 `'use client'` 标记（Next.js App Router）
- ⚠️ 某些功能需要自定义扩展

### 性能
- ⚠️ 初始化时间可能增加（首次加载）
- ⚠️ 使用 Stream 版减少体积
- ⚠️ 配置虚拟滚动处理大文档
- ⚠️ 使用懒加载减少首屏加载

---

## 📞 支持和反馈

### 遇到问题？

1. 查看 [快速参考卡 - 常见问题](./cherry-quick-reference.md#-常见问题)
2. 查看 [安装指南 - 注意事项](./cherry-markdown-installation.md#-注意事项)
3. 查阅 [Cherry 官方文档](https://github.com/Tencent/cherry-markdown/wiki)
4. 提交 Issue 到项目仓库

### 发现文档错误？

- 提交 PR 改进文档
- 记录在 [迁移检查清单](./migration-checklist.md) 的注释中

---

## ✨ 迁移成功标准

迁移成功的标准：

- [x] 所有 Tiptap 依赖已移除
- [x] Cherry Markdown 正常安装
- [x] 原有编辑器功能完整迁移
- [x] 所有测试用例通过
- [x] 性能不低于 Tiptap
- [x] 浏览器兼容性良好
- [x] 用户体验无明显下降
- [x] 生产环境稳定运行 24+ 小时

---

## 📈 后续优化

迁移完成后，可以考虑：

1. **性能优化**
   - 配置虚拟滚动
   - 实现懒加载
   - 优化打包体积

2. **功能增强**
   - 自定义主题
   - 添加更多工具栏按钮
   - 实现协同编辑

3. **用户体验**
   - 添加快捷键提示
   - 优化移动端体验
   - 添加格式化提示

---

**文档创建日期**: 2025-02-01
**维护者**: Frontend Team
**最后更新**: 2025-02-01

---

💡 **提示**: 建议打印 [快速参考卡](./cherry-quick-reference.md) 并放在键盘旁边，迁移过程中随时查阅！
