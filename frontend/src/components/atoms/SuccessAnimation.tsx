import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onComplete?: () => void;
}

/**
 * Success animation component with checkmark and pulse effect
 * Used to provide visual feedback for successful actions
 */
export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  size = 'md',
  className,
  onComplete,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      {/* Pulse rings */}
      <motion.div
        className={cn(
          'absolute rounded-full bg-success/20',
          sizeClasses[size]
        )}
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.div
        className={cn(
          'absolute rounded-full bg-success/20',
          sizeClasses[size]
        )}
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        onAnimationComplete={onComplete}
      />

      {/* Checkmark circle */}
      <motion.div
        className={cn(
          'relative rounded-full bg-success flex items-center justify-center',
          sizeClasses[size]
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        {/* Checkmark icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          <Check
            size={iconSizes[size]}
            className="text-white"
            strokeWidth={3}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * Inline success checkmark animation for buttons and small spaces
 */
export const InlineSuccessCheck: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={className}
    >
      <Check size={16} className="text-success" strokeWidth={3} />
    </motion.div>
  );
};

/**
 * Success pulse effect that can be applied to any element
 */
export const SuccessPulse: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 0.4,
        times: [0, 0.5, 1],
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};
