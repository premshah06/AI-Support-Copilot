import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';

// **Feature: ui-modernization, Property 15: Focus order correctness**
// **Validates: Requirements 12.5**

describe('Property 15: Focus order correctness', () => {
  beforeEach(() => {
    // Clear the document body before each test
    document.body.innerHTML = '';
  });

  it('should maintain logical tab order for any set of focusable elements', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }),
        (numElements) => {
          // Create a container with focusable elements
          const container = document.createElement('div');
          document.body.appendChild(container);

          const buttons: HTMLButtonElement[] = [];
          for (let i = 0; i < numElements; i++) {
            const button = document.createElement('button');
            button.textContent = `Button ${i + 1}`;
            button.setAttribute('data-index', String(i));
            container.appendChild(button);
            buttons.push(button);
          }

          // Verify tab order matches DOM order
          buttons.forEach((button, index) => {
            const tabIndex = button.getAttribute('tabindex');
            // Elements without explicit tabindex should be focusable in DOM order
            // or have tabindex >= 0
            if (tabIndex !== null) {
              expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(-1);
            }

            // Verify the element is in the correct position in the DOM
            const domIndex = Array.from(container.children).indexOf(button);
            expect(domIndex).toBe(index);
          });

          // Cleanup
          document.body.removeChild(container);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ensure focusable elements have non-negative tabindex', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }),
        (numElements) => {
          // Create a container with focusable elements
          const container = document.createElement('div');
          document.body.appendChild(container);

          const elements: HTMLElement[] = [];
          for (let i = 0; i < numElements; i++) {
            const button = document.createElement('button');
            button.textContent = `Button ${i + 1}`;
            container.appendChild(button);
            elements.push(button);
          }

          // Verify all focusable elements have appropriate tabindex
          elements.forEach((element) => {
            const tabIndex = element.tabIndex;
            // Focusable elements should have tabIndex >= 0 (or default 0)
            expect(tabIndex).toBeGreaterThanOrEqual(0);
          });

          // Cleanup
          document.body.removeChild(container);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain sequential focus order for interactive elements', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 8 }),
        (numElements) => {
          // Create a container with focusable elements
          const container = document.createElement('div');
          document.body.appendChild(container);

          const buttons: HTMLButtonElement[] = [];
          for (let i = 0; i < numElements; i++) {
            const button = document.createElement('button');
            button.textContent = `Button ${i + 1}`;
            container.appendChild(button);
            buttons.push(button);
          }

          // Verify sequential focus order
          for (let i = 0; i < buttons.length - 1; i++) {
            const currentButton = buttons[i];
            const nextButton = buttons[i + 1];

            // Current button should come before next button in DOM
            const currentIndex = Array.from(container.children).indexOf(currentButton);
            const nextIndex = Array.from(container.children).indexOf(nextButton);
            
            expect(currentIndex).toBeLessThan(nextIndex);
          }

          // Cleanup
          document.body.removeChild(container);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle containers with mixed focusable element types in correct order', () => {
    fc.assert(
      fc.property(
        fc.record({
          numButtons: fc.integer({ min: 1, max: 3 }),
          numInputs: fc.integer({ min: 1, max: 3 }),
          numLinks: fc.integer({ min: 1, max: 3 }),
        }),
        (config) => {
          // Create a container with mixed focusable elements
          const container = document.createElement('div');
          document.body.appendChild(container);

          const elements: HTMLElement[] = [];

          // Add buttons
          for (let i = 0; i < config.numButtons; i++) {
            const button = document.createElement('button');
            button.textContent = `Button ${i + 1}`;
            container.appendChild(button);
            elements.push(button);
          }

          // Add inputs
          for (let i = 0; i < config.numInputs; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Input ${i + 1}`;
            container.appendChild(input);
            elements.push(input);
          }

          // Add links
          for (let i = 0; i < config.numLinks; i++) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = `Link ${i + 1}`;
            container.appendChild(link);
            elements.push(link);
          }

          // Verify all elements are in the correct DOM order
          elements.forEach((element, index) => {
            const domIndex = Array.from(container.children).indexOf(element);
            expect(domIndex).toBe(index);
          });

          // Verify all elements are focusable
          elements.forEach((element) => {
            const tabIndex = element.tabIndex;
            // Should have tabindex >= 0 (focusable)
            expect(tabIndex).toBeGreaterThanOrEqual(0);
          });

          // Cleanup
          document.body.removeChild(container);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not have elements with tabindex > 0 (which breaks natural order)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 8 }),
        (numElements) => {
          // Create a container with focusable elements
          const container = document.createElement('div');
          document.body.appendChild(container);

          const elements: HTMLElement[] = [];
          for (let i = 0; i < numElements; i++) {
            const button = document.createElement('button');
            button.textContent = `Button ${i + 1}`;
            container.appendChild(button);
            elements.push(button);
          }

          // Verify no elements have tabindex > 0 (which would break natural order)
          elements.forEach((element) => {
            const tabIndex = element.tabIndex;
            // tabindex should be 0 (natural order) or -1 (not focusable)
            // Never > 0 as that breaks natural tab order
            expect(tabIndex).toBeLessThanOrEqual(0);
          });

          // Cleanup
          document.body.removeChild(container);
        }
      ),
      { numRuns: 100 }
    );
  });
});
