# Story 2.9: Data Privacy and Sharing Controls

Status: ready-for-dev

**Epic 2: User Account & Authentication**

Epic Value: Enable users to control their data privacy settings and manage how their skills and business models are shared with others.

---

## Story

**As a user**, I want to control my data privacy and sharing settings, so that I can manage who can access my skills, business models, and personal data.

---

## Acceptance Criteria

1. Public/Private toggle for individual skills
2. Public/Private toggle for individual business models
3. Default privacy settings for new content
4. Shareable link generation with optional expiration
5. Access log for shared content
6. Data visibility controls (show/hide email, name, etc.)
7. Opt-out of public search/indexing
8. Third-party data sharing preferences
9. Export all personal data on request
10. Account deletion with data cleanup
11. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Update Privacy Data Models (AC: 1, 2, 6, 7)
- [ ] Verify Skill model has isPublic field
- [ ] Verify BusinessModel model has isPublic field
- [ ] Add ShareToken model for shareable links
- [ ] Add DataVisibilitySettings model
- [ ] Add UserPrivacySettings model

### Task 2: Create Privacy Settings Service (AC: 3, 4, 8)
- [ ] Create `src/lib/privacy/privacy.service.ts`
- [ ] Implement getPrivacySettings(userId)
- [ ] Implement updatePrivacySettings(userId, settings)
- [ ] Implement generateShareLink(contentId, type, options)
- [ ] Implement validateShareLink(token)
- [ ] Implement revokeShareLink(tokenId)

### Task 3: Create Content Sharing Endpoints (AC: 4)
- [ ] Create `src/app/api/share/generate/route.ts`
- [ ] Create `src/app/api/share/[token]/route.ts`
- [ ] Create `src/app/api/share/[token]/revoke/route.ts`
- [ ] Create `src/app/api/share/my/route.ts`

### Task 4: Create Privacy Settings API (AC: 6, 7, 8)
- [ ] Create `src/app/api/user/privacy/route.ts`
- [ ] Create `src/app/api/user/visibility/route.ts`
- [ ] Implement GET for reading privacy settings
- [ ] Implement PATCH for updating privacy settings

### Task 5: Create Privacy UI Components (AC: 1, 2, 3, 6, 7)
- [ ] Create `src/components/privacy/privacy-settings-panel.tsx`
- [ ] Create `src/components/privacy/content-visibility-toggle.tsx`
- [ ] Create `src/components/privacy/share-link-modal.tsx`
- [ ] Create `src/components/privacy/access-log-viewer.tsx`

### Task 6: Add Privacy Controls to Skill Management (AC: 1, 3)
- [ ] Add public/private toggle to skill create/edit forms
- [ ] Add share button to skill detail view
- [ ] Update skill list to show privacy status
- [ ] Add default privacy setting to user profile

### Task 7: Create GDPR/Compliance Features (AC: 9, 10)
- [ ] Add complete data export endpoint
- [ ] Add account deletion endpoint
- [ ] Create data retention policy
- [ ] Add consent tracking

### Task 8: Update User Settings Page (AC: 6, 7, 8)
- [ ] Add Privacy tab to user settings
- [ ] Display current privacy settings
- [ ] Allow modification of privacy preferences
- [ ] Show data sharing status

### Task 9: Create Privacy Context/Store (AC: 1, 2)
- [ ] Create `src/stores/privacy-store.ts`
- [ ] Manage privacy settings state
- [ ] Cache share links
- [ ] Handle visibility changes

### Task 10: Implement Public Search Controls (AC: 7)
- [ ] Add robots.txt endpoint for user-level control
- [ ] Implement search opt-out for user profiles
- [ ] Add meta tag generation for public content
- [ ] Update skill/business model search to respect settings

### Task 11: Run Type Check (AC: 11)
- [ ] Run `npx tsc --noEmit` to verify TypeScript
- [ ] Fix any type errors
- [ ] All imports use `@/*` alias

---

## Dev Notes

### Architectural Constraints & Requirements

**File Organization:**
```
src/
├── app/
│   ├── api/
│   │   ├── share/
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   └── [token]/
│   │   │       ├── route.ts
│   │   │       └── revoke/
│   │   │           └── route.ts
│   │   └── user/
│   │       └── privacy/
│   │           └── route.ts
│   └── (protected)/
│       └── settings/
│           └── privacy/page.tsx
├── components/
│   └── privacy/
│       ├── privacy-settings-panel.tsx
│       ├── content-visibility-toggle.tsx
│       ├── share-link-modal.tsx
│       └── access-log-viewer.tsx
├── lib/
│   └── privacy/
│       ├── privacy.service.ts
│       └── types.ts
└── stores/
    └── privacy-store.ts
```

### Database Schema Updates

**Skill Model (verify existing):**
```prisma
model Skill {
  // ... existing fields ...
  isPublic    Boolean  @default(false) @map("is_public")
  // ... existing fields ...
}
```

**New ShareToken Model:**
```prisma
model ShareToken {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  contentId  String   @map("content_id")
  contentType String // 'skill' | 'businessModel'
  token      String   @unique
  expiresAt  DateTime? @map("expires_at")
  accessCount Int     @default(0) @map("access_count")
  maxAccess  Int?     @map("max_access")
  password   String?  @db.Text
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")
  expiresAt  DateTime? @map("expires_at")

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("share_tokens")
  @@index([token])
}
```

**New UserPrivacySettings Model:**
```prisma
model UserPrivacySettings {
  id                        String  @id @default(uuid())
  userId                    String  @unique @map("user_id")
  allowPublicProfile        Boolean @default(true) @map("allow_public_profile")
  allowSearchIndexing       Boolean @default(true) @map("allow_search_indexing")
  showEmail                 Boolean @default(false) @map("show_email")
  showRealName              Boolean @default(true) @map("show_real_name")
  thirdPartyDataSharing     Boolean @default(false) @map("third_party_data_sharing")
  marketingEmails           Boolean @default(false) @map("marketing_emails")
  analyticsEnabled          Boolean @default(true) @map("analytics_enabled")
  defaultSkillVisibility    String  @default("private") @map("default_skill_visibility")
  defaultModelVisibility    String  @default("private") @map("default_model_visibility")
  createdAt                 DateTime @default(now()) @map("created_at")
  updatedAt                 DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_privacy_settings")
}
```

**New ContentAccessLog Model:**
```prisma
model ContentAccessLog {
  id         String   @id @default(uuid())
  contentId  String   @map("content_id")
  contentType String
  shareToken String?  @map("share_token")
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  visitedAt  DateTime @default(now()) @map("visited_at")

  @@map("content_access_logs")
  @@index([contentId, visitedAt])
  @@index([shareToken])
}
```

### Privacy Settings Types

```typescript
export interface PrivacySettings {
  // Profile Visibility
  allowPublicProfile: boolean;
  allowSearchIndexing: boolean;
  
  // Personal Information
  showEmail: boolean;
  showRealName: boolean;
  
  // Data Sharing
  thirdPartyDataSharing: boolean;
  marketingEmails: boolean;
  analyticsEnabled: boolean;
  
  // Default Visibility
  defaultSkillVisibility: 'public' | 'private';
  defaultModelVisibility: 'public' | 'private';
}

export interface ShareLinkOptions {
  expiresAt?: Date;
  maxAccess?: number;
  password?: string;
}

export interface ShareLink {
  id: string;
  token: string;
  contentId: string;
  contentType: 'skill' | 'businessModel';
  url: string;
  expiresAt: Date | null;
  accessCount: number;
  maxAccess: number | null;
  isActive: boolean;
  createdAt: Date;
}
```

### Service Layer Functions

**PrivacyService:**
```typescript
class PrivacyService {
  async getPrivacySettings(userId: string): Promise<PrivacySettings>;
  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings>;
  
  async generateShareLink(userId: string, contentId: string, contentType: 'skill' | 'businessModel', options?: ShareLinkOptions): Promise<ShareLink>;
  async validateShareLink(token: string): Promise<{ valid: boolean; contentId?: string; contentType?: string }>;
  async revokeShareLink(userId: string, tokenId: string): Promise<void>;
  async getUserShareLinks(userId: string): Promise<ShareLink[]>;
  
  async getContentAccessLogs(contentId: string): Promise<ContentAccessLog[]>;
  
  async exportAllUserData(userId: string): Promise<Blob>;
  async requestAccountDeletion(userId: string): Promise<void>;
}
```

### Security Considerations

1. **Share Token Security**: Use cryptographically secure random tokens
2. **Password Protection**: Hash passwords for protected share links
3. **Access Logging**: Log all shared content access
4. **Rate Limiting**: Prevent abuse of share link generation
5. **Data Deletion**: Complete data scrubbing on account deletion
6. **Consent Tracking**: Record user consent for data sharing

### GDPR Compliance

**Right to Access:**
- Complete data export endpoint
- Structured data format (JSON/CSV)

**Right to Erasure:**
- Account deletion with 30-day grace period
- Complete data removal including backups

**Right to Be Forgotten:**
- Opt-out from search indexing
- Profile deactivation option

**Data Portability:**
- Export in standard format
- Include all user-generated content

### API Endpoints

**POST /api/share/generate**
- Generate a shareable link
- Body: `{ contentId, contentType, options }`
- Response: `{ shareLink }`

**GET /api/share/[token]**
- Access shared content (public endpoint)
- Validate token and check expiration

**DELETE /api/share/[token]/revoke**
- Revoke a share link
- Requires authentication

**GET /api/share/my**
- Get all share links for user
- Requires authentication

**GET/PATCH /api/user/privacy**
- Get/update privacy settings
- Requires authentication

**POST /api/user/privacy/export**
- Export all user data
- Requires authentication

**POST /api/user/privacy/delete-account**
- Request account deletion
- Requires authentication + confirmation

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { PrivacyService } from '@/lib/privacy/privacy.service'
import { PrivacySettings } from '@/lib/privacy/types'

// INCORRECT
import { PrivacyService } from '../../../lib/privacy/privacy.service'
```

---

## Technical References

### Source: `_bmad-output/prd.md`
- FR22: 用户可以控制技能的公开/私密状态 (lines 410-415)
- FR23: 用户可以生成技能分享链接 (lines 416-420)
- FR24: 个人信息隐私设置 (lines 421-425)
- Data privacy requirements (lines 600-610)

### Source: `_bmad-output/epics.md`
- Epic 2 overview (lines 290-299)
- Story 2.9 reference (line 299)

### Source: Previous Stories
- Story 2.3: User Profile Setup - privacy pattern
- Story 2.6: Data Export - export functionality reference

---

## Success Criteria Checklist

- [ ] Public/Private toggle working for skills
- [ ] Public/Private toggle working for business models
- [ ] Default privacy settings configured
- [ ] Shareable links generation functional
- [ ] Share links validation working
- [ ] Access logs recording properly
- [ ] Data visibility controls functional
- [ ] Search opt-out implemented
- [ ] Third-party sharing preferences saved
- [ ] Complete data export functional
- [ ] Account deletion with cleanup working
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
