/**
 * Property-based tests for formatting utilities
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { formatRelativeTime } from './formatters';

// **Feature: ui-modernization, Property 6: Timestamp formatting consistency**
describe('Property: Timestamp formatting consistency', () => {
  it('should format any valid ISO timestamp as relative time', () => {
    fc.assert(
      fc.property(
        fc.date().filter(d => !isNaN(d.getTime())), // Filter out invalid dates
        (date) => {
          const isoString = date.toISOString();
          const formatted = formatRelativeTime(isoString);

          // Should return a string matching relative time pattern
          const relativeTimePattern = /^(\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago|just now)$/;
          return relativeTimePattern.test(formatted);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format Date objects as relative time', () => {
    fc.assert(
      fc.property(
        fc.date().filter(d => !isNaN(d.getTime())), // Filter out invalid dates
        (date) => {
          const formatted = formatRelativeTime(date);

          // Should return a string matching relative time pattern
          const relativeTimePattern = /^(\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago|just now)$/;
          return relativeTimePattern.test(formatted);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle timestamps from the past consistently', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 365 * 10 }), // Days in the past (up to 10 years)
        (daysAgo) => {
          const date = new Date();
          date.setDate(date.getDate() - daysAgo);
          
          const formatted = formatRelativeTime(date);

          // Should not return "Invalid date"
          expect(formatted).not.toBe('Invalid date');
          
          // Should match relative time pattern
          const relativeTimePattern = /^(\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago|just now)$/;
          return relativeTimePattern.test(formatted);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return "just now" for very recent timestamps', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 59 }), // Seconds in the past
        (secondsAgo) => {
          const date = new Date();
          date.setSeconds(date.getSeconds() - secondsAgo);
          
          const formatted = formatRelativeTime(date);

          return formatted === 'just now';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format minutes correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 59 }), // Minutes in the past
        (minutesAgo) => {
          const date = new Date();
          date.setMinutes(date.getMinutes() - minutesAgo);
          
          const formatted = formatRelativeTime(date);

          const expectedSingular = '1 minute ago';
          const expectedPlural = new RegExp(`^${minutesAgo} minutes ago$`);
          
          return minutesAgo === 1 
            ? formatted === expectedSingular 
            : expectedPlural.test(formatted);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format hours correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 23 }), // Hours in the past
        (hoursAgo) => {
          const date = new Date();
          date.setHours(date.getHours() - hoursAgo);
          
          const formatted = formatRelativeTime(date);

          const expectedSingular = '1 hour ago';
          const expectedPlural = new RegExp(`^${hoursAgo} hours ago$`);
          
          return hoursAgo === 1 
            ? formatted === expectedSingular 
            : expectedPlural.test(formatted);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format days correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }), // Days in the past (less than a week)
        (daysAgo) => {
          const date = new Date();
          date.setDate(date.getDate() - daysAgo);
          
          const formatted = formatRelativeTime(date);

          const expectedSingular = '1 day ago';
          const expectedPlural = new RegExp(`^${daysAgo} days ago$`);
          
          return daysAgo === 1 
            ? formatted === expectedSingular 
            : expectedPlural.test(formatted);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle future dates gracefully', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 }), // Days in the future
        (daysInFuture) => {
          const date = new Date();
          date.setDate(date.getDate() + daysInFuture);
          
          const formatted = formatRelativeTime(date);

          // Future dates should return "just now"
          return formatted === 'just now';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle invalid date strings', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (dateString) => {
          const formatted = formatRelativeTime(dateString);

          // Should always return a string (either valid relative time or "Invalid date")
          // Valid patterns include relative time or "Invalid date"
          const relativeTimePattern = /^(\d+\s+(second|minute|hour|day|week|month|year)s?\s+ago|just now|Invalid date)$/;
          return typeof formatted === 'string' && relativeTimePattern.test(formatted);
        }
      ),
      { numRuns: 100 }
    );
  });
});
