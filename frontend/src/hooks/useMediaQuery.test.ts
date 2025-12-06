import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    matchMediaMock = vi.fn();
    window.matchMedia = matchMediaMock as any;
  });

  it('should return true when media query matches', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('should return false when media query does not match', () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should call matchMedia with correct query', () => {
    const query = '(max-width: 1024px)';
    matchMediaMock.mockReturnValue({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    renderHook(() => useMediaQuery(query));
    expect(matchMediaMock).toHaveBeenCalledWith(query);
  });

  it('should add event listener on mount', () => {
    const addEventListenerSpy = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      addEventListener: addEventListenerSpy,
      removeEventListener: vi.fn(),
    });

    renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
    });

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should update when media query match changes', () => {
    let changeHandler: ((e: any) => void) | null = null;
    const addEventListenerSpy = vi.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });

    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      addEventListener: addEventListenerSpy,
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    // Simulate media query change
    if (changeHandler) {
      act(() => {
        changeHandler!({ matches: true } as MediaQueryListEvent);
      });
    }

    expect(result.current).toBe(true);
  });

  it('should work with different media queries', () => {
    const queries = [
      '(min-width: 640px)',
      '(max-width: 1024px)',
      '(orientation: portrait)',
      '(prefers-color-scheme: dark)',
    ];

    queries.forEach((query) => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      const { result } = renderHook(() => useMediaQuery(query));
      expect(result.current).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith(query);
    });
  });

  it('should handle query changes', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 768px)' } }
    );

    expect(result.current).toBe(true);

    // Change query
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(min-width: 1024px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    rerender({ query: '(min-width: 1024px)' });
    expect(result.current).toBe(false);
  });
});
