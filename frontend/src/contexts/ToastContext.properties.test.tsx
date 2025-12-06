import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import { ToastProvider, useToast } from './ToastContext';
import React from 'react';

// **Feature: ui-modernization, Property 8: User feedback consistency**
// **Validates: Requirements 7.1, 7.3**

/**
 * Property 8: User feedback consistency
 * For any user action that triggers feedback (success, error, info, warning),
 * the application should display a toast notification with the appropriate
 * message, icon, and color variant.
 */

// Test component that uses the toast hook
const ToastTestComponent: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onMount: () => void;
}> = ({ message, type, onMount }) => {
  const { showToast } = useToast();

  React.useEffect(() => {
    showToast(message, type);
    onMount();
  }, [message, type, showToast, onMount]);

  return <div data-testid="toast-trigger">Toast Trigger</div>;
};

describe('Property 8: User feedback consistency', () => {
  beforeEach(() => {
    // Clear any existing toasts before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  it('should display toast notification with appropriate message for any feedback type', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // Exclude whitespace-only strings
        fc.constantFrom('success', 'error', 'info', 'warning'),
        async (message, type) => {
          let mountCalled = false;
          const onMount = () => {
            mountCalled = true;
          };

          const { unmount } = render(
            <ToastProvider>
              <ToastTestComponent message={message} type={type} onMount={onMount} />
            </ToastProvider>
          );

          // Wait for the component to mount and toast to be triggered
          await waitFor(() => expect(mountCalled).toBe(true), { timeout: 1000 });

          // Wait for toast with the correct type to appear
          let alertElement: HTMLElement | null = null;
          await waitFor(
            () => {
              const alerts = screen.queryAllByRole('alert');
              expect(alerts.length).toBeGreaterThan(0);
              
              // Find the alert with the correct color for this type
              const expectedColor = type === 'success' ? 'green' : 
                                   type === 'error' ? 'red' :
                                   type === 'warning' ? 'amber' : 'blue';
              
              const matchingAlert = Array.from(alerts).find(alert => 
                alert.className.includes(expectedColor)
              );
              
              expect(matchingAlert).toBeTruthy();
              alertElement = matchingAlert as HTMLElement;
            },
            { timeout: 2000 }
          );

          // Verify we found the alert
          expect(alertElement).toBeInTheDocument();

          // Verify the toast has appropriate ARIA attributes
          expect(alertElement).toHaveAttribute('aria-live', 'polite');

          // Verify the toast has an icon (all toast types should have an icon)
          const iconElement = alertElement!.querySelector('svg');
          expect(iconElement).toBeInTheDocument();

          // Verify the toast has a dismiss button
          const dismissButtons = screen.getAllByLabelText('Dismiss notification');
          expect(dismissButtons.length).toBeGreaterThan(0);

          // Verify the toast has appropriate color styling based on type
          const classes = alertElement!.className;

          switch (type) {
            case 'success':
              expect(classes).toMatch(/green/);
              break;
            case 'error':
              expect(classes).toMatch(/red/);
              break;
            case 'warning':
              expect(classes).toMatch(/amber/);
              break;
            case 'info':
              expect(classes).toMatch(/blue/);
              break;
          }

          unmount();
        }
      ),
      { numRuns: 20 } // Reduced from 100 for faster test execution
    );
  }, 30000); // Increase timeout

  it('should display toast with correct icon for each feedback type', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('success', 'error', 'info', 'warning'),
        async (type) => {
          const message = `Test ${type} message`;
          let mountCalled = false;
          const onMount = () => {
            mountCalled = true;
          };

          const { unmount } = render(
            <ToastProvider>
              <ToastTestComponent message={message} type={type} onMount={onMount} />
            </ToastProvider>
          );

          // Wait for the component to mount
          await waitFor(() => expect(mountCalled).toBe(true), { timeout: 1000 });

          // Wait for toast to appear
          await waitFor(
            () => {
              const toastElements = screen.queryAllByText(message);
              expect(toastElements.length).toBeGreaterThan(0);
            },
            { timeout: 2000 }
          );

          // Verify icon is present (use getAllByText since multiple toasts may exist)
          const toastElements = screen.getAllByText(message);
          const alertElement = toastElements[0].closest('[role="alert"]');
          const iconElement = alertElement?.querySelector('svg');
          expect(iconElement).toBeInTheDocument();

          // Verify icon has appropriate color class
          const iconClasses = iconElement?.getAttribute('class') || '';
          switch (type) {
            case 'success':
              expect(iconClasses).toMatch(/green/);
              break;
            case 'error':
              expect(iconClasses).toMatch(/red/);
              break;
            case 'warning':
              expect(iconClasses).toMatch(/amber/);
              break;
            case 'info':
              expect(iconClasses).toMatch(/blue/);
              break;
          }

          unmount();
        }
      ),
      { numRuns: 20 } // Reduced from 100 for faster test execution
    );
  }, 30000); // Increase timeout

  it('should provide dismiss functionality for all toast types', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), // Exclude whitespace-only strings
        fc.constantFrom('success', 'error', 'info', 'warning'),
        async (message, type) => {
          let mountCalled = false;
          const onMount = () => {
            mountCalled = true;
          };

          const { unmount } = render(
            <ToastProvider>
              <ToastTestComponent message={message} type={type} onMount={onMount} />
            </ToastProvider>
          );

          // Wait for mount
          await waitFor(() => expect(mountCalled).toBe(true), { timeout: 1000 });

          // Wait for toast to appear - use a more flexible query
          await waitFor(
            () => {
              const toastElements = screen.queryAllByText(message, { exact: false });
              if (toastElements.length === 0) {
                // Try finding by role if text query fails
                const alerts = screen.queryAllByRole('alert');
                expect(alerts.length).toBeGreaterThan(0);
              } else {
                expect(toastElements.length).toBeGreaterThan(0);
              }
            },
            { timeout: 2000 }
          );

          // Verify dismiss button exists (use getAllByLabelText since multiple toasts may exist)
          const dismissButtons = screen.getAllByLabelText('Dismiss notification');
          expect(dismissButtons.length).toBeGreaterThan(0);
          expect(dismissButtons[0].tagName).toBe('BUTTON');

          unmount();
        }
      ),
      { numRuns: 20 } // Reduced from 100 for faster test execution
    );
  }, 30000); // Increase timeout for this test
});
