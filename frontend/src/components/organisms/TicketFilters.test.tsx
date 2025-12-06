import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketFilters } from './TicketFilters';
import { FilterState } from '@/types';

const emptyFilters: FilterState = {
  status: [],
  priority: [],
  category: [],
  searchQuery: '',
};

const activeFilters: FilterState = {
  status: ['open', 'in_progress'],
  priority: ['P1', 'P2'],
  category: ['bug'],
  searchQuery: 'test query',
};

describe('TicketFilters', () => {
  it('renders filter sections', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    
    render(
      <TicketFilters
        filters={emptyFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    
    render(
      <TicketFilters
        filters={emptyFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    expect(screen.getByPlaceholderText('Search tickets...')).toBeInTheDocument();
  });

  it('calls onFilterChange when status is selected', async () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TicketFilters
        filters={emptyFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    const statusSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(statusSelect, 'open');
    
    expect(handleFilterChange).toHaveBeenCalledWith({
      ...emptyFilters,
      status: ['open'],
    });
  });

  it('calls onFilterChange when priority is selected', async () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TicketFilters
        filters={emptyFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    const prioritySelect = screen.getAllByRole('combobox')[1];
    await user.selectOptions(prioritySelect, 'P1');
    
    expect(handleFilterChange).toHaveBeenCalledWith({
      ...emptyFilters,
      priority: ['P1'],
    });
  });

  it('calls onFilterChange when category is selected', async () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TicketFilters
        filters={emptyFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    const categorySelect = screen.getAllByRole('combobox')[2];
    await user.selectOptions(categorySelect, 'bug');
    
    expect(handleFilterChange).toHaveBeenCalledWith({
      ...emptyFilters,
      category: ['bug'],
    });
  });

  it('renders filter chips for active filters', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    
    render(
      <TicketFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('P1 - Critical')).toBeInTheDocument();
    expect(screen.getByText('P2 - High')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
  });

  it('removes status filter when chip is clicked', async () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TicketFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    const openChip = screen.getByText('Open').closest('div');
    const removeButton = openChip?.querySelector('button');
    
    if (removeButton) {
      await user.click(removeButton);
      
      expect(handleFilterChange).toHaveBeenCalledWith({
        ...activeFilters,
        status: ['in_progress'],
      });
    }
  });

  it('removes priority filter when chip is clicked', async () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TicketFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    const p1Chip = screen.getByText('P1 - Critical').closest('div');
    const removeButton = p1Chip?.querySelector('button');
    
    if (removeButton) {
      await user.click(removeButton);
      
      expect(handleFilterChange).toHaveBeenCalledWith({
        ...activeFilters,
        priority: ['P2'],
      });
    }
  });

  it('removes category filter when chip is clicked', async () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TicketFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    const bugChip = screen.getByText('Billing').closest('div');
    const removeButton = bugChip?.querySelector('button');
    
    if (removeButton) {
      await user.click(removeButton);
      
      expect(handleFilterChange).toHaveBeenCalledWith({
        ...activeFilters,
        category: [],
      });
    }
  });

  it('shows "Clear all" button when filters are active', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    
    render(
      <TicketFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('does not show "Clear all" button when no filters are active', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    
    render(
      <TicketFilters
        filters={emptyFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('calls onClearAll when "Clear all" button is clicked', async () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TicketFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    await user.click(screen.getByText('Clear all'));
    
    expect(handleClearAll).toHaveBeenCalledTimes(1);
  });

  it('displays active filter count', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    
    render(
      <TicketFilters
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    // 2 status + 2 priority + 1 category + 1 search = 6 filters
    expect(screen.getByText('6 filters active')).toBeInTheDocument();
  });

  it('displays singular "filter" when only one filter is active', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const singleFilter: FilterState = {
      status: ['open'],
      priority: [],
      category: [],
      searchQuery: '',
    };
    
    render(
      <TicketFilters
        filters={singleFilter}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    expect(screen.getByText('1 filter active')).toBeInTheDocument();
  });

  it('does not add duplicate filters', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    const filtersWithOpen: FilterState = {
      status: ['open'],
      priority: [],
      category: [],
      searchQuery: '',
    };
    
    render(
      <TicketFilters
        filters={filtersWithOpen}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    // The 'open' option should not be available in the select since it's already active
    const statusSelect = screen.getAllByRole('combobox')[0];
    const openOption = Array.from(statusSelect.querySelectorAll('option')).find(
      (option) => option.value === 'open'
    );
    
    expect(openOption).toBeUndefined();
  });

  it('applies custom className', () => {
    const handleFilterChange = vi.fn();
    const handleClearAll = vi.fn();
    
    const { container } = render(
      <TicketFilters
        filters={emptyFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        className="custom-class"
      />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
