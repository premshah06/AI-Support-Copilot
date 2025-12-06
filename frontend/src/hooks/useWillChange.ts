import { useEffect, useRef } from 'react';

/**
 * Hook to optimize animations by managing will-change CSS property
 * Adds will-change during animations and removes it after to avoid performance issues
 * 
 * @param properties - CSS properties that will change (e.g., 'transform', 'opacity')
 * @param isAnimating - Whether the element is currently animating
 */
export function useWillChange(
  properties: string[],
  isAnimating: boolean
): React.RefObject<HTMLElement> {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (isAnimating) {
      // Add will-change when animation starts
      element.style.willChange = properties.join(', ');
    } else {
      // Remove will-change after animation completes
      // Use a small delay to ensure animation has finished
      const timeoutId = setTimeout(() => {
        element.style.willChange = 'auto';
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [properties, isAnimating]);

  return elementRef;
}
