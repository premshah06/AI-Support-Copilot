import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Label component for form fields with required indicator
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      required = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'text-sm font-medium text-foreground';

    return (
      <label
        ref={ref}
        className={cn(baseStyles, className)}
        {...props}
      >
        {children}
        {required && <span className="text-error ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
