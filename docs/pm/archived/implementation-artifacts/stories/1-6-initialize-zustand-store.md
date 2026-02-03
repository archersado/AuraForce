# Story 1.6: Initialize Zustand Store Structure

Status: done

**Epic 1: Project Foundation & Tech Stack Initialization**

Epic Value: Establish the Zustand v5.0.9 state management foundation with feature-based store organization, TypeScript type safety, and middleware support for persistence, devtools, and atomic updates.

---

## Story

**As a development engineer**, I want to initialize a well-structured Zustand v5.0.9 store architecture with feature-based organization, TypeScript type safety, and production-ready middleware, so that the application has a scalable state management foundation for skill extraction, UI state, user sessions, and workflow execution.

---

## Acceptance Criteria

1. Store directory structure created at `src/stores/` with feature-based organization
2. Zustand v5.0.9 imported and verified in package.json
3. Base store type definitions created with TypeScript strict mode
4. Middleware configured: `zustand/middleware` for devtools and persistence
5. Feature stores created:
   - `useSkillStore` - Skill extraction process state
   - `useSessionStore` - User session and authentication state
   - `useUIStore` - UI component state (modals, loading, navigation)
   - `useWorkflowStore` - Claude workflow execution state
6. Each store has proper TypeScript interfaces and action types
7. DevTools middleware configured for development environment
8. Persistence middleware configured for state hydration (optional)
9. All stores exported from central `src/stores/index.ts`
10. Type check passes: `npx tsc --noEmit`

---

## Tasks / Subtasks

### Task 1: Create Store Directory Structure (AC: 1)
- [ ] Create `src/stores/` directory
- [ ] Create `src/stores/types.ts` for shared type definitions
- [ ] Create `src/stores/index.ts` for centralized exports
- [ ] Create feature subdirectories: `src/stores/skill/`, `src/stores/session/`, `src/stores/ui/`, `src/stores/workflow/`
- [ ] Verify directory structure matches architecture specs

### Task 2: Create Base Store Types (AC: 3)
- [ ] Define `StoreState<T>` generic type in `src/stores/types.ts`
- [ ] Define `StoreActions<T>` for action typing
- [ ] Define `StoreSlice` type for composing slices
- [ ] Export all type definitions

### Task 3: Create UseSkillStore (AC: 5)
- [ ] Create `src/stores/skill/useSkillStore.ts`
- [ ] Define `SkillState` interface (extractedSkills, extractionProgress, currentStage)
- [ ] Define `SkillActions` (addSkill, updateSkill, resetSkills, setProgress, setStage)
- [ ] Implement Zustand store with devtools middleware
- [ ] Add TypeScript typing for state and actions
- [ ] Export individual selectors for performance optimization

### Task 4: Create UseSessionStore (AC: 5)
- [ ] Create `src/stores/session/useSessionStore.ts`
- [ ] Define `SessionState` interface (user, isAuthenticated, sessionData)
- [ ] Define `SessionActions` (login, logout, updateUser, setSessionData)
- [ ] Implement Zustand store with persistent middleware
- [ ] Add TypeScript typing for state and actions
- [ ] Export individual selectors

### Task 5: Create UseUIStore (AC: 5)
- [ ] Create `src/stores/ui/useUIStore.ts`
- [ ] Define `UIState` interface (activeModal, isLoading, navOpen, theme)
- [ ] Define `UIActions` (openModal, closeModal, setLoading, toggleNav, setTheme)
- [ ] Implement Zustand store with devtools middleware
- [ ] Add TypeScript typing for state and actions
- [ ] Export individual selectors

### Task 6: Create UseWorkflowStore (AC: 5)
- [ ] Create `src/stores/workflow/useWorkflowStore.ts`
- [ ] Define `WorkflowState` interface (activeWorkflows, workflowHistory, executionStatus)
- [ ] Define `WorkflowActions` (startWorkflow, pauseWorkflow, resumeWorkflow, terminateWorkflow)
- [ ] Implement Zustand store with devtools middleware
- [ ] Add TypeScript typing for state and actions
- [ ] Export individual selectors

### Task 7: Configure Middleware (AC: 4, 7, 8)
- [ ] Configure devtools middleware for all stores
- [ ] Set devtools enabled only in development
- [ ] Configure persistence middleware for useSessionStore
- [ ] Set storage key names for persisted stores
- [ ] Test middleware functionality

### Task 8: Create Central Export Module (AC: 9)
- [ ] Update `src/stores/index.ts` with all store exports
- [ ] Export all stores as named exports
- [ ] Export type definitions
- [ ] Verify import paths work from components

### Task 9: Run Type Check (AC: 10)
- [ ] Run `npx tsc --noEmit` to verify TypeScript
- [ ] Fix any type errors
- [ ] All imports use `@/*` alias
- [ ] Ensure strict mode compliance

---

## Dev Notes

### Architectural Constraints & Requirements

**Zustand v5.0.9 Specifications:**
- Version: 5.0.9 (1KB bundle size)
- TypeScript: Built-in type definitions, strict mode compatible
- Middleware: Support for devtools, persistence, immer (optional)

**File Organization Pattern:**
```
src/stores/
├── types.ts                    # Shared type definitions
├── index.ts                    # Central exports
├── skill/
│   └── useSkillStore.ts       # Skill extraction state
├── session/
│   └── useSessionStore.ts     # User session state
├── ui/
│   └── useUIStore.ts          # UI component state
└── workflow/
    └── useWorkflowStore.ts    # Workflow execution state
```

### TypeScript Requirements

**Strict Mode Compliance:**
- All state properties must be typed (no `any`)
- Actions must have explicit parameter types
- Use generic types for reusable patterns
- Export state and action types for external usage

**State Type Pattern:**
```typescript
interface SkillState {
  extractedSkills: ExtractedSkill[]
  extractionProgress: number
  currentStage: StageType
  sessionId: string | null
}

interface SkillActions {
  addSkill: (skill: ExtractedSkill) => void
  updateSkill: (id: string, updates: Partial<ExtractedSkill>) => void
  resetSkills: () => void
  setProgress: (progress: number) => void
  setStage: (stage: StageType) => void
}

type SkillStore = SkillState & SkillActions
```

### Middleware Configuration

**DevTools Middleware:**
```typescript
import { devtools } from 'zustand/middleware'

export const useSkillStore = create<SkillStore>()(
  devtools(
    (set) => ({
      // state and actions
    }),
    { name: 'SkillStore' }
  )
)
```

**Persistence Middleware:**
```typescript
import { persist } from 'zustand/middleware'

export const useSessionStore = create<SessionStore>()(
  persist(
    devtools(
      (set) => ({
        // state and actions
      }),
      { name: 'SessionStore' }
    ),
    { name: 'auraforce-session' }
  )
)
```

### Import Paths

**CRITICAL:** Always use `@/` alias for internal imports
```typescript
// CORRECT
import { useSkillStore } from '@/stores/skill/useSkillStore'

// INCORRECT
import { useSkillStore } from '../../../stores/skill/useSkillStore'
```

### Selector Pattern

For performance optimization, export individual selectors:
```typescript
export const useExtractedSkills = () => useSkillStore((state) => state.extractedSkills)
export const useExtractionProgress = () => useSkillStore((state) => state.extractionProgress)
export const useAddSkill = () => useSkillStore((state) => state.addSkill)
```

### Integration with Existing Code

**Current Ad-hoc State:**
- Component-level useState in skill-builder page
- No global state management

**Zustand Migration Goal:**
- Replace component-level useState with stores
- Enable cross-component state sharing
- Provide central state location for debugging

### Testing Standards

**Manual Testing Required:**
- Verify stores can be imported in components
- Test state updates trigger re-renders
- Verify devtools shows state changes
- Check persistence works (for session store)

**TypeScript Verification:**
- `npx tsc --noEmit` must pass with strict mode

---

## Technical References

### Source: `_bmad-output/architecture.md`
- Section: Frontend Architecture - State Management (lines 256-263)
- Zustand v5.0.9 specifications
- Feature-based store organization pattern

### Source: `_bmad-output/project-context.md`
- Section: Technology Stack (line 25)
- Zustand v5.0.9 confirmation

### Source: `_bmad-output/epics.md`
- Section: Technology Stack (line 149)
- Zustand v5.0.9 requirement

---

## Success Criteria Checklist

- [ ] `src/stores/` directory created with proper structure
- [ ] All 4 feature stores implemented (skill, session, ui, workflow)
- [ ] DevTools middleware configured for all stores
- [ ] Persistence middleware configured for session store
- [ ] TypeScript strict mode compliance verified
- [ ] All exports available from `src/stores/index.ts`
- [ ] Import paths use `@/*` alias
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Store files follow naming conventions (PascalCase for types, camelCase for functions)

---

**Ready for Development:** ✅
