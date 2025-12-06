import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/**
 * Radio button component with optional label
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'h-4 w-4 rounded-full border-2 border-border text-accent focus:ring-2 focus:ring-accent focus:ring-offset-1 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const radio = (
      <input
        ref={ref}
        type="radio"
        className={cn(baseStyles, className)}
        {...props}
      />
    );

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {radio}
          <span className="text-base select-none">{label}</span>
        </label>
      );
    }

    return radio;
  }
);

Radio.displayName = 'Radio';
