import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { ticketArbitrary } from '@/test-utils/arbitraries';
import { applyFilters } from './filterUtils';
import { FilterState } from '@/types';

// **Feature: ui-modernization, Property 2: Filter application correctness**
describe('Property: Filter application correctness', () => {
  it('should only show tickets matching all active filters', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 0, maxLength: 50 }),
        fc.record({
          status: fc.array(fc.constantFrom('open', 'in_progress', 'resolved', 'closed'), { maxLength: 4 }),
          priority: fc.array(fc.constantFrom('low', 'medium', 'high', 'critical'), { maxLength: 4 }),
          category: fc.array(fc.string(), { maxLength: 5 }),
          searchQuery: fc.string({ maxLength: 20 }),
        }),
        (tickets, filters) => {
          const filtered = applyFilters(tickets, filters);

          // Every filtered ticket must match all active filters
          filtered.forEach(ticket => {
            // Check status filter
            const matchesStatus =
              filters.status.length === 0 || filters.status.includes(ticket.status as any);
            expect(matchesStatus).toBe(true);

            // Check priority filter
            const matchesPriority =
              filters.priority.length === 0 || filters.priority.includes(ticket.priority as any);
            expect(matchesPriority).toBe(true);

            // Check category filter
            const matchesCategory =
              filters.category.length === 0 ||
              filters.category.some(filterCat => {
                if (!filterCat) {
                  return !ticket.category;
                }
                return ticket.category === filterCat;
              });
            expect(matchesCategory).toBe(true);

            // Check search query filter
            const matchesSearch =
              !filters.searchQuery ||
              ticket.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              ticket.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
            expect(matchesSearch).toBe(true);
          });

          // Verify no tickets were incorrectly excluded
          tickets.forEach(ticket => {
            const matchesStatus =
              filters.status.length === 0 || filters.status.includes(ticket.status as any);
            const matchesPriority =
              filters.priority.length === 0 || filters.priority.includes(ticket.priority as any);
            const matchesCategory =
              filters.category.length === 0 ||
              filters.category.some(filterCat => {
                if (!filterCat) {
                  return !ticket.category;
                }
                return ticket.category === filterCat;
              });
            const matchesSearch =
              !filters.searchQuery ||
              ticket.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
              ticket.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

            const shouldBeIncluded =
              matchesStatus && matchesPriority && matchesCategory && matchesSearch;
            const isIncluded = filtered.includes(ticket);

            expect(isIncluded).toBe(shouldBeIncluded);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return all tickets when no filters are active', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 0, maxLength: 50 }),
        (tickets) => {
          const emptyFilters: FilterState = {
            status: [],
            priority: [],
            category: [],
            searchQuery: '',
          };

          const filtered = applyFilters(tickets, emptyFilters);

          expect(filtered.length).toBe(tickets.length);
          expect(filtered).toEqual(tickets);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return empty array when filters match no tickets', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 1, maxLength: 50 }),
        (tickets) => {
          // Create a filter that definitely won't match any tickets
          const impossibleFilters: FilterState = {
            status: [],
            priority: [],
            category: [],
            searchQuery: 'XYZABC123IMPOSSIBLE_SEARCH_QUERY_THAT_WONT_MATCH',
          };

          const filtered = applyFilters(tickets, impossibleFilters);

          // Should return empty array since search query won't match anything
          expect(filtered.length).toBe(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
