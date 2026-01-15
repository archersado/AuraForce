# Testing Guidelines for AuraForce

**Project**: AuraForce
**Version**: 1.0
**Last Updated**: 2026-01-07
**Target Audience**: Testing Engineers

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Testing Tools](#testing-tools)
3. [Unit Testing (Jest)](#unit-testing-jest)
4. [Integration Testing](#integration-testing)
5. [E2E Testing (Playwright)](#e2e-testing-playwright)
6. [Test Coverage](#test-coverage)
7. [Test Planning](#test-planning)
8. [Bug Reporting](#bug-reporting)
9. [Quality Metrics](#quality-metrics)
10. [Testing Workflow](#testing-workflow)

---

## Testing Overview

### Testing Pyramid

```
       E2E Tests
      (User Flows)
     ___________
    /           \
   / Integration \
  /_______________\
 |   Unit Tests    |
 | (Components)    |
 |_________________|
```

- **Unit Tests (70%)**: Individual component and function logic
- **Integration Tests (20%)**: API routes, database operations, component interactions
- **E2E Tests (10%)**: Critical user flows and journeys

### Coverage Targets

| Metric | Target |
|--------|--------|
| Overall Coverage | ≥ 80% |
| Statement Coverage | ≥ 80% |
| Branch Coverage | ≥ 70% |
| Function Coverage | ≥ 70% |
| Line Coverage | ≥ 80% |

---

## Testing Tools

### Installed in Project

```json
{
  "jest": "^29.7.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^6.1.4"
}
```

### Not Yet Installed (Add When Needed)

```bash
npm install -D @playwright/test
npm install -D @types/jest # Already installed
npm install -D ts-jest
npm install -D @testing-library/user-event
npm install -D msw # Mock Service Worker for API mocking
```

### Configuration Files

- **Unit Tests**: `jest.config.js`, `jest.setup.js`
- **E2E Tests**: `playwright.config.ts`
- **Test Utilities**: `src/lib/test-utils.ts`

---

## Unit Testing (Jest)

### Test File Placement

Co-locate tests with source files:

```
src/components/claude/
├── MessageBubble.tsx
├── MessageBubble.test.tsx  # Unit tests

src/lib/store/
├── claude-store.ts
├── claude-store.test.ts    # Unit tests
```

### Component Testing Examples

```typescript
// components/claude/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react'
import { MessageBubble } from './MessageBubble'

describe('MessageBubble', () => {
  const mockMessage = {
    id: '1',
    role: 'user' as const,
    content: 'Hello, world!',
    timestamp: new Date('2024-01-01T10:00:00Z'),
  }

  it('renders message content', () => {
    render(<MessageBubble message={mockMessage} />)

    expect(screen.getByText('Hello, world!')).toBeInTheDocument()
  })

  it('applies correct styling for user messages', () => {
    const { container } = render(<MessageBubble message={mockMessage} />)

    expect(container.firstChild).toHaveClass('bg-purple-600')
  })

  it('applies correct styling for assistant messages', () => {
    const assistantMessage = { ...mockMessage, role: 'assistant' as const }
    const { container } = render(<MessageBubble message={assistantMessage} />)

    expect(container.firstChild).toHaveClass('bg-gray-700')
  })

  it('displays timestamp', () => {
    render(<MessageBubble message={mockMessage} />)

    expect(screen.getByText(/10:00/)).toBeInTheDocument()
  })
})
```

### Hook Testing Examples

```typescript
// hooks/useClaudeStore.test.ts
import { renderHook, act } from '@testing-library/react'
import { useClaudeStore } from '@/lib/store/claude-store'

describe('useClaudeStore', () => {
  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useClaudeStore())

    expect(result.current.messages).toEqual([])
  })

  it('adds a message', () => {
    const { result } = renderHook(() => useClaudeStore())

    act(() => {
      result.current.addMessage({
        id: '1',
        role: 'user',
        content: 'Test',
        timestamp: new Date(),
      })
    })

    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].content).toBe('Test')
  })

  it('clears messages', () => {
    const { result } = renderHook(() => useClaudeStore())

    act(() => {
      result.current.addMessage({
        id: '1',
        role: 'user',
        content: 'Test',
        timestamp: new Date(),
      })
    })

    act(() => {
      result.current.clearMessages()
    })

    expect(result.current.messages).toEqual([])
  })
})
```

### Utility Testing Examples

```typescript
// utils/formatDate.test.ts
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    expect(formatDate(date)).toBe('Jan 15, 2024 10:30 AM')
  })

  it('handles timezone correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    const formatted = formatDate(date)
    expect(formatted).toMatch(/Jan 15, 2024/)
  })
})
```

---

## Integration Testing

### API Route Testing

```typescript
// app/api/sessions/route.test.ts
import { GET, POST } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Mock prisma
jest.mock('@/lib/db/prisma')

describe('/api/sessions', () => {
  describe('GET', () => {
    it('returns sessions for authenticated user', async () => {
      const mockSessions = [
        { id: '1', title: 'Session 1', status: 'active' },
      ]

      ;(prisma.session.findMany as jest.Mock).mockResolvedValue(mockSessions)

      const request = new NextRequest('http://localhost:3000/api/sessions')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toEqual(mockSessions)
    })

    it('returns 401 for unauthenticated user', async () => {
      // Mock unauthenticated session
      const request = new NextRequest('http://localhost:3000/api/sessions')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(401)
      expect(json.success).toBe(false)
      expect(json.error.type).toBe('UNAUTHORIZED')
    })
  })

  describe('POST', () => {
    it('creates a new session', async () => {
      const newSession = { id: '1', title: 'New Session', status: 'active' }

      ;(prisma.session.create as jest.Mock).mockResolvedValue(newSession)

      const request = new NextRequest('http://localhost:3000/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Session' }),
      })
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data).toEqual(newSession)
    })
  })
})
```

### Component Integration Testing

```typescript
// components/claude/ChatInterface.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatInterface } from './ChatInterface'
import { useClaudeStore } from '@/lib/store/claude-store'

// Mock the store
jest.mock('@/lib/store/claude-store')

describe('ChatInterface integration', () => {
  it('sends message and displays it', async () => {
    const mockAddMessage = jest.fn()
    ;(useClaudeStore as jest.Mock).mockReturnValue({
      messages: [],
      addMessage: mockAddMessage,
      isStreaming: false,
    })

    render(<ChatInterface sessionId="test-session" />)

    const input = screen.getByPlaceholderText(/type a message/i)
    const sendButton = screen.getByRole('button', { name: /send/i })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user',
          content: 'Hello',
        })
      )
    })
  })
})
```

---

## E2E Testing (Playwright)

### Test File Structure

```
e2e/
├── auth.spec.ts          # Authentication flows
├── chat.spec.ts          # Chat interface flows
├── sessions.spec.ts      # Session management flows
└── fixtures/
    └── testData.ts       # Test data helpers
```

### E2E Test Examples

```typescript
// e2e/chat.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('sends a message and receives response', async ({ page }) => {
    await page.goto('/claude')

    // Send a message
    await page.fill('input[role="textbox"]', 'Hello, Claude!')
    await page.click('button:has-text("Send")')

    // Wait for message to appear
    await expect(page.locator('[data-testid="message-user"]')).toContainText('Hello, Claude!')

    // Wait for response
    await expect(page.locator('[data-testid="message-assistant"]')).toBeVisible({ timeout: 10000 })
  })

  test('displays typing indicator', async ({ page }) => {
    await page.goto('/claude')

    await page.fill('input[role="textbox"]', 'Test message')
    await page.click('button:has-text("Send")')

    // Check typing indicator
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible()

    // Wait for indicator to disappear
    await expect(page.locator('[data-testid="typing-indicator"]')).not.toBeVisible({ timeout: 10000 })
  })

  test('switches between sessions', async ({ page }) => {
    await page.goto('/claude')

    // Create first session
    await page.click('[data-testid="new-session-button"]')

    // Create second session
    await page.click('[data-testid="new-session-button"]')

    // Switch to first session
    await page.click('[data-testid="session-1"]')

    // Verify correct session is active
    await expect(page.locator('[data-testid="session-1"]')).toHaveClass(/active/)
  })
})
```

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await page.waitForURL('/dashboard')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('user cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/invalid/i)
  })

  test('user can logout', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Logout
    await page.click('[data-testid="logout-button"]')

    // Should redirect to login
    await page.waitForURL('/login')
  })
})
```

---

## Test Coverage

### Running Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Coverage Report Interpretation

**Lines Coverage**: Percentage of executable lines covered
**Branches Coverage**: Percentage of conditional branches covered
**Functions Coverage**: Percentage of functions/methods covered
**Statements Coverage**: Percentage of statements covered

### Improving Coverage

1. **Identify uncovered code**:
   - Review coverage report
   - Focus on critical business logic
   - Prioritize high-risk code paths

2. **Add tests**:
   - Write tests for uncovered functions
   - Add boundary/edge case tests
   - Test error handling paths

3. **Verify coverage**:
   - Re-run tests with coverage
   - Confirm improvements
   - Document untestable code if any

---

## Test Planning

### Test Plan Template

```markdown
## Test Plan for Story [X.Y]

### Scope
- [Story description and features under test]

### Acceptance Criteria Mapping
| AC # | Description | Test Case | Status |
|------|-------------|----------|--------|
| 1 | [AC description] | TC-001 | Pass/Fail |
| 2 | [AC description] | TC-002 | Pass/Fail |
| ... | ... | ... | ... |

### Test Types
- **Functional Tests**:
  - [Test 1]
  - [Test 2]

- **Integration Tests**:
  - [Test 1]
  - [Test 2]

- **E2E Tests**:
  - [Test 1]
  - [Test 2]

### Test Environment
- Database: [Describe setup]
- Test Data: [Describe fixtures]
- Dependencies: [Describe mocks]

### Test Cases

#### TC-001: [Test Case Name]
**Description**: [What this test validates]
**Preconditions**: [State before test]
**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]
**Actual Result**: [Leave blank during planning]

### Test Results
- Test Coverage: [Percentage]
- Pass Rate: [Percentage]
- Issues Found: [List with severity]

### Recommendation
[Pass/Fail recommendation]
```

### Test Case Naming Convention

```
[Feature]_[What is tested]_[ExpectedBehavior]

Examples:
- MessageBubble_RendersContent_Correctly
- MessageBubble_UserMessage_HasPurpleStyling
- SessionAPI_Create_ReturnsNewSession
```

---

## Bug Reporting

### Bug Report Template

```markdown
## Bug Report

### Description
[Clear description of the bug]

### Severity
[Critical/High/Medium/Low]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser/OS: [Details]
- Relevant Story: [Story ID]
- Screenshots/Logs: [Attach if available]

### Acceptance Criteria Impact
Which AC(s) are affected?

### Test Coverage
Is there a test for this? If not, can one be written?

### Assignee
@[Development Engineer]
```

### Severity Levels

| Severity | Definition | Example | Response Time |
|----------|-----------|---------|---------------|
| Critical | Application crash or data loss | Users cannot login, data corruption | < 4 hours |
| High | Major feature broken | Cannot send messages | < 1 day |
| Medium | Feature partially broken | Message styling incorrect | < 2 days |
| Low | Minor issues | Small UI element misaligned | < 3 days |

---

## Quality Metrics

### Metrics to Track

```typescript
interface QualityMetrics {
  // Coverage
  overallCoverage: number // Target: >= 80%
  lineCoverage: number // Target: >= 80%
  branchCoverage: number // Target: >= 70%

  // Test Results
  passRate: number // Target: >= 95%
  totalTests: number
  failingTests: number

  // Bugs
  openBugs: number
  bugsBySeverity: {
    critical: number
    high: number
    medium: number
    low: number
  }

  // Defect Density
  defectDensity: number // Target: < 5 per 1000 LOC

  // Performance
  averageTestDuration: number // Target: < 5s per test
}
```

### Generating Quality Report

```bash
# Run tests with coverage
npm test -- --coverage --verbose

# Extract metrics from coverage report
# Generate quality metrics document

# Example report structure:
# - Coverage summary
# - Test results summary
# - Bug summary
# - Recommendations
```

---

## Testing Workflow

### Before Starting Testing

1. **Read the Story**:了解需求和验收标准
2. **Review Implementation**:理解代码实现
3. **Create Test Plan**:制定测试计划
4. **Prepare Test Data**:准备测试数据

### During Testing

1. **Write Unit Tests**:先写单元测试
2. **Write Integration Tests**:写集成测试
3. **Write E2E Tests**:写E2E测试
4. **Run Tests**:执行所有测试
5. **Document Results**:记录测试结果

### After Testing

1. **Review Coverage**:检查覆盖率
2. **Report Bugs**:报告发现的bug
3. **Verify Fixes**:验证bug修复
4. **Update Documentation**:更新文档

### Continuous Testing

```bash
# Watch mode for unit tests
npm run test:watch

# Run all tests before commit
npm test && npx playwright test

# Generate coverage report
npm test -- --coverage
```

---

## Testing Best Practices

### DO ✅

1. **Test behavior, not implementation**: Test what users see and do
2. **Use meaningful test names**: Clear description of what's being tested
3. **Test edge cases**: Boundary conditions, error states
4. **Keep tests independent**: No dependencies between tests
5. **Use test utilities**: leverage `src/lib/test-utils.ts`
6. **Mock external dependencies**: API calls, database, third-party services
7. **Test error handling**: Ensure proper error messages and handling

### DON'T ❌

1. **Don't test implementation details**: Avoid testing internal functions
2. **Don't use test IDs as primary selectors**: Prefer accessible queries
3. **Don't write tests that never fail**: Every test should verify something meaningful
4. **Don't ignore flaky tests**: Fix or remove flaky tests
5. **Don't rely on thread.sleep**: Use proper waiting strategies
6. **Don't test third-party libraries**: Assume they work

### Testing Pyramid Advice

```
Write many unit tests (fast + focused)
Write fewer integration tests (slower + broader)
Write fewest E2E tests (slowest + widest)
```

---

## Additional Resources

### Documentation

- **Jest**: https://jestjs.io/docs/getting-started
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Playwright**: https://playwright.dev/docs/intro

### Project Resources

- **Development Standards**: `/Users/archersado/workspace/mygit/AuraForce/docs/team/development-standards.md`
- **Sprint Plan**: `/Users/archersado/workspace/mygit/AuraForce/docs/team/sprint-1-plan.md`
- **Test Utilities**: `/Users/archersado/workspace/mygit/AuraForce/src/lib/test-utils.ts`

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run E2E tests in headed mode
npx playwright test --headed

# Run specific test file
npm test MessageBubble.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="MessageBubble"
```
