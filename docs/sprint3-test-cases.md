# Sprint 3 Test Case Design

**Epic**: Epic 14 - Workspace Editor & File Management
**Sprint**: Sprint 3
**Test Designer**: QA Team
**Date**: 2025-02-07

---

## Test Strategy

### Testing Types
1. **Unit Tests**: 组件逻辑测试
2. **Integration Tests**: API 和组件集成
3. **E2E Tests**: 用户流程测试
4. **Security Tests**: 安全性验证
5. **Performance Tests**: 大文件和性能测试

### Test Tools
- Jest: 单元测试
- React Testing Library: 组件测试
- Playwright: E2E 测试
- 手动测试: 视觉和交互验证

---

## STORY-14-4: Document File Support Test Cases

### TC-D-01: PDF Preview Component - Basic Functionality

**Priority**: P0
**Type**: E2E

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-D-01-01 | Valid PDF file preview | 1. Navigate to file editor<br>2. Upload/load a valid PDF file<br>3. Verify preview renders | PDF content displays correctly with first page visible |
| TC-D-01-02 | PDF page navigation | 1. Open a multi-page PDF<br>2. Click "Next" button<br>3. Click "Previous" button | Navigation works correctly, pages advance and retreat |
| TC-D-01-03 | PDF zoom in/out | 1. Open PDF preview<br>2. Click zoom in button<br>3. Click zoom out button | PDF scales up and down smoothly |
| TC-D-01-04 | PDF download button | 1. Open PDF preview<br>2. Click download button | File downloads as intended |
| TC-D-01-05 | Invalid PDF file | 1. Load corrupted PDF file<br>2. Verify error message | User-friendly error message displayed |

### TC-D-02: PDF Preview - Large File Handling

**Priority**: P1
**Type**: Performance

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-D-02-01 | Large PDF (>50MB) | 1. Upload large PDF file<br>2. Monitor loading time and memory | File chunks load progressively, browser remains responsive |
| TC-D-02-02 | Multi-page PDF (>100 pages) | 1. Open multi-page PDF<br>2. Test navigation | Navigation remains smooth, no memory leaks |
| TC-D-02-03 | Loading state | 1. Open large PDF<br>2. Verify loading indicator | Loading spinner shows during page rendering |

### TC-D-03: DOCX Preview Component

**Priority**: P0
**Type**: E2E

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-D-03-01 | Valid DOCX file preview | 1. Navigate to file editor<br>2. Upload/load DOCX file<br>3. Verify preview | DOCX content displays with formatting preserved |
| TC-D-03-02 | DOCX with formatting | 1. Load DOCX with headings, lists, tables<br>2. Verify rendering | All formatting elements render correctly |
| TC-D-03-03 | DOCX with images | 1. Load DOCX with embedded images<br>2. Verify images display | Images display in correct positions |
| TC-D-03-04 | Invalid DOCX file | 1. Load corrupted DOCX<br>2. Verify error handling | Error message displays gracefully |
| TC-D-03-05 | Empty DOCX file | 1. Load empty DOCX<br>2. Verify handling | Shows "Empty document" message or blank view |

### TC-D-04: Document Export Functionality

**Priority**: P1
**Type**: Integration

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-D-04-01 | Export document to PDF | 1. Open document preview<br>2. Click "Export as PDF" | PDF file downloads with correct content |
| TC-D-04-02 | Export document to DOCX | 1. Open document preview<br>2. Click "Export as DOCX" | DOCX file downloads with correct content |
| TC-D-04-03 | Export confirmation dialog | 1. Click export button<br>2. Verify dialog | Dialog shows with format options |
| TC-D-04-04 | Export cancellation | 1. Open export dialog<br>2. Click cancel | Action cancels, no download initiated |
| TC-D-04-05 | Export error handling | 1. Trigger export failure<br>2. Verify error message | User-friendly error notification |

### TC-D-05: Document Preview Integration

**Priority**: P1
**Type**: Integration

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-D-05-01 | File type detection | 1. Upload files with different extensions<br>2. Verify correct preview loads | Router selects appropriate preview component |
| TC-D-05-02 | Auto-detection fallback | 1. Upload unsupported format<br>2. Verify fallback | Shows "Unsupported format" with download option |
| TC-D-05-03 | Responsive design mobile | 1. Open preview on mobile device<br>2. Verify layout | Layout adapts to mobile viewport |
| TC-D-05-04 | Responsive design tablet | 1. Open preview on tablet device<br>2. Verify layout | Layout adapts to tablet viewport |
| TC-D-05-05 | Dark mode | 1. Switch to dark theme<br>2. Open preview | Preview mode respects dark theme |

---

## STORY-14-15: Web Viewer Test Cases

### TC-WV-01: iframe Basic Functionality

**Priority**: P0
**Type**: E2E

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-WV-01-01 | Load valid URL | 1. Enter valid HTTPS URL<br>2. Click "Load" | Page loads in iframe |
| TC-WV-01-02 | URL input validation | 1. Enter malformed URL<br>2. Click "Load" | Error message "Invalid URL" displays |
| TC-WV-01-03 | Load http:// URL (blocked) | 1. Enter http:// URL<br>2. Click "Load" | Shows security warning "Only HTTPS allowed" |
| TC-WV-01-04 | Loading indicator | 1. Load a slow-loading page<br>2. Observe loading state | Spinner shows while loading |
| TC-WV-01-05 | Load error handling | 1. Enter non-existent domain<br>2. Click "Load" | Shows friendly error message |

### TC-WV-02: Navigation Controls

**Priority**: P0
**Type**: E2E

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-WV-02-01 | Back button | 1. Navigate to page A<br>2. Navigate to page B<br>3. Click Back | Returns to page A |
| TC-WV-02-02 | Forward button | 1. Navigate A→B→click Back<br>2. Click Forward | Returns to page B |
| TC-WV-02-03 | Refresh button | 1. Load page<br>2. Click refresh | Page reloads content |
| TC-WV-02-04 | Button state (no history) | 1. Load initial page<br>2. Observe buttons | Back/Forward buttons disabled |
| TC-WV-02-05 | Button state (history) | 1. Navigate through pages<br>2. Observe buttons | Buttons enable/disable based on history |

### TC-WV-03: Page Size Adjustment

**Priority**: P1
**Type**: E2E

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-WV-03-01 | Set size to 50% | 1. Click size dropdown<br>2. Select 50% | Iframe scales to 50% size |
| TC-WV-03-02 | Set size to 100% | 1. Select 100% size | Iframe scales to full width |
| TC-WV-03-03 | Set size to 150% | 1. Select 150% size | Iframe scales to 1.5x width |
| TC-WV-03-04 | Size animation | 1. Change sizes multiple times | Smooth transition animation |
| TC-WV-03-05 | Size persistence | 1. Set size to 75%<br>2. Reload page | Size preference persists |

### TC-WV-04: Security Features

**Priority**: P0
**Type**: Security

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-WV-04-01 | iframe sandbox attribute | 1. Inspect iframe element<br>2. Verify sandbox | Sandbox attribute restricts dangerous actions |
| TC-WV-04-02 | CSP header verification | 1. Load page<br>2. Check browser console for CSP violations | No CSP violations in console |
| TC-WV-04-03 | XSS prevention | 1. Try injecting script in URL<br>2. Attempt loading | Script blocked, sanitization active |
| TC-WV-04-04 | Clickjacking prevention | 1. Test via iframe embedding<br>2. Verify X-Frame-Options | Page refuses to be framed without permission |
| TC-WV-04-05 | Malicious URL blocking | 1. Try loading known malicious domain<br>2. Verify block | Domain blocked, warning message displays |

### TC-WV-05: URL Validation and Whitelisting

**Priority**: P1
**Type**: Security

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-WV-05-01 | HTTPS only enforcement | 1. Enter http:// URL<br>2. Try loading | Blocked with "HTTPS required" message |
| TC-WV-05-02 | Local network blocking | 1. Enter 192.168.x.x URL<br>2. Try loading | Blocked with "Private network not allowed" |
| TC-WV-05-03 | JavaScript protocol blocking | 1. Enter javascript:alert(1)<br>2. Try loading | Blocked, no script execution |
| TC-WV-05-04 | Data URL blocking | 1. Enter data:text/html URL<br>2. Try loading | Blocked for security |
| TC-WV-05-05 | Allowed domain verification | 1. Load whitelisted domain<br>2. Verify loading | Page loads successfully |

### TC-WV-06: Cross-Origin Handling

**Priority**: P2
**Type**: Integration

| Test ID | Test Description | Test Steps | Expected Result |
|---------|-----------------|------------|-----------------|
| TC-WV-06-01 | Same-origin page | 1. Load same-origin page<br>2. Verify access | Full access and interaction |
| TC-WV-06-02 | Cross-origin page (CORS) | 1. Load CORS-enabled page<br>2. Verify interaction | Interaction works appropriately |
| TC-WV-06-03 | Cross-origin (no CORS) | 1. Load restricted page<br>2. Verify error | Shows restricted access message |
| TC-WV-06-04 | X-Frame-Options denial | 1. Load X-Frame-Options: deny page<br>2. Verify error | Shows "Page cannot be embedded" error |
| TC-WV-06-05 | Certificate error handling | 1. Load invalid cert HTTPS domain<br>2. Verify error | Shows security certificate error message |

---

## Performance Test Cases

### TC-PERF-01: Document Preview Performance

| Test ID | Metric | Target | Measurement Method |
|---------|--------|--------|-------------------|
| TC-PERF-01-01 | Small PDF (<5MB) load time | <2 seconds | Performance API |
| TC-PERF-01-02 | Medium PDF (5-50MB) load time | <5 seconds | Performance API |
| TC-PERF-01-03 | DOCX file load time | <1 second | Performance API |
| TC-PERF-01-04 | Page navigation latency | <300ms | Console timing |
| TC-PERF-01-05 | Memory usage (large file) | <200MB | Chrome DevTools |

### TC-PERF-02: Web Viewer Performance

| Test ID | Metric | Target | Measurement Method |
|---------|--------|--------|-------------------|
| TC-PERF-02-01 | iframe load time (light page) | <2 seconds | Performance API |
| TC-PERF-02-02 | iframe load time (heavy page) | <5 seconds | Performance API |
| TC-PERF-02-03 | Navigation history state time | <100ms | Console timing |
| TC-PERF-02-04 | Scale animation time | <500ms | Visual timing |
| TC-PERF-02-05 | iframe memory footprint | <50MB | Chrome DevTools |

---

## Accessibility Test Cases

### TC-A11Y-01: Document Preview Accessibility

| Test ID | Test Description | Expected Result |
|---------|-----------------|-----------------|
| TC-A11Y-01-01 | Keyboard navigation | Can navigate controls with Tab/Enter |
| TC-A11Y-01-02 | Screen reader support | ARIA labels and roles present |
| TC-A11Y-01-03 | Color contrast | WCAG AA compliant (4.5:1) |
| TC-A11Y-01-04 | Focus management | Focus moves logically |
| TC-A11Y-01-05 | Error announcements | Errors are announced to screen readers |

---

## Manual Testing Checklist

### Document Preview
- [ ] Visual verification of PDF rendering
- [ ] Font loading and text clarity
- [ ] Table and image positioning
- [ ] Scrollbar visibility in dark mode
- [ ] Mobile viewport adaptation

### Web Viewer
- [ ] Visual fit in iframe
- [ ] Scrollbar visibility
- [ ] Loading animation smoothness
- [ ] Button states (hover, active, disabled)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

---

## Test Execution Schedule

| Phase | Tasks | Duration |
|-------|-------|----------|
| Phase 1 | Unit Tests implementation | Day 1-2 |
| Phase 2 | Integration Tests implementation | Day 2-3 |
| Phase 3 | E2E Tests implementation | Day 3-4 |
| Phase 4 | Security and Performance Tests | Day 4-5 |
| Phase 5 | Regression Testing | Day 5-6 |

---

## Known Limitations

### DOC Format
- Old `.doc` format requires backend conversion
- Implementation limited to "download to view" in Sprint 3
- Full preview deferred to future iteration

### iframe Limitations
- Third-party sites may block iframe embedding
- Cookies and local storage isolated
- Some modern web features may be restricted

---

## Success Criteria

### All Tests Must Pass
✅ 90%+ test coverage
✅ All P0 and P1 tests passing
✅ No critical bugs
✅ Security vulnerabilities addressed
✅ Performance benchmarks met

### Documentation Complete
✅ Test cases documented
✅ Test results recorded
✅ Bug tickets created for failures
✅ Known limitations documented
