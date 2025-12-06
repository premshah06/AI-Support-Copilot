import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Card component
 */
interface CardProps {
  /** Visual style variant of the card */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Padding size inside the card */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether the card should have hover effects */
  hoverable?: boolean;
  /** Click handler for the card */
  onClick?: () => void;
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for Card section components (Header, Body, Footer)
 */
interface CardSectionProps {
  /** Section content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Card component for containing related content.
 * 
 * A flexible container component with multiple variants and optional hover effects.
 * Can be composed with CardHeader, CardBody, and CardFooter for structured layouts.
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content goes here</CardBody>
 * </Card>
 * 
 * // Elevated card with hover effect
 * <Card variant="elevated" hoverable onClick={handleClick}>
 *   <CardBody>Clickable content</CardBody>
 * </Card>
 * 
 * // Card with footer
 * <Card padding="lg">
 *   <CardHeader>Header</CardHeader>
 *   <CardBody>Body content</CardBody>
 *   <CardFooter>Footer actions</CardFooter>
 * </Card>
 * ```
 * 
 * @component
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hoverable = false, onClick, children, className }, ref) => {
    const variantClasses = {
      default: 'bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700',
      elevated: 'bg-white dark:bg-secondary shadow-md',
      outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    const hoverClasses = hoverable
      ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'rounded-lg',
          variantClasses[variant],
          paddingClasses[padding],
          hoverClasses,
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader component for card titles and header content.
 * 
 * @component
 */
const CardHeader: React.FC<CardSectionProps> = ({ children, className }) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

/**
 * CardBody component for main card content.
 * 
 * @component
 */
const CardBody: React.FC<CardSectionProps> = ({ children, className }) => {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
};

/**
 * CardFooter component for card actions and footer content.
 * Includes a top border to separate from the body.
 * 
 * @component
 */
const CardFooter: React.FC<CardSectionProps> = ({ children, className }) => {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };
