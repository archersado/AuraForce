# Story 2.3: User Profile Setup and Management

Status: done

**Epic 2: User Account & Authentication**

Epic Value: Enable users to manage their personal profile information, including name, avatar, and settings, providing a personalized experience across the platform.

---

## Story

**As a logged-in user**, I want to view and edit my profile information, so that I can personalize my AuraForce experience and manage my account details.

---

## Acceptance Criteria

1. Profile settings page at `/profile/settings`
2. Display user's current profile information (name, email, avatar)
3. Allow editing display name
4. Allow uploading/changing avatar image
5. Profile update API endpoint (`PATCH /api/user/profile`)
6. Validation for profile updates
7. Success/error messages for profile updates
8. Change password functionality
9. Change password API endpoint (`POST /api/user/change-password`)
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Profile Settings UI (AC: 1, 2)
- [ ] Create `src/app/(protected)/profile/settings/page.tsx`
- [ ] Create `src/components/profile/profile-form.tsx`
- [ ] Display current user name
- [ ] Display current user email (read-only)
- [ ] Display current user avatar
- [ ] Add edit name input field
- [ ] Add file upload for avatar
- [ ] Add avatar preview
- [ ] Add save profile button

### Task 2: Create Change Password UI (AC: 8)
- [ ] Create `src/components/profile/change-password-form.tsx`
- [ ] Add current password input
- [ ] Add new password input
- [ ] Add confirm new password input
- [ ] Add submit button
- [ ] Add password validation feedback

### Task 3: Create Update Profile API Endpoint (AC: 5, 6, 7)
- [ ] Create `src/app/api/user/profile/route.ts`
- [ ] Get current user from session
- [ ] Validate request body (name, avatar)
- [ ] Update user in database
- [ ] Handle avatar upload to storage
- [ ] Return success/failure response

### Task 4: Create Change Password API Endpoint (AC: 9, 6, 7)
- [ ] Create `src/app/api/user/change-password/route.ts`
- [ ] Get current user from session
- [ ] Validate current password
- [ ] Validate new password strength
- [ ] Hash new password
- [ ] Update password in database
- [ ] Return success/failure response

### Task 5: Implement Avatar Storage (AC: 4)
- [ ] Configure avatar storage directory
- [ ] Implement file upload handler
- [ ] Generate unique filename for avatars
- [ ] Handle image validation (type, size)
- [ ] Create default avatar URL

### Task 6: Add Session Helper hooks (AC: 1)
- [ ] Create `src/hooks/useSession.ts`
- [ ] Provide session state to components
- [ ] Provide user info to components
- [ ] Handle session expiration

### Task 7: Create Protected Route Layout (AC: 1)
- [ ] Create `src/app/(protected)/layout.tsx`
- [ ] Add session check in layout
- [ ] Add navigation header
- [ ] Add logout button
- [ ] Redirect to login if not authenticated

### Task 8: Add Error Handling (AC: 7)
- [ ] Handle invalid input errors
- [ ] Handle file upload errors
- [ ] Handle password mismatch errors
- [ ] Display user-friendly error messages
- [ ] Add loading states

### Task 9: Add Navigation (AC: 1)
- [ ] Add profile link to dashboard
- [ ] Add settings link in user menu
- [ ] Ensure profile accessible at `/profile/settings`
- [ ] Test navigation flows

### Task 10: Run Type Check (AC: 10)
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
│   │   ├── layout.tsx
│   │   └── profile/
│   │       └── settings/
│   │           └── page.tsx
│   └── api/
│       └── user/
│           ├── profile/
│           │   └── route.ts
│           └── change-password/
│               └── route.ts
├── components/
│   └── profile/
│       ├── profile-form.tsx
│       └── change-password-form.tsx
└── hooks/
    └── useSession.ts
```

### Prisma Schema (Existing)

**User Model:**
```prisma
model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  password      String?   @db.Text
  image         String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  // ... relations
}
```

### Avatar Storage

**Storage Strategy:**
- Store avatars in `public/avatars/` directory
- Generate unique filename using userId + timestamp
- Supported formats: JPG, PNG, WebP, GIF
- Max file size: 5MB
- Default avatar: `/avatars/default.png`

**Filename Format:**
```
public/avatars/${userId}-${timestamp}.${ext}
```

### API Endpoints

**PATCH /api/user/profile**
```typescript
{
  name?: string
  avatar?: string // URL or base64
}

// Response
200 {
  success: boolean
  message: string
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
  }
}

400 {
  success: false
  message: string
}
```

**POST /api/user/change-password**
```typescript
{
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Response
200 {
  success: boolean
  message: string
}

400 {
  success: false
  message: string
  code?: 'INVALID_CURRENT_PASSWORD' | 'WEAK_PASSWORD' | 'PASSWORD_MISMATCH'
}
```

### Password Change Requirements

According to `src/lib/auth/password-validation.ts`:
- Minimum 8 characters
- At least one letter (a-z, A-Z)
- At least one number (0-9)
- New password must be different from current password

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { getSession } from '@/lib/auth/session'
import { validatePassword } from '@/lib/auth/password-validation'

// INCORRECT
import { getSession } from '../../../lib/auth/session'
```

### Session Management

**useSession Hook:**
```typescript
interface SessionData {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
  }
}

function useSession(): {
  session: SessionData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```

### Error Handling

**Error Codes:**
- `UNAUTHORIZED` - User not authenticated
- `INVALID_INPUT` - Invalid request body
- `FILE_TOO_LARGE` - Avatar file exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file format
- `INVALID_CURRENT_PASSWORD` - Current password is incorrect
- `WEAK_PASSWORD` - New password doesn't meet requirements
- `PASSWORD_MISMATCH` - Passwords don't match

### Security Best Practices

1. **File Upload Validation:** Validate file type and size before processing
2. **Password Verification:** Always verify current password before changing
3. **Session Validation:** Always check session on protected endpoints
4. **Input Sanitization:** Sanitize all user inputs
5. **Rate Limiting:** Consider rate limiting password changes
6. **CSRF Protection:** POST/PUT/DELETE endpoints should use CSRF tokens

### Testing Standards

**Manual Testing Required:**
- View profile page shows correct user info
- Update name successfully
- Upload and display new avatar
- Test file size validation
- Test file type validation
- Change password with correct current password
- Fail change with incorrect current password
- Fail change with weak password
- Fail change with password mismatch
- Test navigation flows

**TypeScript Verification:**
- `npx tsc --noEmit` must pass with strict mode

---

## Technical References

### Source: `_bmad-output/architecture.md`
- Section: Project Structure (lines 520-630)
- Protected routes and component organization

### Source: `_bmad-output/prisma/schema.prisma`
- User model definition (lines 14-31)

### Source: `_bmad-output/epics.md`
- Section: Epic 2 Overview (lines 290-291)
- User Profile requirements

### Source: `src/lib/auth/password-validation.ts`
- Password validation utilities

---

## Success Criteria Checklist

- [ ] Profile settings page created at `/profile/settings`
- [ ] Current profile information displayed
- [ ] Profile can be edited (name, avatar)
- [ ] Update profile API endpoint working
- [ ] Avatar upload functionality working
- [ ] Change password form created
- [ ] Change password API endpoint working
- [ ] Proper validation for all operations
- [ ] Error handling for all failure scenarios
- [ ] Protected route layout with session check
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
