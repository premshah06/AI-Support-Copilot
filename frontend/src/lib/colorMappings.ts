/**
 * Color Mapping Utility
 * 
 * This file provides consistent color class mappings that work with both
 * light and dark modes using CSS variables.
 * 
 * Usage: Import these constants instead of hardcoding Tailwind classes
 */

export const colors = {
  // Background colors
  bg: {
    page: 'bg-background',
    card: 'bg-card',
    muted: 'bg-muted',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    error: 'bg-error',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info',
  },
  
  // Text colors
  text: {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    accent: 'text-accent',
    error: 'text-error',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    onPrimary: 'text-primary-foreground',
    onAccent: 'text-accent-foreground',
    onCard: 'text-card-foreground',
  },
  
  // Border colors
  border: {
    default: 'border-border',
    muted: 'border-muted',
    accent: 'border-accent',
    error: 'border-error',
    success: 'border-success',
  },
  
  // Hover states
  hover: {
    card: 'hover:bg-card/80',
    muted: 'hover:bg-muted/80',
    accent: 'hover:bg-accent/90',
    secondary: 'hover:bg-secondary/80',
  },
} as const;

/**
 * Get consistent class names for common UI patterns
 */
export const uiPatterns = {
  card: `${colors.bg.card} ${colors.text.primary} ${colors.border.default} border rounded-lg shadow-sm`,
  cardHover: `${colors.bg.card} ${colors.text.primary} ${colors.border.default} border rounded-lg shadow-sm ${colors.hover.card} transition-colors`,
  emptyState: `${colors.bg.muted} ${colors.text.secondary} border-2 border-dashed ${colors.border.muted} rounded-xl`,
  errorState: `${colors.bg.error}/10 ${colors.text.error} ${colors.border.error} border rounded-lg`,
} as const;
