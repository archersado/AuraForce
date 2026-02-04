# AuraForce 未使用页面分析

**分析时间：** 2025-02-03 22:50 GMT+8

---

## 📊 页面统计

### 文件系统中的页面总数

**根级别：**
- `page.tsx` - 首页
- `layout.tsx` - 根布局
- `dashboard/page.tsx` - Dashboard
- `diagnostic/page.tsx` - 诊断页面
- `code-editor-demo/page.tsx` - Code Editor Demo
- `skill-builder/page.tsx` - 技能构建器
- `market/layout.tsx` - 市场布局
- `market/page.tsx` - 市场首页
- `market/workflows/page.tsx` - 工作流市场

**认证相关 ((auth) 路由组)：**
- `(auth)/login/page.tsx` - 登录
- `(auth)/register/page.tsx` - 注册
- `(auth)/forgot-password/page.tsx` - 忘记密码
- `(auth)/reset-password/page.tsx` - 重置密码
- `(auth)/verify/page.tsx` - 邮箱验证

**受保护路由 ((protected) 路由组)：**
- `(protected)/workspace/page.tsx` - 工作空间首页 ✅ 已注册
- `(protected)/workspace/new/page.tsx` - 新建工作空间 ❌ 未注册
- `(protected)/project/[id]/page.tsx` - 项目详情页 ✅ 已注册
- `(protected)/workflows/page.tsx` - 工作流管理 ❌ 未注册
- `(protected)/market/workflows/page.tsx` - 工作流市场 ❌ 未注册
- `(protected)/profile/settings/page.tsx` - 个人设置 ❌ 未注册

**租户相关：**
- `tenant/[tenantId]/page.tsx` - 租户详情
- `tenant/create/page.tsx` - 创建租户
- `workspace/new/page.tsx` - 新建工作空间（根级别，重复）

---

## ✅ Next.js 实际注册的页面（.next/app-build-manifest.json）

**根级别：**
- ✅ `/page` - 首页
- ✅ `/layout` - 根布局
- ✅ `/skill-builder/page` - 技能构建器

**受保护路由 ((protected) 路由组)：**
- ✅ `/(protected)/layout` - 受保护布局
- ✅ `/(protected)/workspace/page` - 工作空间首页
- ✅ `/(protected)/project/[id]/page` - 项目详情页

**API 路由：**
- ✅ `/api/workspaces/route`
- ✅ `/api/workspaces/[id]/route`
- ✅ `/api/sessions/route`
- ✅ `/api/sessions/project/[projectId]/latest/route`
- ✅ `/api/files/list/route`
- ✅ `/api/sessions/[id]/route`
- ✅ `/api/files/read/route`
- ✅ `/api/auth/session/route`

---

## ❌ 未使用的页面（26 个）

### P0 - 完全未注册（16 个）

**受保护路由中的页面（7 个）：**
1. ❌ `(protected)/workspace/new/page.tsx` - 新建工作空间（我刚创建的）
2. ❌ `(protected)/workflows/page.tsx` - 工作流管理（4KB）
3. ❌ `(protected)/market/workflows/page.tsx` - 工作流市场（我刚创建的）
4. ❌ `(protected)/profile/settings/page.tsx` - 个人设置
5. ❌ `(protected)/subscription/page.tsx` - 订阅页面（不存在）

**认证路由 ((auth) 路由组)（5 个）：**
6. ❌ `(auth)/login/page.tsx` - 登录页面
7. ❌ `(auth)/register/page.tsx` - 注册页面
8. ❌ `(auth)/forgot-password/page.tsx` - 忘记密码页面
9. ❌ `(auth)/reset-password/page.tsx` - 重置密码页面
10. ❌ `(auth)/verify/page.tsx` - 邮箱验证页面

**仪表盘 ((dashboard) 路由组)（1 个）：**
11. ❌ `(dashboard)/claude/page.tsx` - Claude 页面

**根级别页面（3 个）：**
12. ❌ `dashboard/page.tsx` - Dashboard
13. ❌ `diagnostic/page.tsx` - 诊断页面
14. ❌ `code-editor-demo/page.tsx` - Code Editor Demo

**租户相关（2 个）：**
15. ❌ `tenant/[tenantId]/page.tsx` - 租户详情
16. ❌ `tenant/create/page.tsx` - 创建租户

### P1 - 部分使用但未注册（3 个）

17. ❌ `market/layout.tsx` - 市场布局（未注册）
18. ❌ `market/page.tsx` - 市场首页（未注册）
19. ❌ `market/workflows/page.tsx` - 工作流市场（未注册）

### P2 - 可能不需要的页面（7 个）

**重复页面（1 个）：**
20. ❌ `workspace/new/page.tsx` - 新建工作空间（重复存在于根级别）

**潜在未使用（6 个）：**
21. ❌ `src/components/Visualization/CCAssetPreview.tsx` - 资产预览
22. ❌ `src/components/Visualization/SkillCards.tsx` - 技能卡片
23. ❌ `src/components/Visualization/WorkflowDiagram.tsx` - 工作流图表
24. ❌ `src/components/Visualization/SkillRadar.tsx` - 技能雷达图

---

## 🔍 根因分析

### 路由组配置问题

**问题：** `basePath: '/auraforce' + (protected) 路由组` 配置冲突

**表现：**
- `(protected)/workflows/page.tsx` → 预期 `/auroraforce/workflows` → 实际 404
- `(protected)/market/workflows/page.tsx` → 预期 `/auroraforce/market/workflows` → 实际 404

**原因：** Next.js 15 App Router 在使用 `(protected)` 路由组时，可能会与 basePath 冲突

### 命名空间重复

**问题：** `workspace/new/page.tsx` 同时存在于根级别和 `(protected)` 路由组
- 根级别：`workspace/new/page.tsx`
- (protected) 组：`(protected)/workspace/new/page.tsx`

**影响：** 可能导致路由混乱和优先级不确定

### 未注册路由的页面（26 个）

**说明：** `.next/app-build-manifest.json` 只注册了 9 个页面

**未注册原因：**
1. **路由组配置问题：** `(protected)` 路由组的页面未正确注册
2. **未使用的路由：** 部分页面是旧功能或实验性功能
3. **配置错误：** 下一版的 Next.js 可能重新编译后这些页面会被注册

---

## 🧹 清理建议

### 立即修复（P0 - 阻塞）

1. **移除重复的 workspace/new**
   ```bash
   rm /Users/archersado/clawd/projects/AuraForce/src/app/workspace/new/page.tsx
   ```

2. **修复路由组配置问题**
   - 方案 A：禁用 basePath（你说不可以）
   - 方案 B：移除 `(protected)` 路由组，使用中间件保护页面
   - 方案 C：使用相对路径代替绝对路由

### 可以删除的页面（P1 - 优化）

3. **删除诊断和 Demo 页面**
   - `diagnostic/page.tsx`
   - `code-editor-demo/page.tsx`
   - `dashboard/page.tsx`

4. **删除租户相关页面（如果不使用多租户）**
   - `tenant/[tenantId]/page.tsx`
   - `tenant/create/page.tsx`

### 保留但需要注册的页面（需要 Sprint 3）

5. **认证相关页面（5 个）**
   - `(auth)/login/page.tsx`
   - `(auth)/register/page.tsx`
   - `(auth)/forgot-password/page.tsx`
   - `(auth)/reset-password/page.tsx`
   - `(auth)/verify/page.tsx`

6. **市场相关页面（3 个）**
   - `market/layout.tsx`
   - `market/page.tsx`
   - `market/workflows/page.tsx`

7. **工作流管理页面**
   - `(protected)/workflows/page.tsx` - 工作流管理

---

## 📋 清理清单

### 🔥 立即删除（重复路由）
- [ ] `workspace/new/page.tsx`（根级别，重复）

### ✅ 保留（用户正在使用）
- [ ] `(protected)/workspace/page.tsx` - 工作空间首页
- [ ] `(protected)/project/[id]/page.tsx` - 项目详情页
- [ ] `page.tsx` - 首页
- [ ] `skill-builder/page.tsx` - 技能构建器（已注册）

### ⏳ Sprint 3 需要注册
- [ ] `(protected)/workspace/new/page.tsx` - 新建工作空间
- [ ] `(protected)/market/workflows/page.tsx` - 工作流市场
- [ ] `(protected)/workflows/page.tsx` - 工作流管理

### 🗑️ 删除（未使用的功能）
- [ ] `code-editor-demo/page.tsx` - 旧 demo 页面
- [ ] `diagnostic/page.tsx` - 诊断页面
- [ ] `dashboard/page.tsx` - 旧 dashboard
- [ ] `tenant/[tenantId]/page.tsx` - 不使用的租户功能
- [ ] `tenant/create/page.tsx` - 不使用的租户创建
- [ ] `(dashboard)/claude/page.tsx` - 未使用

### 🔐 需要激活（认证功能）
- [ ] `(auth)/login/page.tsx` - 登录
- [ ] `(auth)/register/page.tsx` - 注册
- [ ] `(auth)/forgot-password/page.tsx` - 忘记密码
- [ ] `(auth)/reset-password/page.tsx` - 重置密码
- [ ] `(auth)/verify/page.tsx` - 邮箱验证

---

## 📊 估算修复成本

**总页面数：** **27 个页面**
**已注册：** **9 个（33%）**
**未注册：** **18 个（67%）**

**修复工作量：**
- 路由配置修复：2-4 小时
- 删除重复和未使用页面：30 分钟
- 注册必要页面 Sprint 3：1-2 小时

---

## 🎯 建议行动

**立即执行：**
1. [ ] 移除 `workspace/new/page.tsx`（重复）
2. [ ] 删除 `code-editor-demo/page.tsx`、`diagnostic/page.tsx`

**下一 Sprint：**
1. [ ] 修复路由组配置（解决 `(protected)` 路由问题）
2. [ ] 注册必要页面（新建工作空间、工作流市场、工作流管理）
3. [ ] 激活认证功能（如果需要）

---

**状态：** 分析完成，等待你确认清理清单

---

**完成后告诉我：我应该开始清理吗？** 🧹✨
