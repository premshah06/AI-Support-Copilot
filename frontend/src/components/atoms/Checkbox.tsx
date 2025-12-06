import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

/**
 * Checkbox component with optional label and indeterminate state
 * Includes toggle animation
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      className,
      ...props
    },
    ref
  ) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => checkboxRef.current!);

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const baseStyles = 'h-4 w-4 rounded border-2 border-border text-accent focus:ring-2 focus:ring-accent focus:ring-offset-1 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const checkbox = (
      <motion.div
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.1 }}
      >
        <input
          ref={checkboxRef}
          type="checkbox"
          className={cn(baseStyles, className)}
          {...props}
        />
      </motion.div>
    );

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {checkbox}
          <span className="text-base select-none">{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';
