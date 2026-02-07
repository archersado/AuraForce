# STORY-14-11: AI-assisted Code Writing and Refactoring
## Test Case Design

### Test Categories
1. **Functional Tests** - Core features and user flows
2. **Backend API Tests** - API endpoint functionality
3. **Security Tests** - Code security validation
4. **UI/UX Tests** - User interface and experience
5. **Integration Tests** - End-to-end workflows

---

### 1. Functional Tests

#### TC-F001: Natural Language Command Processing
**Priority**: P0 (Critical)
**Description**: AI should understand and process natural language code commands
**Preconditions**: Code editor is open, AI assistant panel is visible
**Test Steps**:
  1. Enter command "改善这个函数" (Improve this function)
  2. Verify AI acknowledges the command
  3. Verify AI generates improved code
**Expected Result**: AI generates code suggestions with visible improvements
**Acceptance Criteria**: Code quality improves (e.g., better naming, cleaner logic)

#### TC-F002: Add Comments Command
**Priority**: P0
**Description**: AI should add comments to selected code
**Test Steps**:
  1. Select a code block without comments
  2. Click "添加注释" button
  3. Verify AI generates version with comments
**Expected Result**: Code includes meaningful comments explaining functionality
**Acceptance Criteria**: Comments are clear, accurate, and add value

#### TC-F003: Refactor Code Command
**Priority**: P0
**Description**: AI should refactor code for better structure
**Test Steps**:
  1. Select code with potential refactoring opportunities (repetitive code, long functions)
  2. Click "重构代码" button
  3. Verify AI generates refactored version
**Expected Result**: Code is restructured with improved maintainability
**Acceptance Criteria**: Functionality is preserved, structure is improved

#### TC-F004: Optimize Performance Command
**Priority**: P0
**Description**: AI should suggest performance optimizations
**Test Steps**:
  1. Select code with potential performance issues (nested loops, inefficient algorithms)
  2. Click "优化性能" button
  3. Verify AI suggests optimizations
**Expected Result**: Suggestions include specific performance improvements
**Acceptance Criteria**: Optimizations are valid and explain trade-offs

#### TC-F005: Diff Preview Display
**Priority**: P0
**Description**: Diff viewer should clearly show changes
**Test Steps**:
  1. Generate AI code suggestion
  2. View diff preview
  3. Check line-by-line comparison
**Expected Result**: Changes are highlighted clearly (additions in green, deletions in red)
**Acceptance Criteria**: Diff is easy to read and understand

#### TC-F006: Apply Suggestion
**Priority**: P0
**Description**: User can apply AI suggestion to editor
**Test Steps**:
  1. Generate AI suggestion
  2. Review in diff viewer
  3. Click "Apply" button
**Expected Result**: Editor content updates to AI suggestion
**Acceptance Criteria**: Editor reflects applied changes immediately

#### TC-F007: Reject Suggestion
**Priority**: P0
**Description**: User can reject AI suggestion
**Test Steps**:
  1. Generate AI suggestion
  2. Click "Reject" button
**Expected Result**: Suggestion is dismissed, editor content unchanged
**Acceptance Criteria**: Dismissed suggestion is not retried in same session

---

### 2. Backend API Tests

#### TC-B001: Code Assist API Valid Request
**Priority**: P0
**Description**: API should handle valid code assistance requests
**Endpoint**: `POST /api/ai/code-assist`
**Input**: Valid command, code, language
**Expected Result**: 200 OK with structured response
```json
{
  "success": true,
  "suggestion": "...",
  "diff": { /* diff data */ },
  "confidence": 0.85
}
```

#### TC-B002: Code Assist API Missing Parameters
**Priority**: P1
**Description**: API should validate required parameters
**Input**: Request missing `code` or `command`
**Expected Result**: 400 Bad Request with error message

#### TC-B003: Code Assist API Security Check
**Priority**: P0
**Description**: API should block harmful code generation
**Input**: Code with security vulnerabilities or malicious intent
**Expected Result**: 200 OK but suggestion is rejected or flagged
```json
{
  "success": false,
  "error": "Code contains security vulnerabilities",
  "issues": ["XSS vulnerability detected"]
}
```

#### TC-B004: Code Diff API
**Priority**: P0
**Description**: API should generate correct diff
**Endpoint**: `POST /api/ai/code-diff`
**Input**: `original` and `modified` code
**Expected Result**: Correct diff format for frontend rendering
```json
{
  "changes": [
    {
      "type": "add",
      "content": "console.log('New line');",
      "lineNumber": 5
    }
  ]
}
```

#### TC-B005: Code Assist API Rate Limiting
**Priority**: P2
**Description**: API should handle rate limiting gracefully
**Input**: Multiple rapid requests
**Expected Result**: 429 Too Many Requests or queued processing

---

### 3. Security Tests

#### TC-S001: XSS Detection
**Priority**: P0
**Description**: System should detect and prevent XSS vulnerabilities
**Input**: Code with `document.getElementById().innerHTML = user_input`
**Expected Result**: Code flagged with security warning

#### TC-S002: SQL Injection Detection
**Priority**: P0
**Description**: System should detect SQL injection patterns
**Input**: Code with `"SELECT * FROM users WHERE id = " + userId`
**Expected Result**: Code flagged with security warning

#### TC-S003: Dangerous API Calls
**Priority**: P0
**Description**: System should flag dangerous API usage
**Input**: Code with `eval()` or `exec()`
**Expected Result**: Code flagged with security warning

#### TC-S004: Code Injection Protection
**Priority**: P0
**Description**: AI should not inject malicious code
**Test**: Review AI-generated code for hidden malicious patterns
**Expected Result**: No malicious code injected

---

### 4. UI/UX Tests

#### TC-U001: AI Panel Visibility Toggle
**Priority**: P1
**Description**: User can show/hide AI assistant panel
**Test Steps**: Click AI assistant toggle button
**Expected Result**: Panel toggles visibility smoothly

#### TC-U002: Loading State Display
**Priority**: P1
**Description**: Loading indicator shows during AI processing
**Test Steps**: Submit a command
**Expected Result**: Spinner or progress indicator displays
**Acceptance Criteria**: Clear visual feedback

#### TC-U003: Error Handling Display
**Priority**: P1
**Description**: Errors are shown clearly to user
**Test**: Simulate API error (network failure, etc.)
**Expected Result**: User-friendly error message with retry option

#### TC-U004: Responsive Design
**Priority**: P2
**Description**: UI works on different screen sizes
**Test**: Resize browser window, test on mobile
**Expected Result**: Layout adjusts appropriately

---

### 5. Integration Tests

#### TC-I001: End-to-End Code Improvement Flow
**Priority**: P0
**Description**: Complete flow from request to apply
**Test Steps**:
  1. Open code editor with sample code
  2. Click "改善这个函数"
  3. Wait for AI suggestion
  4. Review diff
  5. Click "Apply"
  6. Verify code updated
**Expected Result**: Flow completes successfully, code improved

#### TC-I002: Multiple Suggestions Handling
**Priority**: P1
**Description**: System handles multiple suggestions
**Test Steps**:
  1. Generate first suggestion
  2. Generate second suggestion without applying first
**Expected Result**: Suggestions tracked separately

#### TC-I003: Session Context Preservation
**Priority**: P1
**Description**: AI maintains context across requests
**Test Steps**:
  1. Request code improvement
  2. Request further refactoring on improved code
**Expected Result**: AI understands previous suggestions

#### TC-I004: Performance Under Load
**Priority**: P2
**Description**: System remains responsive with large code
**Test**: Test with 500+ lines of code
**Expected Result**: Response time < 3 seconds

---

### Test Data Requirements

1. **Sample Code Snippets**:
   - JavaScript/TypeScript (functions, classes, async/await)
   - Python (loops, classes, decorators)
   - HTML/CSS (components, styling)

2. **Test Commands** (Chinese and English):
   - "改善这个函数" / "Improve this function"
   - "添加注释" / "Add comments"
   - "重构代码" / "Refactor code"
   - "优化性能" / "Optimize performance"

3. **Edge Cases**:
   - Empty code
   - Very long code (1000+ lines)
   - Code with syntax errors
   - Mixed languages

---

### Code Accuracy Validation Criteria

To validate ≥80% accuracy:
1. **Functionality**: Code performs intended action correctly
2. **Syntax**: No syntax errors
3. **Style**: Follows language best practices
4. **Readability**: Code is clear and maintainable
5. **Security**: No security vulnerabilities introduced

**Measurement**: Manual review + automated tests on 20 sample code snippets

---

### Test Coverage Targets

- **Unit Tests**: ≥80% code coverage
- **Component Tests**: All UI components tested
- **API Tests**: All endpoints tested with positive and negative cases
- **Security Tests**: Known vulnerability patterns covered
- **E2E Tests**: Main user flows covered

---

### Bug Classification

- **P0**: Blocks core functionality (system unusable)
- **P1**: Major feature broken but workaround exists
- **P2**: Minor bug, edge case, or UI issue
- **P3**: Cosmetic issue, enhancement

### Test Execution Environment

- **Browser**: Chrome, Firefox, Safari (latest versions)
- **Node.js**: v20+
- **API**: Mock environment + Claude API staging (if available)

---

### Test Schedule

1. **Backend Testing**: During B1-B4 development
2. **Security Testing**: During B3 development
3. **Component Testing**: During F1-F6 development
4. **Integration Testing**: After frontend integration complete
5. **E2E Testing**: Before delivery
