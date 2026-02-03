# Story 2.8: Enterprise Tenant Setup and Management

Status: ready-for-dev

**Epic 2: User Account & Authentication**

Epic Value: Enable enterprise organizations to create managed multi-user environments with role-based access control, team collaboration features, and centralized billing.

---

## Story

**As an enterprise administrator**, I want to set up and manage a tenant workspace for my organization, so that team members can collaborate with proper data isolation and role-based permissions.

---

## Acceptance Criteria

1. Tenant workspace creation and configuration
2. Multi-user team member invitation and management
3. Role-based access control (RBAC) with predefined roles
4. Tenant-scoped data isolation for skills and business models
5. Team member usage tracking per tenant
6. Administrator controls (add/remove members, assign roles)
7. Tenant billing aggregation and management
8. Tenant settings and branding configuration
9. Audit log for tenant activities
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Tenant Data Models (AC: 1, 4, 8)
- [ ] Add `tenantId` field to User model (nullable, links to tenant)
- [ ] Add `tenantRole` field to User model (enum: ADMIN, MEMBER, VIEWER)
- [ ] Add `tenantId` field to Skill model for tenant isolation
- [ ] Create `Tenant` model (name, description, settings, metadata)
- [ ] Create `TenantInvitation` model for team member invites
- [ ] Create `TenantAuditLog` model for activity tracking
- [ ] Create tenant-level settings structure

### Task 2: Create Tenant Service Layer (AC: 1, 2, 3, 5)
- [ ] Create `src/lib/tenant/tenant.service.ts`
- [ ] Implement `createTenant(userId, tenantData)` function
- [ ] Implement `getTenant(tenantId)` function
- [ ] Implement `inviteMember(tenantId, email, role)` function
- [ ] Implement `updateMemberRole(tenantId, userId, role)` function
- [ ] Implement `removeMember(tenantId, userId)` function
- [ ] Implement `getTenantMembers(tenantId)` function
- [ ] Implement `getTenantUsage(tenantId)` function

### Task 3: Create Role-Based Access Control (AC: 3, 6)
- [ ] Define role permissions (ADMIN, MEMBER, VIEWER)
- [ ] Create `src/lib/tenant/rbac.service.ts`
- [ ] Implement permission checking middleware
- [ ] Implement role validation for different actions
- [ ] Create permission error responses

### Task 4: Create Tenant Configuration (AC: 8)
- [ ] Create `src/lib/tenant/config.ts`
- [ ] Define tenant settings schema
- [ ] Create default tenant settings
- [ ] Implement tenant branding configuration
- [ ] Create tenant feature flags

### Task 5: Create Tenant API Endpoints (AC: 1, 2, 6, 7)
- [ ] Create `src/app/api/tenant/create/route.ts`
- [ ] Create `src/app/api/tenant/[tenantId]/route.ts`
- [ ] Create `src/app/api/tenant/[tenantId]/members/route.ts`
- [ ] Create `src/app/api/tenant/[tenantId]/members/[memberId]/role/route.ts`
- [ ] Create `src/app/api/tenant/[tenantId]/members/[memberId]/remove/route.ts`
- [ ] Create `src/app/api/tenant/[tenantId]/invite/route.ts`
- [ ] Create `src/app/api/tenant/[tenantId]/usage/route.ts`
- [ ] Create `src/app/api/tenant/[tenantId]/settings/route.ts`
- [ ] Implement authorization checks for all endpoints

### Task 6: Create Tenant Dashboard UI (AC: 1, 6, 8)
- [ ] Create `src/app/(protected)/tenant/dashboard/page.tsx`
- [ ] Create tenant overview card
- [ ] Create member list component
- [ ] Create tenant settings form
- [ ] Create usage metrics display
- [ ] Add quick action buttons

### Task 7: Create Member Management Components (AC: 2, 6)
- [ ] Create `src/components/tenant/member-list.tsx`
- [ ] Create `src/components/tenant/invite-form.tsx`
- [ ] Create `src/components/tenant/role-selector.tsx`
- [ ] Create `src/components/tenant/member-actions.tsx`
- [ ] Add member edit modal

### Task 8: Create Tenant Setup Wizard (AC: 1)
- [ ] Create `src/components/tenant/setup-wizard.tsx`
- [ ] Multi-step setup process
- [ ] Step 1: Basic tenant information
- [ ] Step 2: Team member invitation
- [ ] Step 3: Settings configuration
- [ ] Step 4: Review and confirm

### Task 9: Create Tenant Context/Store (AC: 1, 3)
- [ ] Create `src/stores/tenant-store.ts`
- [ ] Manage current tenant state
- [ ] Cache member list
- [ ] Handle tenant switching
- [ ] Revalidate on navigation

### Task 10: Update User Settings for Tenant (AC: 1)
- [ ] Add tenant section to user settings
- [ ] Show current tenant membership
- [ ] Allow switching between tenants
- [ ] Display user role in tenant

### Task 11: Create Audit Logging System (AC: 9)
- [ ] Create `src/lib/tenant/audit-logger.ts`
- [ ] Log tenant creation events
- [ ] Log member management events
- [ ] Log role changes
- [ ] Log data access events
- [ ] Implement audit log viewer

### Task 12: Update Middleware for Tenant Data Isolation (AC: 4)
- [ ] Update skill queries to filter by tenant
- [ ] Update skill creation to check tenant limits
- [ ] Add tenant context to skill models
- [ ] Ensure data isolation at query level

### Task 13: Run Type Check (AC: 10)
- [ ] Run `npx tsc --noEmit` to verify TypeScript
- [ ] Fix any type errors
- [ ] All imports use `@/*` alias
- [ ] Ensure strict mode compliance

---

## Dev Notes

### Architectural Constraints & Requirements

**File Organization:**
```
src/
├── app/
│   ├── (protected)/
│   │   └── tenant/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── setup/
│   │       │   └── page.tsx
│   │       └── members/
│   │           └── page.tsx
│   └── api/
│       └── tenant/
│           ├── create/
│           │   └── route.ts
│           ├── [tenantId]/
│           │   ├── route.ts
│           │   ├── members/
│           │   │   ├── route.ts
│           │   │   ├── [memberId]/
│           │   │   │   ├── role/
│           │   │   │   │   └── route.ts
│           │   │   │   └── remove/
│           │   │   │   └── route.ts
│           │   └── invite/
│           │       └── route.ts
│           └── [tenantId]/usage/
│           └── route.ts
├── components/
│   └── tenant/
│       ├── member-list.tsx
│       ├── invite-form.tsx
│       ├── role-selector.tsx
│       ├── member-actions.tsx
│       ├── setup-wizard.tsx
│       └── tenant-overview.tsx
├── lib/
│   └── tenant/
│       ├── tenant.service.ts
│       ├── rbac.service.ts
│       ├── audit-logger.ts
│       └── config.ts
└── stores/
    └── tenant-store.ts
```

### Database Schema Updates

**User Model (additions):**
```prisma
model User {
  // ... existing fields ...
  tenantId    String? @id @map("tenant_id") // Tenant membership
  tenantRole  String? @map("tenant_role")    // ADMIN, MEMBER, VIEWER
  // ... existing fields ...

  tenant Tenant? @relation(fields: [tenantId], references: [id])
  // ... existing relations ...
}
```

**New Tenant Model:**
```prisma
model Tenant {
  id          String   @id @default(uuid())
  name        String
  description String?  @db.Text
  settings    Json     @map("settings") // { branding, features, quotas }
  plan        String   @default("TEAM") // TEAM, ENTERPRISE
  maxMembers  Int      @default(10)
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  members     User[]
  skills      Skill[]
  invitations TenantInvitation[]
  auditLogs   TenantAuditLog[]

  @@map("tenants")
}
```

**New TenantInvitation Model:**
```prisma
model TenantInvitation {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  email      String
  role       String   // ADMIN, MEMBER, VIEWER
  token      String   @unique // Invitation token
  expiresAt  DateTime @map("expires_at")
  acceptedAt DateTime? @map("accepted_at")
  status     String   @default("pending") // pending, accepted, expired, cancelled
  createdAt  DateTime @default(now()) @map("created_at")

  tenant     Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("tenant_invitations")
}
```

**New TenantAuditLog Model:**
```prisma
model TenantAuditLog {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  userId    String   @map("user_id")
  action    String   // CREATED, MEMBER_ADDED, MEMBER_REMOVED, ROLE_CHANGED, etc.
  details   Json?
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at")

  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("tenant_audit_logs")
  @@index([tenantId, createdAt])
}
```

**Skill Model (additions):**
```prisma
model Skill {
  // ... existing fields ...
  tenantId    String?  @map("tenant_id") // For tenant isolation
  // ... existing fields ...

  tenant Tenant? @relation(fields: [tenantId], references: [id])
  // ... existing relations ...
}
```

### RBAC Permissions

**Role Definitions:**
```typescript
export enum TenantRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export interface Permissions {
  // Member management
  inviteMember: boolean;
  removeMember: boolean;
  updateMemberRole: boolean;

  // Content management
  createSkill: boolean;
  updateSkill: boolean;
  deleteSkill: boolean;
  viewAllSkills: boolean;

  // Tenant management
  updateSettings: boolean;
  viewUsage: boolean;
  manageBilling: boolean;
  exportData: boolean;

  // Audit
  viewAuditLogs: boolean;
}

export const ROLE_PERMISSIONS: Record<TenantRole, Permissions> = {
  [TenantRole.ADMIN]: {
    inviteMember: true,
    removeMember: true,
    updateMemberRole: true,
    createSkill: true,
    updateSkill: true,
    deleteSkill: true,
    viewAllSkills: true,
    updateSettings: true,
    viewUsage: true,
    manageBilling: true,
    exportData: true,
    viewAuditLogs: true,
  },
  [TenantRole.MEMBER]: {
    inviteMember: false,
    removeMember: false,
    updateMemberRole: false,
    createSkill: true,
    updateSkill: true,
    deleteSkill: true,
    viewAllSkills: true,
    updateSettings: false,
    viewUsage: true,
    manageBilling: false,
    exportData: false,
    viewAuditLogs: false,
  },
  [TenantRole.VIEWER]: {
    inviteMember: false,
    removeMember: false,
    updateMemberRole: false,
    createSkill: false,
    updateSkill: false,
    deleteSkill: false,
    viewAllSkills: true,
    updateSettings: false,
    viewUsage: true,
    manageBilling: false,
    exportData: false,
    viewAuditLogs: false,
  },
};
```

### Tenant Settings Schema

```typescript
export interface TenantSettings {
  // Branding
  branding: {
    logoUrl?: string;
    theme?: 'light' | 'dark' | 'system';
    customColors?: {
      primary?: string;
      secondary?: string;
    };
  };

  // Features
  features: {
    allowPublicSkills: boolean;
    allowSkillSharing: boolean;
    enableAuditLogging: boolean;
  };

  // Quotas
  quotas: {
    maxSkills: number;
    maxBusinessModels: number;
    maxMembers: number;
  };

  // Notifications
  notifications: {
    inviteNotifications: boolean;
    activityDigest: boolean;
    billingAlerts: boolean;
  };
}
```

### API Endpoints

**POST /api/tenant/create**
- Create new tenant
- Body: `{ name, description, settings }`
- Response: `{ tenant: Tenant }`

**GET /api/tenant/[tenantId]**
- Get tenant details (requires membership)
- Response: `{ tenant: Tenant, userRole: TenantRole }`

**GET /api/tenant/[tenantId]/members**
- Get all tenant members (requires MEMBER+)
- Response: `{ members: UserWithRole[] }`

**POST /api/tenant/[tenantId]/invite**
- Invite new team member (requires ADMIN)
- Body: `{ email, role }`
- Response: `{ invitation: TenantInvitation }`

**PATCH /api/tenant/[tenantId]/members/[memberId]/role**
- Update member role (requires ADMIN)
- Body: `{ role }`
- Response: `{ success: boolean }`

**DELETE /api/tenant/[tenantId]/members/[memberId]/remove**
- Remove member (requires ADMIN, cannot remove last admin)
- Response: `{ success: boolean }`

**GET /api/tenant/[tenantId]/usage**
- Get tenant usage statistics (requires MEMBER+)
- Response: `{ usage: TenantUsage, members: MemberUsage[] }`

**PATCH /api/tenant/[tenantId]/settings**
- Update tenant settings (requires ADMIN)
- Body: `{ settings: Partial<TenantSettings> }`
- Response: `{ tenant: Tenant }`

### Service Layer Functions

**TenantService:**
```typescript
class TenantService {
  async createTenant(userId: string, data: CreateTenantDto): Promise<Tenant>;
  async getTenant(tenantId: string): Promise<Tenant>;
  async inviteMember(tenantId: string, email: string, role: TenantRole): Promise<TenantInvitation>;
  async acceptInvitation(token: string): Promise<{ tenantId: string; role: TenantRole }>;
  async updateMemberRole(tenantId: string, userId: string, role: TenantRole): Promise<void>;
  async removeMember(tenantId: string, userId: string): Promise<void>;
  async getTenantMembers(tenantId: string): Promise<TenantMember[]>;
  async getTenantUsage(tenantId: string): Promise<TenantUsage>;
  async updateSettings(tenantId: string, settings: Partial<TenantSettings>): Promise<Tenant>;
}
```

**RBACService:**
```typescript
class RBACService {
  async checkPermission(userId: string, tenantId: string, permission: keyof Permissions): Promise<boolean>;
  async getUserRole(userId: string, tenantId: string): Promise<TenantRole>;
  async isAdmin(userId: string, tenantId: string): Promise<boolean>;
  async enforcePermission(userId: string, tenantId: string, requiredPermission: keyof Permissions): Promise<void>;
}
```

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { TenantService } from '@/lib/tenant/tenant.service'
import { RBACService } from '@/lib/tenant/rbac.service'
import { ROLE_PERMISSIONS, TenantRole } from '@/lib/tenant/rbac'

// INCORRECT
import { TenantService } from '../../../lib/tenant/tenant.service'
```

### Security Considerations

1. **Tenant Isolation:** All queries must filter by tenant context
2. **Authorization:** Verify user has role and permissions for all actions
3. **Invitation Security:** Time-limited tokens, email verification required
4. **Admin Protection:** Prevent removing the last admin user
5. **Audit Logging:** Log all tenant management activities
6. **Data Privacy:** Ensure GDPR compliance with tenant data

### Tenant Data Isolation

**Query Filtering Pattern:**
```typescript
// When querying skills, always filter by tenant
const skills = await prisma.skill.findMany({
  where: {
    userId, // User's own skills
    OR: [
      { tenantId: currentTenantId }, // Tenant's shared skills
      { isPublic: true }, // Public skills (if allowed)
    ],
  },
});
```

### Testing Standards

**Manual Testing Required:**
- Create new tenant as enterprise user
- Invite team member via email
- Accept invitation and join tenant
- Test role-based permissions for each role
- Update member role
- Remove tenant member
- View tenant usage metrics
- Update tenant settings
- Verify data isolation between tenants

### Integration Points

**Subscription System:**
- Tenant membership requires ENTERPRISE subscription
- Tenant members count affects pricing
- Usage tracking includes tenant-level metrics

**Email System:**
- Invitation emails with accept link
- Welcome emails for new members
- Notification emails for role changes

---

## Technical References

### Source: `_bmad-output/prd.md`
- FR28: 企业用户可以管理多个子账号和团队权限 (lines 605)
- Multi-tenant model design (lines 394-415)
- RBAC permissions matrix (lines 405-414)
- Data isolation strategy (lines 399-403)

### Source: `_bmad-output/epics.md`
- Epic 2 overview (lines 243-244)
- Story 2.8 reference (line 298)

### Source: `prisma/schema.prisma`
- User model structure (lines 14-35)
- Skill model structure (lines 85-105)

### Source: Previous Stories
- Story 2.3: User Profile Setup and Management - user patterns
- Story 2.7: Subscription Level Management - subscription integration

---

## Success Criteria Checklist

- [ ] Tenant workspace creation working
- [ ] Member invitation flow complete
- [ ] Role-based access control functional
- [ ] Tenant data isolation verified
- [ ] Usage tracking per tenant working
- [ ] Administrator controls implemented
- [ ] Tenant billing display ready
- [ ] Tenant settings configurable
- [ ] Audit logging functional
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
