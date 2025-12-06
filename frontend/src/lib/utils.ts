import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence.
 * 
 * Combines clsx for conditional classes and tailwind-merge to intelligently
 * handle conflicting Tailwind classes (e.g., "px-2 px-4" becomes "px-4").
 * 
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with conflicts resolved
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-2 py-1', 'bg-blue-500')
 * // => 'px-2 py-1 bg-blue-500'
 * 
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', { 'error': hasError })
 * 
 * // Resolving conflicts (last class wins)
 * cn('px-2', 'px-4')
 * // => 'px-4'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
