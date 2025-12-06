/**
 * FormField Component
 * Combines label, input, and error message for form fields
 * Enhanced with validation animations
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shakeVariants, scaleInVariants } from '@/animations/variants';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  showValidation?: boolean; // Show success checkmark when valid
  validate?: (value: string) => boolean; // Optional validation function
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className,
  helpText,
  showValidation = false,
  validate,
}) => {
  const hasError = !!error;
  const [shouldShake, setShouldShake] = useState(false);
  const [previousError, setPreviousError] = useState<string | undefined>(error);
  
  // Determine if field is valid
  const isValid = showValidation && value.trim() !== '' && !hasError && 
    (validate ? validate(value) : true);

  // Trigger shake animation when error appears
  useEffect(() => {
    if (error && error !== previousError) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 400);
      return () => clearTimeout(timer);
    }
    setPreviousError(error);
  }, [error, previousError]);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <div className="relative">
        <motion.div
          animate={shouldShake ? 'shake' : 'rest'}
          variants={shakeVariants}
        >
          <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              hasError && 'border-red-500 dark:border-red-500 focus:ring-red-500',
              isValid && 'border-green-500 dark:border-green-500 focus:ring-green-500 pr-10'
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${name}-error` : helpText ? `${name}-help` : undefined
            }
          />
        </motion.div>
        
        {/* Success checkmark animation */}
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={scaleInVariants}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Error message with fade animation */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scaleY: 0, originY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            id={`${name}-error`}
            className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {helpText && !error && (
        <p
          id={`${name}-help`}
          className="text-xs text-muted-foreground"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};
