import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Props for the FilterChip component
 */
interface FilterChipProps {
  /** Label text for the filter */
  label: string;
  /** Callback fired when the remove button is clicked */
  onRemove: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FilterChip component for displaying active filters with remove functionality.
 * 
 * A pill-shaped chip that shows an active filter and allows users to remove it.
 * Includes smooth animations for appearance, hover, and removal using Framer Motion.
 * 
 * @example
 * ```tsx
 * // Basic filter chip
 * <FilterChip 
 *   label="Status: Open" 
 *   onRemove={() => removeFilter('status')}
 * />
 * 
 * // Multiple filter chips
 * {activeFilters.map(filter => (
 *   <FilterChip 
 *     key={filter.id}
 *     label={filter.label}
 *     onRemove={() => removeFilter(filter.id)}
 *   />
 * ))}
 * ```
 * 
 * @component
 */
export const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent',
        'text-sm font-medium',
        'transition-all duration-200',
        'hover:bg-accent/20 dark:hover:bg-accent/30',
        className
      )}
    >
      <span>{label}</span>
      <motion.button
        onClick={onRemove}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'p-0.5 rounded-full',
          'hover:bg-accent/20 dark:hover:bg-accent/40',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1'
        )}
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  );
};
