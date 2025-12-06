# Design System Setup Summary

This document summarizes the design system foundation that has been set up for the AI Incident Support Copilot application.

## Installed Dependencies

### Core UI Libraries
- **Tailwind CSS v4** - Utility-first CSS framework
- **@tailwindcss/postcss** - PostCSS plugin for Tailwind v4
- **Framer Motion** - Animation library for React
- **Lucide React** - Modern icon library
- **clsx** - Utility for constructing className strings
- **tailwind-merge** - Utility for merging Tailwind classes
- **date-fns** - Date utility library
- **react-hot-toast** - Toast notification system

### Development Dependencies
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - PostCSS plugin for vendor prefixes
- **@types/node** - TypeScript types for Node.js

## Configuration Files Created

### 1. `tailwind.config.js`
Tailwind CSS configuration with custom theme including:
- Extended color palette (primary, secondary, accent, success, warning, error, info)
- Dark mode support via `class` strategy
- Custom typography scale
- Custom spacing system
- Custom border radius values
- Custom box shadows

### 2. `postcss.config.js`
PostCSS configuration for Tailwind CSS v4 and Autoprefixer.

### 3. `src/config/theme.ts`
Comprehensive theme configuration file with:
- Light and dark mode color palettes
- Typography scale (xs to 4xl)
- Font weights
- Spacing system (0 to 16)
- Border radius values
- Box shadows
- Breakpoints
- Transition durations
- Z-index layers

### 4. `src/config/constants.ts`
UI constants including:
- Priority colors (critical, high, medium, low)
- Status colors (open, in_progress, resolved, closed)
- Tier colors (free, pro, enterprise)
- Animation durations
- Breakpoint values
- Z-index values

### 5. `src/lib/utils.ts`
Utility function `cn()` for merging Tailwind classes with proper precedence.

### 6. `src/styles.css`
Updated main stylesheet with:
- Tailwind directives (@tailwind base, components, utilities)
- CSS custom properties for theme colors
- Dark mode color variables
- Custom utility classes (transition-theme, shimmer)
- Legacy styles preserved for gradual migration

### 7. `components.json`
shadcn/ui configuration file for future component installation.

### 8. `tsconfig.json` (updated)
Added path aliases:
- `@/*` maps to `./src/*`

### 9. `vite.config.ts` (updated)
Added path resolution for `@` alias.

## Design Tokens

### Color System
- **Primary**: Deep navy (light) / Light text (dark)
- **Secondary**: Light gray (light) / Dark surface (dark)
- **Accent**: Vibrant blue
- **Semantic Colors**: Success (green), Warning (amber), Error (red), Info (cyan)

### Typography
- 8 font sizes from xs (12px) to 4xl (36px)
- 4 font weights: normal (400), medium (500), semibold (600), bold (700)

### Spacing
- Based on 4px base unit
- 9 spacing values from 0 to 16 (64px)

### Border Radius
- 5 values: sm (4px), md (8px), lg (12px), xl (16px), full (9999px)

### Shadows
- 4 elevation levels: sm, md, lg, xl

## Dark Mode Implementation

Dark mode is implemented using Tailwind's `class` strategy:
- Add `dark` class to root element to enable dark mode
- All colors have dark mode variants defined
- CSS variables automatically switch based on dark class
- Smooth transitions between themes

## Path Aliases

The following path aliases are configured:
- `@/` - Maps to `src/` directory
- Example: `import { theme } from '@/config'`

## Next Steps

With the foundation in place, you can now:

1. **Create atomic components** (Button, Badge, Input, etc.)
2. **Set up theme context** for dark mode toggle
3. **Install shadcn/ui components** as needed
4. **Create custom components** using the design system
5. **Migrate legacy styles** to Tailwind classes

## Verification

The setup has been verified:
- ✅ Build succeeds (`npm run build`)
- ✅ Dev server starts (`npm run dev`)
- ✅ No TypeScript errors
- ✅ Tailwind CSS is processing correctly
- ✅ Path aliases are working

## Usage Examples

### Using Theme Colors
```tsx
<div className="bg-primary text-primary-foreground">
  Content
</div>
```

### Using Custom Utilities
```tsx
<div className="transition-theme">
  Smooth theme transitions
</div>
```

### Using cn() Utility
```tsx
import { cn } from '@/lib/utils';

<button className={cn(
  'px-4 py-2 rounded-md',
  isActive && 'bg-accent text-accent-foreground'
)}>
  Button
</button>
```

### Dark Mode
```tsx
<html className={isDark ? 'dark' : ''}>
  {/* All components automatically adapt */}
</html>
```
