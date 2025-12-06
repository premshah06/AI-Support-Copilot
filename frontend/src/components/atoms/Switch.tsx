import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/**
 * Switch component for binary toggle options
 * Includes smooth toggle animation with spring physics
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      checked = false,
      className,
      ...props
    },
    ref
  ) => {
    const switchElement = (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <motion.div 
          className={cn(
            "w-11 h-6 rounded-full peer transition-colors duration-200 relative",
            "peer-focus:ring-2 peer-focus:ring-accent peer-focus:ring-offset-1",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            checked ? "bg-accent" : "bg-muted",
            className
          )}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 shadow-sm"
            animate={{
              x: checked ? 20 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />
        </motion.div>
      </label>
    );

    if (label) {
      return (
        <div className="inline-flex items-center gap-2">
          {switchElement}
          <span className="text-base select-none">{label}</span>
        </div>
      );
    }

    return switchElement;
  }
);

Switch.displayName = 'Switch';
