import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import { Button } from './atoms/Button';
import { Input } from './atoms/Input';
import { SearchBar } from './molecules/SearchBar';
import { FilterChip } from './molecules/FilterChip';
import { TicketCard } from './organisms/TicketCard';
import { ticketArbitrary } from '@/test-utils/arbitraries';

// **Feature: ui-modernization, Property 14: Accessibility attribute presence**
// **Validates: Requirements 12.3**

describe('Property 14: Accessibility attribute presence', () => {
  it('should render Button components with appropriate ARIA attributes', () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: fc.constantFrom('primary', 'secondary', 'outline', 'ghost', 'destructive'),
          children: fc.string({ minLength: 1, maxLength: 50 }),
          ariaLabel: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
        }),
        (config) => {
          const { container } = render(
            <Button variant={config.variant as any} aria-label={config.ariaLabel}>
              {config.children}
            </Button>
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Button should be focusable
          expect(button?.getAttribute('tabindex')).not.toBe('-1');

          // If aria-label is provided, it should be present
          if (config.ariaLabel) {
            expect(button?.getAttribute('aria-label')).toBe(config.ariaLabel);
          }

          // Button should have proper role (implicit from button element)
          expect(button?.tagName).toBe('BUTTON');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render Input components with proper accessibility attributes', () => {
    fc.assert(
      fc.property(
        fc.record({
          placeholder: fc.string({ minLength: 1, maxLength: 50 }),
          ariaLabel: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
          id: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        (config) => {
          const { container } = render(
            <Input
              placeholder={config.placeholder}
              aria-label={config.ariaLabel}
              id={config.id}
            />
          );

          const input = container.querySelector('input');
          expect(input).toBeTruthy();

          // Input should be focusable
          expect(input?.getAttribute('tabindex')).not.toBe('-1');

          // If aria-label is provided, it should be present
          if (config.ariaLabel) {
            expect(input?.getAttribute('aria-label')).toBe(config.ariaLabel);
          }

          // Input should have an id for label association
          expect(input?.getAttribute('id')).toBe(config.id);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render SearchBar with proper ARIA attributes', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (placeholder) => {
          const mockOnChange = () => {};
          const { container } = render(<SearchBar placeholder={placeholder} onChange={mockOnChange} />);

          const searchInput = container.querySelector('input[role="searchbox"]');
          expect(searchInput).toBeTruthy();

          // Search input should have aria-label
          expect(searchInput?.getAttribute('aria-label')).toBe(placeholder);

          // Search icon should be hidden from screen readers
          const searchIcon = searchInput?.parentElement?.querySelector('svg');
          if (searchIcon) {
            expect(searchIcon.getAttribute('aria-hidden')).toBe('true');
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render FilterChip with proper ARIA label on remove button', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (label) => {
          const mockOnRemove = () => {};
          const { container } = render(
            <FilterChip label={label} onRemove={mockOnRemove} />
          );

          const removeButton = container.querySelector('button');
          expect(removeButton).toBeTruthy();

          // Remove button should have descriptive aria-label
          const ariaLabel = removeButton?.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel).toContain(label);
          expect(ariaLabel).toContain('Remove');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should render TicketCard with proper semantic HTML and ARIA attributes', () => {
    fc.assert(
      fc.property(
        ticketArbitrary,
        (ticket) => {
          const mockOnClick = () => {};
          const { container } = render(
            <BrowserRouter>
              <TicketCard ticket={ticket} onClick={mockOnClick} />
            </BrowserRouter>
          );

          // TicketCard should use semantic article element
          const article = container.querySelector('article');
          expect(article).toBeTruthy();

          // Article should have role="button" since it's clickable
          expect(article?.getAttribute('role')).toBe('button');

          // Article should be keyboard accessible
          expect(article?.getAttribute('tabindex')).toBe('0');

          // Article should have descriptive aria-label
          const ariaLabel = article?.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel).toContain(ticket.title);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should ensure all interactive elements are keyboard accessible', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'outline'),
        (variant) => {
          const { container } = render(
            <Button variant={variant as any}>Click me</Button>
          );

          const button = container.querySelector('button');
          expect(button).toBeTruthy();

          // Interactive element should not have tabindex="-1" (unless explicitly disabled)
          const tabIndex = button?.getAttribute('tabindex');
          if (tabIndex !== null && tabIndex !== undefined) {
            expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
          }

          // Button should be a proper button element (semantic HTML)
          expect(button?.tagName).toBe('BUTTON');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should ensure decorative icons are hidden from screen readers', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (placeholder) => {
          const mockOnChange = () => {};
          const { container } = render(
            <SearchBar placeholder={placeholder} onChange={mockOnChange} />
          );

          // Find all SVG elements (icons)
          const svgs = container.querySelectorAll('svg');
          
          // At least one SVG should exist (the search icon)
          expect(svgs.length).toBeGreaterThan(0);

          // All decorative SVGs should have aria-hidden="true"
          svgs.forEach((svg) => {
            // If the SVG is decorative (not providing unique information)
            // it should be hidden from screen readers
            const ariaHidden = svg.getAttribute('aria-hidden');
            const ariaLabel = svg.getAttribute('aria-label');
            const role = svg.getAttribute('role');

            // Either aria-hidden="true" or has a meaningful aria-label/role
            const isAccessible = ariaHidden === 'true' || ariaLabel || role === 'img';
            expect(isAccessible).toBe(true);
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});
