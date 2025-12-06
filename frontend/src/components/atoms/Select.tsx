import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Select component
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Visual state indicating validation status */
  validationState?: 'error' | 'success' | 'default';
  /** Whether the select should take up the full width of its container */
  fullWidth?: boolean;
}

/**
 * Select component for dropdown menus with validation state styling.
 * 
 * A styled dropdown select with support for validation states.
 * Includes focus states and smooth transitions for better user experience.
 * 
 * @example
 * ```tsx
 * // Basic select
 * <Select>
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </Select>
 * 
 * // Select with error state
 * <Select validationState="error" value={priority}>
 *   <option value="low">Low</option>
 *   <option value="high">High</option>
 * </Select>
 * 
 * // Full width select
 * <Select fullWidth>
 *   <option>Choose...</option>
 * </Select>
 * ```
 * 
 * @component
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      validationState = 'default',
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'px-3 py-2 text-base rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-background';

    const validationStyles = {
      default: 'border-border focus:border-accent focus:ring-accent/20',
      error: 'border-error focus:border-error focus:ring-error/20',
      success: 'border-success focus:border-success focus:ring-success/20',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <select
        ref={ref}
        className={cn(
          baseStyles,
          validationStyles[validationState],
          widthStyles,
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
