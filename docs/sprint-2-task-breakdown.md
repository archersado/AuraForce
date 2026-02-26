# Sprint 2: File Management Enhancement - Task Breakdown

## Overview
Sprint 2 focuses on enhancing file management capabilities in the Workspace Editor with three main features:
1. File Search and Filter (ARC-126)
2. Multi-file Tab System (ARC-125)
3. Image File Preview (ARC-122)

## Current Status Analysis

### ✅ Already Implemented
- File search by filename with type and time filters
- File search result highlighting
- Basic tab system with close/save functionality
- Image preview with zoom and rotation controls
- Tab state management with unsaved change tracking

### ❌ Needs Implementation
- Content search in files (file content search)
- Ctrl+F shortcut for file search
- Tab drag-and-drop reordering
- Tab right-click context menu

---

## Task Breakdown

### Task 1-1: Enhance File Search with Content Search
**Story**: STORY-14-9 (ARC-126)
**Priority**: P2
**Estimate**: 0.5 day

**Subtasks**:
1. Add content search option to FileSearch component
2. Implement file content reading for text-based files
3. Create content search indexer/algorithm
4. Add visual indicator for content matches
5. Optimize search performance for large files

**Acceptance Criteria**:
- User can search for text within file contents
- Search results show filename and matching content snippet
- Content search can be toggled on/off
- Large files (>1MB) are excluded from content search

---

### Task 1-2: Add Ctrl+F Shortcut for File Search
**Story**: STORY-14-9 (ARC-126)
**Priority**: P2
**Estimate**: 0.25 day

**Subtasks**:
1. Update keyboard shortcut from Ctrl+K to Ctrl+F
2. Add Ctrl+K for command palette (future feature)
3. Update documentation and tooltips
4. Add visual shortcut indicator in UI

**Acceptance Criteria**:
- Ctrl+F opens file search dialog
- Shortcut hint displayed in UI
- Documentation updated

---

### Task 2-1: Implement Tab Drag-and-Drop Reordering
**Story**: STORY-14-8 (ARC-125)
**Priority**: P2
**Estimate**: 0.75 day

**Subtasks**:
1. Install and configure @dnd-kit dependencies
2. Create draggable tab items with DndContext
3. Implement handle for drag interaction
4. Connect drag events to reorderTab store action
5. Add visual feedback during drag (opacity, cursor)
6. Test drag behavior on different screen sizes

**Acceptance Criteria**:
- Tabs can be reordered by dragging
- Drag operation has smooth visual feedback
- Active tab state preserved after reordering
- Works on touch devices

---

### Task 2-2: Implement Tab Right-Click Context Menu
**Story**: STORY-14-8 (ARC-125)
**Priority**: P2
**Estimate**: 0.5 day

**Subtasks**:
1. Create ContextMenu component using Radix UI
2. Add menu items: Close, Close Others, Close All, Copy Path
3. Position menu based on click coordinates
4. Handle menu actions with proper state management
5. Add unsaved changes confirmation
6. Styling to match design system

**Acceptance Criteria**:
- Right-click on tab shows context menu
- All menu options work correctly
- Unsaved tab shows warning before closing
- Menu closes on click outside or ESC

---

### Task 3-1: Enhance Image Preview Features
**Story**: STORY-14-3 (ARC-122)
**Priority**: P2
**Estimate**: 0.5 day

**Subtasks**:
1. Add image dimensions display (width x height)
2. Enhance zoom controls with preset levels (25%, 50%, 100%, 200%, 400%)
3. Add fit-to-screen and fit-to-width options
4. Show image metadata (EXIF data if available)
5. Add thumbnail grid for multiple images in directory

**Acceptance Criteria**:
- Image dimensions displayed when loading completes
- Additional zoom presets available
- Fit options work correctly
- Basic metadata shown for images

---

## Implementation Order

### Phase 1: File Search Enhancements (1 day)
- Task 1-1: Content search implementation
- Task 1-2: Ctrl+F shortcut

### Phase 2: Tab System Enhancements (1.25 days)
- Task 2-1: Drag-and-drop reordering
- Task 2-2: Context menu

### Phase 3: Image Preview Enhancements (0.5 day)
- Task 3-1: Enhanced preview features

### Phase 4: Testing & QA (1 day)
- Unit tests for new features
- Integration testing
- E2E testing with Playwright
- Bug fixes

### Phase 5: Documentation & Delivery (0.25 day)
- Update documentation
- Create user guide
- Final delivery

**Total Estimate**: 4 days (within 5-8 day budget)

---

## Dependencies

**Technical Dependencies**:
- @dnd-kit/* packages already installed
- zustand store already configured
- Radix UI components available

**Feature Dependencies**:
- Task 1-1 must be completed before Task 1-2
- Task 2-1 can be done in parallel with Task 2-2
- Task 3-1 is independent of other tasks

---

## Risk Assessment

**Medium Risk**:
- Content search performance with large codebases
- Drag-and-drop behavior on mobile devices

**Mitigation**:
- Exclude files >1MB from content search
- Add debouncing to search input
- Test drag behavior on mobile browsers
- Consider mobile-specific UI if needed

---

## Success Metrics

- File search returns results within 500ms for <100 files
- Tab reordering works smoothly with <50 tabs
- Image preview loads within 2s for <10MB images
- E2E tests pass with 100% coverage for new features
