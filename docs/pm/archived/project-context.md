---
project_name: 'AuraForce'
user_name: 'Archersado'
date: '2025-12-29'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'critical_rules']
existing_patterns_found: 12
status: 'complete'
completed_at: '2025-12-29'
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Core Technologies:**
- **Frontend**: Next.js 16.1.1 with App Router (migrate from current Pages Router)
- **Language**: TypeScript 5.2.2 with **strict mode REQUIRED** (current config has strict: false)
- **Styling**: Tailwind CSS 3.3.5 + PostCSS 8.4.31 + Autoprefixer 10.4.16
- **Authentication**: Auth.js v5 with Prisma adapter (NEW - not currently implemented)
- **Database**: MySQL 8.0+ with Prisma ORM (NEW - not currently implemented)
- **State Management**: Zustand v5.0.9 (NEW - replace current ad-hoc patterns)
- **Claude Integration**: @anthropic-ai/claude-agent-sdk (REPLACE current @anthropic-ai/sdk 0.9.1)

**UI/Animation Stack:**
- Framer Motion 10.16.4 (existing animations patterns)
- Lucide React 0.288.0 (icon system)
- React 18.2.0 + React DOM 18.2.0

**Development Tools:**
- ESLint 9.39.2 + eslint-config-next 16.1.1
- Jest 29.7.0 (testing framework)
- TypeScript strict mode configuration REQUIRED

**Critical Migration Notes:**
- Pages Router → App Router: Use `src/app/` directory structure
- No auth → Auth.js v5: All protected routes need middleware
- No database → Prisma + MySQL: Use @@map() for snake_case tables
- Ad-hoc state → Zustand: Feature-based store organization
- Direct Anthropic SDK → Claude Agent SDK: Session management patterns change

## Critical Implementation Rules

### Language-Specific Rules

**TypeScript Configuration:**
- **CRITICAL**: Enable strict mode in tsconfig.json (`"strict": true`)
- **Path Mapping**: Always use `@/*` alias for internal imports (`import { Component } from '@/components/ui'`)
- **Target**: Compile to ES5 but use modern JavaScript features
- **Module Resolution**: Use `"moduleResolution": "node"` with ESNext modules

**Import/Export Patterns:**
- **Client Components**: Must include `'use client'` directive at top of file for interactive components
- **Named Imports**: Prefer named imports over default imports (`import { Component } from 'library'`)
- **Internal Imports**: Always use `@/` path alias for all internal module imports
- **Type Imports**: Use `import type { TypeName }` for type-only imports to optimize bundle size

**TypeScript Typing Rules:**
- **NO ANY TYPES**: Replace all `any` types with proper TypeScript interfaces
- **Interface vs Type**: Use `interface` for component props, `type` for unions/intersections
- **React Props**: Always type component props with explicit interfaces
- **Event Handlers**: Use React's built-in event types (`React.MouseEvent<HTMLButtonElement>`, `React.KeyboardEvent`)
- **Refs**: Use `useRef<HTMLElement>(null)` with proper null checking before access
- **Optional Chaining**: Use `?.` for potentially undefined properties

**Error Handling Patterns:**
- **API Errors**: Use consistent error response format: `{ error: { type, message, details? }, success: false }`
- **Try-Catch**: Wrap all async operations in try-catch blocks with proper error typing
- **Error Types**: Create specific error types instead of generic Error objects
- **Client Errors**: Use React Error Boundaries for component error handling

**Critical Migration from Current Code:**
- **Replace `any` types**: Current code has `extractedInfo?: any` - must be properly typed
- **Null Safety**: Add strict null checks throughout codebase
- **Error Typing**: Implement proper error types for Claude SDK integration
- **API Response Types**: Define interfaces for all API responses and database models

### Framework-Specific Rules

**React Development Patterns:**
- **Hooks Usage**: Use React 18+ patterns, prefer `useCallback` for event handlers in animations
- **Component Structure**: Function components only, organized by feature domains (`/skill/`, `/claude/`, `/auth/`)
- **State Management**: Zustand stores for global state, React state for component-local concerns
- **Performance Rules**: Use `React.memo` for expensive renders, `useMemo` for computed values in animation loops
- **Component Naming**: PascalCase files matching component names (`SkillCard.tsx` exports `SkillCard`)

**Next.js App Router Migration (CRITICAL):**
- **Directory Structure**: Migrate from `src/pages/` to `src/app/` with route groups
- **Server Components**: Use Server Components by default, add `'use client'` only when needed
- **Layouts**: Implement `layout.tsx` files for nested route layouts
- **Route Groups**: Use `(auth)` and `(dashboard)` route groups for organization
- **Metadata API**: Use Next.js 13+ metadata API for SEO instead of `<Head>`
- **Loading States**: Implement `loading.tsx` files for route-level loading states

**Framer Motion Animation Patterns:**
- **Motion Components**: Import from `framer-motion` as `import { motion } from 'framer-motion'`
- **Animation Variants**: Define reusable animation variants for skill cards and interfaces
- **Performance**: Use `layoutId` for shared element transitions between skill states
- **Gestures**: Implement hover and tap gestures for interactive skill elements
- **Responsive Animations**: Use `useMotionValue` and `useTransform` for scroll-based animations

**Authentication Integration (Auth.js v5):**
- **Middleware**: Implement `src/middleware.ts` for route protection
- **Session Management**: Use `getServerSession()` in Server Components
- **Client Session**: Use `useSession()` hook in Client Components
- **API Protection**: Protect all `/api/` routes with session validation
- **Redirect Patterns**: Use Next.js `redirect()` for auth-required routes

**Claude Agent SDK Integration (CRITICAL MIGRATION):**
- **SDK Import**: Replace `@anthropic-ai/sdk` with `@anthropic-ai/claude-agent-sdk`
- **Session Management**: Use Agent SDK session patterns for conversation state
- **WebSocket Integration**: Implement real-time streaming with Agent SDK WebSocket support
- **Error Handling**: Use Agent SDK error types for proper TypeScript integration
- **Context Management**: Leverage Agent SDK context features for skill extraction workflows

**State Management with Zustand:**
- **Store Organization**: Feature-based stores (`useClaudeStore`, `useSkillStore`, `useAuthStore`)
- **TypeScript Integration**: Type all store slices with interfaces
- **Persistence**: Use Zustand persist middleware for user preferences
- **DevTools**: Enable Zustand devtools in development
- **Async Actions**: Wrap async operations in store actions with proper error handling

**Performance Optimization Rules:**
- **Code Splitting**: Use dynamic imports for heavy components (`const SkillEditor = lazy(() => import('@/components/skill/SkillEditor'))`)
- **Image Optimization**: Use Next.js Image component for all images
- **Bundle Analysis**: Avoid importing entire libraries (`import { motion } from 'framer-motion'` not `import * as Motion`)
- **Memoization**: Memoize expensive computations in skill processing workflows

### Testing Rules

**Jest Testing Framework (v29.7.0):**
- **Configuration**: Use Next.js built-in Jest config with `jest.config.js` extending `next/jest`
- **Test Files**: Co-locate tests with source files using `.test.ts` and `.test.tsx` extensions
- **Test Environment**: Use `@testing-library/jest-dom` for DOM assertions
- **Mock Patterns**: Mock Claude Agent SDK calls for component testing

**React Testing Library Patterns:**
- **Component Testing**: Test behavior, not implementation details
- **User Interactions**: Use `user-event` library for realistic user interactions
- **Async Testing**: Use `waitFor()` for async state changes and Claude API responses
- **Screen Queries**: Prefer `screen.getByRole()` and `screen.getByLabelText()` over test IDs
- **Mock Components**: Mock heavy animation components in tests

**API Testing Patterns:**
- **Route Testing**: Test Next.js API routes with `@testing-library/react` and `msw`
- **Database Mocking**: Use Prisma mock client for database operations
- **Auth Testing**: Mock Auth.js sessions for protected route testing
- **Error Scenarios**: Test error handling for Claude SDK failures and network issues

**Integration Testing:**
- **E2E Testing**: Use Playwright for critical skill extraction workflows
- **Claude Integration**: Test real Claude Agent SDK integration in staging environment
- **Animation Testing**: Test Framer Motion animations with reduced motion preferences
- **Performance Testing**: Verify loading states and responsiveness requirements

**Test Organization:**
- **Test Structure**: Group tests by feature domain (`/skill/`, `/claude/`, `/auth/`)
- **Test Data**: Use factories for consistent test data generation
- **Setup Files**: Configure test environment in `jest.setup.js` with global mocks
- **Coverage**: Maintain >80% coverage for core business logic, lower for UI components

### Code Quality & Style Rules

**ESLint Configuration (v9.39.2):**
- **Config Base**: Extend `eslint-config-next` for Next.js best practices
- **TypeScript Rules**: Enable `@typescript-eslint/strict` ruleset for type safety
- **Import Rules**: Enforce consistent import ordering and `@/` path usage
- **React Rules**: Use `eslint-plugin-react-hooks` for hooks best practices
- **Custom Rules**: Disable `any` types, enforce explicit return types for functions

**Code Formatting Standards:**
- **Prettier Integration**: Use Prettier with ESLint for consistent formatting
- **Line Length**: 100 characters maximum for readability
- **Indentation**: 2 spaces for TypeScript/JSX, 4 spaces for JSON/config files
- **Semicolons**: Always use semicolons for statement termination
- **Quotes**: Single quotes for strings, double quotes for JSX attributes

**Naming Conventions (CRITICAL):**
- **Variables**: camelCase (`skillExtractorState`, `claudeSessionId`)
- **Functions**: camelCase with descriptive verbs (`extractSkillDNA`, `validateUserInput`)
- **Constants**: SCREAMING_SNAKE_CASE (`CLAUDE_API_TIMEOUT`, `MAX_SKILL_SIZE`)
- **Components**: PascalCase matching filename (`SkillCard.tsx`, `ClaudeInterface.tsx`)
- **Types/Interfaces**: PascalCase with descriptive names (`SkillExtractionResult`, `ClaudeSession`)
- **Files**: Kebab-case for utilities, PascalCase for components (`api-client.ts`, `SkillCard.tsx`)

**Code Organization Patterns:**
- **File Structure**: Group related functionality in feature-based directories
- **Export Patterns**: Use named exports primarily, default exports only for React components
- **Barrel Exports**: Create `index.ts` files for clean imports from feature directories
- **Comment Standards**: Use JSDoc for public APIs, inline comments for complex business logic
- **TODO Handling**: Prefix with ticket numbers and removal dates (`// TODO AURA-123: Remove after Auth.js migration`)

**Accessibility Requirements:**
- **ARIA Labels**: Required for all interactive elements and form inputs
- **Semantic HTML**: Use semantic elements (`<main>`, `<section>`, `<article>`) for structure
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Readers**: Test with screen readers for skill extraction workflows
- **Color Contrast**: Maintain WCAG AA standards for WolfGaze brand colors

**Performance Code Standards:**
- **Bundle Size**: Avoid large dependencies, prefer tree-shakeable imports
- **Memory Leaks**: Clean up event listeners and timers in useEffect cleanup
- **Render Optimization**: Avoid anonymous functions in JSX, use useCallback for stable references
- **Image Loading**: Always specify width/height for Next.js Image components
- **API Optimization**: Implement request debouncing for user input handling

### Development Workflow Rules

**Git Workflow Patterns:**
- **Branch Naming**: Feature branches use format `feature/AURA-123-skill-extraction-ui`
- **Commit Messages**: Follow conventional commits: `feat(skill): add Claude Agent SDK integration`
- **Pull Requests**: Require code review for all changes to main branch
- **Merge Strategy**: Use squash merging to maintain clean history
- **Release Tagging**: Tag releases with semantic versioning (`v1.0.0`, `v1.1.0`)

**Development Environment Setup:**
- **Node.js Version**: Use Node.js 18+ with npm 9+ for consistent dependency resolution
- **Environment Variables**: Use `.env.local` for local overrides, never commit secrets
- **Database**: Run MySQL 8.0+ locally or use Docker Compose for development
- **Claude SDK**: Configure development API keys for Claude Agent SDK testing
- **Hot Reload**: Enable Next.js Turbopack for faster development builds

**Dependency Management:**
- **Package Updates**: Use exact versions for critical dependencies, ranges for dev tools
- **Security Audits**: Run `npm audit` regularly and fix high-severity vulnerabilities
- **Bundle Analysis**: Use `@next/bundle-analyzer` to monitor bundle size changes
- **Peer Dependencies**: Install required peer dependencies for Claude Agent SDK
- **Lock Files**: Always commit `package-lock.json` for reproducible builds

**Build & Deployment Process:**
- **Build Verification**: Ensure TypeScript compiles without errors before deployment
- **Environment Config**: Use different `.env` files for staging/production environments
- **Database Migrations**: Run Prisma migrations as part of deployment process
- **Health Checks**: Implement `/api/health` endpoint for deployment verification
- **Rollback Strategy**: Maintain ability to rollback to previous version quickly

**Code Review Guidelines:**
- **PR Size**: Keep pull requests focused and under 400 lines when possible
- **Review Checklist**: Verify TypeScript types, test coverage, and accessibility
- **Claude Integration**: Test Claude Agent SDK changes thoroughly in staging
- **Performance Review**: Check for memory leaks and render optimization issues
- **Security Review**: Validate authentication and authorization changes

### Critical Don't-Miss Rules

**🚨 BREAKING CHANGES TO AVOID:**
- **NEVER USE `any` TYPES**: Will break TypeScript strict mode migration - always define proper interfaces
- **NEVER IMPORT @anthropic-ai/sdk**: Must use @anthropic-ai/claude-agent-sdk for all Claude integrations
- **NEVER CREATE Pages Router FILES**: Must use App Router structure (`src/app/` not `src/pages/`)
- **NEVER SKIP 'use client' DIRECTIVE**: Required for all interactive React components with hooks/state
- **NEVER COMMIT SECRETS**: API keys and database credentials must use environment variables only

**💥 ARCHITECTURE VIOLATIONS:**
- **Database Schema**: ALWAYS use Prisma `@@map()` for snake_case table mapping - required for MySQL
- **Authentication**: ALL protected routes must implement Auth.js v5 middleware protection
- **State Management**: NEVER use React Context for global state - use Zustand stores exclusively
- **Import Paths**: ALWAYS use `@/` alias for internal imports - hardcoded relative paths forbidden
- **Error Handling**: MUST implement proper error boundaries and try-catch for all Claude SDK calls

**🔐 SECURITY REQUIREMENTS:**
- **Session Management**: Validate user sessions on every API route and protect all `/api/` endpoints
- **SQL Injection**: Use Prisma parameterized queries exclusively - never concatenate SQL strings
- **XSS Protection**: Sanitize all user inputs before rendering - especially skill content from Claude
- **CORS Configuration**: Restrict API access to known domains only in production environment
- **File Upload Security**: Validate all file uploads and restrict allowed file types for skills

**⚡ PERFORMANCE CRITICAL:**
- **Claude SDK Timeout**: MUST implement 30-second timeouts for all Claude Agent SDK calls
- **Memory Management**: Clean up WebSocket connections and event listeners in component unmount
- **Bundle Size Limits**: Keep individual route bundles under 500KB for performance requirements
- **Image Optimization**: Use Next.js Image component with proper sizing for all skill previews
- **Database Connections**: Pool database connections and implement connection timeouts

**🎯 USER EXPERIENCE BLOCKERS:**
- **Loading States**: MUST show loading indicators for all Claude API calls (>2 second rule)
- **Error Messages**: Provide user-friendly error messages for Claude SDK failures and network issues
- **Accessibility**: All interactive elements must be keyboard navigable and screen reader compatible
- **Mobile Responsiveness**: Test all skill extraction flows on mobile devices (WolfGaze brand requirement)
- **Animation Performance**: Use Framer Motion `layoutId` for shared element transitions in skill workflows

**🔄 MIGRATION SAFETY:**
- **Backward Compatibility**: Maintain existing skill data format during Claude SDK migration
- **Database Migrations**: Test all Prisma migrations on sample data before applying to production
- **Feature Flags**: Use environment variables to control rollout of new Claude Agent SDK features
- **Rollback Plan**: Ensure ability to revert to previous @anthropic-ai/sdk if issues arise
- **Data Validation**: Validate all existing skill data conforms to new TypeScript strict interfaces

---

**✅ PROJECT CONTEXT COMPLETE**

_This document must be referenced by all AI agents implementing code in AuraForce. Update this file when architectural decisions change._