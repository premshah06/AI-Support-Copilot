import { describe, it, vi, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import fc from 'fast-check';
import { AISuggestionPanel } from './AISuggestionPanel';
import { aiSuggestionArbitrary } from '../../test-utils/arbitraries';

// **Feature: ui-modernization, Property 7: AI suggestion rendering completeness**
describe('Property: AI suggestion rendering completeness', () => {
  it('should display all AI suggestion components for any suggestion', () => {
    fc.assert(
      fc.property(aiSuggestionArbitrary, (suggestion) => {
        const mockOnGenerate = vi.fn();
        const mockOnApply = vi.fn();
        
        const { container } = render(
          <AISuggestionPanel
            suggestion={suggestion}
            loading={false}
            error={null}
            onGenerate={mockOnGenerate}
            onApply={mockOnApply}
          />
        );
        
        // Check that summary is displayed - find the paragraph inside the summary section
        // The summary is in a <p> tag with specific classes after the "Summary" heading
        const allParagraphs = container.querySelectorAll('p');
        let summaryFound = false;
        allParagraphs.forEach(p => {
          if (p.textContent?.trim() === suggestion.summary.trim()) {
            summaryFound = true;
          }
        });
        expect(summaryFound).toBe(true);
        
        // Check that category is displayed somewhere in the component
        expect(container.textContent).toContain(suggestion.category);
        
        // Check that priority is displayed somewhere in the component
        expect(container.textContent).toContain(suggestion.priority);
        
        // Check that suggested reply is in the textarea
        const textarea = container.querySelector('textarea');
        expect(textarea).toBeTruthy();
        expect(textarea?.value).toBe(suggestion.suggested_reply);
        
        // Check that all suggested actions are displayed as interactive items
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toBe(suggestion.suggested_actions.length);
        
        // Check that each action text is present in the component
        suggestion.suggested_actions.forEach(action => {
          expect(container.textContent).toContain(action);
        });
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
