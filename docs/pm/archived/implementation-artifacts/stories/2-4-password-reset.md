# Story 2.4: Password Reset via Email

Status: done

**Epic 2: User Account & Authentication**

Epic Value: Enable users to reset their forgotten passwords via email, providing a secure way to regain account access without admin intervention.

---

## Story

**As a registered user**, I want to reset my password via email, so that I can regain access to my account if I forget my current password.

---

## Acceptance Criteria

1. Forgot password page at `/forgot-password` with email input
2. Password reset request API endpoint (`POST /api/auth/reset-password/request`)
3. Password reset token sent via email
4. Password reset page at `/reset-password` with token input
5. Password reset API endpoint (`POST /api/auth/reset-password/confirm`)
6. Token validation with expiration (1 hour)
7. Password validation on reset (same as registration)
8. Success/error messages for each step
9. Rate limiting for reset requests
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Forgot Password UI (AC: 1)
- [ ] Create `src/app/(auth)/forgot-password/page.tsx`
- [ ] Create `src/components/auth/forgot-password-form.tsx`
- [ ] Add email input field
- [ ] Add submit button with loading state
- [ ] Add link back to login
- [ ] Add success message display

### Task 2: Create Reset Password Request API (AC: 2, 3, 9)
- [ ] Create `src/app/api/auth/reset-password/request/route.ts`
- [ ] Validate email format
- [ ] Check if user exists
- [ ] Generate secure reset token
- [ ] Store token with expiration (1 hour)
- [ ] Send reset email
- [ ] Implement rate limiting
- [ ] Return success (even if user doesn't exist for security)

### Task 3: Create Reset Password UI (AC: 4, 7)
- [ ] Create `src/app/(auth)/reset-password/page.tsx`
- [ ] Create `src/components/auth/reset-password-form.tsx`
- [ ] Add token input (optional, pre-filled from URL)
- [ ] Add new password input
- [ ] Add confirm password input
- [ ] Add password validation feedback
- [ ] Add submit button

### Task 4: Create Reset Password Confirmation API (AC: 5, 6, 7)
- [ ] Create `src/app/api/auth/reset-password/confirm/route.ts`
- [ ] Validate reset token
- [ ] Check token expiration
- [ ] Validate new password strength
- [ ] Update user password
- [ ] Delete used reset token
- [ ] Return success/failure response

### Task 5: Update Prisma Schema (AC: 3, 6)
- [ ] Use existing VerificationToken model for password reset
- [ ] Update schema documentation if needed
- [ ] Ensure proper indexes

### Task 6: Implement Rate Limiting (AC: 9)
- [ ] Create `src/lib/rate-limiting.ts`
- [ ] Implement IP-based rate limiting
- [ ] Store rate limit data in memory or database
- [ ] Configure limits (max 3 requests per hour)
- [ ] Return rate limit error if exceeded

### Task 7: Add Email Templates (AC: 3)
- [ ] Create password reset email template
- [ ] Include reset link with token
- [   ] Add security advice
- [ ] Implement email sending (integration with Story 2.1)

### Task 8: Add Error Handling (AC: 8)
- [ ] Handle invalid email format
- [ ] Handle rate limit exceeded
- [ ] Handle invalid/expired token
- [ ] Handle weak password
- [ ] Display user-friendly error messages

### Task 9: Add Navigation Links (AC: 1, 4)
- [ ] Add "forgot password" link to login page
- [ ] Add login link to reset password pages
- [ ] Ensure proper redirect after reset
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
│   ├── (auth)/
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   └── api/
│       └── auth/
│           └── reset-password/
│               ├── request/
│               │   └── route.ts
│               └── confirm/
│                   └── route.ts
├── components/
│   └── auth/
│       ├── forgot-password-form.tsx
│       └── reset-password-form.tsx
└── lib/
    └── rate-limiting.ts
```

### Prisma Schema (Existing)

**VerificationToken Model:**
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

**Usage:**
- `identifier`: User's email
- `token`: Secure reset token
- `expires`: 1 hour from generation

### Password Reset Flow

**Step 1: Request Reset**
1. User enters email on `/forgot-password`
2. System generates token
3. System sends email with reset link: `/reset-password?token=xxx&email=yyy`
4. Display success message

**Step 2: Reset Password**
1. User clicks link or enters token manually
2. User enters new password
3. System validates token and password
4. System updates password
5. Redirect to login

### API Endpoints

**POST /api/auth/reset-password/request**
```typescript
{
  email: string
}

// Response
200 {
  success: boolean
  message: string
  // Always returns success for security (don't reveal if email exists)
}

429 {
  success: false
  message: string
  code: 'RATE_LIMITED'
  retryAfter: number // seconds
}
```

**POST /api/auth/reset-password/confirm**
```typescript
{
  email: string
  token: string
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
  code?: 'INVALID_TOKEN' | 'TOKEN_EXPIRED' | 'WEAK_PASSWORD' | 'PASSWORD_MISMATCH'
}
```

### Rate Limiting Configuration

**Default Limits:**
- Max requests: 3 per hour per IP address
- Max requests per email: 3 per hour
- Token expiration: 1 hour

**Storage:**
```typescript
interface RateLimitEntry {
  key: string // IP or email
  attempts: number
  firstAttempt: Date
}

// In-memory storage for MVP
const rateLimits = new Map<string, RateLimitEntry>();
```

### Email Template

**Reset Email:**
```typescript
Subject: 重置您的 AuraForce 密码

HTML:
<p>您好，</p>
<p>我们收到了重置您 AuraForce 账户密码的请求。</p>
<p>如果这不是您的操作，请忽略此邮件。</p>
<p>
  <a href="${resetUrl}">点击此处重置密码</a>
</p>
<p>此链接将在 1 小时后失效。</p>
<p>祝好，<br>AuraForce 团队</p>
```

### Password Requirements

According to `src/lib/auth/password-validation.ts`:
- Minimum 8 characters
- At least one letter (a-z, A-Z)
- At least one number (0-9)

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { prisma } from '@/lib/db'
import { generateVerificationToken } from '@/lib/auth/password-validation'

// INCORRECT
import { prisma } from '../../../lib/db'
```

### Security Best Practices

1. **Token Security:** Generate cryptographically secure random tokens
2. **Rate Limiting:** Prevent brute force attacks on email enumeration
3. **Timing Attacks:** Use constant-time comparisons where applicable
4. **Email Obfuscation:** Don't reveal if email exists in response
5. **Expiration:** Tokens should expire within reasonable time (1 hour)
6. **Single Use:** Tokens should be deleted after use
7. **HTTPS:** Always use HTTPS in production

### Error Handling

**Error Codes:**
- `RATE_LIMITED` - Too many requests
- `INVALID_TOKEN` - Token doesn't exist
- `TOKEN_EXPIRED` - Token has expired
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `PASSWORD_MISMATCH` - Passwords don't match

### Testing Standards

**Manual Testing Required:**
- Request password reset with valid email
- Request with invalid email (should return same success message)
- Test rate limiting (make 4+ requests within 1 hour)
- Reset password with valid token
- Reset with invalid token
- Reset with expired token
- Reset with weak password
- Test password mismatch
- Test navigation flows
- Verify redirect to login after successful reset

**TypeScript Verification:**
- `npx tsc --noEmit` must pass with strict mode

---

## Technical References

### Source: `_bmad-output/prisma/schema.prisma`
- VerificationToken model (lines 64-71)

### Source: `_bmad-output/epics.md`
- Section: Epic 2 Overview (lines 290-291)
- Password Reset requirements

### Source: `src/lib/auth/password-validation.ts`
- Password validation utilities

### Source: `src/app/api/auth/resend-verification/route.ts`
- Reference for token generation pattern

---

## Success Criteria Checklist

- [ ] Forgot password page created at `/forgot-password`
- [ ] Reset password page created at `/reset-password`
- [ ] Password reset request API endpoint working
- [ ] Reset tokens sent via email
- [ ] Password reset confirmation API endpoint working
- [ ] Token validation with 1-hour expiration
- [ ] Password validation on reset
- [ ] Rate limiting implemented
- [ ] Proper error handling and messages
- [ ] Navigation links working
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
