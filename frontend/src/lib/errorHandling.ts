/**
 * Error handling utilities for the application
 * Provides functions for transforming errors into user-friendly messages
 * and setting up global error handling
 */

import { AxiosError } from 'axios';

/**
 * Error types that can occur in the application
 */
export type ErrorType =
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'server'
  | 'ai_service'
  | 'unknown';

/**
 * User-friendly error message with type and optional action
 */
export interface UserFriendlyError {
  message: string;
  type: ErrorType;
  suggestedAction?: string;
}

/**
 * Convert an error into a user-friendly message
 * Transforms technical errors into messages that users can understand and act on
 * 
 * @param error - The error to convert (can be Error, AxiosError, or unknown)
 * @returns User-friendly error object with message, type, and suggested action
 * 
 * @example
 * try {
 *   await api.updateTicket(id, data);
 * } catch (error) {
 *   const friendlyError = getUserFriendlyErrorMessage(error);
 *   showToast(friendlyError.message, 'error');
 * }
 */
export function getUserFriendlyErrorMessage(error: unknown): UserFriendlyError {
  // Handle Axios errors (API errors)
  if (isAxiosError(error)) {
    return handleAxiosError(error);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return handleStandardError(error);
  }

  // Handle unknown error types
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'unknown',
    suggestedAction: 'If the problem persists, please contact support.',
  };
}

/**
 * Type guard to check if an error is an AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return error != null && (error as AxiosError).isAxiosError === true;
}

/**
 * Handle Axios errors (API/network errors)
 */
function handleAxiosError(error: AxiosError): UserFriendlyError {
  // Network error (no response from server)
  if (!error.response) {
    return {
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'network',
      suggestedAction: 'Check your connection and try again.',
    };
  }

  const status = error.response.status;
  const data = error.response.data as any;

  // Extract error message from response if available
  const serverMessage = data?.message || data?.detail || data?.error;

  switch (status) {
    case 400:
      return {
        message: serverMessage || 'Invalid request. Please check your input and try again.',
        type: 'validation',
        suggestedAction: 'Review your input and make sure all required fields are filled correctly.',
      };

    case 401:
      return {
        message: 'Your session has expired. Please refresh the page.',
        type: 'authentication',
        suggestedAction: 'Refresh the page to continue.',
      };

    case 403:
      return {
        message: "You don't have permission to perform this action.",
        type: 'authorization',
        suggestedAction: 'Contact your administrator if you believe this is an error.',
      };

    case 404:
      return {
        message: 'The requested resource was not found.',
        type: 'not_found',
        suggestedAction: 'Check the URL or try refreshing the page. The item may have been deleted or moved.',
      };

    case 422:
      return {
        message: serverMessage || 'Validation failed. Please check your input.',
        type: 'validation',
        suggestedAction: 'Make sure all fields contain valid data.',
      };

    case 429:
      return {
        message: 'Too many requests. Please slow down and try again.',
        type: 'server',
        suggestedAction: 'Wait a moment before trying again.',
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: 'Server error. Our team has been notified.',
        type: 'server',
        suggestedAction: 'Please try again in a few moments.',
      };

    default:
      return {
        message: serverMessage || 'An error occurred while processing your request.',
        type: 'server',
        suggestedAction: 'Please try again or contact support if the problem persists.',
      };
  }
}

/**
 * Handle standard Error objects
 */
function handleStandardError(error: Error): UserFriendlyError {
  const message = error.message.toLowerCase();

  // Check for specific error patterns
  if (message.includes('network') || message.includes('fetch')) {
    return {
      message: 'Network error. Please check your connection.',
      type: 'network',
      suggestedAction: 'Check your internet connection and try again.',
    };
  }

  if (message.includes('timeout')) {
    return {
      message: 'Request timed out. The server took too long to respond.',
      type: 'network',
      suggestedAction: 'Try again in a moment.',
    };
  }

  if (message.includes('ai') || message.includes('assistant')) {
    return {
      message: 'AI assistant is temporarily unavailable.',
      type: 'ai_service',
      suggestedAction: 'You can still manage tickets manually. Try the AI assistant again later.',
    };
  }

  // Generic error
  return {
    message: error.message || 'An unexpected error occurred.',
    type: 'unknown',
    suggestedAction: 'Try again or contact support if the problem persists.',
  };
}

/**
 * Setup global error handler for axios
 * This should be called once during app initialization
 * 
 * @param apiClient - The axios instance to add interceptors to
 * @param onError - Optional callback to handle errors (e.g., show toast)
 * 
 * @example
 * import { apiClient } from './api/client';
 * import { useToast } from './contexts/ToastContext';
 * 
 * const { showToast } = useToast();
 * setupGlobalErrorHandler(apiClient, (error) => {
 *   showToast(error.message, 'error');
 * });
 */
export function setupGlobalErrorHandler(
  apiClient: any,
  onError?: (error: UserFriendlyError) => void
): void {
  apiClient.interceptors.response.use(
    (response: any) => response,
    (error: unknown) => {
      // Log error for debugging
      console.error('API Error:', error);

      // Transform to user-friendly error
      const friendlyError = getUserFriendlyErrorMessage(error);

      // Call error callback if provided
      if (onError) {
        onError(friendlyError);
      }

      // Re-throw the original error so it can be caught by calling code
      return Promise.reject(error);
    }
  );
}

/**
 * Check if an error is a specific type
 * Useful for conditional error handling
 * 
 * @param error - The error to check
 * @param type - The error type to check for
 * @returns True if the error matches the specified type
 * 
 * @example
 * if (isErrorType(error, 'network')) {
 *   // Show offline message
 * } else if (isErrorType(error, 'validation')) {
 *   // Highlight invalid fields
 * }
 */
export function isErrorType(error: unknown, type: ErrorType): boolean {
  const friendlyError = getUserFriendlyErrorMessage(error);
  return friendlyError.type === type;
}

/**
 * Extract validation errors from API response
 * Useful for form validation
 * 
 * @param error - The error from API
 * @returns Object mapping field names to error messages
 * 
 * @example
 * const validationErrors = getValidationErrors(error);
 * // { email: "Invalid email format", password: "Password too short" }
 */
export function getValidationErrors(error: unknown): Record<string, string> {
  if (!isAxiosError(error) || !error.response) {
    return {};
  }

  const data = error.response.data as any;

  // Handle different validation error formats
  if (data?.errors && typeof data.errors === 'object') {
    return data.errors;
  }

  if (data?.detail && Array.isArray(data.detail)) {
    // FastAPI validation error format
    const errors: Record<string, string> = {};
    data.detail.forEach((err: any) => {
      const field = err.loc?.[err.loc.length - 1] || 'unknown';
      errors[field] = err.msg;
    });
    return errors;
  }

  return {};
}
