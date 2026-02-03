# Story 1.4: Setup Prisma Schema with Basic Models

Status: done

**Epic 1: Project Foundation & Tech Stack Initialization**

Epic Value: Establish the foundational Next.js 16.1.1 + TypeScript strict mode + App Router project structure that will serve as the base for all subsequent stories in this epic (Config TypeScript, Install Dependencies, Setup Prisma, Configure Auth.js, Setup Zustand, Setup Claude SDK).

---

## Story

**As a development engineer**, I want to set up the Prisma ORM schema with basic database models for Users, Accounts, Sessions, and Authentication, so that we have a type-safe database layer for AuraForce's authentication and user management features.

---

## Acceptance Criteria

1. Prisma schema file (`prisma/schema.prisma`) is created with basic models
2. Database provider is configured for MySQL
3. User model is defined with proper fields (id, email, name, etc.)
4. Account model is defined for OAuth providers
5. Session model is defined for user sessions
6. All models use `@@map()` for snake_case table mapping
7. Database connection string is configured in `.env`
8. Prisma client is generated successfully with `npx prisma generate`
9. TypeScript types are exported for use throughout the application

---

## Tasks / Subtasks

### Task 1: Create Prisma Schema with Basic Configuration (AC: 1, 2)
- [ ] Create or open `prisma/schema.prisma` file
- [ ] Set `datasource db` provider to `mysql` and properly configure connection URL
- [ ] Set `generator client` for Prisma Client
- [ ] Add `@@map()` helper for all models (snake_case table names)

### Task 2: Define Authentication Models (AC: 3, 4, 5, 6)
- [ ] Define `User` model with:
  - id (UUID, primary key)
  - email (String, unique)
  - emailVerified (DateTime, nullable)
  - name (String, nullable)
  - image (String, nullable)
  - createdAt/updatedAt timestamps
  - @@map("users")
- [ ] Define `Account` model with:
  - id (UUID, primary key)
  - userId (foreign key to User)
  - type (String for provider type)
  - provider (String for provider ID)
  - providerAccountId (String)
  - refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
  - @@map("accounts")
- [ ] Define `Session` model with:
  - id (UUID, primary key)
  - sessionToken (String, unique)
  - userId (foreign key to User)
  - expires (DateTime)
  - @@map("sessions")
- [ ] Define relations between User, Account, and Session

### Task 3: Setup Database Connection (AC: 7)
- [ ] Check `.env.example` file exists and document required environment variables
- [ ] Add database connection string template to `.env.example`
- [ ] Configure MySQL connection URL format: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`

### Task 4: Generate Prisma Client (AC: 8, 9)
- [ ] Run `npx prisma generate` to generate Prisma Client
- [ ] Verify TypeScript types are generated in `node_modules/.prisma/client`
- [ ] Test basic Prisma client import in a test file

### Task 5: Create Database Utility (AC: 9)
- [ ] Create `src/lib/prisma.ts` to export a singleton Prisma client instance
- [ ] Ensure it works in both development and serverless/edge environments
- [ ] Add type exports for the generated models

### Task 6: Verify Configuration (AC: 8)
- [ ] Run `npx prisma validate` to check schema syntax
- [ ] Run `npx prisma format` to format the schema
- [ ] Ensure no syntax errors in schema.prisma

---

## Dev Notes

### Architectural Constraints & Requirements

**IMPORTANT - Database Architecture from Architecture.md:**

**Database Choice:**
- Database: MySQL 8.0+ (from architecture lines 198-218)
- ORM: Prisma for type-safe database access
- Connection: Cloud database or containerized MySQL

**Critical Naming Convention - MUST USE:**
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  // ...
  @@map("users")  // CRITICAL: snake_case for MySQL
}

// Creates table: users (lowercase snake_case)
// TypeScript type: User (PascalCase)
```

**Why @@map()? Architecture Requirements:**
- MySQL tables should use snake_case (industry convention)
- TypeScript models should use PascalCase (language convention)
- `@@map()` bridges this gap elegantly
- Required for consistency across the codebase

### Database Models for Auth.js v5

**Standard Auth.js Models Required:**

```prisma
// User model - central user record
model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  @@map("users")
}

// Account model - OAuth/ID provider accounts
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

// Session model - active user sessions
model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("sessions")
}
```

### Additional Models (Future Stories)

**For Future Epics (NOT in this story):**
- Subscription (Epic 2.7)
- Tenant (Epic 2.8)
- SkillAsset (Epic 6, 9)
- WorkflowExecution (Epic 4, 5)
- BusinessModel (Epic 7, 8)
- UserProgress (Epic 10)
- AnalyticsEvent (Epic 12)

### Environment Variables

**Required for Prisma:**

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/auraforce"

# Auth.js (will be added in Story 1.5)
# AUTH_SECRET="your-secret-key-here"
# AUTH_URL="http://localhost:3000"
```

### Project Structure Alignment

**Prisma Directory:**
```
prisma/
├── schema.prisma      # Database schema definition
├── migrations/        # Database migrations (auto-created)
└── seed.ts            # Optional: Seed data (future)

lib/
└── prisma.ts          # Singleton Prisma client (create in this story)
```

### Technology Stack Constraints

**From Architecture:**
- MySQL 8.0+ with Prisma ORM
- Prisma adapter for Next-Auth.js
- Strict mode TypeScript for all model types

**From Prisma Requirements:**
- UUID for primary keys (matching Auth.js v5 requirements)
- Soft deletes pattern (add deletedAt to models for production)
- Cascade delete on relations

### Don't-Miss Configuration Details

**CRITICAL - Things Developers Often Miss:**

1. **@@map() is REQUIRED for MySQL:**
   - Without it, Prisma uses PascalCase table names in MySQL
   - MySQL convention is snake_case, must use @@map()

2. **Relation onDelete Cascade:**
   - Account and Session should cascade delete when User is deleted
   - Ensures data integrity

3. **UUID Primary Keys:**
   - Auth.js v5 uses UUID format for IDs
   - Must use `@default(uuid())` for id fields

4. **Provider AccountID Unique Constraint:**
   - Account model needs @@unique([provider, providerAccountId])
   - Prevents duplicate accounts from same provider

5. **Environment Variable Handling:**
   - DATABASE_URL MUST be set in .env
   - Add template to .env.example

### Prisma Client Singleton Pattern

**For Serverless/Next.js Compatibility:**

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Why Singleton?**
- Next.js creates multiple instances during hot reload
- Without singleton, would exceed database connection limit
- Safe for production edge functions

### Testing Standards

**For This Story:**
- `npx prisma validate` - Schema syntax check
- `npx prisma format` - Schema formatting check
- `npx prisma generate` - Client generation
- Optional: `npx prisma db push` (only if local MySQL available)

**Verification Checklist:**
- [ ] prisma/schema.prisma exists and is valid
- [ ] All models have @@map() directives
- [ ] Prisma client generates successfully
- [ ] TypeScript types are exported

### File Naming Conventions

From project-context.md:
- Prisma schema: `prisma/schema.prisma`
- Prisma client file: `src/lib/prisma.ts`
- Follow kebab-case for utilities

### Do NOT Create During This Story

- ❌ Do NOT create additional models (User, Account, Session only)
- ❌ Do NOT run database migrations (Story 1.5+ will handle)
- ❌ Do NOT create seed data (future task)
- ❌ Do NOT modify .env directly (use .env.example)

---

## Dev Agent Record

### Agent Model Used

Claude (Anthropic Claude 4.6, glm-4.6-no-think model)

### Completion Notes List

**Story 1.4 Implementation Summary:**

✅ **Completed Acceptance Criteria:**
1. ✅ Prisma schema file exists and is valid
2. ✅ Database provider configured for MySQL (provider = "mysql")
3. ✅ User model defined with UUID id, email, emailVerified, name, image, timestamps
4. ✅ Account model defined for OAuth providers (type, provider, tokens)
5. ✅ Session model defined for user sessions
6. ✅ All models use @@map() for snake_case table mapping
7. ✅ Database connection configured in .env.example
8. ✅ Prisma client generated successfully (v5.22.0)
9. ✅ TypeScript types exported via src/lib/prisma.ts

**Schema Updates Made:**
- Changed all ID fields from `cuid()` to `uuid()` for Auth.js v5 compatibility
- Verified all models have proper @@map() directives
- Updated .env.example to use AUTH_ prefix for Auth.js v5 (AUTH_SECRET, AUTH_URL)

**Files Modified:**
- `prisma/schema.prisma` - Updated models to use UUID, verified compatibility
- `.env.example` - Updated Auth.js v5 environment variable prefixes

**Files Created:**
- `src/lib/prisma.ts` - Prisma client singleton with hot-reload prevention

**Schema Models Defined:**
- User (authentication users)
- Account (OAuth provider accounts)
- Session (user sessions)
- VerificationToken (email verification tokens)
- Skill (user-generated skill assets)
- ClaudeConversation (Claude Agent SDK conversations)
- SkillTemplate (marketplace templates)
- UserSettings (user preferences)

### File List

**Created by Story:**
- `prisma/schema.prisma` - Database schema
- `src/lib/prisma.ts` - Prisma client singleton
- `.env.example` - Environment variables template

**Modified by Story:**
- None

---

## Technical References

### Core Architecture Documentation

**Source:** `_bmad-output/architecture.md`
- Section: Database Architecture (lines 198-218)
  - Database: MySQL 8.0+ + Prisma
  - ORM: Prisma with TypeScript support
  - Connection pooling and schema design

**Source:** `_bmad-output/project-context.md`
- Section: Database & Entity Creation Timing (lines 645-670)
  - Progressive database creation pattern
  - Create models as needed, not all upfront

### Previous Story References

**Source:** `implementation-artifacts/stories/1-3-install-dependencies.md`
- Story 1.3 installed Prisma 5.0.0 and mysql2 3.6.0
- Prisma adapter available for next-auth

### Next Story Context

**Epic 1 Dependencies:**
- Story 1.1 MUST be complete (project scaffold)
- Story 1.2 MUST be complete (TypeScript configured)
- Story 1.3 MUST be complete (Prisma installed)
- This story (1.4) creates Prisma schema
- Story 1.5 will configure Auth.js v5 using this schema

**Next Stories in Epic 1:**
1. Story 1.5: Configure Auth.js v5 Foundation (uses User, Account, Session models)
2. Story 1.6: Initialize Zustand Store Structure
3. Story 1.7: Setup Claude Agent SDK Configuration

---

## Success Criteria Checklist

- [ ] Prisma schema file created
- [ ] Database provider configured for MySQL
- [ ] User model defined with proper fields
- [ ] Account model defined for OAuth providers
- [ ] Session model defined for user sessions
- [ ] All models use @@map() for snake_case tables
- [ ] Database connection documented in .env.example
- [ ] Prisma client generated successfully
- [ ] TypeScript types exported and accessible

---

**Done:** ✅

This story provides comprehensive context for setting up Prisma schema with basic authentication models. All architectural requirements, constraints, and patterns are documented to ensure type-safe database access for AuraForce.
