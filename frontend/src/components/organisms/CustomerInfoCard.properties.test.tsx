import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { CustomerInfoCard } from './CustomerInfoCard';
import { customerArbitrary } from '../../test-utils/arbitraries';

// **Feature: ui-modernization, Property 5: Customer information completeness**
describe('Property: Customer information completeness', () => {
  it('should display all customer information components for any customer', () => {
    fc.assert(
      fc.property(customerArbitrary, (customer) => {
        const { container } = render(<CustomerInfoCard customer={customer} defaultExpanded={true} />);
        
        // Check that customer name is displayed (use query to handle edge cases)
        const nameElement = container.querySelector('h3');
        expect(nameElement).toBeTruthy();
        expect(nameElement?.textContent).toBe(customer.name);
        
        // Check that email is displayed (appears twice - in header and expanded section)
        const emailElements = screen.getAllByText(customer.email);
        expect(emailElements.length).toBeGreaterThanOrEqual(1);
        
        // Check that avatar or initials fallback is present
        const avatarContainer = container.querySelector('div[class*="rounded-full"]');
        expect(avatarContainer).toBeTruthy();
        
        // Tier badge not in current backend model, so we just check that the component renders
        // without errors
        
        // Company field not in current backend model
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
