/**
 * TextAreaField Component
 * Combines label, textarea, and error message for multi-line form fields
 */

import React from 'react';
import { Label } from '../atoms/Label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
  helpText?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className,
  helpText,
}) => {
  const hasError = !!error;
  const charCount = value.length;
  const isNearLimit = maxLength && charCount > maxLength * 0.9;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'w-full px-3 py-2 text-sm border rounded-lg',
          'bg-background text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'resize-none transition-colors',
          hasError && 'border-red-500 dark:border-red-500 focus:ring-red-500',
          !hasError && 'border-border'
        )}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${name}-error` : helpText ? `${name}-help` : undefined
        }
      />
      
      {/* Character count and error/help text row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {error && (
            <div
              id={`${name}-error`}
              className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {helpText && !error && (
            <p
              id={`${name}-help`}
              className="text-xs text-muted-foreground"
            >
              {helpText}
            </p>
          )}
        </div>
        
        {showCharCount && (
          <span
            className={cn(
              'text-xs flex-shrink-0',
              isNearLimit ? 'text-warning font-medium' : 'text-muted-foreground'
            )}
          >
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </span>
        )}
      </div>
    </div>
  );
};
