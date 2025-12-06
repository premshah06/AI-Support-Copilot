/**
 * Property-based tests for error handling utilities
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getUserFriendlyErrorMessage, isErrorType } from './errorHandling';
import { AxiosError } from 'axios';

// Helper to create mock Axios errors
function createMockAxiosError(status: number, message?: string): AxiosError {
  const error = new Error(message || 'Request failed') as AxiosError;
  error.isAxiosError = true;
  error.name = 'AxiosError';
  error.code = status === 0 ? 'ERR_NETWORK' : undefined;
  
  // Only add response if status is not 0 (network error)
  if (status !== 0) {
    error.response = {
      status,
      data: message ? { message } : {},
      statusText: 'Error',
      headers: {},
      config: {} as any,
    };
  }
  
  error.config = {} as any;
  error.toJSON = () => ({});
  return error;
}

// **Feature: ui-modernization, Property 17: Error message appropriateness**
describe('Property: Error message appropriateness', () => {
  it('should return user-friendly messages without technical jargon for any error', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Standard errors
          fc.string({ minLength: 5, maxLength: 100 }).map(msg => new Error(msg)),
          // Network errors
          fc.constant(createMockAxiosError(0)),
          // Client errors (4xx)
          fc.integer({ min: 400, max: 499 }).map(status => createMockAxiosError(status)),
          // Server errors (5xx)
          fc.integer({ min: 500, max: 599 }).map(status => createMockAxiosError(status))
        ),
        (error) => {
          const result = getUserFriendlyErrorMessage(error);

          // Should return a message
          expect(result.message).toBeTruthy();
          expect(typeof result.message).toBe('string');
          expect(result.message.length).toBeGreaterThan(0);

          // Message should not contain technical jargon
          const technicalTerms = [
            'undefined',
            'null',
            'NaN',
            'stack trace',
            'exception',
            'TypeError',
            'ReferenceError',
            'SyntaxError',
            '[object Object]',
          ];

          const lowerMessage = result.message.toLowerCase();
          const hasTechnicalJargon = technicalTerms.some(term =>
            lowerMessage.includes(term.toLowerCase())
          );

          expect(hasTechnicalJargon).toBe(false);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include actionable guidance for any error type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          createMockAxiosError(0), // Network error
          createMockAxiosError(400), // Bad request
          createMockAxiosError(401), // Unauthorized
          createMockAxiosError(403), // Forbidden
          createMockAxiosError(404), // Not found
          createMockAxiosError(500), // Server error
          new Error('Network error occurred')
        ),
        (error) => {
          const result = getUserFriendlyErrorMessage(error);

          // Should have a suggested action
          expect(result.suggestedAction).toBeTruthy();
          expect(typeof result.suggestedAction).toBe('string');
          expect(result.suggestedAction!.length).toBeGreaterThan(0);

          // Suggested action should be actionable (contain verbs or instructions)
          const actionableWords = [
            'try',
            'check',
            'refresh',
            'contact',
            'wait',
            'review',
            'make sure',
            'ensure',
            'verify',
            'again',
          ];

          const lowerAction = result.suggestedAction!.toLowerCase();
          const hasActionableGuidance = actionableWords.some(word =>
            lowerAction.includes(word)
          );

          expect(hasActionableGuidance).toBe(true);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should categorize Axios errors with appropriate types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { error: createMockAxiosError(0), expectedType: 'network' },
          { error: createMockAxiosError(400), expectedType: 'validation' },
          { error: createMockAxiosError(401), expectedType: 'authentication' },
          { error: createMockAxiosError(403), expectedType: 'authorization' },
          { error: createMockAxiosError(404), expectedType: 'not_found' },
          { error: createMockAxiosError(500), expectedType: 'server' },
          { error: createMockAxiosError(502), expectedType: 'server' },
          { error: createMockAxiosError(503), expectedType: 'server' }
        ),
        ({ error, expectedType }) => {
          const result = getUserFriendlyErrorMessage(error);

          // Should have the correct error type
          expect(result.type).toBe(expectedType);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle Axios network errors consistently', () => {
    fc.assert(
      fc.property(
        fc.constant(createMockAxiosError(0)), // Network error (no response)
        (error) => {
          const result = getUserFriendlyErrorMessage(error);

          // Should identify as network error
          expect(result.type).toBe('network');

          // Should mention connection or network
          const lowerMessage = result.message.toLowerCase();
          const mentionsConnection =
            lowerMessage.includes('connect') ||
            lowerMessage.includes('network') ||
            lowerMessage.includes('internet') ||
            lowerMessage.includes('server');

          expect(mentionsConnection).toBe(true);

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should handle validation errors with helpful messages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(400, 422).chain(status =>
          fc.string({ minLength: 10, maxLength: 50 }).map(msg =>
            createMockAxiosError(status, msg)
          )
        ),
        (error) => {
          const result = getUserFriendlyErrorMessage(error);

          // Should identify as validation error
          expect(result.type).toBe('validation');

          // Message should be helpful (at least 10 characters)
          expect(result.message.length).toBeGreaterThanOrEqual(10);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle server errors with appropriate messages', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 504 }).map(status => createMockAxiosError(status)),
        (error) => {
          const result = getUserFriendlyErrorMessage(error);

          // Should identify as server error
          expect(result.type).toBe('server');

          // Should not blame the user
          const lowerMessage = result.message.toLowerCase();
          const blamesUser =
            lowerMessage.includes('you did') ||
            lowerMessage.includes('your fault') ||
            lowerMessage.includes('you caused');

          expect(blamesUser).toBe(false);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should provide consistent error types for the same status codes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 400, max: 599 }),
        (status) => {
          const error1 = createMockAxiosError(status);
          const error2 = createMockAxiosError(status);

          const result1 = getUserFriendlyErrorMessage(error1);
          const result2 = getUserFriendlyErrorMessage(error2);

          // Same status code should produce same error type
          expect(result1.type).toBe(result2.type);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should correctly identify Axios error types with isErrorType helper', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { error: createMockAxiosError(0), type: 'network' as const },
          { error: createMockAxiosError(400), type: 'validation' as const },
          { error: createMockAxiosError(401), type: 'authentication' as const },
          { error: createMockAxiosError(404), type: 'not_found' as const },
          { error: createMockAxiosError(500), type: 'server' as const }
        ),
        ({ error, type }) => {
          // Should correctly identify the error type
          expect(isErrorType(error, type)).toBe(true);

          // Should not match other types
          const otherTypes = ['network', 'validation', 'authentication', 'not_found', 'server'].filter(
            t => t !== type
          );

          otherTypes.forEach(otherType => {
            expect(isErrorType(error, otherType as any)).toBe(false);
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle unknown errors gracefully', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant({}),
          fc.constant('string error'),
          fc.constant(42),
          fc.constant(true)
        ),
        (unknownError) => {
          const result = getUserFriendlyErrorMessage(unknownError);

          // Should still return a valid error object
          expect(result.message).toBeTruthy();
          expect(result.type).toBeTruthy();
          expect(typeof result.message).toBe('string');

          // Should not crash or throw
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
