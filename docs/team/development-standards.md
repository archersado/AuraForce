# Development Standards for AuraForce

**Project**: AuraForce
**Version**: 1.0
**Last Updated**: 2026-01-07
**Target Audience**: Development Engineers

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [TypeScript Standards](#typescript-standards)
3. [Code Structure & Organization](#code-structure--organization)
4. [Component Development Patterns](#component-development-patterns)
5. [State Management (Zustand)](#state-management-zustand)
6. [API Development](#api-development)
7. [Testing Requirements](#testing-requirements)
8. [Code Quality Tools](#code-quality-tools)
9. [Git Workflow](#git-workflow)
10. [Pre-commit Hooks](#pre-commit-hooks)

---

## Project Overview

### Technology Stack

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript 5.2.2 (STRICT MODE REQUIRED)
- **Styling**: Tailwind CSS 3.3.5
- **Database**: MySQL 8.0+ with Prisma ORM 5.0.0
- **Authentication**: Auth.js v5
- **State Management**: Zustand v5.0.9
- **Testing**: Jest 29.7.0 + React Testing Library
- **AI Integration**: @anthropic-ai/claude-agent-sdk

### Project Structure

```
src/
├── app/                    # Next.js App Router (Server Components by default)
│   ├── (auth)/            # Auth-related routes (protected)
│   ├── (dashboard)/       # Dashboard routes (protected)
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Auth components
│   ├── claude/            # Claude Code interface components
│   ├── ui/                # Reusable UI components
│   └── shared/            # Shared components
├── lib/                   # Utility libraries
│   ├── auth/              # Auth utilities
│   ├── claude/            # Claude SDK integration
│   ├── store/             # Zustand stores
│   └── utils/             # General utilities
├── types/                 # TypeScript type definitions
│   └── *.ts               # Shared types
└── styles/                # Global styles
    └── globals.css        # Tailwind directives
```

---

## TypeScript Standards

### Strict Mode (CRITICAL)

**MANDATORY**: TypeScript strict mode must be enabled and maintained.

```json
// tsconfig.json - MUST HAVE
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Type Guidelines

**NO `any` TYPES ALLOWED** - Always use proper TypeScript types.

#### Interfaces vs Types
```typescript
// ✅ CORRECT: Use interface for object shapes
interface User {
  id: string
  name: string
  email: string
}

// ✅ CORRECT: Use type for unions and intersections
type UserRole = 'admin' | 'user' | 'guest'

// ✅ CORRECT: Use interface for component props
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

// ❌ AVOID: Don't use 'any'
const data: any = fetchData()
```

#### Component Props Typing
```typescript
// ✅ CORRECT: Explicit interface for props
interface ChatInterfaceProps {
  sessionId: string
  onSessionChange: (id: string) => void
  className?: string
}

export function ChatInterface({
  sessionId,
  onSessionChange,
  className = '',
}: ChatInterfaceProps): JSX.Element {
  // Component implementation
}

// ❌ AVOID: Untyped props
export function ChatInterface(props: any) {
  // Don't do this
}
```

#### Event Handler Types
```typescript
// ✅ CORRECT: Use React event types
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault()
  // Handle click
}

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
  if (event.key === 'Enter') {
    // Handle enter key
  }
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  const value = event.target.value
  // Handle change
}
```

#### Async Functions & Error Types
```typescript
// ✅ CORRECT: Type async return values
interface Session {
  id: string
  title: string
  status: 'active' | 'paused'
}

async function createSession(title: string): Promise<Session> {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error('Failed to create session')
  }

  return response.json() as Promise<Session>
}

// ✅ CORRECT: Try-catch with proper error handling
try {
  const session = await createSession('New Session')
  console.log('Session created:', session.id)
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message)
  }
}
```

### Import Path Standards

**ALWAYS USE `@/*` ALIAS** for internal imports.

```typescript
// ✅ CORRECT: Use @/* alias for all internal imports
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/lib/store/auth-store'
import { Session } from '@/types/session'

// ❌ AVOID: Relative paths
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../../lib/store/auth-store'
```

### Named vs Default Exports

```typescript
// ✅ CORRECT: Use named exports for components
export function MessageBubble({ content }: MessageBubbleProps) {
  return <div className="message">{content}</div>
}

// ✅ CORRECT: Export types for component props
export interface MessageBubbleProps {
  content: string
}

// ❌ AVOID: Default exports for components
export default function MessageBubble({ content }) {
  return <div className="message">{content}</div>
}
```

---

## Code Structure & Organization

### File Naming Conventions

- **Components**: PascalCase, matching export name
  - `MessageBubble.tsx` exports `MessageBubble`
- **Utilities**: kebab-case
  - `format-date.ts`
  - `api-client.ts`
- **Types**: kebab-case
  - `session.ts`
  - `user-credentials.ts`
- **Constants**: kebab-case
  - `api-endpoints.ts`

### Component Organization

```
components/claude/
├── ChatInterface.tsx       # Main component
├── ChatInterface.types.ts  # Component types (if complex)
├── ChatHeader.tsx
├── MessageBubble.tsx
├── MessageInput.tsx
├── MessageList.tsx
├── TypingIndicator.tsx
└── index.ts                # Barrel export
```

### Barrel Exports

Create `index.ts` files for clean imports:

```typescript
// components/claude/index.ts
export { ChatInterface } from './ChatInterface'
export { ChatHeader } from './ChatHeader'
export { MessageBubble } from './MessageBubble'
export { MessageInput } from './MessageInput'
export { MessageList } from './MessageList'
export { TypingIndicator } from './TypingIndicator'
export type {
  ChatInterfaceProps,
  ChatHeaderProps,
  MessageBubbleProps,
  MessageInputProps,
  MessageListProps,
} from './types'
```

---

## Component Development Patterns

### Client Components

**REQUIRE `'use client'` directive** at top of interactive components.

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface MessageInputProps {
  onSend: (message: string) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (text.trim()) {
      onSend(text)
      setText('')
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2 border rounded"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend()
          }
        }}
      />
      <Button onClick={handleSend}>Send</Button>
    </div>
  )
}
```

### Server Components

**DEFAULT behavior** - No `'use client'` needed.

```typescript
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
    </div>
  )
}
```

### Component Composition

```typescript
// Parent component
export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  return (
    <div className="flex flex-col h-screen">
      <ChatHeader sessionId={sessionId} />
      <MessageList sessionId={sessionId} />
      <MessageInput onSend={handleSend} />
    </div>
  )
}

// Reuse child components in different contexts
export function EmbeddedChat({ message }: { message: string }) {
  return (
    <div className="p-4 border rounded">
      <MessageBubble content={message} role="user" />
    </div>
  )
}
```

---

## State Management (Zustand)

### Store Structure

Create feature-based stores in `/lib/store/`:

```typescript
// lib/store/claude-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface Session {
  id: string
  title: string
  status: 'active' | 'paused' | 'terminated'
  createdAt: Date
}

interface ClaudeState {
  // State
  messages: Message[]
  currentSession: Session | null
  isStreaming: boolean

  // Actions
  addMessage: (message: Message) => void
  setCurrentSession: (session: Session) => void
  setStreaming: (streaming: boolean) => void
  clearMessages: () => void
}

export const useClaudeStore = create<ClaudeState>()(
  persist(
    (set) => ({
      // Initial state
      messages: [],
      currentSession: null,
      isStreaming: false,

      // Actions
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setCurrentSession: (session) => set({ currentSession: session }),

      setStreaming: (streaming) => set({ isStreaming: streaming }),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'claude-store', // localStorage key
      partialize: (state) => ({
        currentSession: state.currentSession,
        // Don't persist messages (too large)
      }),
    }
  )
)
```

### Using the Store

```typescript
'use client'

import { useClaudeStore } from '@/lib/store/claude-store'

export function ChatInterface() {
  const { messages, addMessage, isStreaming } = useClaudeStore()

  const handleSendMessage = (content: string) => {
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    })
  }

  return (
    <div>
      {/* Render messages */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isStreaming && <TypingIndicator />}

      <MessageInput onSend={handleSendMessage} />
    </div>
  )
}

// Selector for specific state (prevents re-renders)
function SessionTitle() {
  const title = useClaudeStore((state) => state.currentSession?.title)
  return <h1>{title || 'New Chat'}</h1>
}
```

---

## API Development

### API Route Structure

Use Next.js App Router API routes:

```typescript
// app/api/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: { type: 'UNAUTHORIZED', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  try {
    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: sessions })
  } catch (error) {
    return NextResponse.json(
      { error: { type: 'INTERNAL_ERROR', message: 'Failed to fetch sessions' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: { type: 'UNAUTHORIZED', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { title } = body

    if (!title?.trim()) {
      return NextResponse.json(
        { error: { type: 'VALIDATION_ERROR', message: 'Title is required' } },
        { status: 400 }
      )
    }

    const newSession = await prisma.session.create({
      data: {
        title: title.trim(),
        userId: session.user.id,
        status: 'active',
      },
    })

    return NextResponse.json({ success: true, data: newSession }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: { type: 'INTERNAL_ERROR', message: 'Failed to create session' } },
      { status: 500 }
    )
  }
}
```

### API Endpoint Conventions

- **REST**: Use plural resource names (`/api/sessions`, `/api/messages`)
- **Query Parameters**: camelCase (`?sessionId=abc123`)
- **Response Format**: Consistent structure

```typescript
// Success response
{
  "success": true,
  "data": { /* resource data */ }
}

// Error response
{
  "success": false,
  "error": {
    "type": "ERROR_TYPE",
    "message": "Human-readable error message",
    "details": {} // Optional
  }
}
```

---

## Testing Requirements

### Test File Placement

Co-locate tests with source files:

```
src/
├── components/
│   └── claude/
│       ├── MessageBubble.tsx
│       └── MessageBubble.test.tsx
├── lib/
│   └── store/
│       ├── claude-store.ts
│       └── claude-store.test.ts
```

### Unit Testing (Jest + React Testing Library)

```typescript
// components/claude/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react'
import { MessageBubble } from './MessageBubble'

describe('MessageBubble', () => {
  it('renders message content', () => {
    render(
      <MessageBubble
        message={{
          id: '1',
          role: 'user',
          content: 'Hello, world!',
          timestamp: new Date(),
        }}
      />
    )

    expect(screen.getByText('Hello, world!')).toBeInTheDocument()
  })

  it('applies correct styling for user messages', () => {
    const { container } = render(
      <MessageBubble
        message={{
          id: '1',
          role: 'user',
          content: 'Test',
          timestamp: new Date(),
        }}
      />
    )

    expect(container.firstChild).toHaveClass('bg-purple-500')
  })
})
```

### Testing Guidelines

1. **Test behavior, not implementation**: Test what the component does, not how it does it
2. **Use user-centric queries**: Prefer `getByRole` and `getByLabelText` over `getByTestId`
3. **Mock external dependencies**: Mock API calls, Claude SDK, database operations
4. **Coverage target**: Minimum 80% for new features

---

## Code Quality Tools

### ESLint

Run before committing:

```bash
npm run lint
```

Rules to follow:
- Next.js best practices (`eslint-config-next`)
- React hooks rules (`react-hooks/rules-of-hooks`)
- TypeScript strict rules (`@typescript-eslint/strict`)
- No unused variables

### TypeScript Compilation

Always verify TypeScript compiles:

```bash
npm run type-check
```

Should pass with zero errors.

### Code Formatting

Use Prettier (add to project if not present):

```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

---

## Git Workflow

### Commit Message Format

```
<type>: <subject>

<body>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Tests
- `chore`: Build/tooling

**Examples:**
```
feat: add session persistence to database

- Add Prisma Session model
- Implement session CRUD operations
- Add session history API endpoints

fix: resolve WebSocket reconnection issue

- Add exponential backoff for reconnection
- Improve error handling on connection loss
```

### Branch Naming

```
feature/story-3-4-session-persistence
fix/websocket-reconnection
refactor/claude-store-types
```

### Pull Request Checklist

- [ ] Code follows development standards
- [ ] TypeScript passes type-check
- [ ] ESLint passes with no errors
- [ ] Tests added and passing
- [ ] Test coverage >= 80%
- [ ] Story acceptance criteria met
- [ ] Dev Agent Record updated
- [ ] Code review workflow completed

---

## Pre-commit Hooks

### Required Checks

Before committing, ensure:

```bash
# 1. TypeScript compilation
npm run type-check

# 2. ESLint
npm run lint

# 3. Tests
npm test

# 4. Build (optional, for final checks)
npm run build
```

### Husky Setup (Recommended)

```bash
npm install --save-dev husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
npm run type-check && npm run lint
```

---

## Quick Reference

### Before Starting a Story:
1. Read the story file from `_bmad-output/implementation-artifacts/stories/`
2. Review linked architecture.md sections
3. Verify acceptance criteria are clear
4. Estimate effort and communicate to PM

### During Implementation:
1. Use TypeScript strict mode (no `any`)
2. Use `@/*` import aliases
3. Write tests alongside code
4. Run pre-commit checks before committing

### After Implementation:
1. Run `npm run type-check`
2. Run `npm run lint`
3. Update Dev Agent Record
4. Move story to `review` status
5. Run BMAD code-review workflow
6. Address feedback until passing

---

## Additional Resources

- **Project Context**: `/Users/archersado/workspace/mygit/AuraForce/_bmad-output/project-context.md`
- **Architecture**: `/Users/archersado/workspace/mygit/AuraForce/_bmad-output/architecture.md`
- **Epic Stories**: `/Users/archersado/workspace/mygit/AuraForce/_bmad-output/epics.md`
- **Sprint Plan**: `/Users/archersado/workspace/mygit/AuraForce/docs/team/sprint-1-plan.md`
- **Testing Guidelines**: `/Users/archersado/workspace/mygit/AuraForce/docs/team/testing-guidelines.md`
