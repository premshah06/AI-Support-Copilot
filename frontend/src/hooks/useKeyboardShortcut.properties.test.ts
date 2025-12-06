import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import fc from 'fast-check';
import { useKeyboardShortcut, KeyboardShortcut } from './useKeyboardShortcut';

// **Feature: ui-modernization, Property 13: Keyboard shortcut execution**
// **Validates: Requirements 12.1**

describe('Property 13: Keyboard shortcut execution', () => {
  beforeEach(() => {
    // Clear any existing event listeners
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up
    vi.restoreAllMocks();
  });

  it('should execute the corresponding action when a defined keyboard shortcut is triggered', () => {
    fc.assert(
      fc.property(
        // Generate a random key and modifier combination
        fc.record({
          key: fc.constantFrom('a', 'b', 'c', 'k', 's', 'Enter', 'Escape', '?', '/'),
          ctrlKey: fc.boolean(),
          shiftKey: fc.boolean(),
          altKey: fc.boolean(),
        }),
        (shortcutConfig) => {
          // Create a mock action function
          const mockAction = vi.fn();

          // Create the shortcut definition
          const shortcuts: KeyboardShortcut[] = [
            {
              key: shortcutConfig.key,
              ctrlKey: shortcutConfig.ctrlKey,
              shiftKey: shortcutConfig.shiftKey,
              altKey: shortcutConfig.altKey,
              description: 'Test shortcut',
              action: mockAction,
            },
          ];

          // Render the hook
          renderHook(() => useKeyboardShortcut(shortcuts, true));

          // Create and dispatch a keyboard event matching the shortcut
          const event = new KeyboardEvent('keydown', {
            key: shortcutConfig.key,
            ctrlKey: shortcutConfig.ctrlKey,
            shiftKey: shortcutConfig.shiftKey,
            altKey: shortcutConfig.altKey,
            metaKey: shortcutConfig.ctrlKey, // metaKey is treated as ctrlKey on Mac
            bubbles: true,
            cancelable: true,
          });

          window.dispatchEvent(event);

          // The action should have been called exactly once
          expect(mockAction).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not execute action when shortcut is disabled', () => {
    fc.assert(
      fc.property(
        fc.record({
          key: fc.constantFrom('a', 'b', 'c', 'k', 's'),
          ctrlKey: fc.boolean(),
        }),
        (shortcutConfig) => {
          const mockAction = vi.fn();

          const shortcuts: KeyboardShortcut[] = [
            {
              key: shortcutConfig.key,
              ctrlKey: shortcutConfig.ctrlKey,
              description: 'Test shortcut',
              action: mockAction,
            },
          ];

          // Render with enabled=false
          renderHook(() => useKeyboardShortcut(shortcuts, false));

          const event = new KeyboardEvent('keydown', {
            key: shortcutConfig.key,
            ctrlKey: shortcutConfig.ctrlKey,
            metaKey: shortcutConfig.ctrlKey,
            bubbles: true,
            cancelable: true,
          });

          window.dispatchEvent(event);

          // The action should NOT have been called
          expect(mockAction).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not execute action when typing in input fields (except ESC)', () => {
    fc.assert(
      fc.property(
        fc.record({
          key: fc.constantFrom('a', 'b', 'c', 'k', 's'),
          inputType: fc.constantFrom('INPUT', 'TEXTAREA'),
        }),
        (config) => {
          const mockAction = vi.fn();

          const shortcuts: KeyboardShortcut[] = [
            {
              key: config.key,
              description: 'Test shortcut',
              action: mockAction,
            },
          ];

          renderHook(() => useKeyboardShortcut(shortcuts, true));

          // Create an input element and set it as the event target
          const inputElement = document.createElement(config.inputType.toLowerCase());
          document.body.appendChild(inputElement);
          inputElement.focus();

          const event = new KeyboardEvent('keydown', {
            key: config.key,
            bubbles: true,
            cancelable: true,
          });

          // Dispatch event on the input element
          inputElement.dispatchEvent(event);

          // The action should NOT have been called (input fields block shortcuts)
          expect(mockAction).not.toHaveBeenCalled();

          // Cleanup
          document.body.removeChild(inputElement);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should execute ESC shortcut even when typing in input fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('INPUT', 'TEXTAREA'),
        (inputType) => {
          const mockAction = vi.fn();

          const shortcuts: KeyboardShortcut[] = [
            {
              key: 'Escape',
              description: 'Close',
              action: mockAction,
            },
          ];

          renderHook(() => useKeyboardShortcut(shortcuts, true));

          // Create an input element
          const inputElement = document.createElement(inputType.toLowerCase());
          document.body.appendChild(inputElement);
          inputElement.focus();

          const event = new KeyboardEvent('keydown', {
            key: 'Escape',
            bubbles: true,
            cancelable: true,
          });

          inputElement.dispatchEvent(event);

          // ESC should work even in input fields
          expect(mockAction).toHaveBeenCalledTimes(1);

          // Cleanup
          document.body.removeChild(inputElement);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should only execute the first matching shortcut when multiple shortcuts match', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('a', 'b', 'c', 'k'),
        (key) => {
          const mockAction1 = vi.fn();
          const mockAction2 = vi.fn();

          // Create two shortcuts with the same key combination
          const shortcuts: KeyboardShortcut[] = [
            {
              key,
              description: 'First shortcut',
              action: mockAction1,
            },
            {
              key,
              description: 'Second shortcut',
              action: mockAction2,
            },
          ];

          renderHook(() => useKeyboardShortcut(shortcuts, true));

          const event = new KeyboardEvent('keydown', {
            key,
            bubbles: true,
            cancelable: true,
          });

          window.dispatchEvent(event);

          // Only the first action should be called
          expect(mockAction1).toHaveBeenCalledTimes(1);
          expect(mockAction2).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 50 }
    );
  });
});
