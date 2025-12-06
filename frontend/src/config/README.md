# Design System Configuration

This directory contains the design system configuration for the AI Incident Support Copilot application.

## Files

### `theme.ts`
Contains the complete theme configuration including:
- Color palette (light and dark modes)
- Typography scale
- Font weights
- Spacing system
- Border radius values
- Box shadows
- Breakpoints
- Transitions
- Z-index layers

### `constants.ts`
Contains UI constants including:
- Priority colors (critical, high, medium, low)
- Status colors (open, in_progress, resolved, closed)
- Tier colors (free, pro, enterprise)
- Animation durations
- Breakpoint values
- Z-index values

### `index.ts`
Central export point for all configuration files.

## Usage

### Importing Theme Configuration

```typescript
import { theme } from '@/config';

// Access theme values
const primaryColor = theme.colors.light.primary;
const spacing = theme.spacing[4];
```

### Using Constants

```typescript
import { PRIORITY_COLORS, STATUS_COLORS } from '@/config';

// Get priority-specific colors
const criticalColors = PRIORITY_COLORS.critical;
// Returns: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-300', ... }
```

### Using with Tailwind

The theme is configured in `tailwind.config.js` and CSS variables are defined in `src/styles.css`.

```tsx
// Use Tailwind classes directly
<div className="bg-primary text-primary-foreground">
  Content
</div>

// Use CSS variables
<div style={{ backgroundColor: 'hsl(var(--color-primary))' }}>
  Content
</div>
```

## Design Tokens

### Colors

All colors use HSL format for better manipulation and dark mode support.

**Light Mode:**
- Primary: Deep navy (`hsl(222, 47%, 11%)`)
- Secondary: Light gray (`hsl(210, 40%, 96%)`)
- Accent: Vibrant blue (`hsl(217, 91%, 60%)`)
- Success: Green (`hsl(142, 71%, 45%)`)
- Warning: Amber (`hsl(38, 92%, 50%)`)
- Error: Red (`hsl(0, 84%, 60%)`)
- Info: Cyan (`hsl(199, 89%, 48%)`)

**Dark Mode:**
- Colors are automatically adjusted for dark backgrounds
- Maintains WCAG AA contrast compliance

### Typography

Based on a modular scale with 8 sizes from `xs` (12px) to `4xl` (36px).

### Spacing

Based on a 4px base unit with values from `1` (4px) to `16` (64px).

### Shadows

Four shadow levels: `sm`, `md`, `lg`, `xl` for different elevation needs.

## Dark Mode

Dark mode is implemented using CSS classes. Add the `dark` class to the root element to enable dark mode.

```tsx
<html className={isDark ? 'dark' : ''}>
  {/* Content */}
</html>
```

## Extending the Theme

To add new design tokens:

1. Update `theme.ts` with new values
2. Add corresponding Tailwind config in `tailwind.config.js`
3. Add CSS variables in `src/styles.css` if needed
4. Update this README with documentation
