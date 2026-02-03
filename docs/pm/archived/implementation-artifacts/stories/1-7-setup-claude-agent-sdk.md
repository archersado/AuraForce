# Story 1.7: Setup Claude Agent SDK Configuration

Status: done

**Epic 1: Project Foundation & Tech Stack Initialization**

Epic Value: Configure and implement Claude Agent SDK foundation including client initialization, session management, streaming response handling, and TypeScript type safety for AI-powered skill extraction functionality.

---

## Story

**As a development engineer**, I want to set up the Claude Agent SDK configuration with proper TypeScript types, session management, and streaming response patterns, so that the application has a production-ready AI integration foundation for skill extraction and workflow execution.

---

## Acceptance Criteria

1. Claude Agent SDK installed and verified in package.json
2. Claude client created in `src/lib/claude/client.ts` with TypeScript types
3. Session management implemented in `src/lib/claude/session-manager.ts`
4. Streaming response handler in `src/lib/claude/stream-handler.ts`
5. TypeScript type definitions for Claude SDK in `src/types/claude.ts`
6. Environment variables configured for Claude API key
7. Error handling patterns implemented for Claude SDK failures
8. Timeout configuration (30-second default) for all Claude calls
9. Mock patterns for testing (in development)
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Verify Claude Agent SDK Installation (AC: 1)
- [ ] Verify `@anthropic-ai/claude-agent-sdk` is in package.json
- [ ] Check version compatibility with Next.js 16
- [ ] Install if missing: `npm install @anthropic-ai/claude-agent-sdk`
- [ ] Confirm no `@anthropic-ai/sdk` conflicts

### Task 2: Create Claude Type Definitions (AC: 5)
- [ ] Create `src/types/claude.ts`
- [ ] Define `ClaudeMessage` interface
- [ ] Define `ClaudeResponse` interface
- [ ] Define `ClaudeStreamEvent` union type
- [ ] Define `ClaudeError` types
- [ ] Export all Claude-related types

### Task 3: Create Claude Client (AC: 2)
- [ ] Create `src/lib/claude/client.ts`
- [ ] Initialize Claude client with API key from env
- [ ] Configure default model parameters
- [ ] Implement `sendMessage` function
- [ ] Implement `startStream` function
- [ ] Add TypeScript typing

### Task 4: Create Session Manager (AC: 3)
- [ ] Create `src/lib/claude/session-manager.ts`
- [ ] Define `ClaudeSession` interface
- [ ] Implement session creation
- [ ] Implement session storage (in-memory with persistence)
- [ ] Implement session cleanup
- [ ] Add session list management

### Task 5: Create Stream Handler (AC: 4)
- [ ] Create `src/lib/claude/stream-handler.ts`
- [ ] Implement stream event parsing
- [ ] Implement text chunk accumulation
- [ ] Implement onChunk callback
- [ ] Implement onComplete callback
- [ ] Implement onError callback

### Task 6: Configure Environment Variables (AC: 6)
- [ ] Update `.env.example` with `ANTHROPIC_API_KEY`
- [ ] Update `.env.local` (if exists)
- [ ] Document environment variables in README
- [ ] Add API key validation

### Task 7: Implement Error Handling (AC: 7)
- [ ] Create `src/lib/claude/errors.ts`
- [ ] Define custom Claude error types
- [ ] Implement retry logic (max 3 attempts)
- [ ] Implement timeout handling (30 seconds)
- [ ] Implement user-friendly error messages

### Task 8: Create Mock Patterns for Testing (AC: 9)
- [ ] Create `src/lib/claude/mock-client.ts`
- [ ] Implement mock responses for common queries
- [ ] Add feature flag for mocking
- [ ] Document mock usage in development

### Task 9: Run Type Check (AC: 10)
- [ ] Run `npx tsc --noEmit` to verify TypeScript
- [ ] Fix any type errors
- [ ] All imports use `@/*` alias
- [ ] Ensure strict mode compliance

---

## Dev Notes

### Architectural Constraints & Requirements

**IMPORTANT - Claude SDK Migration:**
- MUST use `@anthropic-ai/claude-agent-sdk` (REPLACE `@anthropic-ai/sdk`)
- This is a CRITICAL migration from direct SDK to Agent SDK
- Patterns differ: session management, streaming, responses

**File Organization:**
```
src/
├── lib/
│   └── claude/
│       ├── client.ts              # Main Claude client
│       ├── session-manager.ts     # Session lifecycle
│       ├── stream-handler.ts      # Stream processing
│       ├── errors.ts              # Error types and handling
│       └── mock-client.ts         # Mock for development
├── types/
│   └── claude.ts                 # Claude type definitions
```

### TypeScript Requirements

**Claude Types Pattern:**
```typescript
export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
}

export interface ClaudeResponse {
  content: string
  model: string
  stopReason?: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

export type ClaudeStreamEvent =
  | { type: 'text-delta'; delta: string }
  | { type: 'done; finishReason: string }
  | { type: 'error'; error: unknown }
```

### Client Configuration

**Environment Variables:**
```env
# .env.local
ANTHROPIC_API_KEY=your_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

**Client Init:**
```typescript
import Anthropic from '@anthropic-ai/claude-agent-sdk'

export const claudeClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: false, // Server-side only
})
```

### Session Management Requirements

- Session ID generation using `crypto.randomUUID()`
- Session storage with TTL (24 hours default)
- Session metadata tracking (user, timestamp, message count)
- Graceful cleanup of expired sessions

### Stream Handler Requirements

**Stream Pattern:**
```typescript
export interface StreamCallbacks {
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: ClaudeError) => void
}

export async function* streamClaudeResponse(
  messages: ClaudeMessage[],
  callbacks: StreamCallbacks
): AsyncGenerator<string> {
  // Stream implementation
}
```

### Error Handling Requirements

**Retry Logic:**
- Max 3 retry attempts
- Exponential backoff (1s, 2s, 4s)
- Timeout after 30 seconds
- Specific error messages for common failures

**Error Types:**
- `ClaudeTimeoutError` - Request timeout
- `ClaudeRateLimitError` - Rate limit exceeded
- `ClaudeInvalidKeyError` - Invalid API key
- `ClaudeNetworkError` - Network failure

### Mock Patterns for Development

**Feature Flag:**
```typescript
const USE_MOCK_CLAUDE = process.env.NODE_ENV === 'development' &&
                         process.env.USE_MOCK_CLAUDE === 'true'
```

**Mock Responses:**
```typescript
export const mockResponses: Record<string, string> = {
  'skill-extraction-start': '好的，让我们开始...',
  'skill-extraction-continue': '请继续分享...',
}
```

### Integration with Existing Code

**Current State:**
- `@anthropic-ai/sdk 0.9.1` exists (to be replaced)
- Direct API calls in components (to be refactored to use client)

**Migration Goal:**
- Replace direct SDK usage with Agent SDK client
- Move API logic to `src/lib/claude/`
- Provide typed interfaces for components

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { claudeClient } from '@/lib/claude/client'
import type { ClaudeMessage } from '@/types/claude'

// INCORRECT
import Anthropic from '@anthropic-ai/claude-agent-sdk'
```

### Testing Standards

**Manual Testing Required:**
- Verify client initialization
- Test message sending (with real API or mock)
- Test streaming responses
- Verify session management
- Test error handling

**TypeScript Verification:**
- `npx tsc --noEmit` must pass with strict mode

---

## Technical References

### Source: `_bmad-output/architecture.md`
- Section: Claude Agent SDK Integration Architecture (lines 246-263)
- Session management patterns
- WebSocket communication requirements

### Source: `_bmad-output/project-context.md`
- Section: Technology Stack (line 26)
- Claude Agent SDK requirement

### Source: `_bmad-output/project-context.md`
- Section: Claude Agent SDK Integration (lines 112-123)
- SDK migration patterns and requirements

---

## Success Criteria Checklist

- [ ] Claude Agent SDK installed and verified
- [ ] All Claude library files created in `src/lib/claude/`
- [ ] TypeScript type definitions created
- [ ] Client initialized with API key
- [ ] Session management working
- [ ] Stream handler implemented
- [ ] Error handling with retry logic
- [ ] Timeout configuration (30s)
- [ ] Mock patterns for development
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Import paths use `@/*` alias

---

**Ready for Development:** ✅
