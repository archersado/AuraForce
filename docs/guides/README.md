# Development Guides - 开发指南

本目录包含 AuraForce 项目的开发指南和配置文档。

## 📚 指南列表

### 配置设置
- [Email Setup](email-setup.md) - 邮件服务配置指南

### 开发流程
（待补充）

## 🎯 快速开始

### 第 1 步：项目设置
```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
npm install || pnpm install

# 安装 Cherry Markdown
npm install cherry-markdown
```

### 第 2 步：配置环境
```bash
# 复制环境配置模板
cp .env.example .env

# 编辑环境变量
nano .env
```

### 第 3 步：启动开发服务器
```bash
# 启动 Next.js 开发服务器
npm run dev

# 打开浏览器
open http://localhost:3000
```

### 第 4 步：数据库设置
```bash
# 运行数据库迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate
```

## 🔧 常用命令

### 开发
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint
npm run test         # 运行单元测试
npm run test:e2e     # 运行 E2E 测试
```

### 数据库
```bash
npx prisma migrate dev          # 创建新迁移
npx prisma studio               # 打开 Prisma Studio
npx prisma generate             # 重新生成 Prisma Client
npx prisma migrate dev --name init
```

### 类型检查
```bash
npm run type-check             # TypeScript 类型检查
npm run build                  # 构建同时进行类型检查
```

## 📝 代码规范

### 代码风格
- 使用 ESLint 进行代码检查
- 使用 Prettier 格式化代码
- 遵循 TypeScript 最佳实践

### 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具变更
```

## 🤝 团队协作

### 分支管理
- `main` - 主分支，生产环境
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支
- `hotfix/*` - 紧急修复

### 代码审查
在合并 Pull Request 前必须经过代码审查。

---

*最后更新: 2025-02-02*
