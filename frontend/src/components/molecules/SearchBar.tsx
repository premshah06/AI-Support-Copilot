import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Props for the SearchBar component
 */
interface SearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Callback fired when the debounced search value changes */
  onChange: (value: string) => void;
  /** Delay in milliseconds before triggering onChange */
  debounceDelay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Controlled value for the search input */
  value?: string;
}

/**
 * SearchBar component with debounced input and clear functionality.
 * 
 * A search input with a search icon and clear button. Automatically debounces
 * user input to avoid excessive onChange calls during typing. Supports both
 * controlled and uncontrolled modes.
 * 
 * @example
 * ```tsx
 * // Basic search bar
 * <SearchBar 
 *   placeholder="Search tickets..." 
 *   onChange={handleSearch}
 * />
 * 
 * // Search bar with custom debounce delay
 * <SearchBar 
 *   placeholder="Search..." 
 *   onChange={handleSearch}
 *   debounceDelay={500}
 * />
 * 
 * // Controlled search bar
 * <SearchBar 
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 * />
 * ```
 * 
 * @component
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onChange,
  debounceDelay = 300,
  className,
  value: controlledValue,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const debouncedValue = useDebounce(internalValue, debounceDelay);

  // Sync with controlled value if provided
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Call onChange when debounced value changes
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          role="searchbox"
          className={cn(
            'w-full pl-10 pr-10 py-2.5 rounded-lg',
            'bg-white dark:bg-secondary',
            'border border-gray-300 dark:border-gray-600',
            'text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'transition-all duration-200'
          )}
        />
        {internalValue && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1 rounded-full',
              'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-accent'
            )}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
