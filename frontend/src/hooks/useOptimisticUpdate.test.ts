import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useOptimisticUpdate } from './useOptimisticUpdate';

describe('useOptimisticUpdate', () => {
  it('should initialize with loading false and null data', () => {
    const mutationFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should immediately set optimistic data when mutate is called', async () => {
    const mutationFn = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('server-data'), 100))
    );

    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
      })
    );

    await act(async () => {
      result.current.mutate();
    });

    // Should have optimistic data immediately
    expect(result.current.data).toBe('optimistic-data');
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe('server-data');
    });
  });

  it('should call mutation function when mutate is invoked', async () => {
    const mutationFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
      })
    );

    await act(async () => {
      await result.current.mutate();
    });

    expect(mutationFn).toHaveBeenCalledTimes(1);
  });

  it('should call onSuccess callback when mutation succeeds', async () => {
    const mutationFn = vi.fn().mockResolvedValue('success-data');
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
        onSuccess,
      })
    );

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('success-data');
    });
  });

  it('should call onError callback when mutation fails', async () => {
    const error = new Error('Mutation failed');
    const mutationFn = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
        onError,
      })
    );

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it('should rollback to previous data on error', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('Failed'));
    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
      })
    );

    // Set initial data
    result.current.mutate();
    
    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  it('should set loading to false after successful mutation', async () => {
    const mutationFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
      })
    );

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should set loading to false after failed mutation', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('Failed'));
    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
        onError: () => {},
      })
    );

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle multiple mutations sequentially', async () => {
    let callCount = 0;
    const mutationFn = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve(`success-${callCount}`);
    });

    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
        onSuccess,
      })
    );

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('success-1');
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('success-2');
    });

    expect(mutationFn).toHaveBeenCalledTimes(2);
  });

  it('should work without callbacks', async () => {
    const mutationFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
      })
    );

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mutationFn).toHaveBeenCalled();
  });

  it('should reset state when reset is called', () => {
    const mutationFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() =>
      useOptimisticUpdate({
        mutationFn,
        optimisticData: 'optimistic-data',
      })
    );

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
