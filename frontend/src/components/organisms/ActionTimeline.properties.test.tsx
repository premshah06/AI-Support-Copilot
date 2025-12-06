import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { ActionTimeline } from './ActionTimeline';
import { ticketActionArbitrary } from '../../test-utils/arbitraries';

// **Feature: ui-modernization, Property 12: Timeline completeness**
describe('Property: Timeline completeness', () => {
  it('should display exactly one timeline item for each action with correct icon and timestamp', () => {
    fc.assert(
      fc.property(
        fc.array(ticketActionArbitrary, { minLength: 1, maxLength: 10 }),
        (actions) => {
          const { container } = render(<ActionTimeline actions={actions} />);
          
          // Check that we have the correct number of timeline items
          // Each action should have a timeline node (the circular icon container)
          const timelineNodes = container.querySelectorAll('div[class*="rounded-full"]');
          expect(timelineNodes.length).toBe(actions.length);
          
          // Check that each action's content is displayed
          actions.forEach((action) => {
            // Content should be visible in the timeline (use container query for edge cases)
            const contentElements = container.querySelectorAll('div[class*="text-gray-700"]');
            const hasContent = Array.from(contentElements).some(el => 
              el.textContent?.includes(action.content.trim()) || el.textContent === action.content
            );
            expect(hasContent).toBe(true);
          });
          
          // Check that AI and human actions have different icons
          const aiActions = actions.filter(a => a.actor_type === 'AI');
          const humanActions = actions.filter(a => a.actor_type === 'human');
          
          // Bot icons for AI actions
          const botIcons = container.querySelectorAll('svg[class*="lucide-bot"]');
          expect(botIcons.length).toBe(aiActions.length);
          
          // User icons for human actions
          const userIcons = container.querySelectorAll('svg[class*="lucide-user"]');
          expect(userIcons.length).toBe(humanActions.length);
          
          // Check that relative timestamps are displayed
          // Should have "ago" text for each action (from formatRelativeTime)
          const timeElements = container.querySelectorAll('span[class*="text-gray-500"]');
          const timeElementsWithAgo = Array.from(timeElements).filter(el => 
            el.textContent?.includes('ago') || el.textContent?.includes('just now')
          );
          expect(timeElementsWithAgo.length).toBeGreaterThanOrEqual(actions.length);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
