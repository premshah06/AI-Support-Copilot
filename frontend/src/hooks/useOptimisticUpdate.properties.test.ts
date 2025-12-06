/**
 * Property-based tests for useOptimisticUpdate hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import { useOptimisticUpdate } from './useOptimisticUpdate';

// **Feature: ui-modernization, Property 16: Optimistic update immediacy**
describe('Property: Optimistic update immediacy', () => {
  it('should immediately reflect optimistic data before server response', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        fc.integer({ min: 50, max: 150 }), // Delay in ms
        async (initialData, optimisticData, delay) => {
          let serverResponseReceived = false;

          const { result } = renderHook(() =>
            useOptimisticUpdate({
              mutationFn: async () => {
                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, delay));
                serverResponseReceived = true;
                return { ...optimisticData, serverConfirmed: true };
              },
              optimisticData,
            })
          );

          // Trigger the mutation
          const mutatePromise = result.current.mutate();

          // Wait a short time for React to update
          await new Promise(resolve => setTimeout(resolve, 10));

          // Data should be optimistic immediately
          expect(result.current.data).toEqual(optimisticData);

          // Server response should not have been received yet
          expect(serverResponseReceived).toBe(false);

          // Wait for mutation to complete
          await mutatePromise;

          // Now server response should be received
          expect(serverResponseReceived).toBe(true);

          return true;
        }
      ),
      { numRuns: 10, timeout: 10000 } // Reduced runs and increased timeout for async tests
    );
  }, 15000); // Increase test timeout

  it('should rollback to previous data on error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        fc.string({ minLength: 5, maxLength: 30 }), // Error message
        async (previousData, optimisticData, errorMessage) => {
          const { result } = renderHook(() =>
            useOptimisticUpdate({
              mutationFn: async () => {
                // Simulate API error
                throw new Error(errorMessage);
              },
              optimisticData,
            })
          );

          // Set initial data
          await result.current.mutate().catch(() => {
            // Expected to fail
          });

          // After error, data should be null (rolled back from optimistic)
          await waitFor(() => {
            expect(result.current.data).toBeNull();
            expect(result.current.error).toBeTruthy();
            expect(result.current.error?.message).toBe(errorMessage);
          });

          return true;
        }
      ),
      { numRuns: 20 } // Reduced runs for async tests
    );
  });

  it('should set loading state during mutation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        fc.integer({ min: 50, max: 150 }), // Delay in ms
        async (optimisticData, delay) => {
          const { result } = renderHook(() =>
            useOptimisticUpdate({
              mutationFn: async () => {
                await new Promise((resolve) => setTimeout(resolve, delay));
                return optimisticData;
              },
              optimisticData,
            })
          );

          // Initially not loading
          expect(result.current.loading).toBe(false);

          // Trigger mutation
          const mutatePromise = result.current.mutate();

          // Wait a short time for React to update
          await new Promise(resolve => setTimeout(resolve, 10));

          // Should be loading during mutation
          expect(result.current.loading).toBe(true);

          // Wait for completion
          await mutatePromise;

          // Wait a short time for React to update
          await new Promise(resolve => setTimeout(resolve, 10));

          // Should not be loading after completion
          expect(result.current.loading).toBe(false);

          return true;
        }
      ),
      { numRuns: 10, timeout: 10000 } // Reduced runs and increased timeout for async tests
    );
  }, 15000); // Increase test timeout

  it('should call onSuccess callback with server data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (serverData) => {
          let successCallbackCalled = false;
          let receivedData: any = null;

          const { result } = renderHook(() =>
            useOptimisticUpdate({
              mutationFn: async () => serverData,
              optimisticData: { ...serverData },
              onSuccess: (data) => {
                successCallbackCalled = true;
                receivedData = data;
              },
            })
          );

          await result.current.mutate();

          await waitFor(() => {
            expect(successCallbackCalled).toBe(true);
            expect(receivedData).toEqual(serverData);
          });

          return true;
        }
      ),
      { numRuns: 20 } // Reduced runs for async tests
    );
  });

  it('should call onError callback on failure', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          value: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        fc.string({ minLength: 5, maxLength: 30 }), // Error message
        async (optimisticData, errorMessage) => {
          let errorCallbackCalled = false;
          let receivedError: Error | null = null;

          const { result } = renderHook(() =>
            useOptimisticUpdate({
              mutationFn: async () => {
                throw new Error(errorMessage);
              },
              optimisticData,
              onError: (error) => {
                errorCallbackCalled = true;
                receivedError = error;
              },
            })
          );

          await result.current.mutate().catch(() => {
            // Expected to fail
          });

          await waitFor(() => {
            expect(errorCallbackCalled).toBe(true);
            expect(receivedError).toBeTruthy();
            expect(receivedError?.message).toBe(errorMessage);
          });

          return true;
        }
      ),
      { numRuns: 20 } // Reduced runs for async tests
    );
  });
});
