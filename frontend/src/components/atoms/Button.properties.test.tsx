import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { Button } from './Button';

// **Feature: ui-modernization, Property 9: Button variant consistency**
describe('Property: Button variant consistency', () => {
  it('should apply correct CSS classes for each button variant', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'outline', 'ghost', 'destructive'),
        (variant) => {
          const { container } = render(<Button variant={variant}>Test Button</Button>);
          const button = container.querySelector('button');
          
          expect(button).toBeTruthy();
          
          // Verify that the button has the base styles
          expect(button?.className).toContain('inline-flex');
          expect(button?.className).toContain('items-center');
          expect(button?.className).toContain('justify-center');
          
          // Verify variant-specific classes are applied
          const variantClassMap: Record<string, string[]> = {
            primary: ['bg-accent', 'text-accent-foreground'],
            secondary: ['bg-secondary', 'text-secondary-foreground'],
            outline: ['border-2', 'border-border', 'bg-transparent'],
            ghost: ['bg-transparent'],
            destructive: ['bg-error', 'text-error-foreground'],
          };
          
          const expectedClasses = variantClassMap[variant];
          const hasExpectedClasses = expectedClasses.some(cls => button?.className.includes(cls));
          
          return hasExpectedClasses;
        }
      ),
      { numRuns: 100 }
    );
  });
});
