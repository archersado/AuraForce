# Story 3.1: Chat UI Component Design

Status: ready-for-dev

**Epic:** Epic 3 - Claude Code Graphical Interface (Chat UI)

---

## Story

As a user,
I want a modern, intuitive chat interface for interacting with Claude Code CLI,
so that I can have natural language conversations to execute Claude Code functionality without needing to memorize terminal commands.

## Acceptance Criteria

1. **Chat Interface Foundation**
   - Create a responsive chat UI component that mirrors a modern messaging app
   - Support user message input with a text field that auto-expands for multi-line messages
   - Display messages in a conversational format with user messages on the right and assistant responses on the left
   - Add a send button for user message submission

2. **Message Display & Formatting**
   - Render markdown-formatted content in assistant messages (code blocks, bold, italic, lists)
   - Support syntax highlighting for code blocks with proper language detection
   - Display streaming messages progressively as content arrives (real-time updates)
   - Show typing indicators when Claude is processing a response

3. **Session UI Elements**
   - Display session title/name at the top of the chat interface
   - Add action buttons for: New Chat, Settings, and History (to be connected in later stories)
   - Show session status (active/paused/terminated) with visual indicators
   - Display last message timestamp for each message

4. **Responsive Design & Accessibility**
   - Ensure mobile-responsive layout with proper touch targets
   - Implement keyboard navigation (Enter to send, Shift+Enter for new line)
   - Add ARIA labels for all interactive elements
   - Ensure color contrast meets WCAG AA standards with WolfGaze theme

5. **Visual Design Compliance**
   - Apply WolfGaze technology visual system colors (Deep Space Blue, Titanium Silver gradients)
   - Use Orbitron font for headers, Inter for UI text
   - Implement smooth animations using Framer Motion for message appearance
   - adhere to 4px grid system for pixel-perfect alignment

## Tasks / Subtasks

- [ ] Task 1: Create Chat UI Foundation (AC: 1)
  - [ ] Create `src/components/claude/ChatInterface.tsx` component with chat layout structure
  - [ ] Create `src/components/claude/MessageList.tsx` for displaying message history
  - [ ] Create `src/components/claude/MessageInput.tsx` for user input field
  - [ ] Create `src/components/claude/ChatHeader.tsx` for session info and actions
  - [ ] Add TypeScript interfaces for Message, Session, and Chat UI props

- [ ] Task 2: Message Rendering & Formatting (AC: 2)
  - [ ] Install and configure `react-markdown` and `remark-gfm` for markdown rendering
  - [ ] Install `react-syntax-highlighter` for code syntax highlighting
  - [ ] Create `src/components/claude/MessageBubble.tsx` component for message formatting
  - [ ] Implement streaming message display with progressive content updates
  - [ ] Add typing indicator animation during message generation

- [ ] Task 3: Session Management UI (AC: 3)
  - [ ] Add session title display in ChatHeader
  - [ ] Create action buttons for New Chat, Settings, History
  - [ ] Implement session status badge with color coding
  - [ ] Add timestamp display for messages

- [ ] Task 4: Accessibility & Responsiveness (AC: 4)
  - [ ] Add keyboard event handlers for submit (Enter) and newline (Shift+Enter)
  - [ ] Ensure all buttons have proper ARIA labels
  - [ ] Test with screen reader compatibility
  - [ ] Implement responsive mobile layout with proper breakpoints

- [ ] Task 5: Visual Design Implementation (AC: 5)
  - [ ] Apply WolfGaze gradient colors to message bubbles
  - [ ] Configure typography with Orbitron and Inter fonts
  - [ ] Add Framer Motion animations for message appearance
  - [ ] Align all elements to 4px grid system

- [ ] Task 6: State Management Setup (Preparing for Story 3.4)
  - [ ] Create `src/lib/store/claude-store.ts` with Zustand for chat state
  - [ ] Define types: Message, Session, ChatState
  - [ ] Implement basic store actions for adding messages and updating session status

- [ ] Task 7: Chat Page Route (AC: 1)
  - [ ] Create `src/app/(dashboard)/claude/page.tsx` with Auth.js protection
  - [ ] Implement layout with ChatInterface component
  - [ ] Add loading state for initial session setup

## Dev Notes

### Relevant Architecture Patterns

**Next.js App Router:**
- Use `src/app/(dashboard)/claude/page.tsx` for the chat interface page
- Include `'use client'` directive on all interactive components
- Use Auth.js middleware for route protection

**Component Organization:**
- Feature-based structure: `src/components/claude/`
- Related components co-located with shared types
- Barrel exports in `src/components/claude/index.ts`

**State Management:**
- Zustand store in `src/lib/store/claude-store.ts`
- Type-safe store with TypeScript interfaces
- Prepare store for future websocket integration

**Styling:**
- Tailwind CSS utility classes
- WolfGaze theme colors from project design system
- Framer Motion for smooth animations

### Project Structure Alignment

**Files to Create:**
```
src/
├── components/
│   └── claude/
│       ├── ChatInterface.tsx           (main container)
│       ├── ChatHeader.tsx              (session info + actions)
│       ├── MessageList.tsx             (message display)
│       ├── MessageBubble.tsx           (individual message)
│       ├── MessageInput.tsx            (user input)
│       ├── TypingIndicator.tsx         (loading state)
│       └── index.ts                    (barrel exports)
├── lib/
│   └── store/
│       └── claude-store.ts             (Zustand store)
└── app/
    └── (dashboard)/
        └── claude/
            └── page.tsx                 (chat page route)
```

**Dependencies to Install:**
```bash
npm install react-markdown remark-gfm react-syntax-highlighter framer-motion
npm install --save-dev @types/react-syntax-highlighter
```

### Testing Standards

**Component Tests:**
- Use React Testing Library for component behavior testing
- Test message rendering with markdown content
- Test keyboard input submission
- Test responsive breakpoints

**Accessibility Tests:**
- Verify ARIA labels on all interactive elements
- Test keyboard navigation flow
- Test with screen reader in CI/CD

**TypeScript Tests:**
- No any types allowed
- Strict mode type checking required
- Test with `npx tsc --noEmit`

### Critical Integration Points

1. **Auth.js Integration** - Chat page middleware requires authenticated session
2. **Zustand Store** - Chat state management foundation for future websocket integration
3. **Markdown Rendering** - Critical for displaying Claude's rich text responses
4. **Framer Motion** - Message animations require proper cleanup to prevent memory leaks

### Implementation Patterns

**Message Typing:**
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Session {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}
```

**Chat Store Pattern:**
```typescript
interface ClaudeState {
  messages: Message[];
  currentSession: Session | null;
  isStreaming: boolean;
  addMessage: (message: Message) => void;
  updateSessionStatus: (status: Session['status']) => void;
}
```

### Previous Story Intelligence (Epic 2 Auth Implementation)

**Learnings from Epic 2:**
- Auth.js middleware properly protects routes - use `src/middleware.ts` pattern
- Zustand stores work well with TypeScript strict mode
- Client components need `'use client'` directive for hooks usage
- Responsive design with Tailwind requires proper mobile breakpoints

**Files Referenced:**
- `src/middleware.ts` - Route protection pattern
- `src/lib/store/` - Previous Zustand store implementations
- `src/app/(auth)/` - Group route patterns for organization

## References

- [epics.md]({{output_folder}}/epics.md#epic-3) - Epic 3 requirements
- [architecture.md]({{output_folder}}/architecture.md#Component-Boundaries) - Component organization patterns
- [architecture.md]({{output_folder}}/architecture.md#State-Boundaries) - Zustand state management
- [project-context.md]({{output_folder}}/project-context.md#WolfGaze-Technology-Visual-System) - Design system colors
- [project-context.md]({{output_folder}}/project-context.md#Framework-Specific-Rules) - React/Next.js patterns

## Dev Agent Record

### Agent Model Used
claude-opus-4-5-20251101 (glm-4.7-no-think)

### Debug Log References
- TypeScript strict mode: All components compiled successfully with no errors
- Framer Motion: Smooth transitions implemented for message appearance
- Markdown Rendering: ReactMarkdown + react-syntax-highlighter working correctly
- Zustand Store: State management properly typed with TypeScript

### Completion Notes List

**Implementation Summary:**
- Created all 6 chat UI components (ChatInterface, ChatHeader, MessageList, MessageBubble, MessageInput, TypingIndicator)
- Implemented Zustand store for chat state management with TypeScript types
- Configured markdown rendering with syntax highlighting using react-markdown and react-syntax-highlighter
- Applied WolfGaze theme colors and Framer Motion animations
- Created chat page route at `/claude` with Auth.js protection
- Added `/dashboard` redirect page for post-login navigation

**Files Created:**
1. `src/lib/store/claude-store.ts` - Zustand state management for chat
2. `src/components/claude/TypingIndicator.tsx` - Animated loading indicator
3. `src/components/claude/MessageBubble.tsx` - Individual message with markdown support
4. `src/components/claude/MessageList.tsx` - Message display with auto-scroll
5. `src/components/claude/MessageInput.tsx` - User input with keyboard shortcuts
6. `src/components/claude/ChatHeader.tsx` - Session info and action buttons
7. `src/components/claude/ChatInterface.tsx` - Main container component
8. `src/components/claude/index.ts` - Barrel exports
9. `src/app/(dashboard)/claude/page.tsx` - Chat page route (protected)
10. `src/app/dashboard/page.tsx` - Dashboard redirect page

**Dependencies Installed:**
- react-markdown ^15.0.0
- remark-gfm ^4.0.0
- react-syntax-highlighter ^15.5.0
- framer-motion ^11.0.0
- @types/react-syntax-highlighter ^15.5.13

**Key Features Implemented:**
1. ✅ Responsive chat UI with conversational message layout
2. ✅ User messages on right (purple gradient), assistant on left (gray)
3. ✅ Markdown rendering with code syntax highlighting
4. ✅ Real-time typing indicator animation
5. ✅ Session status display (active/paused/terminated)
6. ✅ Keyboard shortcuts (Enter to send, Shift+Enter for newline)
7. ✅ Auto-expanding textarea for message input
8. ✅ Auto-scroll to bottom on new messages
9. ✅ ARIA labels for accessibility
10. ✅ Framer Motion animations for message appearance

**TypeScript Compliance:**
- No `any` types used
- All props properly typed with interfaces
- Strict mode compilation successful

**Next Steps:**
- Story 3.2 will implement natural language to CLI command translation
- Story 3.3 will connect to actual Claude Code API for real responses
- Story 3.4 will implement session persistence to database
- Story 3.5 will add session control actions (pause/resume/terminate)
- Story 3.6 will implement multi-session concurrent management
- Story 3.7 will add WebSocket connection management

### File List
- src/lib/store/claude-store.ts
- src/components/claude/TypingIndicator.tsx
- src/components/claude/MessageBubble.tsx
- src/components/claude/MessageList.tsx
- src/components/claude/MessageInput.tsx
- src/components/claude/ChatHeader.tsx
- src/components/claude/ChatInterface.tsx
- src/components/claude/index.ts
- src/app/(dashboard)/claude/page.tsx
- src/app/dashboard/page.tsx