import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value from localStorage if it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value is set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
  });

  it('should work with function updater', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem('counter')).toBe(JSON.stringify(1));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
    expect(localStorage.getItem('counter')).toBe(JSON.stringify(6));
  });

  it('should work with objects', () => {
    const initialObj = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('user', initialObj));

    expect(result.current[0]).toEqual(initialObj);

    const updatedObj = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](updatedObj);
    });

    expect(result.current[0]).toEqual(updatedObj);
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(updatedObj);
  });

  it('should work with arrays', () => {
    const { result } = renderHook(() => useLocalStorage('items', [1, 2, 3]));

    expect(result.current[0]).toEqual([1, 2, 3]);

    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
    expect(JSON.parse(localStorage.getItem('items')!)).toEqual([4, 5, 6]);
  });

  it('should work with boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('flag', false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(JSON.parse(localStorage.getItem('flag')!)).toBe(true);
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('test-key', 'invalid-json{');

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle localStorage errors when setting value', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  it('should sync across storage events', () => {
    const { result } = renderHook(() => useLocalStorage('sync-key', 'initial'));

    expect(result.current[0]).toBe('initial');

    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'sync-key',
        newValue: JSON.stringify('updated-from-another-tab'),
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe('updated-from-another-tab');
  });

  it('should not sync for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('key-a', 'value-a'));

    expect(result.current[0]).toBe('value-a');

    // Simulate storage event for different key
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'key-b',
        newValue: JSON.stringify('value-b'),
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);
    });

    // Value should remain unchanged
    expect(result.current[0]).toBe('value-a');
  });
});
