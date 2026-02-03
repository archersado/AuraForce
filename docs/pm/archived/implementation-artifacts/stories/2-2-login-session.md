# Story 2.2: User Login and Session Management

Status: done

**Epic 2: User Account & Authentication**

Epic Value: Enable authenticated users to securely log in and maintain active sessions, providing seamless access to protected features like the dashboard and user settings.

---

## Story

**As a registered user**, I want to log in with my email and password, so that I can securely access my account and protected features.

---

## Acceptance Criteria

1. Login page created at `/login` route with email/password fields
2. Login API endpoint (`POST /api/auth/signin`) validates credentials
3. Successful login creates a secure session token
4. Session persisted in browser (httpOnly cookie)
5. Invalid credentials handled with appropriate error message
6. Unverified email login shows verification prompt
7. Dashboard redirects unauthenticated users to login
8. Logout functionality clears session securely
9. Session persists across page reloads
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Login UI Components (AC: 1)
- [ ] Create `src/app/(auth)/login/page.tsx`
- [ ] Create `src/components/auth/login-form.tsx`
- [ ] Add email input field with validation
- [ ] Add password input field with visibility toggle
- [ ] Add remember me checkbox
- [ ] Add submit button with loading state
- [ ] Add forgot password link
- [ ] Add register page link
- [ ] Add form-level error display

### Task 2: Implement Login API Endpoint (AC: 2)
- [ ] Create `src/app/api/auth/signin/route.ts`
- [ ] Parse request body (email, password, rememberMe)
- [ ] Validate email format
- [ ] Find user in database
- [ ] Check if user email is verified
- [ ] Compare password hash using bcryptjs
- [ ] Generate secure session token
- [ ] Create session in database
- [ ] Return success/failure response

### Task 3: Create Session Management (AC: 3, 4, 9)
- [ ] Create `src/lib/auth/session.ts` for session utilities
- [ ] Implement `createSession` function
- [ ] Implement `getSession` function
- [ ] Implement `deleteSession` function
- [ ] Implement `authenticateUser` function
- [ ] Configure httpOnly, secure, sameSite cookie settings

### Task 4: Update Prisma Schema for Sessions (AC: 3)
- [ ] Add Session model to Prisma schema
- [ ] Define session token, userId, expires fields
- [ ] Add indexes for token and user lookup
- [ ] Run `npx prisma migrate dev`
- [ ] Run `npx prisma generate`

### Task 5: Handle Unverified Email Login (AC: 6)
- [ ] Detect unverified email in login flow
- [ ] Return specific error message directing to verify page
- [ ] Provide resend verification option on error
- [ ] Update login UI to show verification prompt

### Task 6: Implement Route Protection (AC: 7)
- [ ] Create `src/lib/auth/route-protection.ts`
- [ ] Implement `requireAuth` function
- [ ] Update `src/middleware.ts` with session validation
- [ ] Redirect unauthenticated users to /login
- [ ] Store intended destination for post-login redirect

### Task 7: Implement Logout Functionality (AC: 8)
- [ ] Create `src/app/api/auth/signout/route.ts`
- [ ] Get current session from cookies
- [ ] Delete session from database
- [ ] Clear session cookie
- [ ] Redirect to login page
- [ ] Add logout button to dashboard UI

### Task 8: Add Login Page Navigation (AC: 1)
- [ ] Link from register page to login page
- [ ] Link from verify page to login page
- [ ] Ensure login page accessible via /login
- [ ] Test navigation flows

### Task 9: Implement Session Persistence (AC: 9)
- [ ] Configure cookie expiration (7 days default, 30 days with remember me)
- [ ] Implement session refresh mechanism
- [ ] Handle expired sessions gracefully
- [ ] Test session persistence across browser restarts

### Task 10: Error Handling and Security (AC: 5)
- [ ] Handle invalid credentials with generic error
- [ ] Implement rate limiting for login attempts
- [ ] Log failed login attempts for monitoring
- [ ] Use constant-time password comparison
- [ ] Sanitize error messages to avoid information leakage

### Task 11: Run Type Check (AC: 10)
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
│   │   └── login/
│   │       └── page.tsx
│   └── api/
│       └── auth/
│           ├── signin/
│           │   └── route.ts
│           └── signout/
│               └── route.ts
├── components/
│   └── auth/
│       └── login-form.tsx
├── lib/
│   └── auth/
│       ├── session.ts
│       └── route-protection.ts
└── middleware.ts
```

### Prisma Schema Updates

**Session Model Required:**
```prisma
model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([sessionToken])
  @@index([userId])
  @@map("sessions")
}

model User {
  // ... existing fields
  sessions Session[]
}
```

### Session Configuration

**Cookie Settings:**
```typescript
const cookieOptions = {
  name: 'auraforce-session',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}
```

**Session Token Generation:**
```typescript
import { randomBytes } from 'crypto'

function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}
```

### API Endpoints

**POST /api/auth/signin**
```typescript
{
  email: string
  password: string
  rememberMe?: boolean // defaults to false
}

// Response
200 {
  success: boolean
  message: string
  redirect?: string // dashboard or intended destination
}

400 {
  success: false
  message: string
  code?: 'INVALID_CREDENTIALS' | 'UNVERIFIED_EMAIL' | 'RATE_LIMITED'
}
```

**POST /api/auth/signout**
```typescript
// No body required

// Response
200 {
  success: boolean
  message: string
}
```

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { prisma } from '@/lib/db'
import { createSession, getSession } from '@/lib/auth/session'

// INCORRECT
import { prisma } from '../../../lib/db'
```

### Error Handling

**Error Codes:**
- `INVALID_CREDENTIALS` - Email or password is incorrect
- `UNVERIFIED_EMAIL` - Email not verified, need to verify first
- `USER_NOT_FOUND` - No user with this email
- `RATE_LIMITED` - Too many login attempts, try again later
- `SESSION_EXPIRED` - Session has expired

### Security Best Practices

1. **Password Comparison:** Use bcrypt.compare for timing-safe comparison
2. **Session Tokens:** Generate cryptographically secure random tokens
3. **Cookie Security:** Always use httpOnly flag, use sameSite for CSRF protection
4. **Rate Limiting:** Implement IP-based rate limiting for login attempts
5. **Error Messages:** Use generic errors to avoid user enumeration
6. **Session Cleanup:** Implement cleanup job for expired sessions

### Testing Standards

**Manual Testing Required:**
- Login with correct email and password
- Login with incorrect email
- Login with incorrect password
- Login with unverified email (should show verification prompt)
- Test remember me functionality (longer session)
- Test logout clears session
- Test protected route redirects to login
- Test session persists across page reloads
- Test expired session handling

**TypeScript Verification:**
- `npx tsc --noEmit` must pass with strict mode

---

## Technical References

### Source: `_bmad-output/architecture.md`
- Section: Authentication Architecture (lines 150-250)
- Session management patterns and route protection

### Source: `_bmad-output/prisma/schema.prisma`
- User model definition (lines 14-31)
- Verification token model (lines 64-71)
- Session model to be added

### Source: `_bmad-output/epics.md`
- Section: Epic 2 Overview (lines 291-292)
- User Login requirements

### Source: `src/middleware.ts`
- Current middleware configuration for route protection

---

## Success Criteria Checklist

- [ ] Login page created at `/login`
- [ ] Login form with email/password fields
- [ ] Login API endpoint working
- [ ] Session management implemented
- [ ] Unverified email login handled
- [ ] Route protection in middleware
- [ ] Logout functionality working
- [ ] Session persistence confirmed
- [ ] Error handling for all scenarios
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
