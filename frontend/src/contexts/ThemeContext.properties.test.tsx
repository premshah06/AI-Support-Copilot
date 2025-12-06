import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import { ThemeProvider, useTheme } from './ThemeContext';

// **Feature: ui-modernization, Property 10: Theme persistence round-trip**
// **Validates: Requirements 9.3**

const THEME_STORAGE_KEY = 'app-theme-preference';

describe('Property: Theme persistence round-trip', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should persist and retrieve theme preference correctly for any theme value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const),
        (theme) => {
          // Render the hook with ThemeProvider
          const { result } = renderHook(() => useTheme(), {
            wrapper: ThemeProvider,
          });

          // Set the theme
          act(() => {
            result.current.setTheme(theme);
          });

          // Verify the theme is set in the hook
          expect(result.current.theme).toBe(theme);

          // Verify the theme is persisted to localStorage
          const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
          expect(storedTheme).toBe(theme);

          // Simulate a page reload by creating a new hook instance
          const { result: reloadedResult } = renderHook(() => useTheme(), {
            wrapper: ThemeProvider,
          });

          // Verify the theme is retrieved correctly after "reload"
          expect(reloadedResult.current.theme).toBe(theme);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain theme consistency through multiple toggle operations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const),
        fc.integer({ min: 0, max: 10 }),
        (initialTheme, toggleCount) => {
          // Render the hook with ThemeProvider
          const { result } = renderHook(() => useTheme(), {
            wrapper: ThemeProvider,
          });

          // Set initial theme
          act(() => {
            result.current.setTheme(initialTheme);
          });

          // Perform multiple toggles
          for (let i = 0; i < toggleCount; i++) {
            act(() => {
              result.current.toggleTheme();
            });
          }

          // Calculate expected theme after toggles
          const expectedTheme = toggleCount % 2 === 0 ? initialTheme : (initialTheme === 'light' ? 'dark' : 'light');

          // Verify the final theme matches expected
          expect(result.current.theme).toBe(expectedTheme);

          // Verify localStorage matches
          const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
          expect(storedTheme).toBe(expectedTheme);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle direct localStorage manipulation and reload correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const),
        (theme) => {
          // Directly set theme in localStorage (simulating external modification)
          localStorage.setItem(THEME_STORAGE_KEY, theme);

          // Create a new hook instance (simulating page load)
          const { result } = renderHook(() => useTheme(), {
            wrapper: ThemeProvider,
          });

          // Verify the theme is loaded from localStorage
          expect(result.current.theme).toBe(theme);

          // Verify the document has the correct class
          expect(document.documentElement.classList.contains(theme)).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
