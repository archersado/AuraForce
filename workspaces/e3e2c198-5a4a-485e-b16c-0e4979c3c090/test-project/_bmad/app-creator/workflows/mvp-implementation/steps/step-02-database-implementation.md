---
name: 'step-02-database-implementation'
description: 'Set up database connection and implement repository layer'
---

# Step 2: Database Implementation

Configure database connection and implement the data access layer.

## DIALOGUE SECTIONS:

### 1. Database Connection Setup
"**💾 数据库实现**

让我们设置数据库连接和Repository层。"

### 2. Database Connection Code

#### PostgreSQL Connection (Node.js + Prisma)
```typescript
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

// Singleton pattern
export const db = prisma;
```

#### Environment Variables
```env
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/myapp?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
NODE_ENV="development"
PORT=3000
```

### 3. Repository Pattern Implementation

#### Base Repository Interface
```typescript
// src/repositories/BaseRepository.ts
export interface IRepository<T, CreateDto, UpdateDto> {
  findMany(options?: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(where: any): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}
```

#### User Repository Example
```typescript
// src/repositories/UserRepository.ts
import prisma from '../config/database';
import { IRepository } from './BaseRepository';
import { User, CreateUserDto, UpdateUserDto } from '../models/User';

export class UserRepository implements IRepository<User, CreateUserDto, UpdateUserDto> {
  async findMany(options?: any): Promise<User[]> {
    return prisma.user.findMany(options);
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findOne(where: any): Promise<User | null> {
    return prisma.user.findFirst({ where });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserDto): Promise<User> {
    // Hash password before saving
    const hashedPassword = await this.hashPassword(data.password);
    return prisma.user.create({
      data: { ...data, password: hashedPassword }
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    return bcrypt.hash(password, 12);
  }
}

// Export singleton
export const userRepository = new UserRepository();
```

### 4. Prisma Schema Example
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String?   @unique
  password      String
  firstName     String?
  lastName      String?
  role          String    @default("user")
  emailVerified Boolean   @default(false)
  status        String    @default("active")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([status])
}
```

## NEXT:

"**✅ 数据库层已实现**

下一步: 认证系统 - 我们将实现用户注册和登录功能。"
