import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Input component
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual state indicating validation status */
  validationState?: 'error' | 'success' | 'default';
  /** Whether the input should take up the full width of its container */
  fullWidth?: boolean;
}

/**
 * Input component for text fields with validation state styling.
 * 
 * A styled text input with support for validation states (error, success).
 * Includes focus states and smooth transitions for better user experience.
 * 
 * @example
 * ```tsx
 * // Basic input
 * <Input placeholder="Enter your name" />
 * 
 * // Input with error state
 * <Input validationState="error" value={email} onChange={handleChange} />
 * 
 * // Full width input
 * <Input fullWidth placeholder="Search..." />
 * ```
 * 
 * @component
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      validationState = 'default',
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'px-3 py-2 text-base rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    const validationStyles = {
      default: 'border-border focus:border-accent focus:ring-accent/20',
      error: 'border-error focus:border-error focus:ring-error/20',
      success: 'border-success focus:border-success focus:ring-success/20',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <input
        ref={ref}
        className={cn(
          baseStyles,
          validationStyles[validationState],
          widthStyles,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
