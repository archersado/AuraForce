# Sprint 2: File Management Enhancement - Test Case Design

## Test Strategy

### Testing Levels
1. **Unit Tests**: Individual component and function testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: User workflow testing with Playwright
4. **Accessibility Tests**: Keyboard navigation and screen reader support

### Testing Tools
- Jest + React Testing Library (Unit/Integration)
- Playwright (E2E)
- Axe DevTools (Accessibility)

---

## Story 14-9: File Search and Filter Test Cases

### TC-14-9-1: File Name Search
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-9-1-1 | 1. Open file search dialog (Ctrl+F)<br>2. Type "readme.md" in search box | File "readme.md" appears in results |
| TC-14-9-1-2 | 1. Open file search dialog<br>2. Type "README" (case insensitive) | Both "README.md" and "readme.md" appear |
| TC-14-9-1-3 | 1. type "index" in search box<br>2. Verify multiple results | Multiple files containing "index" appear |
| TC-14-9-1-4 | 1. Type non-existent filename<br>2. Submit search | "No files found" message displayed |

### TC-14-9-2: Content Search
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-9-2-1 | 1. Enable content search checkbox<br>2. Search for function name "useEffect" | Files containing "useEffect" appear |
| TC-14-9-2-2 | 1. Search for variable name "const user" | Files with exact match highlighted |
| TC-14-9-2-3 | 1. Search in file >1MB<br>2. Verify behavior | Large file excluded from content search |
| TC-14-9-2-4 | 1. Search with special chars<br>2. Verify matches | Special characters handled correctly |

### TC-14-9-3: File Type Filters
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-9-3-1 | 1. Select "Code Files" filter<br>2. View results | Only .ts, .tsx, .js, .jsx files shown |
| TC-14-9-3-2 | 1. Select "Markdown" filter<br>2. View results | Only .md files shown |
| TC-14-9-3-3 | 1. Select "Images" filter<br>2. View results | Only .png, .jpg, .gif, .svg shown |
| TC-14-9-3-4 | 1. Select "All Types" filter<br>2. View results | All file types shown |

### TC-14-9-4: Time Filters
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-9-4-1 | 1. Select "Today" filter<br>2. View results | Only files modified today shown |
| TC-14-9-4-2 | 1. Select "This Week" filter<br>2. View results | Files modified in last 7 days shown |
| TC-14-9-4-3 | 1. Select "All Time" filter<br>2. View results | All files shown regardless of date |

### TC-14-9-5: Search Result Selection
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-9-5-1 | 1. Search for file<br>2. Click on result | File opens in editor |
| TC-14-9-5-2 | 1. Search for directory<br>2. Click on result | Directory selected in file browser |
| TC-14-9-5-3 | 1. Select result<br>2. Verify search dialog closes | Search dialog closes after selection |

### TC-14-9-6: Keyboard Shortcuts
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-9-6-1 | 1. Press Ctrl+F | File search dialog opens |
| TC-14-9-6-2 | 1. Open search dialog<br>2. Press Esc | Dialog closes |
| TC-14-9-6-3 | 1. Type in search box<br>2. Verify auto-search | Results update after 300ms debounce |

---

## Story 14-8: Multi-file Tab System Test Cases

### TC-14-8-1: Tab Opening
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-8-1-1 | 1. Click on file in browser | Tab opens for file |
| TC-14-8-1-2 | 1. Click on same file again | Existing tab becomes active |
| TC-14-8-1-3 | 1. Open multiple files | Multiple tabs visible |
| TC-14-8-1-4 | 1. Open >10 files | Oldest inactive tab closes |

### TC-14-8-2: Tab Switching
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-8-2-1 | 1. Click on tab | Tab becomes active |
| TC-14-8-2-2 | 1. Edit file in Tab A<br>2. Switch to Tab B<br>3. Switch back to Tab A | Changes preserved in Tab A |
| TC-14-8-2-3 | 1. Use left/right arrow keys? | Tab switches (if implemented) |

### TC-14-8-3: Tab Closing
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-8-1-1 | 1. Click X on tab | Tab closes |
| TC-14-8-1-2 | 1. Middle-click on tab | Tab closes |
| TC-14-8-1-3 | 1. Edit file without saving<br>2. Try to close tab | Confirmation dialog shown |
| TC-14-8-1-4 | 1. Close active tab | Adjacent tab becomes active |

### TC-14-8-4: Tab Drag-and-Drop
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-8-4-1 | 1. Drag Tab A to position of Tab B | Tabs reorder |
| TC-14-8-4-2 | 1. Drag tab to end of list | Tab moves to last position |
| TC-14-8-4-3 | 1. Drag active tab | Active state preserved |
| TC-14-8-4-4 | 1. Drag tab with unsaved changes | Unsaved indicator preserved |

### TC-14-8-5: Tab Context Menu
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-8-5-1 | 1. Right-click on tab<br>2. Select "Close" | Tab closes |
| TC-14-8-5-2 | 1. Right-click on tab<br>2. Select "Close Others" | All other tabs close |
| TC-14-8-5-3 | 1. Right-click on tab<br>2. Select "Close All" | All tabs close |
| TC-14-8-5-4 | 1. Right-click on tab<br>2. Select "Copy Path" | File path copied to clipboard |
| TC-14-8-5-5 | 1. Right-click on unsaved tab<br>2. Select "Close" | Confirmation dialog shown |
| TC-14-8-5-6 | 1. Click outside context menu | Menu closes |

### TC-14-8-6: Tab Unsaved Indicator
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-8-6-1 | 1. Open file<br>2. Edit content | "*" appears next to filename |
| TC-14-8-6-2 | 1. Save file | "*" disappears |
| TC-14-8-6-3 | 1. Modify content<br>2. Close without saving | Confirmation dialog shown |
| TC-14-8-6-4 | 1. Click "Save" in confirmation | File saved, tab closes |

---

## Story 14-3: Image File Preview Test Cases

### TC-14-3-1: Image Loading
**Priority**: P0 (Critical)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-3-1-1 | 1. Click on .png file | Image displays |
| TC-14-3-1-2 | 1. Click on .jpg file | Image displays |
| TC-14-3-1-3 | 1. Click on .gif file | Animated GIF displays |
| TC-14-3-1-4 | 1. Click on .svg file | SVG displays correctly |

### TC-14-3-2: Image Zoom
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-3-2-1 | 1. Click Zoom In button | Zoom increases by 25% |
| TC-14-3-2-2 | 1. Click Zoom Out button | Zoom decreases by 25% |
| TC-14-3-2-3 | 1. Zoom to 400%<br>2. Click Zoom In | Cannot zoom beyond 400% |
| TC-14-3-2-4 | 1. Zoom to 25%<br>2. Click Zoom Out | Cannot zoom below 25% |
| TC-14-3-2-5 | 1. Click Reset button | Zoom returns to 100% |

### TC-14-3-3: Image Rotation
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-3-3-1 | 1. Click Rotate button | Image rotates 90° clockwise |
| TC-14-3-3-2 | 1. Click rotate 4 times | Image returns to original orientation |
| TC-14-3-3-3 | 1. Rotate + zoom<br>2. Verify both applied | Both transformations work together |

### TC-14-3-4: Image Metadata Display
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-3-4-1 | 1. Load image | File size displayed in status bar |
| TC-14-3-4-2 | 1. Load image | Modification date displayed |
| TC-14-3-4-3 | 1. Load image | Width × height dimensions displayed |
| TC-14-3-4-4 | 1. Load image | Format (mimeType) displayed in badge |

### TC-14-3-5: Image Download
**Priority**: P1 (High)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-14-3-5-1 | 1. Click Download button | Image downloaded with correct filename |
| TC-14-3-5-2 | 1. Download image<br>2. Verify file | Original file preserved |

---

## Performance Test Cases

### TC-PERF-1: Search Performance
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-PERF-1-1 | 1. Search in workspace with 100 files | Results within 500ms |
| TC-PERF-1-2 | 1. Content search in 50 files | Results within 1000ms |
| TC-PERF-1-3 | 1. Type with debouncing<br>2. Verify search not triggered | Search only after 300ms |

### TC-PERF-2: Tab System Performance
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-PERF-2-1 | 1. Open 10 tabs | Tabs render within 200ms |
| TC-PERF-2-2 | 1. Drag tab smoothly | No lag or stutter |
| TC-PERF-2-3 | 1. Switch between 10 tabs | Switch instant (<50ms) |

### TC-PERF-3: Image Preview Performance
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-PERF-3-1 | 1. Load 1MB image | Displays within 2s |
| TC-PERF-3-2 | 1. Load 10MB image | Shows warning or optimizes |
| TC-PERF-3-3 | 1. Zoom/rotate smoothly | No lag (<100ms response) |

---

## Accessibility Test Cases

### TC-A11Y-1: Keyboard Navigation
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-A11Y-1-1 | 1. Use Tab to navigate | All controls accessible via keyboard |
| TC-A11Y-1-2 | 1. Use Enter/Space to activate | Buttons work with keyboard |
| TC-A11Y-1-3 | 1. Use Esc to close dialogs | Dialogs close with Esc |

### TC-A11Y-2: Screen Reader Support
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-A11Y-2-1 | 1. Navigate with screen reader | All elements announced correctly |
| TC-A11Y-2-2 | 1. Check ARIA labels | All interactive elements have labels |
| TC-A11Y-2-3 | 1. Verify focus management | Focus moves logically |

---

## Browser Compatibility Test Cases

| Browser | Test Areas |
|---------|------------|
| Chrome (latest) | All features |
| Firefox (latest) | All features |
| Safari (latest) | All features |
| Edge (latest) | All features |

---

## Mobile/Tablet Test Cases (Optional)

### TC-MOB-1: Touch Interaction
| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-MOB-1-1 | 1. Tap file preview on mobile | File opens |
| TC-MOB-1-2 | 1. Long-press tab | Context menu appears |
| TC-MOB-1-3 | 1. Drag tab with touch | Tab reorders |

---

## Test Automation Plan

### Unit Tests (Jest + RTL)
- [x] FileSearch component tests
- [x] TabBar component tests
- [x] MediaPreview component tests
- [x] useTabsStore tests

### Integration Tests
- [x] File search + file selection workflow
- [x] Tab opening + editing + closing workflow
- [x] Image loading + zoom + rotate workflow

### E2E Tests (Playwright)
- [x] Complete file search, edit, save flow
- [x] Multi-tab management workflow
- [x] Image preview with transformations

---

## Test Execution Plan

### Phase 1: Unit Testing (Day 1)
- Write unit tests for all new components
- Run Jest suite
- Fix any failing tests

### Phase 2: Integration Testing (Day 2)
- Write integration tests for workflows
- Run interaction tests
- Verify component communication

### Phase 3: E2E Testing (Day 3)
- Write Playwright tests
- Run full user workflows
- Record test execution videos

### Phase 4: Manual Testing & Bug Fixing (Day 3-4)
- Execute manual test cases
- File bugs for any failures
- Fix bugs and re-test

---

## Bug Severity Classification

**Critical (P0)**:
- Feature completely broken or unusable
- Data loss or corruption

**High (P1)**:
- Feature partially broken
- Major usability issue

**Medium (P2)**:
- Minor feature issue
- Cosmetic problem

**Low (P3)**:
- Trivial issue
- Nice-to-have improvement
