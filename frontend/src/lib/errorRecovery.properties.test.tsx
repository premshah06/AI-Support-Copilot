/**
 * Property-based tests for error recovery availability
 * Tests that all error states provide recovery actions
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { ErrorState } from '@/components/molecules/ErrorState';

// **Feature: ui-modernization, Property 18: Error recovery availability**
describe('Property: Error recovery availability', () => {
  it('should provide at least one recovery action for any error state', () => {
    fc.assert(
      fc.property(
        fc.record({
          message: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
          title: fc.option(fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined }),
          variant: fc.constantFrom('error' as const, 'warning' as const, 'info' as const),
        }),
        ({ message, title, variant }) => {
          // Test with retry action
          const { container: container1, unmount: unmount1 } = render(
            <ErrorState
              message={message}
              title={title}
              variant={variant}
              onRetry={() => {}}
            />
          );

          // Should have a retry button
          const retryButton = screen.queryByText(/retry/i);
          expect(retryButton).toBeTruthy();
          unmount1();

          // Test with dismiss action
          const { container: container2, unmount: unmount2 } = render(
            <ErrorState
              message={message}
              title={title}
              variant={variant}
              onDismiss={() => {}}
            />
          );

          // Should have a dismiss button
          const dismissButton = screen.queryByText(/dismiss/i);
          expect(dismissButton).toBeTruthy();
          unmount2();

          // Test with go back action
          const { container: container3, unmount: unmount3 } = render(
            <ErrorState
              message={message}
              title={title}
              variant={variant}
              onGoBack={() => {}}
            />
          );

          // Should have a go back button
          const goBackButton = screen.queryByText(/go back/i);
          expect(goBackButton).toBeTruthy();
          unmount3();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display custom recovery actions when provided', () => {
    fc.assert(
      fc.property(
        fc.record({
          message: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
          actionLabel: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length > 0),
        }).filter(({ message, actionLabel }) => {
          // Ensure message and actionLabel are distinct to avoid DOM query ambiguity
          const trimmedMessage = message.trim();
          const trimmedLabel = actionLabel.trim();
          return trimmedMessage !== trimmedLabel && !trimmedMessage.includes(trimmedLabel);
        }),
        ({ message, actionLabel }) => {
          const { unmount } = render(
            <ErrorState
              message={message}
              customAction={{
                label: actionLabel,
                onClick: () => {},
              }}
            />
          );

          // Should display the custom action button
          const customButton = screen.getByText(actionLabel.trim());
          expect(customButton).toBeInTheDocument();

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should support multiple recovery actions simultaneously', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
        (message) => {
          const { unmount } = render(
            <ErrorState
              message={message}
              onRetry={() => {}}
              onDismiss={() => {}}
              onGoBack={() => {}}
            />
          );

          // Should have all three buttons
          const retryButton = screen.queryByText(/retry/i);
          const dismissButton = screen.queryByText(/dismiss/i);
          const goBackButton = screen.queryByText(/go back/i);

          expect(retryButton).toBeTruthy();
          expect(dismissButton).toBeTruthy();
          expect(goBackButton).toBeTruthy();

          unmount();
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should render error states with proper ARIA attributes for accessibility', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
        (message) => {
          const { container, unmount } = render(
            <ErrorState
              message={message}
              onRetry={() => {}}
            />
          );

          // Should have role="alert" for screen readers
          const alertElement = container.querySelector('[role="alert"]');
          expect(alertElement).toBeTruthy();

          // Should have aria-live for dynamic updates
          const liveElement = container.querySelector('[aria-live]');
          expect(liveElement).toBeTruthy();

          unmount();
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should display error message for any error variant', () => {
    fc.assert(
      fc.property(
        fc.record({
          message: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
          variant: fc.constantFrom('error' as const, 'warning' as const, 'info' as const),
        }),
        ({ message, variant }) => {
          const { container, unmount } = render(
            <ErrorState
              message={message}
              variant={variant}
              onRetry={() => {}}
            />
          );

          // Should display the error message
          expect(container.textContent).toContain(message.trim());

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render recovery buttons as interactive elements', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
        (message) => {
          const { unmount } = render(
            <ErrorState
              message={message}
              onRetry={() => {}}
              onDismiss={() => {}}
            />
          );

          // Buttons should be in the document
          const retryButton = screen.queryByText(/retry/i);
          const dismissButton = screen.queryByText(/dismiss/i);

          expect(retryButton).toBeTruthy();
          expect(dismissButton).toBeTruthy();

          // Buttons should be clickable (not disabled)
          expect(retryButton?.closest('button')).not.toBeDisabled();
          expect(dismissButton?.closest('button')).not.toBeDisabled();

          unmount();
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should handle different error sizes consistently', () => {
    fc.assert(
      fc.property(
        fc.record({
          message: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
          size: fc.constantFrom('sm' as const, 'md' as const, 'lg' as const),
        }),
        ({ message, size }) => {
          const { container, unmount } = render(
            <ErrorState
              message={message}
              size={size}
              onRetry={() => {}}
            />
          );

          // Should render regardless of size
          expect(container.textContent).toContain(message.trim());

          // Should have retry button
          expect(container.textContent).toMatch(/retry/i);

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should display optional error details when provided', () => {
    fc.assert(
      fc.property(
        fc.record({
          message: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
          details: fc.option(fc.string({ minLength: 20, maxLength: 200 }).filter(s => s.trim().length > 0), { nil: undefined }),
        }),
        ({ message, details }) => {
          const { container, unmount } = render(
            <ErrorState
              message={message}
              details={details}
              onRetry={() => {}}
            />
          );

          // Should always display the main message
          expect(container.textContent).toContain(message.trim());

          // If details provided, should have a way to show them
          if (details) {
            expect(container.textContent).toMatch(/show details/i);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
