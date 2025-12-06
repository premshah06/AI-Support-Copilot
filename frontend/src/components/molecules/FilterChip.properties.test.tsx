import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { FilterChip } from './FilterChip';

// **Feature: ui-modernization, Property 4: Active filter chip display**
describe('Property: Active filter chip display', () => {
  // Ensure cleanup between tests
  beforeEach(async () => {
    cleanup();
    // Wait a bit for any pending animations to complete
    await new Promise(resolve => setTimeout(resolve, 10));
  });

  afterEach(async () => {
    cleanup();
    // Wait a bit for any pending animations to complete
    await new Promise(resolve => setTimeout(resolve, 10));
  });

  it('should render exactly one filter chip for each active filter with correct label and remove functionality', () => {
    fc.assert(
      fc.property(
        // Limit array size to reduce test complexity and improve performance
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          { minLength: 1, maxLength: 5 }
        ),
        (filterLabels) => {
          // Create unique labels to ensure we can count them properly
          const uniqueLabels = Array.from(new Set(filterLabels));
          
          // Skip empty arrays after deduplication
          if (uniqueLabels.length === 0) {
            return true;
          }
          
          const removeHandlers = uniqueLabels.map(() => vi.fn());
          
          const { container, unmount } = render(
            <div>
              {uniqueLabels.map((label, index) => (
                <FilterChip
                  key={index}
                  label={label}
                  onRemove={removeHandlers[index]}
                />
              ))}
            </div>
          );
          
          try {
            // Should render exactly one chip for each unique filter
            const chips = container.querySelectorAll('[class*="inline-flex"][class*="items-center"]');
            expect(chips.length).toBe(uniqueLabels.length);
            
            // Get all remove buttons
            const allButtons = screen.getAllByRole('button');
            expect(allButtons.length).toBe(uniqueLabels.length);
            
            // Each chip should have a remove button with proper aria-label
            uniqueLabels.forEach((label) => {
              const expectedAriaLabel = `Remove ${label} filter`;
              const matchingButtons = allButtons.filter(
                button => button.getAttribute('aria-label') === expectedAriaLabel
              );
              
              // Should have exactly one button per label
              expect(matchingButtons.length).toBe(1);
              
              // Verify the chip contains the label text
              const chipElement = matchingButtons[0].closest('[class*="inline-flex"]');
              expect(chipElement?.textContent).toContain(label);
            });
            
            return true;
          } finally {
            // Explicitly unmount to clean up animations
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 10000); // Increase timeout to 10 seconds for property test

  it('should call onRemove handler when remove button is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 })
          .filter(s => s.trim().length > 0)
          .map(s => s.trim()), // Trim the string to avoid whitespace issues
        async (label) => {
          const user = userEvent.setup();
          const onRemove = vi.fn();
          
          const { unmount } = render(<FilterChip label={label} onRemove={onRemove} />);
          
          try {
            // Wait for the element to be available and animations to settle
            await waitFor(() => {
              const removeButton = screen.getByLabelText(`Remove ${label} filter`);
              expect(removeButton).toBeInTheDocument();
            }, { timeout: 500 });
            
            const removeButton = screen.getByLabelText(`Remove ${label} filter`);
            await user.click(removeButton);
            
            // Remove handler should be called exactly once
            expect(onRemove).toHaveBeenCalledTimes(1);
            
            return true;
          } finally {
            // Clean up after each iteration
            unmount();
            // Small delay to allow cleanup to complete
            await new Promise(resolve => setTimeout(resolve, 5));
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 20000); // Increase timeout to 20 seconds for async property test with animations
});
