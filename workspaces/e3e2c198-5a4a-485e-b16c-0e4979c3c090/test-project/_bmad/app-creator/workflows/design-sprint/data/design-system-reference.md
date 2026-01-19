# Design System Reference

Design system components, patterns, and best practices.

## Color Theory

### Color Psychology
- **Blue**: Trust, professionalism, calm
- **Green**: Growth, freshness, success
- **Purple**: Creativity, luxury, wisdom
- **Orange**: Energy, enthusiasm, warmth
- **Red**: Urgency, passion, excitement
- **Yellow**: Optimism, happiness, caution
- **Black**: Sophistication, elegance, power
- **White**: Purity, cleanliness, simplicity

### Color Contrast Guidelines
- **WCAG AA**: Minimum 4.5:1 contrast ratio for normal text
- **WCAG AAA**: Minimum 7:1 contrast ratio for normal text
- **Large text**: 3:1 contrast ratio minimum
- **Non-text elements**: 3:1 contrast ratio

### Color Palette Examples

#### Primary Color Combinations
1. **Monochromatic** - Single hue, various tints/shades
2. **Analogous** - Adjacent colors on color wheel
3. **Complementary** - Opposite colors for high contrast
4. **Split Complementary** - Base + two adjacent to complementary
5. **Triadic** - Three colors equally spaced
6. **Tetradic** - Four colors forming rectangle

#### Accessibility Color Palettes
Always test color combinations for accessibility:
```css
.example-text { color: #333333; background: #FFFFFF; } /* High contrast */
.success { color: #FFFFFF; background: #28A745; } /* 4.5:1+ contrast */
.warning { color: #333333; background: #FFC107; }
.error { color: #FFFFFF; background: #DC3545; }
```

## Typography

### Type Classification
- **Serif**: Traditional, editorial, trustworthy
- **Sans-Serif**: Modern, clean, versatile
- **Display**: Headers, branding, emphasis
- **Monospace**: Code, data, technical

### Font Sizing Scale
Use modular scale for consistent typography:
```css
- Base: 16px (1rem)
- Scale: 1.25 (major third)

h1: 1rem × 1.25⁴ = 3.052rem
h2: 1rem × 1.25³ = 2.441rem
h3: 1rem × 1.25² = 1.953rem
h4: 1rem × 1.25¹ = 1.563rem
body: 1rem
small: 1rem × 0.8 = 0.8rem
```

### Line Height Guidelines
- Headings: 1.1-1.3
- Body text: 1.4-1.6
- Captions: 1.2-1.4

### Responsive Typography
```css
html {
  font-size: 16px;
}
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
/* All rem-based typography scales automatically */
```

## Spacing System

### Modular Spacing Scale
Use consistent spacing values:
```css
--space-xs: 0.25rem;  4px
--space-sm: 0.5rem;   8px
--space-md: 1rem;     16px
--space-lg: 1.5rem;   24px
--space-xl: 2rem;     32px
--space-xxl: 3rem;    48px
--space-xxxl: 4rem;   64px
```

### Spacing Principles
- **Vertical Rhythm**: Consistent vertical spacing
- **Gutters**: Fixed width for consistent columns
- **Padding**: Breathing room around content
- **Margins**: Space between related elements

## Layout Patterns

### Common Layouts

#### Card Layout
```
[Header    ]
[Content  ]
[Footer    ]
```

#### Dashboard Layout
```
[Navigation] [Header]
[       Sidebar    ]
[           Content      ]
```

#### Master-Detail
```
[List  |  Detail]
[Items |  Content]
```

#### Split Screen
```
[  Left  |  Right ]
[ Content | Content]
```

#### Masonry Grid
```
[ ][ ][    ]
[ ][ ][ ][]
[    ][ ][]
```

### Responsive Breakpoints
- **XS**: 0-575px (Mobile portrait)
- **SM**: 576-767px (Mobile landscape)
- **MD**: 768-991px (Tablet portrait)
- **LG**: 992-1199px (Tablet landscape, small desktop)
- **XL**: 1200-1399px (Desktop)
- **XXL**: 1400+px (Large desktop)

## Button Patterns

### Button Types
1. **Primary**: Main action, emphasized
2. **Secondary**: Alternative action, less emphasis
3. **Tertiary**: Minimal action, ghost button
4. **Destructive**: Destructive action, red/warning
5. **Text**: Minimal visual weight, text-only
6. **Icon**: Icon-only, needs tooltip

### Button States
- Default
- Hover
- Active/Pressed
- Disabled
- Loading

### Button Sizes
- Small (32px height)
- Medium (40px height)
- Large (48px height)

## Form Patterns

### Input Field Design
- Label placement (above or left)
- Placeholder text vs helper text
- Error states
- Success states
- Disabled states

### Form Validation
- Real-time validation
- Error messaging
- Helper text
- Required field indicators

### Form Layouts
- Single column
- Two column
- Inline labels
- Stacked labels

## Iconography

### Icon Guidelines
- **Consistent style**: Use same icon set throughout
- **Appropriate size**: 16px, 24px, 32px, 48px
- **Clear meaning**: Icon purpose should be obvious
- **Accessible**: Screen reader friendly

### Common Icon Sets
- Material Design Icons (Google)
- Feather Icons (Clean, modern)
- Lucide Icons (Feather Fork)
- Heroicons (Tailwind)
- FontAwesome (Comprehensive)

## Animation & Micro-interactions

### Motion Principles
1. **Purposeful**: Every animation should have a purpose
2. **Fast**: Animations should be quick (200-500ms)
3. **Natural**: Use easing for natural feel
4. **Smooth**: Consistent timing across the product

### Common Animations
- **Fade**: Opacity change (300ms)
- **Slide**: Position change (300ms)
- **Scale**: Size change (200ms)
- **Rotate**: Rotation (200ms)
- **Bounce**: Subtle spring effect (400ms)

### Easing Functions
- **ease-in**: Fast start, slow end
- **ease-out**: Slow start, fast end
- **ease-in-out**: Slow both ends, fast middle (recommended)
- **cubic-bezier**: Custom easing for specific animations

## Component Patterns

### Navigation
- Top navigation bar
- Bottom navigation (mobile)
- Sidebar navigation
- Breadcrumbs
- Pagination

### Content Display
- Cards
- Lists (default, horizontal, masonry)
- Tables (default, sortable, expandable)
- Accordions
- Tabs

### Feedback
- Toast notifications
- Modals
- Alerts
- Progress bars
- Spinners/loaders

### Data Entry
- Forms
- Date pickers
- Dropdowns
- Checkboxes
- Radio buttons
- Toggles

## Accessibility Guidelines

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to activate
- Escape to close modals/menus
- Arrow keys for directional navigation

### Screen Reader Support
- Semantic HTML
- ARIA labels
- Alt text for images
- Descriptive link text
- Proper headings hierarchy

### Visual Accessibility
- Color contrast (4.5:1+)
- Text resize support (200%)
- Focus indicators
- No images of text
- Captions for video

## Mobile-First Patterns

### Touch Targets
- Minimum 44x44px
- Spacing between touch targets
- Large hit areas for small screens

### Gestures
- Tap: Primary action
- Long press: Context menu
- Swipe: Navigation or actions
- Pinch: Zoom

### Mobile Considerations
- Thumb-friendly zones
- Reduced scrolling
- Simplified workflows
- Offline support

## Design Tools Resources

### Wireframing Tools
- Balsamiq: Quick wireframes
- Figma: Cloud-based, collaborative
- Sketch: Mac-only design
- Adobe XD: Adobe ecosystem

### Prototyping Tools
- Figma: Design + prototype
- InVision: Prototyping
- ProtoPie: Advanced interactions
- Axure: Complex prototypes

### Design Systems
- Figma Components: Create reusable components
- Storybook: Component documentation
- ZeroHeight: Design system documentation
- Framer: React component prototyping