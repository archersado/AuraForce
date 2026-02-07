# STORY-14-11: AI-assisted Code Writing and Refactoring
## Implementation Guide

### Overview

This document provides comprehensive technical documentation for the AI Code Assistant feature (STORY-14-11), including architecture, API reference, and component documentation.

**Story ID**: STORY-14-11 (ARC-121)
**Status**: Implemented
**Version**: 1.0.0
**Last Updated**: 2025-01-07

---

## Table of Contents

1. [Architecture](#architecture)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [API Reference](#api-reference)
5. [Security Considerations](#security-considerations)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                    │
│                                                              │
│  ┌─────────────┐         ┌──────────────┐                 │
│  │  CodeEditor ├─────────┤AICodeAssistant│                 │
│  └──────┬──────┘         └───────┬──────┘                 │
│         │                        │                         │
│         │                        │                         │
│         │              ┌─────────▼─────────┐                │
│         │              │  CodeDiffViewer   │                │
│         │              └───────────────────┘                │
│         │                                                 │
│         ▼                                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │           API Client (apiFetch)                  │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       │                                  │
└───────────────────────┼──────────────────────────────────┘
                        │ HTTP/HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Next.js API)                  │
│                                                              │
│  ┌─────────────────┐        ┌──────────────────┐          │
│  │ /api/ai/code-   │        │ /api/ai/code-diff│          │
│  │    assist       │        │                  │          │
│  └────────┬────────┘        └──────────────────┘          │
│           │                                                  │
│           ▼                                                  │
│  ┌────────────────────────────────────────────────┐        │
│  │         Code Security Validation               │        │
│  │    (/lib/ai/code-security.ts)                 │        │
│  └────────────────────────────────────────────────┘        │
│           │                                                  │
│           ▼                                                  │
│  ┌────────────────────────────────────────────────┐        │
│  │         Claude Agent SDK                       │        │
│  │   (@anthropic-ai/claude-agent-sdk)            │        │
│  └────────────────────────────────────────────────┘        │
│           │                                                  │
│           ▼                                                  │
│  ┌────────────────────────────────────────────────┐        │
│  │         Claude API                             │        │
│  └────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### Backend Components

1. **Code Assist API** (`/api/ai/code-assist`)
   - Handles AI code generation requests
   - Integrates with Claude API
   - Performs security validation
   - Generates diff output

2. **Code Diff API** (`/api/ai/code-diff`)
   - Generates structured diff between code versions
   - Supports multiple output formats (JSON, Unified, HTML)
   - Calculates similarity metrics

3. **Code Security Module** (`/lib/ai/code-security.ts`)
   - Validates code for security vulnerabilities
   - Detects XSS, SQL injection, eval() usage, etc.
   - Provides security scores and reports

4. **Code Diff Module** (`/lib/ai/code-diff.ts`)
   - Implements diff algorithm
   - Generates both structured and formatted output
   - Calculates similarity and significance

#### Frontend Components

1. **Code Editor** (`/components/workspace/CodeEditor.tsx`)
   - Enhanced with AI assistant panel toggle
   - Manages state and interaction

2. **AI Code Assistant** (`/components/workspace/AICodeAssistant.tsx`)
   - Main UI for AI interactions
   - Quick action buttons
   - Natural language command input
   - Suggestion display and apply/reject

3. **Code Diff Viewer** (`/components/workspace/CodeDiffViewer.tsx`)
   - Renders diff with syntax highlighting
   - Supports unified and split views
   - Interactive line numbers

---

## Backend Implementation

### 1. Code Security Validation

**Location**: `/lib/ai/code-security.ts`

**Key Functions**:

```typescript
// Main validation function
validateCodeSecurity(code: string, language?: string): SecurityValidationResult

// Strip comments before validation
stripComments(code: string, language?: string): string

// Check for obfuscation
isObfuscatedCode(code: string): boolean

// Generate human-readable report
generateSecurityReport(result: SecurityValidationResult): string
```

**Security Patterns Detected**:

- **XSS**: `innerHTML`, `document.write()`
- **SQL Injection**: String concatenation in queries
- **Command Injection**: `exec()`, `spawn()`, `child_process.exec`
- **Eval**: `eval()`, `new Function()`
- **Hardcoded Secrets**: Hardcoded passwords, API keys
- **Insecure Random**: `Math.random()` (non-cryptographic)
- **SSRF**: URL manipulation in fetch()
- **Path Traversal**: File operations with user input
- **React XSS**: `dangerouslySetInnerHTML`
- **Prototype Pollution**: `__proto__`, `constructor.prototype`

**Security Scoring**:
- Critical issues: -40 points each
- High severity: -25 points each
- Medium severity: -10 points each
- Low severity: -5 points each
- Maximum score: 100

### 2. Code Diff Generation

**Location**: `/lib/ai/code-diff.ts`

**Key Functions**:

```typescript
// Generate diff between two code versions
generateCodeDiff(original: string, modified: string): DiffResult

// Apply diff to generate modified code
applyDiff(original: string, changes: DiffChange[]): string

// Generate unified diff format (git-style)
generateUnifiedDiff(original: string, modified: string, fileName?: string): string

// Format diff for display with line numbers
formatDiffForDisplay(diff: DiffResult): FormattedDiffLine[]

// Generate HTML markup for diff
generateDiffHTML(diff: DiffResult): string

// Calculate similarity ratio (0-1)
calculateSimilarity(original: string, modified: string): number

// Check if changes are significant
isSignificantChange(original: string, modified: string, threshold?: number): boolean

// Find inline word-level changes
findInlineDiff(originalLine: string, modifiedLine: string): InlineChange[]
```

**Diff Change Types**:
- `ADD`: Added line
- `REMOVE`: Removed line
- `MODIFY`: Modified line (combination of remove + add)
- `EQUAL`: Unchanged line

### 3. Code Assist API

**Endpoint**: `POST /api/ai/code-assist`

**Request Body**:
```typescript
interface CodeAssistRequest {
  command: string;        // Natural language command
  code: string;           // Original code
  language?: string;      // Programming language
  sessionId?: string;     // Resume existing session
  selection?: {           // Selected code range
    startLine: number;
    endLine: number;
    startChar: number;
    endChar: number;
  };
}
```

**Response Body**:
```typescript
interface CodeAssistResponse {
  success: boolean;
  suggestion: string;      // AI-generated code
  original: string;        // Original code
  diff: DiffResult;        // Diff between versions
  explanation: string;     // Explanation of changes
  confidence: number;      // Confidence score (0-1)
  security: {
    isValid: boolean;
    score: number;
    issues: SecurityIssue[];
    report?: string;
  };
  meta: {
    language: string;
    command: string;
    timestamp: string;
    sessionId?: string;
  };
}
```

**Workflow**:
1. Validate request parameters
2. Check Claude API configuration
3. Build prompt with system instructions
4. Query Claude Agent SDK
5. Extract code from AI response
6. Perform security validation
7. Generate diff between original and suggested code
8. Calculate confidence score
9. Return response with diff and validation results

**Error Handling**:
- Missing parameters: 400 Bad Request
- Empty code: 400 Bad Request
- Claude API errors: 500 Internal Server Error
- Security violations: 200 OK with `security.isValid = false`

### 4. Code Diff API

**Endpoint**: `POST /api/ai/code-diff`

**Request Body**:
```typescript
interface CodeDiffRequest {
  original: string;
  modified: string;
  fileName?: string;
  format?: 'json' | 'unified' | 'html';
  includeHTML?: boolean;
}
```

**Response Body**:
```typescript
interface CodeDiffResponse {
  success: boolean;
  original: string;
  modified: string;
  diff: DiffResult;
  meta: {
    fileName: string;
    similarity: number;      // 0-1 similarity ratio
    isSignificant: boolean;
    timestamp: string;
  };
  formatted?: FormattedDiffLine[];
  unifiedDiff?: string;
  html?: string;
}
```

---

## Frontend Implementation

### 1. Code Editor Component

**Location**: `/components/workspace/CodeEditor.tsx`

**New Props**:
```typescript
interface CodeEditorProps {
  // ... existing props
  enableAIAssistant?: boolean;        // Enable AI assistant panel
  onApplyAISuggestion?: (suggestedCode: string) => void;  // Callback when suggestion applied
}
```

**Enhancements**:
- Toolbar with AI assistant toggle button
- Split layout with editor and AI panel
- State management for AI panel visibility
- Callback for applying AI suggestions

### 2. AI Code Assistant Component

**Location**: `/components/workspace/AICodeAssistant.tsx`

**Props**:
```typescript
interface AICodeAssistantProps {
  code: string;                           // Current editor content
  language?: string;                      // Programming language
  onApplySuggestion: (code: string) => void;  // Callback for applying suggestion
  isOpen?: boolean;                       // Panel visibility
  onClose?: () => void;                   // Close callback
  className?: string;                     // Additional CSS classes
}
```

**State Management**:
- `command`: Current command input
- `isProcessing`: Loading state
- `suggestion`: Current AI suggestion
- `error`: Error message
- `sessionId`: Claude session ID for context
- `activeAction`: Currently executing quick action

**Key Methods**:
```typescript
// Execute AI action with command
handleAction(command: string): Promise<void>

// Apply suggestion to editor
handleApply(): void

// Reject suggestion
handleReject(): void

// Handle quick action button click
handleQuickAction(action: QuickAction): void

// Handle custom command submission
handleSubmitCommand(e: FormEvent): Promise<void>
```

**Quick Actions**:
```typescript
const QUICK_ACTIONS = [
  { id: 'improve', label: '改善这个函数', icon: '✨', english: 'Improve this function' },
  { id: 'comments', label: '添加注释', icon: '💬', english: 'Add comments' },
  { id: 'refactor', label: '重构代码', icon: '🔧', english: 'Refactor code' },
  { id: 'optimize', label: '优化性能', icon: '⚡', english: 'Optimize performance' },
];
```

### 3. Code Diff Viewer Component

**Location**: `/components/workspace/CodeDiffViewer.tsx`

**Props**:
```typescript
interface CodeDiffViewerProps {
  diff: DiffResult;
  fileName?: string;
  viewMode?: 'unified' | 'split';
  language?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
  onLineClick?: (lineNumber: number, side: 'left' | 'right') => void;
}
```

**Features**:
- Unified and split view modes
- Syntax highlighting (using existing CodeMirror support)
- Line numbers (original and new)
- Click-to-select lines
- Add/remove/change highlighting
- Summary statistics
- Responsive design

### 4. Component Styling

**Location**: `/components/workspace/AICodeAssistant.module.css`

**Key Style Classes**:
- `.ai-code-assistant`: Main container
- `.quick-actions`: Grid of quick action buttons
- `.command-form`: Custom command input form
- `.ai-suggestion`: Suggestion display
- `.diff-viewer`: Diff container
- `.diff-line`: Individual diff lines
- `.diff-add`, `.diff-remove`, `.diff-equal`: Change type colors
- `.security-warning`: Security alert styling

---

## API Reference

### POST /api/ai/code-assist

Process AI code assistance request.

**Request**:
```
POST /api/ai/code-assist
Content-Type: application/json

{
  "command": "Improve this function",
  "code": "function f(x) { return x * 2; }",
  "language": "javascript",
  "sessionId": "optional-session-id"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "suggestion": "function multiplyByTwo(x) {\n  return x * 2;\n}",
  "original": "function f(x) { return x * 2; }",
  "diff": {
    "changes": [...],
    "additions": 1,
    "deletions": 1,
    "summary": "+1 -1"
  },
  "explanation": "Renamed function and added clearer documentation...",
  "confidence": 0.85,
  "security": {
    "isValid": true,
    "score": 100,
    "issues": []
  },
  "meta": {
    "language": "javascript",
    "command": "Improve this function",
    "timestamp": "2025-01-07T12:00:00.000Z"
  }
}
```

**Error Response** (400):
```json
{
  "error": "Missing required parameters: command and code are required"
}
```

**Error Response** (500):
```json
{
  "error": "Failed to process code assistance request",
  "details": "Claude API error..."
}
```

### POST /api/ai/code-diff

Generate diff between two code versions.

**Request**:
```
POST /api/ai/code-diff
Content-Type: application/json

{
  "original": "line 1\nline 2",
  "modified": "line 1\nline 2 modified\nline 3",
  "fileName": "example.js",
  "format": "json",
  "includeHTML": true
}
```

**Success Response** (200):
```json
{
  "success": true,
  "original": "line 1\nline 2",
  "modified": "line 1\nline 2 modified\nline 3",
  "diff": {
    "changes": [...],
    "additions": 1,
    "deletions": 0,
    "summary": "+1 -0"
  },
  "meta": {
    "fileName": "example.js",
    "similarity": 0.87,
    "isSignificant": true,
    "timestamp": "2025-01-07T12:00:00.000Z"
  },
  "formatted": [...],
  "html": "<div class=\"diff-container\">...</div>"
}
```

---

## Security Considerations

### Security Validation

All AI-generated code passes through multiple security checks:

1. **Pattern Matching**
   - Configurable regex patterns for known vulnerabilities
   - Language-agnostic and language-specific checks

2. **Code Obfuscation Detection**
   - Excessive single-character variables
   - Very long lines
   - Base64 or hex-encoded content

3. **Multiple Validation Layers**
   - Backend validation (primary)
   - Frontend display of security warnings (secondary)

### Security Rules

1. **Never Allow**:
   - `eval()` or `new Function()` (critical)
   - Direct SQL string concatenation (critical)
   - `dangerouslySetInnerHTML` (high)
   - Hardcoded secrets (high)

2. **Warn About**:
   - `Math.random()` for cryptography (medium)
   - `innerHTML` assignments (high)
   - File operations with user input (medium)

3. **Always Sanitize**:
   - User inputs in API calls
   - Code before displaying (escape HTML)
   - Diff rendering

### API Key Security

- API keys stored in environment variables (not in code)
- Never expose keys to client-side code
- Use proxy API routes for Claude SDK calls

### Rate Limiting

Claude API has built-in rate limiting. Consider adding:
- Request rate limiting per user
- Token usage tracking
- Cost monitoring

---

## Testing

### Unit Tests

**Location**: `/__tests__/`

1. **Code Security Tests** (`__tests__/lib/ai/code-security.test.ts`)
   - XSS detection
   - SQL injection detection
   - eval() detection
   - Security scoring
   - Report generation

2. **Code Diff Tests** (`__tests__/lib/ai/code-diff.test.ts`)
   - Diff generation accuracy
   - Apply diff correctness
   - Unified diff format
   - Similarity calculation
   - Inline diff detection

3. **Component Tests** (__tests__/components/workspace/AICodeAssistant.test.tsx)
   - Rendering tests
   - Quick action handling
   - Custom command submission
   - Apply/reject functionality
   - Error handling
   - Loading states

4. **API Tests**:
   - `__tests__/api/ai/code-assist.test.ts`
   - `__tests__/api/ai/code-diff.test.ts`
   - Request validation
   - Response formatting
   - Error handling
   - Security validation

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test code-security.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Coverage Goals

- **Backend**: ≥80% coverage
- **Security validation**: 100% coverage (critical)
- **API endpoints**: All positive and negative cases
- **Components**: Main user flows
- **E2E**: Critical paths

---

## Deployment

### Environment Variables

Required environment variables in `.env`:

```bash
# Claude API Configuration
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_MODEL=sonnet

# Next.js Configuration
NEXT_PUBLIC_API_PREFIX=/auraforce  # Optional
```

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start

# Docker deployment (if configured)
docker build -t auraforce .
docker run -p 3000:3000 --env-file .env auraforce
```

### Production Checklist

- [ ] Set valid Claude API key
- [ ] Configure rate limits
- [ ] Enable monitoring and logging
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CORS rules
- [ ] Test API authentication
- [ ] Verify security validation
- [ ] Monitor token usage and costs
- [ ] Set up alerts for API failures

---

## Troubleshooting

### Common Issues

#### 1. "No valid Claude API key" Error

**Cause**: API key not configured or invalid.

**Solution**:
```bash
# Check .env file
cat .env | grep ANTHROPIC

# Verify key format (should start with sk-ant-)
# Set correct key
export ANTHROPIC_API_KEY=sk-ant-...
```

#### 2. "Process exited with code 1" Error

**Cause**: Claude SDK process termination issue.

**Solution**:
- Ensure Node.js is in PATH
- Check SDK compatibility with Node version (v20+)
- Verify `@anthropic-ai/claude-agent-sdk` is installed

#### 3. Security Validation Blocking Valid Code

**Cause**: Security patterns too strict.

**Solution**:
- Review false positives in `/lib/ai/code-security.ts`
- Adjust pattern severity
- Add exception rules for safe patterns

#### 4. Diff Not Showing Changes

**Cause**: Diff algorithm not detecting changes correctly.

**Solution**:
- Check whitespace handling
- Verify line ending consistency (CRLF vs LF)
- Review diff algorithm in `/lib/ai/code-diff.ts`

#### 5. AI Suggestions Not Applying

**Cause**: Security validation failed.

**Solution**:
- Review security warnings
- Fix security issues in suggestion
- Check `security.isValid` flag

### Debug Mode

Enable debug logging:

```typescript
// In code-assist/route.ts
console.log('[Debug]', details);
```

```bash
# Run with debug output
NODE_ENV=development npm run dev
```

### Monitoring and Logs

Monitor:
- API response times
- Success/failure rates
- Token usage
- Cost accumulation
- Security violations

---

## Future Enhancements

### Potential Features

1. **Advanced Refactoring**
   - Extract to function/method
   - Rename variables with scope awareness
   - Move code between files

2. **Multi-File Operations**
   - Cross-file refactoring
   - Dependency analysis
   - Import/export optimization

3. **Project-Wide Changes**
   - Batch refactoring
   - Pattern-based replacements
   - Code style enforcement

4. **Learning and Adaptation**
   - User feedback integration
   - Custom style guide learning
   - Team-specific conventions

5. **Enhanced Security**
   - SAST integration
   - Vulnerability scanning
   - Compliance checking

---

## Contributing

### Adding New Commands

1. Update `QUICK_ACTIONS` in `AICodeAssistant.tsx`
2. Add corresponding English command
3. Test with various code samples
4. Update documentation

### Adding Security Patterns

1. Add pattern to `SECURITY_PATTERNS` in `code-security.ts`
2. Include severity and suggestion
3. Write test case
4. Update user guide

### Modifying Diff Algorithm

1. Update `generateCodeDiff()` in `code-diff.ts`
2. Ensure backward compatibility
3. Add tests for edge cases
4. Performance test with large files

---

## Support and Resources

- **GitHub Repository**: [AuraForce GitHub]
- **Documentation**: [AuraForce Docs]
- **Claude API Docs**: [Anthropic Documentation]
- **Issue Tracker**: [GitHub Issues]

---

**Document Version**: 1.0.0
**Last Modified**: 2025-01-07
**Maintained By**: AuraForce Development Team
