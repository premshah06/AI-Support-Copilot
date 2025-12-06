import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Badge component
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color variant indicating the badge's semantic meaning */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Size of the badge */
  size?: 'sm' | 'md' | 'lg';
  /** Optional icon to display before the badge text */
  icon?: React.ReactNode;
  /** Badge content */
  children: React.ReactNode;
}

/**
 * Badge component for displaying status indicators and labels.
 * 
 * Used to highlight important information, status, or categories with color-coded variants.
 * Commonly used for priority levels, ticket statuses, and category tags.
 * 
 * @example
 * ```tsx
 * // Success badge
 * <Badge variant="success">Resolved</Badge>
 * 
 * // Badge with icon
 * <Badge variant="error" icon={<AlertCircle />}>
 *   Critical
 * </Badge>
 * 
 * // Small badge
 * <Badge size="sm" variant="info">New</Badge>
 * ```
 * 
 * @component
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';

    const variantStyles = {
      default: 'bg-muted text-muted-foreground',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      error: 'bg-error/10 text-error border border-error/20',
      info: 'bg-info/10 text-info border border-info/20',
    };

    const sizeStyles = {
      sm: 'text-xs px-2 py-0.5 gap-1',
      md: 'text-sm px-2.5 py-1 gap-1.5',
      lg: 'text-base px-3 py-1.5 gap-2',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && <span className="inline-flex items-center">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
