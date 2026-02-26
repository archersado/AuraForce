# Sprint 2: File Management Enhancement - User Guide

## Overview

Welcome to the enhanced Workspace Editor! This guide will walk you through the new features introduced in Sprint 2, designed to improve your file management experience.

---

## New Features at a Glance

✨ **Enhanced File Search** - Search in file contents, not just filenames
✨ **Drag-and-Drop Tabs** - Reorder your open files with ease
✨ **Tab Context Menu** - Right-click for quick actions
✨ **Advanced Image Preview** - Better zoom, fit modes, and metadata

---

## 1. Enhanced File Search

### Accessing File Search

**Keyboard Shortcut**: Press `Ctrl+F` (Windows/Linux) or `Cmd+F` (Mac)

**Via UI**: Click the search icon in the Workspace Panel toolbar

### Basic Search

1. Open file search with `Ctrl+F`
2. Type your search term
3. Results appear instantly (after 300ms)

### Content Search

**New!** You can now search inside your files, not just filenames.

**To enable content search**:

1. Open file search (`Ctrl+F`)
2. Check the "Search in content" checkbox
3. Type your search term
4. Results will show:
   - Files with matching names (highlighted)
   - Files with matching content (with match count badge)

### Using Filters

#### File Type Filter

Limit your search to specific file types:

- **All Types** - Search everything
- **Code Files** - .js, .ts, .jsx, .tsx, .json, .css, .html, .py, .go
- **Markdown** - .md, .mdx, .markdown
- **Images** - .png, .jpg, .jpeg, .gif, .svg
- **Other** - Everything else

#### Time Filter

Find files by when they were modified:

- **All Time** - No time restriction
- **Today** - Files modified in the last 24 hours
- **This Week** - Files modified in the last 7 days

### Expanding Results

Click "Expand" in the search results to see:

- Full file paths
- Content matches with line numbers
- Context snippets showing where matches appear

### Tips & Tricks

💡 **Quick search**: Just type `Ctrl+F` and start typing
💡 **Content search is smart**: Large files (>1MB) are automatically excluded
💡 **Case insensitive**: "readme" finds "README", "readme", "Readme"
💡 **Partial matches**: "use" finds "useEffect", "useState", "useCallback"

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+F` / `Cmd+F` | Open file search |
| `Esc` | Close search dialog |
| `Enter` | Open selected result |

---

## 2. Enhanced Tab System

### Opening Files

Click on any file in the file browser to open it in a new tab.

### Tabs Overview

Your open files appear as tabs at the top of the editor:

- **📄**: Text/code files
- **📝**: Markdown files
- **🖼️**: Image files
- **📁**: Directories

**Unsaved Changes**: A `*` appears next to files with unsaved changes.

### Drag-and-Drop Reordering

**New!** Rearrange your tabs to organize your workflow.

**How to drag a tab**:

1. Click and hold the drag handle (⋮⋮) on the left side of the tab
2. Drag the tab to your desired position
3. Release to drop

**Visual feedback**:
- Dragged tab becomes semi-transparent
- A "ghost" tab shows where it will be placed
- Other tabs smoothly move out of the way

### Tab Context Menu

**New!** Right-click on any tab for quick actions.

**Context menu options**:

1. **Close Tab** - Close the specific tab
   - Unsaved files will prompt for confirmation

2. **Close Others** - Keep only this tab open
   - Unsaved tabs will prompt for confirmation

3. **Copy Path** - Copy the file path to clipboard
   - Useful for sharing file locations

4. **Close All** - Close all tabs
   - All unsaved tabs will prompt for confirmation

### Closing Tabs

Multiple ways to close a tab:

| Method | Action |
|--------|--------|
| Click `×` button | Close tab |
| Middle-click (wheel) | Close tab quickly |
| Right-click → Close | Close with context menu |
| `Ctrl+W` | Close active tab |

### Tab Limit

You can have up to 10 open tabs. When you open the 11th file, the oldest inactive tab closes automatically.

### Tips & Tricks

💡 **Drag with confidence**: Dragging feels smooth and responsive
💡 **Right-click for speed**: Context menu is faster than toolbar buttons
💡 **Stay organized**: Group related tabs together by dragging
💡 **Copy paths**: Great for team collaboration

---

## 3. Advanced Image Preview

### Opening Images

Click on any image file (.png, .jpg, .gif, .svg) in the file browser to open the preview.

### Zoom Controls

Multiple ways to zoom in and out:

#### Buttons
- **➕** (Zoom In) - Increase zoom by 25%
- **➖** (Zoom Out) - Decrease zoom by 25%

#### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl++` / `Cmd++` | Zoom in |
| `Ctrl+-` / `Cmd+-` | Zoom out |
| `Ctrl+0` / `Cmd+0` | Reset zoom to 100% |

#### Zoom Presets
Click on any preset zoom level:
```
25% | 50% | 75% | 100% | 150% | 200% | 300% | 400%
```

**Note**: Presets appear when you're using manual zoom mode.

### Fit Modes

**New!** Three smart fit modes to help you view images correctly.

#### Fit to Screen (Default)
- Fits the entire image within the viewing area
- Best for viewing full images
- Icon: Minimize (⊟)

#### Fit to Width
- Stretches image to fill the horizontal space
- Great for wide panoramas
- Icon: Scan (▢)

#### Manual / None
- Zoom to exact percentage
- Use presets or +/- buttons
- Icon: Maximize (⛶)

**How to cycle through modes**:
- Click the fit mode button
- Or press `F` key

**Visual indicator**:
- Blue highlight = Active mode
- Gray = Inactive mode

### Rotation

Rotate your images in 90° increments.

**Methods**:
- Click the **↻** (Rotate) button
- Press `R` key

**Use cases**:
- Fix sideways photos
- Check portrait vs landscape
- Preview in different orientations

### Metadata Panel

**New!** View detailed information about your images.

**Toggle metadata**:
- Click the **📐** (metadata) button
- Panel slides down from toolbar

**Information displayed**:
- **Filename** - Full file name
- **Size** - File size (KB/MB)
- **Type** - MIME type (image/png, etc.)
- **Modified** - Last modified date
- **Dimensions** - Width × Height in pixels
- **Aspect Ratio** - Width/Height ratio

### Toolbar Actions

| Icon | Action | Shortcut |
|------|--------|----------|
| 🔍 Zoom | Zoom controls | `Ctrl++`, `Ctrl+-` |
| 🎯 Fit | Switch fit mode | `F` |
| ↻ Rotate | Rotate 90° | `R` |
| 📐 Meta | Toggle metadata panel | - |
- **⬇ Download** | Download image | - |
| **✕ Close** | Close preview | `Esc` |

### Status Bar

Bottom bar shows quick info:
- File size
- Modification date
- Image dimensions (when available)

### Tips & Tricks

💡 **Quick reset**: Press `Ctrl+0` to reset zoom immediately
💡 **Fit modes are smart**: They calculate the perfect zoom for you
💡 **Check details**: Use metadata panel to verify image properties
💡 **Keyboard power user**: All main actions have shortcuts
💡 **High-res images**: Zoom works fine even with large images

### Supported Formats

- **Images**: .png, .jpg, .jpeg, .gif, .svg, .webp, .bmp, .ico
- **Format support**: Same as your browser

### Known Limitations

- **EXIF data**: Camera metadata not extracted (feature request)
- **Panoramas**: No special handling for 360° images
- **Comparison**: No side-by-side view

---

## Keyboard Shortcuts Reference

### File Search

| Shortcut | Action |
|----------|--------|
| `Ctrl+F` / `Cmd+F` | Open file search |
| `Esc` | Close search dialog |

### Tab System

| Shortcut | Action |
|----------|--------|
| `Ctrl+W` / `Cmd+W` | Close active tab |
| Middle-click | Close tab under cursor |

### Image Preview

| Shortcut | Action |
|----------|--------|
| `Ctrl++` / `Cmd++` | Zoom in |
| `Ctrl+-` / `Cmd+-` | Zoom out |
| `Ctrl+0` / `Cmd+0` | Reset zoom |
| `R` | Rotate image 90° |
| `F` | Cycle fit modes (Screen → Width → None) |
| `Esc` | Close preview |

### Universal

| Shortcut | Action |
|----------|--------|
| `Esc` | Close any dialog/panel |
| `Ctrl+S` / `Cmd+S` | Save file |

---

## Performance Tips

### File Search

✅ **Fast searches**: Results appear in <500ms for <100 files
✅ **Content search**: Works with text files <1MB (excluded automatically)
✅ **Debounce**: Waits 300ms after you stop typing to search

### Tab System

✅ **Smooth dragging**: Tabs reorder at 60fps
✅ **Limit**: 10 tabs max to keep things fast
✅ **Context menu**: Opens in <50ms

### Image Preview

✅ **Quick load**: Images <10MB load in <2s
✅ **Smooth zoom**: 200ms transitions
✅ **Instant rotate**: CSS transform (no lag)

---

## Troubleshooting

### File Search Issues

**Problem**: Search is slow
- **Solution**: Limit search with file type or time filters
- **Solution**: Disable "Search in content" for faster results

**Problem**: Can't find a file
- **Solution**: Try different keywords or partial matches
- **Solution**: Check your file type filter
- **Solution**: Verify the file location

### Tab System Issues

**Problem**: Can't drag a tab
- **Solution**: Click and hold the drag handle (⋮⋮) on the left
- **Solution**: Try again with a more deliberate motion

**Problem**: Unsaved changes warning
- **Solution**: Save the file (`Ctrl+S`) before closing
- **Solution**: Click "OK" to discard changes

### Image Preview Issues

**Problem**: Image won't load
- **Solution**: Check internet connection (for remote files)
- **Solution**: Verify file format is supported
- **Solution**: Try clicking "Retry"

**Problem**: Zoom doesn't work
- **Solution**: Make sure you're not in a fit mode
- **Solution**: Click the fit mode button to switch to manual zoom
- **Solution**: Check that zoom isn't at min (25%) or max (400%)

---

## Getting Help

### Documentation
- Check the component docs in the codebase
- Read inline code comments

### Keyboard Shortcuts
- Use the shortcuts reference table above
- Look for tooltip hints on hover

### Feedback
- Report bugs through your team's issue tracker
- Suggest features for future sprints

---

## What's Next?

Future enhancements may include:
- Regular expression search
- Tab grouping and pinning
- EXIF metadata extraction
- Image annotation tools
- Side-by-side image comparison
- More file format support

---

## Quick Start Checklist

- [ ] Try `Ctrl+F` to open file search
- [ ] Test content search by checking the checkbox
- [ ] Drag a tab to a new position
- [ ] Right-click a tab and try "Copy Path"
- [ ] Open an image and test all zoom levels
- [ ] Try all three fit modes (Screen, Width, None)
- [ ] Toggle the metadata panel
- [ ] Use keyboard shortcuts for speed

**Enjoy the enhanced Workspace Editor!** 🚀

---

**Last Updated**: 2024-02-07
**Version**: 2.0.0 (Sprint 2)
