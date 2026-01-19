---
name: 'step-01-project-setup'
description: 'Initialize project structure and configure development tools'
---

# Step 1: Project Setup

Initialize the complete project structure with both frontend and backend applications.

## DIALOGUE SECTIONS:

### 1. Welcome and Tech Stack Confirmation
"**💻 MVP Implementation 工作流启动**

我是Atlas，全栈开发专家。我将基于技术架构文档，引导你构建完整的MVP产品。

**让我们确认技术栈配置：**"

### 2. Confirm Tech Stack
Based on Tech Architecture workflow:
- Frontend framework: [React/Vue/Next.js]
- Backend framework: [Express/FastAPI/...]
- Database: [PostgreSQL/MongoDB/...]
- Language: [TypeScript/Python/...]

### 3. Create Project Structure

#### Frontend Structure
```bash
my-app-frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management
│   ├── api/              # API client
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── styles/           # Styles (CSS/Sass/Tailwind)
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts        # Build config
└── README.md
```

#### Backend Structure
```bash
my-app-backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access
│   ├── models/           # Data models
│   ├── middleware/       # Express middleware
│   ├── routes/           # Route definitions
│   ├── utils/            # Utility functions
│   └── config/           # Configuration
├── migrations/           # Database migrations
├── tests/                # Test files
├── package.json
├── tsconfig.json
└── .env.example
```

### 4. Code Generation Level

**请选择代码生成级别**:

1. **概念级 (Conceptual)** - 伪代码和算法描述
2. **基础级 (Basic)** - 核心函数，详细注释
3. **实现级 (Implementational)** - 完整可运行代码

### 5. Initialize Frontend (Example: React + Vite)

```bash
# Initialize project
npm create vite@latest my-app-frontend -- --template react-ts

# Install dependencies
cd my-app-frontend
npm install
npm install axios zustand react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 6. Initialize Backend (Example: Node.js + Express)

```bash
# Initialize project
mkdir my-app-backend
cd my-app-backend
npm init -y

# Install dependencies
npm install express cors helmet dotenv
npm install -D typescript @types/express @types/node @types/cors ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

## DOCUMENTATION:

Update output file with project structure and initialization commands.

## NEXT:

"**✅ 项目结构已创建**

下一步: 数据库实现 - 我们将设置数据库连接和创建迁移。"
