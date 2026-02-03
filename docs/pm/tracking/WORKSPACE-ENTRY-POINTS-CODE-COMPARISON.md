# 代码对比：工作空间入口统一

## 1. `/src/app/(protected)/workspace/page.tsx`

### 导入修改

```diff
- import TemplateSelect from '@/components/workflows/TemplateSelect';
```

### View 类型修改

```diff
- type View = 'dashboard' | 'templateSelect' | 'upload';
+ type View = 'dashboard' | 'upload';
```

### 初始 View 修改

```diff
const [view, setView] = useState<View>(() => {
  const path = searchParams.get('page');
- if (path === 'templates') return 'templateSelect';
  if (path === 'upload') return 'upload';
  return 'dashboard';
});
```

### handleCreateProject 函数修改

```diff
  const handleCreateProject = () => {
-   setView('templateSelect');
-   router.push('/workspace?page=templates');
+   router.push('/workspace/new');
  };
```

### 移除 handleLoadTemplate 函数

```diff
- const handleLoadTemplate = (templateId: string, projectName: string) => {
-   setView('dashboard');
-   router.push('/workspace');
-   window.location.reload();
- };
```

### 快捷操作按钮修改

```diff
- <button onClick={() => setView('templateSelect')}>
+ <button onClick={handleCreateProject}>
```

### 移除 TemplateSelect 视图

```diff
- {/* Template Select View */}
- {view === 'templateSelect' && (
-   <div className="flex-1 overflow-auto p-6">
-     <TemplateSelect
-       onLoadTemplate={handleLoadTemplate}
-     />
-   </div>
- )}
```

---

## 2. `/src/app/workspace/new/page.tsx`

### 新增 State

```diff
+ const [projectName, setProjectName] = useState('');
```

### 修复 API 调用（P0 Bug）

#### 修改前（错误）：
```typescript
const response = await fetch('/api/workspace/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: selectedWorkflow.id,
    workflowName: selectedWorkflow.name,
  }),
});
```

#### 修改后（正确）：
```typescript
const response = await fetch('/api/workflows/load-template', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateId: selectedWorkflow.id,
    projectName: projectName.trim(),
  }),
});
```

### 新增表单验证

```diff
  const handleConfirm = async () => {
+   if (!selectedWorkflow || !projectName.trim()) {
+     setError('请选择工作流并输入项目名称');
+     return;
+   }
```

### 修复成功跳转

```diff
- router.push(`/workspace/${data.id}`);
+ router.push(`/workspace`);
```

### 新增右侧固定面板

#### 布局修改：

```diff
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto h-full">
+         <div className="flex gap-6 h-[calc(100vh-200px)]">
            {/* Left side - Workflow selector */}
+           <div className="flex-1">
              <WorkflowSelector
                onSelect={handleWorkflowSelect}
                onCancel={handleCancel}
                selectedWorkflowId={selectedWorkflow?.id}
-               className="h-[calc(100vh-200px)]"
+               className="h-full"
              />
+           </div>

+           {/* Right side - Project name input (fixed) */}
+           <div className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
+             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
+               项目配置
+             </h3>

+             {selectedWorkflow ? (
+               <div className="space-y-4">
+                 {/* Selected workflow info */}
+                 <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
+                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
+                     已选择的工作流
+                   </p>
+                   <p className="font-medium text-gray-900 dark:text-white">
+                     {selectedWorkflow.name}
+                   </p>
+                 </div>

+                 {/* Project name input */}
+                 <div>
+                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
+                     项目名称
+                   </label>
+                   <input
+                     type="text"
+                     value={projectName}
+                     onChange={(e) => setProjectName(e.target.value)}
+                     placeholder="my-project"
+                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
+                   />
+                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
+                     输入您的项目名称
+                   </p>
+                 </div>

+                 {/* Confirm button */}
+                 <button
+                   onClick={handleConfirm}
+                   disabled={!projectName.trim() || isCreating}
+                   className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 text-white rounded-lg font-medium transition-colors"
+                 >
+                   {isCreating ? '创建中...' : '创建项目'}
+                 </button>
+               </div>
+             ) : (
+               <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
+                 <p className="text-sm">请在左侧选择一个工作流</p>
+               </div>
+             )}
+           </div>
+         </div>
        </div>
      </div>
```

---

## API 对比

### 修复前（不存在）

```typescript
POST /api/workspace/create
{
  workflowId: string,
  workflowName: string
}
```

### 修复后（已存在）

```typescript
POST /api/workflows/load-template
{
  templateId: string,
  projectName: string
}
```

---

## 用户流程对比

### 修改前（两套流程）

#### 入口 1：Workspace 页面
1. 点击 "New Project"
2. 显示 TemplateSelect 组件
3. 选择模板
4. 弹出模态框输入项目名
5. 调用 `/api/workflows/load-template`
6. `window.location.reload()`

#### 入口 2：/workspace/new 页面
1. 显示 WorkflowSelector 组件
2. 选择工作流
3. 点击确认（没有项目名输入）
4. 调用不存在的 `/api/workspace/create` ❌
5. 跳转到 `/workspace/${data.id}`

### 修改后（统一流程）

#### 统一入口：/workspace/new
1. 从任何地方点击 "New Project" → 跳转到 `/workspace/new`
2. 左侧：WorkflowSelector 选择工作流
3. 右侧：固定面板显示项目配置和项目名输入
4. 点击"创建项目"
5. 调用 `/api/workflows/load-template` ✅
6. 跳转到 `/workspace`

---

## 总结

### 主要修改

1. ✅ 修复 P0 Bug：将 API 调用从不存在的 `/api/workspace/create` 改为 `/api/workflows/load-template`
2. ✅ 统一导航：所有 "New Project" 按钮都跳转到 `/workspace/new`
3. ✅ 新增功能：在 `/workspace/new` 页面添加右侧固定面板，显示项目配置和项目名输入
4. ✅ 简化代码：移除 `TemplateSelect` 视图和相关逻辑

### 用户体验提升

- ✅ 更清晰的导航路径
- ✅ 无模态框，更流畅的交互
- ✅ 实时看到输入的项目名
- ✅ 更好的视觉层次（左侧选择 + 右侧配置）
