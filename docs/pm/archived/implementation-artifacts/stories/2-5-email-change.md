# Story 2.5: Email Address Change

Status: done

**Epic 2: User Account & Authentication**

Epic Value: Enable users to change their registered email address, ensuring account security and verification of the new email.

---

## Story

**As a logged-in user**, I want to change my email address, so that I can update my account information while maintaining security through email verification.

---

## Acceptance Criteria

1. Email change page or section in profile settings
2. Current email displayed (read-only)
3. New email input field
4. Current password required for confirmation
5. Email change API endpoint (`POST /api/user/change-email`)
6. Verification email sent to new email address
7. Email verification required to complete change
8. Old email remains active until verification
9. Error handling for invalid email, wrong password, duplicate email
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Email Change UI (AC: 1, 2, 3, 4)
- [ ] Create `src/components/profile/change-email-form.tsx`
- [ ] Display current email (read-only)
- [ ] Add new email input field
- [ ] Add current password input field
- [ ] Add submit button
- [ ] Add client-side validation

### Task 2: Create Email Change API Endpoint (AC: 5, 9)
- [ ] Create `src/app/api/user/change-email/request/route.ts`
- [ ] Get current session
- [ ] Verify current password
- [ ] Validate new email format
- [ ] Check for duplicate email
- [ ] Generate verification token
- [ ] Store change request with metadata
- [ ] Send verification email

### Task 3: Update Email Database Schema (AC: 8)
- [ ] Add email change tracking fields to User model
- [ ] Or use VerificationToken model with metadata
- [ ] Store old email for rollback
- [ ] Run Prisma migration

### Task 4: Create Email Verification Endpoint (AC: 7, 8)
- [ ] Create `src/app/api/user/change-email/confirm/route.ts`
- [ ] Validate verification token
- [ ] Check token expiration
- [ ] Update user's primary email
- [ ] Clear email change request
- [ ] Send confirmation email to old email

### Task 5: Email Templates (AC: 6, 7)
- [ ] Create email verification email template for new email
- [ ] Create confirmation email for old email
- [ ] Include security notifications
- [ ] Implement email sending

### Task 6: Add to Profile Settings Page (AC: 1)
- [ ] Add email change form to profile settings
- [ ] Add tab or section for email change
- [ ] Integrate with existing profile forms

### Task 7: Error Handling (AC: 9)
- [ ] Handle invalid email format
- [ ] Handle wrong current password
- [ ] Handle duplicate email error
- [ ] Handle invalid/expired verification token
- [ ] Display user-friendly error messages

### Task 8: Add Rate Limiting (Security)
- [ ] Rate limit email change requests
- [ ] Prevent email enumeration attempts
- [ ] Limit verification attempts

### Task 9: Add Security Features
- [ ] Log email change events
- [ ] Require password confirmation
- [ ] Send notifications to both old and new email
- [ ] Implement rollback timeout

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
│   ├── (protected)/profile/
│   │   └── settings/
│   │       └── page.tsx (update with email change)
│   └── api/
│       └── user/
│           └── change-email/
│               ├── request/
│               │   └── route.ts
│               └── confirm/
│                   └── route.ts
└── components/
    └── profile/
        └── change-email-form.tsx
```

### Prisma Schema Updates

**Option 1: Use VerificationToken with metadata**
```prisma
// Model already exists, add metadata field
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  metadata   Json?    // Store type: 'email-change', oldEmail, newEmail

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

**Option 2: Add to User model**
```prisma
model User {
  // ... existing fields
  pendingEmail      String?  @db.Text @map("pending_email")
  pendingEmailToken String?  @db.Text @map("pending_email_token")
  pendingEmailExpires DateTime? @map("pending_email_expires")
}
```

### Email Change Flow

**Step 1: Request Change**
1. User enters new email and current password
2. System verifies current password
3. System validates new email format
4. System checks for duplicate email
5. System generates verification token
6. System stores pending email change
7. System sends verification email to new email
8. Display success message

**Step 2: Confirm Change**
1. User clicks verification link or enters token
2. System validates token
3. System updates user's email
4. System sends confirmation to old email
5. System clears pending email change
6. Redirect to profile with success message

### API Endpoints

**POST /api/user/change-email/request**
```typescript
{
  newEmail: string
  currentPassword: string
}

// Response
200 {
  success: boolean
  message: string
}

400 {
  success: false
  message: string
  code?: 'INVALID_EMAIL' | 'WRONG_PASSWORD' | 'EMAIL_EXISTS' | 'SAME_EMAIL'
}
```

**POST /api/user/change-email/confirm**
```typescript
{
  token: string
  userId: string // optional, for security verification
}

// Response
200 {
  success: boolean
  message: string
}

400 {
  success: false
  message: string
  code?: 'INVALID_TOKEN' | 'TOKEN_EXPIRED' | 'USER_MISMATCH'
}
```

### Email Templates

**Verification Email (to new email):**
```typescript
Subject: 确认您的 AuraForce 新邮箱地址

HTML:
<p>您好，</p>
<p>您正在将您的 AuraForce 账户邮箱更改为此邮箱。</p>
<p>如果这不是您的操作，请忽略此邮件。</p>
<p>
  <a href="${confirmationUrl}">确认更改邮箱</a>
</p>
<p>此链接将在 24 小时后失效。</p>
```

**Confirmation Email (to old email):**
```typescript
Subject: 您的 AuraForce 邮箱地址已更改

HTML:
<p>您好，</p>
<p>您的 AuraForce 账户邮箱地址已成功更改为：${newEmail}</p>
<p>如果这不是您的操作，请立即联系我们。</p>
```

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { getSession } from '@/lib/auth/session'
import { verifyPassword } from '@/lib/auth/password-validation'

// INCORRECT
import { getSession } from '../../../lib/auth/session'
```

### Error Handling

**Error Codes:**
- `INVALID_EMAIL` - Invalid email format
- `WRONG_PASSWORD` - Current password is incorrect
- `EMAIL_EXISTS` - New email already in use
- `SAME_EMAIL` - New email is same as current email
- `INVALID_TOKEN` - Verification token invalid
- `TOKEN_EXPIRED` - Token has expired
- `USER_MISMATCH` - Token doesn't match user
- `RATE_LIMITED` - Too many requests

### Security Best Practices

1. **Password Required:** Always require current password for email change
2. **Double Verification:** Verify both old and new email addresses
3. **Token Expiration:** Tokens should expire within 24 hours
4. **Rate Limiting:** Limit email change attempts per hour
5. **Audit Logging:** Log all email change attempts
6. **Rollback Window:** Consider allowing rollback within a time window
7. **Notification:** Always notify old email of changes

### Testing Standards

**Manual Testing Required:**
- Request email change with valid data
- Try using wrong current password
- Try using invalid email format
- Try using existing email
- Try using same email as current
- Verify email change with valid token
- Try with invalid token
- Try with expired token
- Check confirmation email to old address
- Test rate limiting

**TypeScript Verification:**
- `npx tsc --noEmit` must pass with strict mode

---

## Technical References

### Source: `_bmad-output/prisma/schema.prisma`
- User model definition (lines 14-31)
- VerificationToken model (lines 64-71)

### Source: `_bmad-output/epics.md`
- Section: Epic 2 Overview (lines 290-291)
- Email Change requirements

### Source: `src/lib/auth/password-validation.ts`
- Password validation utilities

### Source: `src/app/api/auth/signup/route.ts`
- Reference for validation patterns

---

## Success Criteria Checklist

- [ ] Email change form created
- [ ] Current email displayed read-only
- [ ] New email input with validation
- [ ] Password confirmation required
- [ ] Email change request API working
- [ ] Verification email sent correctly
- [ ] Email confirmation endpoint working
- [ ] Old email notified of change
- [ ] Proper error handling
- [ ] Rate limiting implemented
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
