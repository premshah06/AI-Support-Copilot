/**
 * Unit tests for formatting utilities
 * Tests specific examples and edge cases for formatting functions
 */

import { describe, it, expect } from 'vitest';
import {
  formatRelativeTime,
  formatNumber,
  formatPercentage,
  formatDuration,
  truncateText,
  highlightText,
  formatFileSize,
  formatAbsoluteTime,
} from './formatters';

describe('formatRelativeTime', () => {
  it('should format "just now" for timestamps less than 60 seconds ago', () => {
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
    expect(formatRelativeTime(thirtySecondsAgo)).toBe('just now');
  });

  it('should format minutes correctly', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('should format singular minute correctly', () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
    expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
  });

  it('should format hours correctly', () => {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(threeHoursAgo)).toBe('3 hours ago');
  });

  it('should format days correctly', () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoDaysAgo)).toBe('2 days ago');
  });

  it('should format weeks correctly', () => {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago');
  });

  it('should format months correctly', () => {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoMonthsAgo)).toBe('2 months ago');
  });

  it('should format years correctly', () => {
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoYearsAgo)).toBe('2 years ago');
  });

  it('should handle ISO string input', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinutesAgo.toISOString())).toBe('5 minutes ago');
  });

  it('should return "Invalid date" for invalid date strings', () => {
    expect(formatRelativeTime('not-a-date')).toBe('Invalid date');
  });

  it('should return "just now" for future dates', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60);
    expect(formatRelativeTime(future)).toBe('just now');
  });
});

describe('formatNumber', () => {
  it('should format integers with thousands separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('should format numbers with specified decimal places', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
    expect(formatNumber(1000, 2)).toBe('1,000.00');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1,234');
  });

  it('should default to 0 decimal places', () => {
    expect(formatNumber(1234.5678)).toBe('1,235');
  });
});

describe('formatPercentage', () => {
  it('should format decimal values as percentages', () => {
    expect(formatPercentage(0.5)).toBe('50%');
    expect(formatPercentage(0.75)).toBe('75%');
  });

  it('should format percentage values when isDecimal is false', () => {
    expect(formatPercentage(50, 0, false)).toBe('50%');
    expect(formatPercentage(75, 0, false)).toBe('75%');
  });

  it('should respect decimal places', () => {
    expect(formatPercentage(0.12345, 2)).toBe('12.35%');
    expect(formatPercentage(0.12345, 1)).toBe('12.3%');
  });

  it('should handle 0%', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  it('should handle 100%', () => {
    expect(formatPercentage(1)).toBe('100%');
  });
});

describe('formatDuration', () => {
  it('should format seconds only for durations less than 60 seconds', () => {
    expect(formatDuration(30)).toBe('30s');
    expect(formatDuration(59)).toBe('59s');
  });

  it('should format minutes only for durations less than 60 minutes', () => {
    expect(formatDuration(120)).toBe('2m');
    expect(formatDuration(3540)).toBe('59m');
  });

  it('should format hours and minutes', () => {
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(3660)).toBe('1h 1m');
    expect(formatDuration(7200)).toBe('2h');
    expect(formatDuration(7320)).toBe('2h 2m');
  });

  it('should handle zero duration', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('should floor fractional seconds', () => {
    expect(formatDuration(30.9)).toBe('30s');
  });
});

describe('truncateText', () => {
  it('should not truncate text shorter than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should truncate text longer than maxLength', () => {
    expect(truncateText('Hello World', 8)).toBe('Hello...');
  });

  it('should use custom ellipsis', () => {
    expect(truncateText('Hello World', 8, '…')).toBe('Hello W…');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should handle maxLength equal to text length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('should account for ellipsis length', () => {
    const text = 'Hello World';
    const maxLength = 8;
    const result = truncateText(text, maxLength);
    expect(result.length).toBe(maxLength);
  });
});

describe('highlightText', () => {
  it('should wrap matching text in mark tags', () => {
    expect(highlightText('Hello World', 'World')).toBe('Hello <mark>World</mark>');
  });

  it('should be case-insensitive by default', () => {
    expect(highlightText('Hello World', 'world')).toBe('Hello <mark>World</mark>');
  });

  it('should be case-sensitive when specified', () => {
    expect(highlightText('Hello World', 'world', true)).toBe('Hello World');
    expect(highlightText('Hello World', 'World', true)).toBe('Hello <mark>World</mark>');
  });

  it('should highlight multiple matches', () => {
    expect(highlightText('Hello Hello', 'Hello')).toBe('<mark>Hello</mark> <mark>Hello</mark>');
  });

  it('should return original text when query is empty', () => {
    expect(highlightText('Hello World', '')).toBe('Hello World');
  });

  it('should return original text when no match found', () => {
    expect(highlightText('Hello World', 'xyz')).toBe('Hello World');
  });

  it('should handle empty text', () => {
    expect(highlightText('', 'test')).toBe('');
  });

  it('should escape special regex characters', () => {
    expect(highlightText('Price: $100', '$100')).toBe('Price: <mark>$100</mark>');
    expect(highlightText('Test (example)', '(example)')).toBe('Test <mark>(example)</mark>');
  });
});

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1572864)).toBe('1.5 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });

  it('should respect decimal places', () => {
    expect(formatFileSize(1536, 0)).toBe('2 KB');
    expect(formatFileSize(1536, 3)).toBe('1.5 KB');
  });
});

describe('formatAbsoluteTime', () => {
  it('should format Date objects', () => {
    const date = new Date('2024-01-15T15:45:00');
    const formatted = formatAbsoluteTime(date);
    expect(formatted).toMatch(/Jan 15, 2024/);
    expect(formatted).toMatch(/3:45 PM/);
  });

  it('should format ISO strings', () => {
    const isoString = '2024-01-15T15:45:00.000Z';
    const formatted = formatAbsoluteTime(isoString);
    expect(formatted).toContain('2024');
  });

  it('should include month, day, year, and time', () => {
    const date = new Date('2024-06-20T10:30:00');
    const formatted = formatAbsoluteTime(date);
    expect(formatted).toMatch(/Jun 20, 2024/);
    expect(formatted).toMatch(/10:30 AM/);
  });
});
