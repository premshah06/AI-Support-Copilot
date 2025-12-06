# Color Consistency Audit & Fixes

## Issues Found

### 1. Hardcoded Gray Colors
Many components use hardcoded `gray-X` colors instead of theme variables:
- `bg-gray-50`, `bg-gray-800`, `bg-gray-900` → Should use `bg-background`, `bg-card`, `bg-muted`
- `text-gray-900`, `text-gray-600`, `text-gray-400` → Should use `text-foreground`, `text-muted-foreground`
- `border-gray-200`, `border-gray-700` → Should use `border-border`

### 2. Inconsistent Dark Mode Handling
- Some components use `dark:` variants with hardcoded colors
- Should use CSS variables that automatically adapt

### 3. Components Needing Fixes

#### High Priority (Visible UI)
1. **ErrorBoundary.tsx** - Error page colors
2. **TicketList.tsx** - Empty state, ticket count text
3. **TicketDetail.tsx** - Card backgrounds, text colors
4. **Dialog.tsx** - Modal backgrounds and borders
5. **TicketsPage.tsx** - Page header text
6. **DashboardLayout.tsx** - Layout background

#### Medium Priority
7. **CustomerInfoCard.tsx** - Card styling
8. **ReplyEditor.tsx** - Editor background
9. **AISuggestionPanel.tsx** - Panel styling
10. **TicketCard.tsx** - Card backgrounds

## Solution

### Use Theme Variables
Replace hardcoded colors with theme-aware classes:

```tsx
// ❌ Bad - Hardcoded with dark variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// ✅ Good - Theme variables
<div className="bg-card text-card-foreground">
```

### Color Mapping Reference

| Old (Hardcoded) | New (Theme Variable) |
|----------------|---------------------|
| `bg-white dark:bg-gray-800` | `bg-card` |
| `bg-gray-50 dark:bg-gray-900` | `bg-background` |
| `bg-gray-100 dark:bg-gray-700` | `bg-muted` |
| `text-gray-900 dark:text-white` | `text-foreground` |
| `text-gray-600 dark:text-gray-400` | `text-muted-foreground` |
| `border-gray-200 dark:border-gray-700` | `border-border` |

## Implementation Plan

1. ✅ Update Tailwind config to use CSS variables
2. ✅ Update styles.css with proper theme variables
3. ✅ Create color mapping utility
4. 🔄 Fix high-priority components
5. 🔄 Fix medium-priority components
6. 🔄 Test light/dark mode transitions
