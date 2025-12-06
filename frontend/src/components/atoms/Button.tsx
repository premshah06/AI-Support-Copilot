import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for the Button component
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Optional icon to display alongside the button text */
  icon?: React.ReactNode;
  /** Position of the icon relative to the text */
  iconPosition?: 'left' | 'right';
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean;
  /** Button content */
  children?: React.ReactNode;
}

/**
 * Button component with multiple variants and sizes.
 * 
 * A versatile button component that supports different visual styles, sizes, and states.
 * Includes smooth animations for hover and press interactions using Framer Motion.
 * 
 * @example
 * ```tsx
 * // Primary button with loading state
 * <Button variant="primary" loading={isLoading}>
 *   Save Changes
 * </Button>
 * 
 * // Button with icon
 * <Button variant="outline" icon={<Plus />} iconPosition="left">
 *   Add Item
 * </Button>
 * 
 * // Destructive action button
 * <Button variant="destructive" size="sm">
 *   Delete
 * </Button>
 * ```
 * 
 * @component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
      outline: 'border-2 border-border bg-transparent hover:bg-muted focus:ring-accent',
      ghost: 'bg-transparent hover:bg-muted focus:ring-accent',
      destructive: 'bg-error text-error-foreground hover:bg-error/90 focus:ring-error',
    };

    const sizeStyles = {
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-base px-4 py-2 gap-2',
      lg: 'text-lg px-6 py-3 gap-2.5',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          className
        )}
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.15 }}
        {...(props as any)}
      >
        {loading && (
          <motion.svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
