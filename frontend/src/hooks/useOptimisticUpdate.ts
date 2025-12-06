import { useState, useCallback } from 'react';

/**
 * Options for the useOptimisticUpdate hook
 */
interface OptimisticUpdateOptions<T> {
  /** Function to execute the mutation (API call) */
  mutationFn: () => Promise<T>;
  /** Optimistic data to display immediately */
  optimisticData: T;
  /** Callback on successful mutation */
  onSuccess?: (data: T) => void;
  /** Callback on failed mutation */
  onError?: (error: Error) => void;
  /** Callback on mutation completion (success or error) */
  onSettled?: () => void;
}

/**
 * Return type for the useOptimisticUpdate hook
 */
interface OptimisticUpdateResult<T> {
  /** Current data (optimistic or actual) */
  data: T | null;
  /** Whether the mutation is in progress */
  loading: boolean;
  /** Error if mutation failed */
  error: Error | null;
  /** Function to trigger the optimistic update */
  mutate: () => Promise<void>;
  /** Function to reset the state */
  reset: () => void;
}

/**
 * Hook to handle optimistic UI updates with automatic rollback on error
 * Immediately updates the UI with optimistic data, then reverts if the mutation fails
 * 
 * @param options - Configuration options for the optimistic update
 * @returns Object with data, loading state, error, and mutate function
 * 
 * @example
 * const { data, loading, error, mutate } = useOptimisticUpdate({
 *   mutationFn: () => updateTicketStatus(ticketId, 'resolved'),
 *   optimisticData: { ...ticket, status: 'resolved' },
 *   onSuccess: (updatedTicket) => {
 *     showToast('Ticket updated successfully', 'success');
 *   },
 *   onError: (error) => {
 *     showToast('Failed to update ticket', 'error');
 *   },
 * });
 * 
 * // Trigger the update
 * await mutate();
 */
export function useOptimisticUpdate<T>(
  options: OptimisticUpdateOptions<T>
): OptimisticUpdateResult<T> {
  const { mutationFn, optimisticData, onSuccess, onError, onSettled } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [previousData, setPreviousData] = useState<T | null>(null);

  const mutate = useCallback(async () => {
    // Store current data for potential rollback
    setPreviousData(data);
    
    // Immediately update with optimistic data
    setData(optimisticData);
    setLoading(true);
    setError(null);

    try {
      // Execute the mutation
      const result = await mutationFn();
      
      // Update with actual server response
      setData(result);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      // Rollback to previous data on error
      setData(previousData);
      
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      // Call error callback
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
      
      // Call settled callback
      if (onSettled) {
        onSettled();
      }
    }
  }, [mutationFn, optimisticData, data, previousData, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setPreviousData(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

/**
 * Simplified version of useOptimisticUpdate for common use cases
 * Automatically handles state updates for a single value
 * 
 * @param currentValue - Current value before update
 * @param updateFn - Function to perform the update
 * @returns Tuple of [optimisticValue, updateWithOptimism, isUpdating, error]
 * 
 * @example
 * const [status, updateStatus, isUpdating] = useOptimisticValue(
 *   ticket.status,
 *   (newStatus) => api.updateTicketStatus(ticketId, newStatus)
 * );
 * 
 * // Update with optimistic UI
 * await updateStatus('resolved');
 */
export function useOptimisticValue<T>(
  currentValue: T,
  updateFn: (newValue: T) => Promise<T>
): [T, (newValue: T) => Promise<void>, boolean, Error | null] {
  const [optimisticValue, setOptimisticValue] = useState<T>(currentValue);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateWithOptimism = useCallback(
    async (newValue: T) => {
      const previousValue = optimisticValue;
      
      // Immediately update UI
      setOptimisticValue(newValue);
      setIsUpdating(true);
      setError(null);

      try {
        // Perform actual update
        const result = await updateFn(newValue);
        setOptimisticValue(result);
      } catch (err) {
        // Rollback on error
        setOptimisticValue(previousValue);
        const error = err instanceof Error ? err : new Error('Update failed');
        setError(error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [optimisticValue, updateFn]
  );

  return [optimisticValue, updateWithOptimism, isUpdating, error];
}
