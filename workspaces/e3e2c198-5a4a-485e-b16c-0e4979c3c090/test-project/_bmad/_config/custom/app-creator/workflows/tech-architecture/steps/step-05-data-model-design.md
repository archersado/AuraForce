---
name: 'step-05-data-model-design'
description: 'Design database schema and data relationships'

# Path Definitions
workflow_path: '{bmb_creations_output_folder}/app-creator/workflows/tech-architecture'
outputFile: '{output_folder}/tech-architecture-{project_name}.md'
---

# Step 5: Data Model Design

Design comprehensive database schema, entity relationships, and data management strategies.

## DIALOGUE SECTIONS:

### 1. Data Analysis Overview
"**💾 数据模型设计**

我将分析产品需求和业务逻辑，设计完整的数据库Schema和数据实体关系。"

### 2. Entity Identification
"**🔍 实体识别**

基于PRD中的功能需求，识别核心数据实体："

List all major entities based on:
- User-facing features
- Data storage requirements
- Business domain concepts

Typical entities include:
- **Users**: User accounts and profiles
- **[Business Entity 1]**: Core business data
- **[Business Entity 2]**: Related business data
- **[Config/Settings]**: Application configuration
- **[Audit Logs]**: Tracking and history

### 3. Entity Definition
"**📝 实体定义**

详细定义每个实体的属性和关系："

For each entity, document:

#### Base Entities

##### Users Table
```sql
Table: users

Columns:
- id: UUID PRIMARY KEY
- email: VARCHAR(255) UNIQUE NOT NULL
- username: VARCHAR(100) UNIQUE
- password_hash: VARCHAR(255) NOT NULL
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- avatar_url: VARCHAR(500)
- role: ENUM('user', 'admin', ... ) DEFAULT 'user'
- email_verified: BOOLEAN DEFAULT FALSE
- status: ENUM('active', 'suspended', 'deleted') DEFAULT 'active'
- last_login_at: TIMESTAMP
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

Indexes:
- idx_users_email: (email)
- idx_users_username: (username)
- idx_users_status: (status)

Relationships:
- One-to-Many with [related tables]
```

##### Business Entities
Define all domain-specific entities with:
- Table name
- All columns with data types
- Primary key
- Foreign keys
- Indexes
- Unique constraints
- Default values
- Nullable fields

### 4. Entity Relationship Diagram (ERD)
"**🔗 实体关系图**

让我描述实体间的关系："

Describe relationships:

```
User (1) ──────< (N) Order
 │                       │
 │                       │
 (1) ──────< (N)      (N)
[Related Entity]         OrderItem
                         │
                         │
                        (N)
Product (1) ───────────<
```

Document relationship types:
- **One-to-One (1:1)**: User ↔ UserProfile
- **One-to-Many (1:N)**: User → Orders
- **Many-to-Many (M:N)**: Users ↔ Groups
- **Self-referencing**: Comments parent/child

### 5. Database Schema Design
"**📊 数据库Schema设计**

基于选定的数据库技术，设计完整的Schema："

#### Relational Database (PostgreSQL/MySQL)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- [Business table 1]
CREATE TABLE [table_name] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    [other columns],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_[table]_user_id ON [table](user_id);

-- [Additional tables as needed]
```

#### NoSQL Database (MongoDB)

```javascript
// Users collection
users: {
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  role: String (default: 'user'),
  emailVerified: Boolean,
  status: String,
  createdAt: Date,
  updatedAt: Date
}

// [Business collection]
[collectionName]: {
  _id: ObjectId,
  userId: ObjectId,
  [other fields],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ status: 1 })
```

### 6. Data Migration Strategy
"**🔄 数据迁移策略**

设计和规划数据迁移方案："

Document migration approach:
- **Initial Migration**: Database setup with all tables
- **Schema Changes**: How to handle future migrations
- **Migration Tooling**: Use tools like:
  - Prisma Migrations (TypeScript/Node)
  - Alembic (Python)
  - Flyway (Java)
  - Custom migration scripts

### 7. Data Versioning & History
"**📜 数据版本化和历史**

考虑是否需要数据审计和历史跟踪："

Options:
- **Audit Logs**: Separate table tracking all changes
- **Soft Delete**: Don't actually delete, mark as deleted
- **Version Tables**: Store previous versions of entities
- **Event Sourcing**: Store events, derive current state

Define approach based on requirements.

### 8. Data Access Layer Design
"**🎯 数据访问层设计**

设计数据访问抽象层："

Define data access pattern:

#### Repository Pattern
```typescript
// Base Repository
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}

// User Repository Example
interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}

// Implementation
class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return db.users.findUnique({ where: { email } });
  }

  // ... other methods
}
```

### 9. Data Consistency & Transactions
"**✅ 数据一致性和事务**

定义事务使用策略："

Document when to use transactions:
- **Multi-record operations**: Create → Update → Link
- **Critical operations**: Payments, transfers
- **Data integrity**: Ensure referential integrity

Transaction scope examples:
- Creating an order with multiple items
- User registration with profile setup
- Payment processing with inventory update

## DOCUMENTATION:

Update output file `{outputFile}`:

Add section:
```markdown
## 5. 数据模型设计

### 5.1 实体列表
[List of all identified entities]

### 5.2 实体定义

#### [Entity Name]
[Complete entity definition with all attributes]

#### [Entity Name]
[Complete entity definition]

### 5.3 实体关系图

[ERD description or ASCII diagram]

### 5.4 数据库Schema

#### SQL Schema
[Complete SQL DDL statements]

#### 或 MongoDB Schema
[Complete MongoDB collection definitions]

### 5.5 数据迁移策略
[Migration approach and tooling]

### 5.6 数据版本化和历史
[Audit and versioning approach]

### 5.7 数据访问层
[Repository pattern implementations]

### 5.8 数据一致性
[Transaction strategy and usage]
```

Update frontmatter:
```yaml
stepsCompleted: [1, 2, 3, 4, 5]
lastStep: 'data-model-design'
```

## NEXT:

"**✅ 数据模型设计完成**

我们设计了完整的数据库Schema和实体关系。

**📊 数据模型摘要**:
- 实体总数: `[X] 个`
- 数据库: `[selected database]`
- 外键关系: `[X] 个`
- 索引: `[X] 个`

**下一步**: 接口设计 - 我们将定义API接口规范和数据协议。"

## CRITICAL NOTES:

- Normalize database design to 3NF (unless specific reasons not to)
- Define all constraints and indexes upfront
- Consider indexing strategy based on query patterns
- Document all relationships clearly
- Design for data access abstraction (Repository pattern)
- Plan for schema evolution and migrations
- Consider backup and recovery strategy
- Reference sidecar architecture patterns for data access best practices
