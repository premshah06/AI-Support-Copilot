import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { Badge } from './Badge';

// **Feature: ui-modernization, Property 1: Badge rendering consistency**
describe('Property: Badge rendering consistency', () => {
  it('should render badge with appropriate color and icon for any priority value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('default', 'success', 'warning', 'error', 'info'),
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.option(fc.constant('🔥'), { nil: null }),
        (variant, text, icon) => {
          const { container } = render(
            <Badge variant={variant} icon={icon}>
              {text}
            </Badge>
          );
          
          const badge = container.querySelector('span');
          
          // Badge should exist
          expect(badge).toBeTruthy();
          
          // Badge should contain the text
          expect(badge?.textContent).toContain(text);
          
          // Badge should have base styling
          expect(badge?.className).toContain('inline-flex');
          expect(badge?.className).toContain('items-center');
          
          // Badge should have variant-specific classes
          const variantClassMap: Record<string, string[]> = {
            default: ['bg-muted', 'text-muted-foreground'],
            success: ['text-success'],
            warning: ['text-warning'],
            error: ['text-error'],
            info: ['text-info'],
          };
          
          const expectedClasses = variantClassMap[variant];
          const hasExpectedClasses = expectedClasses.some(cls => badge?.className.includes(cls));
          
          // If icon is provided, verify it's rendered
          if (icon) {
            expect(badge?.textContent).toContain(icon);
          }
          
          return hasExpectedClasses;
        }
      ),
      { numRuns: 100 }
    );
  });
});
