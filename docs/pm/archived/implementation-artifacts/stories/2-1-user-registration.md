# Story 2.1: User Registration with Email

Status: done

**Epic 2: User Account & Authentication**

Epic Value: Enable new users to register an account with email verification, providing the entry point for all authentication-related features in AuraForce.

---

## Story

**As a new user**, I want to register an account with email verification, so that I can securely access the AuraForce platform and manage my skill assets.

---

## Acceptance Criteria

1. Registration form created at `/register` route with email/password fields
2. Password validation (min 8 characters, at least one letter and number)
3. Email verification flow implemented (send verification token)
4. Registration API endpoint (`POST /api/auth/signup`)
5. Error handling for duplicate email, weak password, network failures
6. Success redirect to email verification page
7. Email verification page at `/verify` with token input
8. Verification API endpoint (`POST /api/auth/verify-email`)
9. Successful verification redirects to login page
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Registration UI Components (AC: 1)
- [ ] Create `src/app/(auth)/register/page.tsx`
- [ ] Create `src/components/auth/register-form.tsx`
- [ ] Add email input field with validation
- [ ] Add password input field with visibility toggle
- [ ] Add confirm password field
- [ ] Add submit button with loading state
- [ ] Add form-level error display

### Task 2: Implement Password Validation (AC: 2)
- [ ] Create `src/lib/auth/password-validation.ts`
- [ ] Implement minimum length check (8 chars)
- [ ] Implement letter requirement
- [ ] Implement number requirement
- [ ] Implement strength indicator (optional)
- [ ] Export validation function

### Task 3: Create Registration API Endpoint (AC: 4)
- [ ] Create `src/app/api/auth/signup/route.ts`
- [ ] Parse request body (email, password, confirmPassword)
- [ ] Validate email format
- [ ] Validate password strength
- [ ] Check for duplicate email in database
- [ ] Hash password using bcryptjs
- [ ] Create user record via Prisma
- [ ] Generate verification token
- [ ] Store verification token in database
- [ ] Send verification email

### Task 4: Implement Email Verification Flow (AC: 3, 7)
- [ ] Create email template for verification
- [ ] Configure email sending (Nodemailer or Resend)
- [ ] Create `src/app/(auth)/verify/page.tsx`
- [ ] Add token input field
- [ ] Add resend verification email link
- [ ] Add email input for resending

### Task 5: Create Verification API Endpoint (AC: 8, 9)
- [ ] Create `src/app/api/auth/verify-email/route.ts`
- [ ] Validate verification token
- [ ] Check token expiration
- [ ] Update user's emailVerified field
- [ ] Delete verification token
- [ ] Return success/failure response

### Task 6: Implement Email Sending (AC: 3)
- [ ] Configure email service in `.env`
- [ ] Create `src/lib/email/verifier.ts`
- [ ] Implement sendVerificationEmail function
- [ ] Add tracking for email opens/clicks (optional)
- [ ] Handle email sending failures

### Task 7: Add Error Handling (AC: 5, 6)
- [ ] Handle duplicate email error
- [ ] Handle weak password error
- [ ] Handle network/email sending errors
- [ ] Display user-friendly error messages
- [ ] Add loading states to prevent double-submit

### Task 8: Update Navigation and Links (AC: 6)
- [ ] Add register link to login page
- [ ] Add login link to register page
- [ ] Update middleware to allow access to auth routes
- [ ] Test navigation flows

### Task 9: Run Type Check (AC: 10)
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
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── verify/
│   │       └── page.tsx
│   └── api/
│       └── auth/
│           ├── signup/
│           │   └── route.ts
│           └── verify-email/
│               └── route.ts
├── components/
│   └── auth/
│       └── register-form.tsx
├── lib/
│   ├── auth/
│   │   └── password-validation.ts
│   └── email/
│       └── verifier.ts
```

### Password Requirements

According to `src/lib/auth/password-validation.ts`:
- Minimum 8 characters
- At least one letter (a-z, A-Z)
- At least one number (0-9)
- Optional special characters recommendation

### Prisma Schema (Existing)

```prisma
model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  // ...
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

### Email Configuration

**Environment Variables:**
```env
# Email service configuration
EMAIL_FROM=noreply@auraforce.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

**Email Template:**
```typescript
{
  to: user.email,
  subject: '验证您的 AuraForce 账户',
  html: `<p>点击以下链接验证您的账户：</p>
          <a href="${verificationUrl}">验证账户</a>`
}
```

### API Endpoints

**POST /api/auth/signup**
```typescript
{
  email: string
  password: string
  confirmPassword: string
}

// Response
{
  success: boolean
  message: string
  userId?: string
  requireVerification: boolean
}
```

**POST /api/auth/verify-email**
```typescript
{
  email: string
  token: string
}

// Response
{
  success: boolean
  message: string
}
```

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { prisma } from '@/lib/db'
import { validatePassword } from '@/lib/auth/password-validation'

// INCORRECT
import { prisma } from '../../../lib/db'
```

### Error Handling

**Common Errors:**
- `EMAIL_EXISTS` - User with this email already exists
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `PASSWORD_MISMATCH` - Passwords don't match
- `EMAIL_SEND_FAILED` - Email sending failed
- `INVALID_TOKEN` - Verification token invalid
- `TOKEN_EXPIRED` - Token has expired

### Testing Standards

**Manual Testing Required:**
- Register with valid email and strong password
- Register with duplicate email (should fail)
- Try weak password (should fail)
- Verify password mismatch (should fail)
- Check email verification link works
- Verify expired token handling
- Test resend verification email

**TypeScript Verification:**
- `npx tsc --noEmit` must pass with strict mode

---

## Technical References

### Source: `_bmad-output/architecture.md`
- Section: Project Structure (lines 520-630)
- Authentication route patterns and UI components

### Source: `_bmad-output/prisma/schema.prisma`
- User model definition (lines 14-31)
- VerificationToken model (lines 64-71)

### Source: `_bmad-output/epics.md`
- Section: Epic 2 Overview (lines 290-299)
- User Registration requirements

---

## Success Criteria Checklist

- [ ] Registration UI created at `/register`
- [ ] Password validation implemented (8+ chars, letter + number)
- [ ] Registration API endpoint working
- [ ] Email verification flow complete
- [ ] Verification page created at `/verify`
- [ ] Verification API endpoint working
- [ ] Error handling for all failure scenarios
- [ ] Proper navigation flows
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
