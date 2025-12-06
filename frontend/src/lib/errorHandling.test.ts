/**
 * Unit tests for error handling utilities
 * Tests specific error scenarios and edge cases
 */

import { describe, it, expect, vi } from 'vitest';
import {
  getUserFriendlyErrorMessage,
  isErrorType,
  getValidationErrors,
  setupGlobalErrorHandler,
  type UserFriendlyError,
} from './errorHandling';
import { AxiosError } from 'axios';

// Helper to create mock Axios errors
function createMockAxiosError(
  status: number,
  message?: string,
  data?: any
): AxiosError {
  const error = new Error(message || 'Request failed') as AxiosError;
  error.isAxiosError = true;
  error.name = 'AxiosError';
  error.code = status === 0 ? 'ERR_NETWORK' : undefined;

  if (status !== 0) {
    error.response = {
      status,
      data: data || (message ? { message } : {}),
      statusText: 'Error',
      headers: {},
      config: {} as any,
    };
  }

  error.config = {} as any;
  error.toJSON = () => ({});
  return error;
}

describe('getUserFriendlyErrorMessage', () => {
  describe('Network Errors', () => {
    it('should handle network errors without response', () => {
      const error = createMockAxiosError(0);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('network');
      expect(result.message).toContain('connect');
      expect(result.suggestedAction).toBeTruthy();
    });

    it('should provide connection-related guidance for network errors', () => {
      const error = createMockAxiosError(0);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.suggestedAction).toMatch(/connection|try again/i);
    });
  });

  describe('Client Errors (4xx)', () => {
    it('should handle 400 Bad Request', () => {
      const error = createMockAxiosError(400);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('validation');
      expect(result.message).toMatch(/invalid|check/i);
    });

    it('should use server message for 400 errors when available', () => {
      const error = createMockAxiosError(400, 'Email is already registered');
      const result = getUserFriendlyErrorMessage(error);

      expect(result.message).toBe('Email is already registered');
    });

    it('should handle 401 Unauthorized', () => {
      const error = createMockAxiosError(401);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('authentication');
      expect(result.message).toMatch(/session|expired|refresh/i);
    });

    it('should handle 403 Forbidden', () => {
      const error = createMockAxiosError(403);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('authorization');
      expect(result.message).toMatch(/permission/i);
    });

    it('should handle 404 Not Found', () => {
      const error = createMockAxiosError(404);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('not_found');
      expect(result.message).toMatch(/not found/i);
    });

    it('should handle 422 Unprocessable Entity', () => {
      const error = createMockAxiosError(422, 'Validation failed');
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('validation');
      expect(result.message).toContain('Validation failed');
    });

    it('should handle 429 Too Many Requests', () => {
      const error = createMockAxiosError(429);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('server');
      expect(result.message).toMatch(/too many|slow down/i);
    });
  });

  describe('Server Errors (5xx)', () => {
    it('should handle 500 Internal Server Error', () => {
      const error = createMockAxiosError(500);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('server');
      expect(result.message).toMatch(/server error/i);
    });

    it('should handle 502 Bad Gateway', () => {
      const error = createMockAxiosError(502);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('server');
    });

    it('should handle 503 Service Unavailable', () => {
      const error = createMockAxiosError(503);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('server');
    });

    it('should handle 504 Gateway Timeout', () => {
      const error = createMockAxiosError(504);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('server');
    });

    it('should not blame user for server errors', () => {
      const error = createMockAxiosError(500);
      const result = getUserFriendlyErrorMessage(error);

      expect(result.message.toLowerCase()).not.toMatch(/your fault|you did/);
    });
  });

  describe('Standard Error Objects', () => {
    it('should handle network-related Error messages', () => {
      const error = new Error('Network request failed');
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('network');
    });

    it('should handle timeout errors', () => {
      const error = new Error('Request timeout exceeded');
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('network');
      expect(result.message.toLowerCase()).toMatch(/timeout|timed out/);
    });

    it('should handle AI service errors', () => {
      const error = new Error('AI assistant service unavailable');
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('ai_service');
      expect(result.message).toMatch(/ai/i);
    });

    it('should handle generic Error objects', () => {
      const error = new Error('Something went wrong');
      const result = getUserFriendlyErrorMessage(error);

      expect(result.type).toBe('unknown');
      expect(result.message).toBeTruthy();
    });
  });

  describe('Unknown Error Types', () => {
    it('should handle null', () => {
      const result = getUserFriendlyErrorMessage(null);

      expect(result.type).toBe('unknown');
      expect(result.message).toBeTruthy();
    });

    it('should handle undefined', () => {
      const result = getUserFriendlyErrorMessage(undefined);

      expect(result.type).toBe('unknown');
      expect(result.message).toBeTruthy();
    });

    it('should handle string errors', () => {
      const result = getUserFriendlyErrorMessage('Something failed');

      expect(result.type).toBe('unknown');
      expect(result.message).toBeTruthy();
    });

    it('should handle number errors', () => {
      const result = getUserFriendlyErrorMessage(404);

      expect(result.type).toBe('unknown');
      expect(result.message).toBeTruthy();
    });

    it('should handle plain objects', () => {
      const result = getUserFriendlyErrorMessage({ error: 'failed' });

      expect(result.type).toBe('unknown');
      expect(result.message).toBeTruthy();
    });
  });

  describe('Message Quality', () => {
    it('should always return non-empty messages', () => {
      const errors = [
        createMockAxiosError(0),
        createMockAxiosError(400),
        createMockAxiosError(500),
        new Error('Test error'),
        null,
      ];

      errors.forEach((error) => {
        const result = getUserFriendlyErrorMessage(error);
        expect(result.message.length).toBeGreaterThan(0);
      });
    });

    it('should always provide suggested actions', () => {
      const errors = [
        createMockAxiosError(0),
        createMockAxiosError(400),
        createMockAxiosError(500),
      ];

      errors.forEach((error) => {
        const result = getUserFriendlyErrorMessage(error);
        expect(result.suggestedAction).toBeTruthy();
        expect(result.suggestedAction!.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('isErrorType', () => {
  it('should correctly identify network errors', () => {
    const error = createMockAxiosError(0);
    expect(isErrorType(error, 'network')).toBe(true);
    expect(isErrorType(error, 'validation')).toBe(false);
  });

  it('should correctly identify validation errors', () => {
    const error = createMockAxiosError(400);
    expect(isErrorType(error, 'validation')).toBe(true);
    expect(isErrorType(error, 'network')).toBe(false);
  });

  it('should correctly identify authentication errors', () => {
    const error = createMockAxiosError(401);
    expect(isErrorType(error, 'authentication')).toBe(true);
  });

  it('should correctly identify authorization errors', () => {
    const error = createMockAxiosError(403);
    expect(isErrorType(error, 'authorization')).toBe(true);
  });

  it('should correctly identify not_found errors', () => {
    const error = createMockAxiosError(404);
    expect(isErrorType(error, 'not_found')).toBe(true);
  });

  it('should correctly identify server errors', () => {
    const error = createMockAxiosError(500);
    expect(isErrorType(error, 'server')).toBe(true);
  });

  it('should correctly identify AI service errors', () => {
    const error = new Error('AI assistant failed');
    expect(isErrorType(error, 'ai_service')).toBe(true);
  });

  it('should correctly identify unknown errors', () => {
    const error = new Error('Random error');
    expect(isErrorType(error, 'unknown')).toBe(true);
  });
});

describe('getValidationErrors', () => {
  it('should extract validation errors from errors object', () => {
    const error = createMockAxiosError(400, undefined, {
      errors: {
        email: 'Invalid email format',
        password: 'Password too short',
      },
    });

    const result = getValidationErrors(error);

    expect(result).toEqual({
      email: 'Invalid email format',
      password: 'Password too short',
    });
  });

  it('should extract FastAPI validation errors', () => {
    const error = createMockAxiosError(422, undefined, {
      detail: [
        { loc: ['body', 'email'], msg: 'Invalid email' },
        { loc: ['body', 'password'], msg: 'Too short' },
      ],
    });

    const result = getValidationErrors(error);

    expect(result).toEqual({
      email: 'Invalid email',
      password: 'Too short',
    });
  });

  it('should return empty object for non-Axios errors', () => {
    const error = new Error('Not an Axios error');
    const result = getValidationErrors(error);

    expect(result).toEqual({});
  });

  it('should return empty object for errors without validation data', () => {
    const error = createMockAxiosError(500);
    const result = getValidationErrors(error);

    expect(result).toEqual({});
  });

  it('should return empty object for network errors', () => {
    const error = createMockAxiosError(0);
    const result = getValidationErrors(error);

    expect(result).toEqual({});
  });

  it('should handle nested field paths in FastAPI errors', () => {
    const error = createMockAxiosError(422, undefined, {
      detail: [{ loc: ['body', 'user', 'email'], msg: 'Invalid' }],
    });

    const result = getValidationErrors(error);

    expect(result.email).toBe('Invalid');
  });
});

describe('setupGlobalErrorHandler', () => {
  it('should add response interceptor to API client', () => {
    const mockApiClient = {
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    };

    setupGlobalErrorHandler(mockApiClient);

    expect(mockApiClient.interceptors.response.use).toHaveBeenCalled();
  });

  it('should call onError callback when error occurs', async () => {
    const mockApiClient = {
      interceptors: {
        response: {
          use: vi.fn((successHandler, errorHandler) => {
            // Simulate an error
            const error = createMockAxiosError(500);
            // Call error handler and catch the rejection
            errorHandler(error).catch(() => {});
          }),
        },
      },
    };

    const onError = vi.fn();
    setupGlobalErrorHandler(mockApiClient, onError);

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
        type: expect.any(String),
      })
    );
  });

  it('should work without onError callback', () => {
    const mockApiClient = {
      interceptors: {
        response: {
          use: vi.fn((successHandler, errorHandler) => {
            const error = createMockAxiosError(500);
            // Call error handler and catch the rejection
            errorHandler(error).catch(() => {});
          }),
        },
      },
    };

    expect(() => {
      setupGlobalErrorHandler(mockApiClient);
    }).not.toThrow();
  });
});
