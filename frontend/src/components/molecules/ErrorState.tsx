/**
 * ErrorState Component
 * Reusable error display with recovery actions
 */

import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft, X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message to display */
  message: string;
  /** Optional detailed error information */
  details?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Go back callback */
  onGoBack?: () => void;
  /** Custom recovery action */
  customAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'error' | 'warning' | 'info';
  /** Additional CSS classes */
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  details,
  onRetry,
  onDismiss,
  onGoBack,
  customAction,
  size = 'md',
  variant = 'error',
  className,
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-12 h-12 sm:w-16 sm:h-16',
  };

  const variantClasses = {
    error: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
  };

  const iconColors = {
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  const textColors = {
    error: {
      title: 'text-red-900 dark:text-red-100',
      message: 'text-red-700 dark:text-red-300',
      details: 'text-red-600 dark:text-red-400',
    },
    warning: {
      title: 'text-yellow-900 dark:text-yellow-100',
      message: 'text-yellow-700 dark:text-yellow-300',
      details: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      title: 'text-blue-900 dark:text-blue-100',
      message: 'text-blue-700 dark:text-blue-300',
      details: 'text-blue-600 dark:text-blue-400',
    },
  };

  // Ensure at least one recovery action is available
  const hasRecoveryAction = onRetry || onDismiss || onGoBack || customAction;

  return (
    <div
      className={cn(
        'rounded-lg border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        {/* Icon */}
        <AlertCircle className={cn(iconSizes[size], iconColors[variant], 'mb-4')} />

        {/* Title */}
        <h3 className={cn('text-lg font-semibold mb-2', textColors[variant].title)}>
          {title}
        </h3>

        {/* Message */}
        <p className={cn('text-sm mb-4', textColors[variant].message)}>
          {message}
        </p>

        {/* Details (if provided) */}
        {details && (
          <details className="w-full mb-4">
            <summary className={cn('text-xs cursor-pointer hover:underline', textColors[variant].details)}>
              Show details
            </summary>
            <pre className={cn('text-xs mt-2 p-2 bg-white/50 dark:bg-black/20 rounded overflow-auto', textColors[variant].details)}>
              {details}
            </pre>
          </details>
        )}

        {/* Recovery Actions */}
        {hasRecoveryAction && (
          <div className="flex flex-wrap gap-2 justify-center">
            {onRetry && (
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Retry
              </Button>
            )}

            {customAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={customAction.onClick}
                icon={customAction.icon}
              >
                {customAction.label}
              </Button>
            )}

            {onGoBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onGoBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Go Back
              </Button>
            )}

            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                icon={<X className="w-4 h-4" />}
              >
                Dismiss
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
