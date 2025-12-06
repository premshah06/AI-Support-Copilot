import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('renders with label', () => {
    render(<FilterChip label="Status: Open" onRemove={vi.fn()} />);
    expect(screen.getByText('Status: Open')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const handleRemove = vi.fn();
    const user = userEvent.setup();
    
    render(<FilterChip label="Priority: High" onRemove={handleRemove} />);
    
    const removeButton = screen.getByRole('button', { name: /remove priority: high filter/i });
    await user.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('renders remove button with X icon', () => {
    render(<FilterChip label="Test Filter" onRemove={vi.fn()} />);
    const removeButton = screen.getByRole('button', { name: /remove test filter filter/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FilterChip label="Test" onRemove={vi.fn()} className="custom-chip" />
    );
    expect(container.querySelector('.custom-chip')).toBeInTheDocument();
  });

  it('has accessible aria-label on remove button', () => {
    render(<FilterChip label="Category: Bug" onRemove={vi.fn()} />);
    const removeButton = screen.getByRole('button', { name: /remove category: bug filter/i });
    expect(removeButton).toHaveAttribute('aria-label', 'Remove Category: Bug filter');
  });
});
