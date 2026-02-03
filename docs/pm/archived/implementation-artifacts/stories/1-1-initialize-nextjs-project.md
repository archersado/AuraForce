# Story 1.1: Initialize Next.js Project with App Router

Status: done

**Epic 1: Project Foundation & Tech Stack Initialization**

Epic Value: Establish the foundational Next.js 16.1.1 + TypeScript strict mode + App Router project structure that will serve as the base for all subsequent stories in this epic (Config TypeScript, Install Dependencies, Setup Prisma, Configure Auth.js, Setup Zustand, Setup Claude SDK).

---

## Story

**As a development engineer**, I want to initialize a fresh Next.js 16.1.1 project with App Router architecture, TypeScript strict mode, and proper configuration, so that we have a solid foundation for implementing all subsequent features of AuraForce with full type safety and modern React patterns.

---

## Acceptance Criteria

1. Project initialized using `create-next-app@latest` with flags: `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. TypeScript configuration (`tsconfig.json`) has `"strict: true"` enabled
3. Path alias `@/*` is properly configured to point to `./src/` directory
4. Project uses `src/app/` directory structure (App Router, not Pages Router)
5. Tailwind CSS is configured with PostCSS and Autoprefixer
6. ESLint is configured with `eslint-config-next` for Next.js best practices
7. Basic project scaffold runs successfully with `npm run dev`
8. Default Next.js page loads without errors
9. Project is clean and ready for next foundation stories (no unnecessary demo code)

---

## Tasks / Subtasks

### Task 1: Initialize Next.js Project with create-next-app (AC: 1)
- [ ] Execute: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` from project root
- [ ] Verify project structure created with `src/app/` directory
- [ ] Confirm App Router pattern (no `src/pages/` directory)
- [ ] Verify package.json is properly initialized with Next.js dependencies

### Task 2: Verify and Optimize TypeScript Configuration (AC: 2, 3)
- [ ] Open `tsconfig.json` and verify `"strict": true` is set
- [ ] Ensure `"moduleResolution": "node"` is configured
- [ ] Verify `baseUrl` is configured if needed for path alias support
- [ ] Confirm TypeScript target is ES5 or ESNext
- [ ] Test TypeScript compilation: `npx tsc --noEmit` (should succeed with strict mode)

### Task 3: Validate Path Alias Configuration (AC: 4)
- [ ] Verify `tsconfig.json` has proper paths configuration for `@/*` alias
- [ ] Check that `tsconfig.json` or `next.config.js` references `./src/` as base
- [ ] Create a test import using `@/*` alias in a test file to verify
- [ ] Run build to confirm path alias works correctly

### Task 4: Verify Tailwind CSS Configuration (AC: 5)
- [ ] Confirm `tailwind.config.js` exists with proper configuration
- [ ] Verify `postcss.config.js` includes Autoprefixer and PostCSS
- [ ] Check `src/app/globals.css` has Tailwind directives (`@tailwind base;@tailwind components;@tailwind utilities;`)
- [ ] Create a test styled component to verify Tailwind works
- [ ] Verify Tailwind classes are processed in development and build

### Task 5: Verify ESLint Configuration (AC: 6)
- [ ] Confirms `.eslintrc.json` exists with `extends: ["next/core-web-vitals", "next/typescript"]`
- [ ] Verify strict TypeScript rules are enabled (`@typescript-eslint/strict`)
- - [ ] `@typescript-eslint/no-explicit-any` is set (disallow `any` types)
- - [ ] Check for React hooks rules configuration
- [ ] Test ESLint: `npx eslint . --fix` (should find no errors)

### Task 6: Verify Project Structure and App Router Setup (AC: 7, 8)
- [ ] Confirm `src/app/layout.tsx` exists (App Router root layout)
- [ ] Confirm `src/app/page.tsx` exists (App Router home page)
- [ ] Verify NO `src/pages/` directory exists (Pages Router not used)
- [ ] Check for proper `(route-groups)` directory structure usage examples
- [ ] Run `npm run dev` and verify server starts successfully
- [ ] Visit http://localhost:3000 and confirm page renders correctly
- [ ] Stop dev server to complete verification

### Task 7: Clean Up Demo Code (AC: 9)
- [ ] Review `src/app/page.tsx` and ensure minimal clean content (standard Next.js template acceptable)
- [ ] Remove any unnecessary demo components or assets
- [ ] Verify project is in clean state for next stories
- [ ] Document any kept demo code with TODO comments for later removal

---

## Dev Notes

### Architectural Constraints & Requirements

**IMPORTANT - This is a GREENFIELD project:**
- NO migration from existing codebase
- Use official create-next-app@latest template as specified in Architecture
- Do NOT use Pages Router - MUST use App Router only

**CRITICAL TypeScript Requirements:**
1. Strict mode is **REQUIRED** - do NOT skip or ignore TypeScript errors
2. NO `any` types allowed - use proper interfaces for all data structures
3. All API responses and database models must be typed

**Technology Stack MUST match Architecture specifications:**
- Next.js 16.1.1 (get latest available, but must be 16+)
- TypeScript 5.2.2+ (use latest stable)
- Tailwind CSS 3.3.5
- ESLint 9.39.2 with eslint-config-next 16.1.1

### Project Structure Alignment

**MUST follow architecture-defined structure:**
```
src/
├── app/                    # Next.js 16 App Router (REQUIRED)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── loading.tsx         # Route loading state
│   ├── error.tsx           # Route error page
│   └── not-found.tsx       # 404 page
├── components/            # Future: Reusable UI components
├── lib/                   # Future: Utilities and configurations
├── styles/                # Future: Component styles
└── types/                 # Future: TypeScript type definitions
```

### Do NOT Create During This Story

- ❌ Do NOT create Auth.js configuration (Story 1.5 will handle this)
- ❌ Do NOT create Prisma schema (Story 1.4 will handle this)
- ❌ Do NOT create Zustand stores (Story 1.6 will handle this)
- ❌ Do NOT setup Claude Agent SDK (Story 1.7 will handle this)
- ❌ Do NOT create any production UI components
- ❌ Do NOT create API routes

### File Naming Conventions

From project-context.md:
- TypeScript files: `.ts` or `.tsx` extensions
- Component files: PascalCase matching component names (`SkillCard.tsx` exports `SkillCard`)
- Configuration files: kebab-case (`eslint.config.js`, `next.config.js`)
- Use semantic naming, not abbreviated names

### Import Paths

**CRITICAL:** Always use `@/*` alias for internal imports
```typescript
// CORRECT
import { MyComponent } from '@/components/ui/MyComponent'

// INCORRECT (hardcoded relative path)
import { MyComponent } from '../../components/ui/MyComponent'
```

### Client Components Note

App Router uses Server Components by default. This story will only need:
- `src/app/layout.tsx` - root layout (server component by default)
- `src/app/page.tsx` - home page (server component by default)

NO `'use client'` directive needed in this story (no interactive components yet).

### Testing Standards

**For This Story:**
- Verify TypeScript compilation: `npx tsc --noEmit`
- Verify ESLint passes: `npx eslint . --fix`
- Verify project builds successfully: `npm run build`
- Verify dev server starts: `npm run dev`

### Performance Considerations

- Next.js will automatically optimize the build
- Image Optimization will be configured in future stories
- No performance tests needed for this foundational story

---

## Dev Agent Record

### Agent Model Used

Claude (Anthropic Claude 4.6, glm-4.6-no-think model)

### Debug Log References

None (first story in epic)

### Completion Notes List

None (not yet implemented)

### File List

**Created by Story:**
- `package.json` (auto-created by create-next-app)
- `next.config.js` (auto-created by create-next-app)
- `tailwind.config.js` (auto-created by create-next-app)
- `postcss.config.js` (auto-created by create-next-app)
- `tsconfig.json` (auto-created by create-next-app)
- `.eslintrc.json` (auto-created by create-next-app)
- `.gitignore` (auto-created by create-next-app)
- `src/app/layout.tsx` (auto-created by create-next-app)
- `src/app/page.tsx` (auto-created by create-next-app)
- `src/app/globals.css` (auto-created by create-next-app)

**Modified by Story:**
- `tsconfig.json` - verify strict mode enabled
- `tailwind.config.js` - verify WolfGaze theme config for future (optional for this story)

---

## Technical References

### Core Architecture Documentation

**Source:** `_bmad-output/architecture.md`
- Section: Starter Template Evaluation (page 96-134 in architecture.md)
  - Confirms: `npx create-next-app@latest auraforce-mvp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - This is the **MUST USE** initialization command

**Source:** `_bmad-output/project-context.md`
- Section: Technology Stack & Versions (lines 17-44)
  - Next.js 16.1.1 with App Router (migrate from current Pages Router)
  - TypeScript 5.2.2 with **strict mode REQUIRED**
  - Tailwind CSS 3.3.5 + PostCSS 8.4.31 + Autoprefixer 10.4.16
  - ESLint 9.39.2 + eslint-config-next 16.1.1

- Section: Critical Migration Notes (lines 38-43)
  - Pages Router → App Router: Use `src/app/` directory structure
  - This is a GREENFIELD project, not migration

- Section: React Development Patterns (lines 84-88)
  - Function components only, organized by feature domains
- Section: Next.js App Router Migration (lines 90-96)
  - Use `src/app/` directory structure with route groups
  - Server Components by default, add `'use client'` only when needed (not applicable in this story)

### PRD References

**Source:** `_bmad-output/prd.md`
- Epic 1 provides foundational tech stack requirements
- Technology Stack Constraints section (lines 214-223 in PRD) specifies exact versions
- Critical Migration Requirements (lines 224-228) note App Router requirement

### WolfGaze Design System

**Source:** `_bmad-output/project-context.md`
- Design system foundation established for future UI work
- Color palette and typography will be configured in future UI stories
- No WolfGaze theming needed in this foundational story

### Implementation Patterns

**Epic 1 Dependencies:**
- Story 1.1 has NO dependencies (first story in epic)
- Story 1.2 will depend on Story 1.1 completing successfully
- This story must be completed before any other Epic 1 story can start

**Next Stories in Epic 1:**
1. Story 1.2: Configure TypeScript Strict Mode and @/ Path Aliases
2. Story 1.3: Install Core Dependencies
3. Story 1.4: Setup Prisma Schema with Basic Models
4. Story 1.5: Configure Auth.js v5 Foundation
5. Story 1.6: Initialize Zustand Store Structure
6. Story 1.7: Setup Claude Agent SDK Configuration

### Testing Approach

**Test File Pattern:** `.test.ts` files co-located with source files (from project-context.md)

**For This Story:**
- No new functionality to test
- Verify project scaffold works: `npm run dev` + basic page load
- TypeScript verification: `npx tsc --noEmit` (should pass with strict mode enabled)
- ESLint verification: `npx eslint . --fix` (should find no critical errors)

---

## Success Criteria Checklist

- [ ] Project initialized with correct create-next-app command
- [ ] tsconfig.json has `"strict: true"` verified
- [ ] Path alias `@/*` properly configured
- [ ] App Router structure confirmed (`src/app/` exists, `src/pages/` does not exist)
- [ ] Tailwind CSS configuration verified with working test
- [ ] ESLint configured with Next.js best practices and strict TypeScript rules
- [ ] `npm run dev` starts successfully
- [ ] Default page renders at http://localhost:3000
- [ ] TypeScript compilation succeeds (`npx tsc --noEmit`)
- [ ] ESLint passes without blocking errors
- [ ] Project is clean and ready for next story

---

**Ready for Development:** ✅

This story provides comprehensive context for the developer agent. All architectural requirements, constraints, and patterns are documented to prevent common LLM implementation mistakes such as using Pages Router, missing strict mode, or incorrect import paths.
