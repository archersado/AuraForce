# Story 3.5: Session Control Actions (Start/Pause/Resume/Terminate)

Status: ready-for-dev

**Epic 3: Claude Code Graphical Interface**

Epic Value: Provide users with control over their Claude Code sessions, allowing them to pause ongoing responses, resume later, and terminate sessions as needed.

---

## Story

As a user,
I want to be able to pause, resume, and terminate my Claude Code conversations,
so that I can control when the AI responds and stop unwanted operations.

---

## Acceptance Criteria

1. **Session Control UI Elements**
   - Display control buttons (Pause/Resume/Terminate) in the chat interface when a session is active
   - Disable Start button when a session is already in progress
   - Show appropriate enabled/disabled states based on current session status

2. **Pause Functionality**
   - User can pause the current streaming response at any time
   - When paused, the stream stops sending data but maintains connection
   - Display visual indicator showing session is paused
   - Store the pause state in the session metadata

3. **Resume Functionality**
   - User can resume a paused session
   - When resumed, the stream continues from where it was paused
   - Clear visual pause indicator
   - Update session metadata to reflect resumed state

4. **Terminate Functionality**
   - User can terminate the current session at any time
   - Terminate stops the stream and closes the connection
   - Session status is updated to "terminated" in the database
   - User can start a new session after termination
   - Show confirmation dialog before terminating to prevent accidental stops

5. **Session Status Synchronization**
   - Session status (active/paused/terminated) is persisted to database
   - UI reflects current session status accurately
   - Session control buttons update state based on current status
   - Auto-save session state when status changes

---

## Tasks / Subtasks

### Task 1: Design Session Control UI Components (AC: 1)
- [ ] Create `SessionControlButtons.tsx` component with Pause/Resume/Terminate buttons
- [ ] Design button states (enabled/disabled/active/paused)
- [ ] Add icons from lucide-react for each control action
- [ ] Position controls in ChatHeader or near input area

### Task 2: Implement Session Status in Store (AC: 2, 3, 4, 5)
- [ ] Add `sessionControlState: 'idle' | 'streaming' | 'paused' | 'terminated'` to claude-store
- [ ] Add `pauseSession()` action to set paused state
- [ ] Add `resumeSession()` action to resume streaming
- [ ] Add `terminateSession()` action to terminate current session
- [ ] Persist control state changes to database via session service

### Task 3: Implement Pause Logic (AC: 2)
- [ ] Modify streamMessage in ChatInterface to check pause state
- [ ] Stop reading from stream when paused
- [ ] Store stream reader reference for resuming
- [ ] Update streamManager to handle paused state
- [ ] Add visual pause indicator in the UI

### Task 4: Implement Resume Logic (AC: 3)
- [ ] Resume reading from stored stream reader
- [ ] Clear paused visual indicator
- [ ] Continue stream processing
- [ ] Update session status in database

### Task 5: Implement Terminate Logic (AC: 4)
- [ ] Close stream reader and connection
- [ ] Clear current streaming message on termination
- [ ] Update session status to "terminated" in database
- [ ] Show confirmation dialog before terminating
- [ ] Reset session state to allow new session start

### Task 6: Update API for Session Status (AC: 5)
- [ ] Update `PUT /api/sessions/[id]` to support status changes
- [ ] Add validation for allowed status transitions
- [ ] Update session-service.ts with status management methods

### Task 7: Add Error Handling (AC: 2, 3, 4)
- [ ] Handle stream errors when pausing/resuming
- [ ] Show error message if pause/resume fails
- [ ] Gracefully handle termination errors
- [ ] Log all control actions for debugging

---

## Dev Notes

### Existing Implementation Context

**Story 3.4 Learnings:**
- Session persistence uses Zod type validation for session status: `'active' | 'completed' | 'aborted'`
- Need to add `'paused'` to allowed status values or use separate control state
- Session status is stored in `ClaudeConversation.status` field in database
- Auto-save is triggered 1 second after message completion via `triggerAutoSave()`

**Current Streaming Implementation:**
- Uses SSE (Server-Sent Events) via `/api/claude/stream` endpoint
- Stream managed by `streamManager.ts` with `StreamChunk` pattern
- `for await (const message of queryInstance)` loop processes SDK AsyncGenerator
- Frontend uses `response.body?.getReader()` to read stream
- `includePartialMessages: true` enables character-level updates

**Store Structure (from Story 3.4):**
```typescript
interface ClaudeState {
  // Session persistence state
  currentSession: Session | null;
  sessionsList: SessionDTO[];
  isLoadingSession: boolean;
  isSavingSession: boolean;
  saveError: string | null;
  isSessionPersisted: boolean; // Tracks if session is in database

  // Streaming state
  isStreaming: boolean;
  activeStreamId: string | null;

  // Actions needed for session control:
  pauseSession: () => void;
  resumeSession: () => void;
  terminateSession: () => void;
}
```

### Architecture Decisions

**Pause Implementation Strategy:**

Since we're using SSE (Server-Sent Events), true "pause" has limitations:
- SSE is one-way (server → client), can't stop server from pushing
- **Frontend Approach:** Stop reading from `reader.read()` when paused
- **Store reader reference** to resume later
- **Client-side buffering** of received chunks when paused

**Session Status Model Extension:**

Current `SessionStatus` type: `'active' | 'completed' | 'aborted'`

**Option A:** Add `'paused'` to database status
- Pros: Persisted across page refreshes
- Cons: Mixed concerns - pause is transient, status is persistent

**Option B:** Use separate control state
- Store `sessionControlState` in database metadata
- Keep `status` for final states (active/completed/aborted)
- **Recommended:** Use metadata for transient control state

**Option C:** In-memory only
- Pause state not persisted
- Session always shows as "active" on refresh
- Simplest but least feature-complete

**Decision:** Use **Option B** - store control state in `metadata` field

```typescript
// Extended Session metadata
interface SessionMetadata {
  controlState?: 'idle' | 'streaming' | 'paused' | 'terminated';
  pausedAt?: string; // ISO timestamp
  resumedAt?: string; // ISO timestamp
  terminatedAt?: string; // ISO timestamp
  terminatedReason?: 'user' | 'error' | 'timeout';
}

// Store state
interface ClaudeState {
  // New control state (transient, not persisted to status field)
  sessionControlState: 'idle' | 'streaming' | 'paused' | 'terminated';

  // Pause/resume actions
  pauseSession: () => void;
  resumeSession: () => void;
  terminateSession: (reason?: 'user') => void;
}
```

**Stream Manager Updates:**

The `StreamManager` needs to support pausing:

```typescript
export type StreamState = 'idle' | 'active' | 'paused' | 'completed' | 'error';

export const createStreamManager = (config: {
  onMessageUpdate: (message: Message) => void;
  onStreamError: (error: StreamError) => void;
  onConnectionStateChange: (state: ConnectionState) => void;
  onStreamStateChange?: (state: StreamState) => void; // NEW
}) => {
  let streamState: StreamState = 'idle';

  return {
    // ... existing methods
    pauseStream: () => { streamState = 'paused'; },
    resumeStream: () => { streamState = 'active'; },
    getStreamState: () => streamState,
  };
};
```

### Project Structure Notes

**Files to Create/Modify:**

```
src/
├── components/claude/
│   ├── SessionControlButtons.tsx      # NEW - Control UI
│   ├── TerminateDialog.tsx             # NEW - Confirmation dialog
│   └── ChatInterface.tsx               # UPDATE - Wire up controls
├── lib/
│   ├── store/
│   │   └── claude-store.ts             # UPDATE - Add control state/actions
│   └── claude/
│       └── stream-manager.ts           # UPDATE - Add pause/resume support
├── types/
│   └── session.ts                      # UPDATE - Add SessionMetadata type
└── app/api/
    └── sessions/
        └── [id]/
            └── route.ts                 # UPDATE - Support metadata update
```

### Technical Constraints

**SSE Limitations:**
- Cannot pause the server-side query execution
- Can only pause client-side stream consumption
- Server continues generating (wastes API quota)
- Consider this tradeoff for MVP

**WebSocket Alternative:**
- Story 3.7 will implement WebSocket (bidirectional)
- WebSocket can truly pause server execution
- For now, SSE with client-side pause is acceptable

**Memory Considerations:**
- Paused stream continues to push data
- Accumulated data should have reasonable limit (< 10MB)
- Consider dropping chunks if buffer grows too large

### Testing Standards

**Unit Tests:**
```typescript
describe('claude-store session control', () => {
  it('should pause streaming session', () => {
    const store = createClaudeStore();
    store.pauseSession();
    expect(store.sessionControlState).toBe('paused');
  });

  it('should resume paused session', () => {
    const store = createClaudeStore();
    store.pauseSession();
    store.resumeSession();
    expect(store.sessionControlState).toBe('streaming');
  });

  it('should terminate session', () => {
    const store = createClaudeStore();
    store.terminateSession();
    expect(store.sessionControlState).toBe('terminated');
    expect(store.currentSession).toBe(null);
  });
});
```

**Integration Tests:**
```typescript
describe('Session control integration', () => {
  it('should persist pause state to session metadata', async () => {
    // Test metadata update on pause
  });

  it('should update session status to terminated on terminate', async () => {
    // Test status change
  });
});
```

### Performance Considerations

- Pause response should be immediate (< 100ms)
- Resume should have minimal delay
- Terminate must close resources promptly
- Handle rapid toggle (pause → resume → pause) gracefully

### Security Considerations

- Termination requires user confirmation
- Session owner verification (already implemented in API)
- Control actions are authenticated

---

## Technical Requirements

### Dependencies

**New Dependencies:** None (use existing lucide-react icons)

**Existing Dependencies:**
- zustand v5.0.9 (store)
- lucide-react v0.2880 (icons: `Pause`, `Play`, `Square`, `X`)
- framer-motion v10.16.4 (animations for control buttons)

### TypeScript Types

```typescript
// src/types/session.ts - Add to existing types
export interface SessionMetadata {
  controlState?: 'idle' | 'streaming' | 'paused' | 'terminated';
  pausedAt?: string;
  resumedAt?: string;
  terminatedAt?: string;
  terminatedReason?: 'user' | 'error' | 'timeout';
  streamId?: string; // Track current stream
}

// src/lib/claude/types.ts - Stream manager types
export interface StreamManager {
  // ... existing methods
  pauseStream: () => void;
  resumeStream: () => void;
  getStreamState: () => StreamState;
}

export type StreamState = 'idle' | 'active' | 'paused' | 'completed' | 'error';
```

### API Updates

**PUT /api/sessions/[id]** - Support status and metadata update:

```typescript
// Request body extended
interface UpdateSessionRequest {
  title?: string;
  status?: 'active' | 'completed' | 'aborted';
  sessionId?: string;
  metadata?: SessionMetadata; // NEW
}
```

### Component Props

```typescript
// src/components/claude/SessionControlButtons.tsx
interface SessionControlButtonsProps {
  controlState: 'idle' | 'streaming' | 'paused' | 'terminated';
  isStreaming: boolean;
  onPause: () => void;
  onResume: () => void;
  onTerminate: () => void;
  disabled?: boolean;
}

// src/components/claude/TerminateDialog.tsx
interface TerminateDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

### Store Actions

```typescript
// src/lib/store/claude-store.ts - Add to existing store
interface ClaudeState {
  // ... existing state
  sessionControlState: 'idle' | 'streaming' | 'paused' | 'terminated';
}

interface ClaudeActions {
  // ... existing actions
  pauseSession: () => void;
  resumeSession: () => void;
  terminateSession: (reason?: 'user') => Promise<void>;
  setSessionControlState: (state: ClaudeState['sessionControlState']) => void;
}
```

---

## Architecture Compliance

### Follows Project Context Rules:

- ✅ TypeScript strict mode (all types properly defined)
- ✅ Use `@/` path alias for all imports
- ✅ Client components use `'use client'` directive
- ✅ Named imports over default imports
- ✅ Proper error handling with try-catch
- ✅ State management with Zustand

### Aligns with Epic 3 Requirements:

- ✅ FR43: 用户可以启动、暂停、恢复和终止Claude Code会话
- ✅ Uses established pattern from Story 3.4 for session persistence
- ✅ Consistent with SSE streaming implementation from Story 3.3

### Code Organization:

```typescript
// Use established patterns from Story 3.4
const { sessionControlState, pauseSession, resumeSession, terminateSession } = useClaudeStore();

// UI components in src/components/claude/ (consistent with other Claude UI)
// Store actions in src/lib/store/claude-store.ts (single source of truth)
// Types in src/types/session.ts (single type definition location)
```

---

## Dev Agent Record

### Agent Model Used

Claude (Anthropic Claude 4.7, glm-4.7-no-think model)

### Completion Notes List

Story 3.5 file created with comprehensive developer context. Key decisions:

1. **Pause Implementation:** Client-side stream consumption pause (SSE limitation)
2. **Control State Storage:** Use metadata field, not status field
3. **Session Status Types:** Extended with control state enum
4. **Stream Manager:** Will need pause/resume capability
5. **Confirmation Dialog:** Required for termination to prevent accidents

### File List

**Files to Create:**
- `src/components/claude/SessionControlButtons.tsx` - Control UI component
- `src/components/claude/TerminateDialog.tsx` - Confirmation dialog

**Files to Modify:**
- `src/lib/store/claude-store.ts` - Add session control state/actions
- `src/lib/claude/stream-manager.ts` - Add pause/resume support
- `src/types/session.ts` - Add SessionMetadata type
- `src/app/api/sessions/[id]/route.ts` - Support metadata update
- `src/lib/services/session-service.ts` - Metadata update methods
- `src/components/claude/ChatInterface.tsx` - Wire up controls

**Test Files:**
- `src/lib/store/__tests__/claude-store.control.test.ts` - Unit tests for control actions
- `src/components/claude/__tests__/SessionControlButtons.test.tsx` - Component tests

### Next Steps

1. Run `dev-story` workflow to implement this story
2. Test pause/resume functionality with streaming responses
3. Test termination with confirmation dialog
4. Verify session state persistence across page refreshes
5. Run `code-review` when complete

---

**Ready for Development:** ✅

This story provides everything needed to implement session control actions with clear technical decisions, architectural alignment, and implementation guidance.
