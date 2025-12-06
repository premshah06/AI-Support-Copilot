/**
 * Design System Theme Configuration
 * 
 * This file contains all design tokens for the application including
 * colors, typography, spacing, shadows, and other visual properties.
 */

export const theme = {
  colors: {
    light: {
      primary: 'hsl(0, 0%, 9%)',
      primaryForeground: 'hsl(0, 0%, 100%)',
      secondary: 'hsl(0, 0%, 96%)',
      secondaryForeground: 'hsl(0, 0%, 9%)',
      accent: 'hsl(211, 100%, 50%)',
      accentForeground: 'hsl(0, 0%, 100%)',
      success: 'hsl(122, 39%, 49%)',
      successForeground: 'hsl(0, 0%, 100%)',
      warning: 'hsl(36, 100%, 50%)',
      warningForeground: 'hsl(0, 0%, 100%)',
      error: 'hsl(4, 90%, 58%)',
      errorForeground: 'hsl(0, 0%, 100%)',
      info: 'hsl(199, 92%, 56%)',
      infoForeground: 'hsl(0, 0%, 100%)',
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(0, 0%, 9%)',
      muted: 'hsl(0, 0%, 96%)',
      mutedForeground: 'hsl(0, 0%, 40%)',
      border: 'hsl(0, 0%, 88%)',
    },
    dark: {
      primary: 'hsl(0, 0%, 90%)',
      primaryForeground: 'hsl(0, 0%, 10%)',
      secondary: 'hsl(0, 0%, 18%)',
      secondaryForeground: 'hsl(0, 0%, 90%)',
      accent: 'hsl(207, 90%, 61%)',
      accentForeground: 'hsl(0, 0%, 10%)',
      success: 'hsl(122, 39%, 49%)',
      successForeground: 'hsl(0, 0%, 10%)',
      warning: 'hsl(36, 100%, 50%)',
      warningForeground: 'hsl(0, 0%, 10%)',
      error: 'hsl(4, 90%, 58%)',
      errorForeground: 'hsl(0, 0%, 10%)',
      info: 'hsl(199, 92%, 56%)',
      infoForeground: 'hsl(0, 0%, 10%)',
      background: 'hsl(0, 0%, 8%)',
      foreground: 'hsl(0, 0%, 90%)',
      muted: 'hsl(0, 0%, 15%)',
      mutedForeground: 'hsl(0, 0%, 60%)',
      border: 'hsl(0, 0%, 20%)',
    },
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
  },
  
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',  // Fully rounded
  },
  
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof theme;
export type ThemeMode = 'light' | 'dark';
