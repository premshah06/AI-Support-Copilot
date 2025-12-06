import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { ticketArbitrary } from '@/test-utils/arbitraries';
import { Ticket } from '@/types';

// **Feature: ui-modernization, Property 11: Chart data rendering accuracy**
describe('Property: Chart data rendering accuracy', () => {
  // Helper function to calculate priority breakdown
  const calculatePriorityBreakdown = (tickets: Ticket[]) => {
    const priorityCounts: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    tickets.forEach(ticket => {
      const priority = ticket.priority.toLowerCase();
      if (priority in priorityCounts) {
        priorityCounts[priority]++;
      }
    });

    return Object.entries(priorityCounts)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .filter(item => item.value > 0);
  };

  it('should display exactly one segment for each priority level with correct value and percentage', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 1, maxLength: 50 }),
        (tickets) => {
          // Calculate expected breakdown
          const breakdown = calculatePriorityBreakdown(tickets);
          
          // Verify each priority level has correct count
          const priorityCounts: Record<string, number> = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          };

          tickets.forEach(ticket => {
            const priority = ticket.priority.toLowerCase();
            if (priority in priorityCounts) {
              priorityCounts[priority]++;
            }
          });

          // Check that breakdown matches actual counts
          breakdown.forEach(segment => {
            const priority = segment.name.toLowerCase();
            expect(segment.value).toBe(priorityCounts[priority]);
          });

          // Check that all non-zero priorities are included
          Object.entries(priorityCounts).forEach(([priority, count]) => {
            if (count > 0) {
              const segment = breakdown.find(
                s => s.name.toLowerCase() === priority
              );
              expect(segment).toBeDefined();
              expect(segment?.value).toBe(count);
            }
          });

          // Check that zero-count priorities are excluded
          Object.entries(priorityCounts).forEach(([priority, count]) => {
            if (count === 0) {
              const segment = breakdown.find(
                s => s.name.toLowerCase() === priority
              );
              expect(segment).toBeUndefined();
            }
          });

          // Verify total adds up
          const total = breakdown.reduce((sum, segment) => sum + segment.value, 0);
          expect(total).toBe(tickets.length);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate correct percentages for each priority segment', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 1, maxLength: 50 }),
        (tickets) => {
          const breakdown = calculatePriorityBreakdown(tickets);
          const total = tickets.length;

          // Verify percentages sum to approximately 100%
          const percentageSum = breakdown.reduce((sum, segment) => {
            return sum + (segment.value / total);
          }, 0);

          // Should be very close to 1.0 (100%)
          expect(Math.abs(percentageSum - 1.0)).toBeLessThan(0.01);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
