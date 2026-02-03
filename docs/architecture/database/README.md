# Database Design - 数据库设计

本目录包含 AuraForce 项目数据库 schema 设计文档。

## 🗄️ 数据库规范

### 命名规范
- **表名**: snake_case
- **字段名**: snake_case
- **索引**: `idx_表名_字段`
- **外键**: `fk_表名_字段`

### 数据类型
- **ID**: String (UUID)
- **时间**: DateTime
- **布尔**: Boolean (or Int 0/1)
- **金额**: Decimal

### 约束
- **主键**: `id` (UUID)
- **外键**: `xxxId` (String, UUID)
- **唯一索引**: 确保数据唯一性
- **非空约束**: 必填字段

---

## 📋 数据库设计文档模板

```markdown
# [表名]

## 基本信息
- **表名**: [table_name]
- **描述**: [表的用途和描述]
- **模块**: [所属模块]

## Schema

### Prisma Schema
```prisma
model [TableName] {
  id        String   @id @default(uuid())
  field1    String
  field2    Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  related   RelatedTable? @relation(fields: [relatedId], references: [id])
  relatedId String?

  @@index([field1])
}
```

### SQL Schema
```sql
CREATE TABLE [table_name] (
  id VARCHAR(36) PRIMARY KEY,
  field1 VARCHAR(255) NOT NULL,
  field2 INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY ([related_id]) REFERENCES [related_table](id),
  INDEX idx_field1 ([field1])
);
```

## 字段说明
| 字段名 | 类型 | 可空 | 默认值 | 描述 |
|--------|------|------|--------|------|
| id | String | 否 | uuid() | 主键 ID |
| field1 | String | 否 | - | 字段描述 |
| field2 | Int | 是 | NULL | 可选字段 |

## 索引
| 索引名 | 字段 | 类型 | 说明 |
|--------|------|------|------|
| idx_field1 | field1 | B-Tree | 加速查询 |

## 外键关系
| 表 | 外键字段 | 关联表 | 关联字段 | 关系 |
|----|----------|--------|----------|------|
| table_name | related_id | related_table | id | N:1 |

## 数据示例
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": 100,
  "createdAt": "2025-02-02T10:00:00Z",
  "updatedAt": "2025-02-02T10:00:00Z"
}
```

## 数据量估算
- **预估**: X 万条
- **增长**: X 条/天
- **存储**: X GB

## 性能考虑
- [性能相关考虑]
```

---

## 📊 ER 图

```
┌─────────────────┐         ┌─────────────────┐
│     User        │         │    Document     │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────│ id (PK)         │
│ email           │    FK   │ title           │
│ name            │         │ content         │
│ createdAt       │         │ authorId (FK)   │
│ updatedAt       │         │ createdAt       │
└─────────────────┘         │ updatedAt       │
                            └─────────────────┘
```

---

## 📚 数据库表列表

### 核心表

| 表名 | 估算数据量 | 索引数 | 外键关系 | 状态 |
|------|-----------|--------|---------|------|
| User | - | - | - | 📝 设计中 |
| Document | - | - | - | 📝 设计中 |

### 其他表（待补充）

---

## 🔗 资源链接

- [Prisma Schema](../../prisma/schema.prisma) - 当前的 Prisma schema
- [迁移文件](../../prisma/migrations) - 数据库迁移文件
- [系统设计](../design/README.md) - 系统架构

---

## 📝 数据库维护

### 迁移管理
```bash
# 创建新迁移
npx prisma migrate dev --name [migration_name]

# 重置数据库
npx prisma migrate reset

# 部署迁移
npx prisma migrate deploy
```

### 生成 Client
```bash
npx prisma generate
```

### 打开 Prisma Studio
```bash
npx prisma studio
```

---

**最后更新：** 2025-02-02
