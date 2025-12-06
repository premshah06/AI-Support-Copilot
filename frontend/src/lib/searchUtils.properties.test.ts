import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { ticketArbitrary } from '@/test-utils/arbitraries';
import { searchTickets } from './searchUtils';

// **Feature: ui-modernization, Property 3: Search result accuracy**
describe('Property: Search result accuracy', () => {
  it('should only return tickets where query appears in title or description (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 0, maxLength: 50 }),
        fc.string({ maxLength: 20 }),
        (tickets, query) => {
          const results = searchTickets(tickets, query);

          if (!query || query.trim() === '') {
            // Empty query should return all tickets
            expect(results.length).toBe(tickets.length);
            expect(results).toEqual(tickets);
          } else {
            const lowerQuery = query.toLowerCase();

            // Every result must contain the query in title or description
            results.forEach(ticket => {
              const inTitle = ticket.title.toLowerCase().includes(lowerQuery);
              const inDescription = ticket.description.toLowerCase().includes(lowerQuery);
              expect(inTitle || inDescription).toBe(true);
            });

            // Verify no matching tickets were excluded
            tickets.forEach(ticket => {
              const inTitle = ticket.title.toLowerCase().includes(lowerQuery);
              const inDescription = ticket.description.toLowerCase().includes(lowerQuery);
              const shouldBeIncluded = inTitle || inDescription;
              const isIncluded = results.includes(ticket);

              expect(isIncluded).toBe(shouldBeIncluded);
            });
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        (tickets, query) => {
          const lowerResults = searchTickets(tickets, query.toLowerCase());
          const upperResults = searchTickets(tickets, query.toUpperCase());
          const mixedResults = searchTickets(tickets, query);

          // All three should return the same results
          expect(lowerResults.length).toBe(upperResults.length);
          expect(lowerResults.length).toBe(mixedResults.length);

          // Results should be identical (same tickets)
          lowerResults.forEach((ticket, index) => {
            expect(ticket).toBe(upperResults[index]);
            expect(ticket).toBe(mixedResults[index]);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return all tickets when query is empty or whitespace', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 0, maxLength: 50 }),
        fc.constantFrom('', ' ', '  ', '\t', '\n'),
        (tickets, emptyQuery) => {
          const results = searchTickets(tickets, emptyQuery);

          expect(results.length).toBe(tickets.length);
          expect(results).toEqual(tickets);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return empty array when no tickets match the query', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 1, maxLength: 50 }),
        (tickets) => {
          // Use a query that definitely won't match
          const impossibleQuery = 'XYZABC123IMPOSSIBLE_QUERY_THAT_WONT_MATCH_ANYTHING';
          const results = searchTickets(tickets, impossibleQuery);

          expect(results.length).toBe(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should find partial matches', () => {
    fc.assert(
      fc.property(
        fc.array(ticketArbitrary, { minLength: 1, maxLength: 20 }),
        (tickets) => {
          // Pick a random ticket and search for a substring of its title
          if (tickets.length === 0) return true;

          const randomTicket = tickets[0];
          if (randomTicket.title.length < 3) return true;

          // Take a substring from the middle of the title
          const substring = randomTicket.title.substring(1, 3);
          const results = searchTickets(tickets, substring);

          // The random ticket should be in the results
          expect(results).toContain(randomTicket);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
