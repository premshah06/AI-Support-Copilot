import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {

  it('renders with placeholder', () => {
    render(<SearchBar placeholder="Search tickets..." onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search tickets...')).toBeInTheDocument();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('has searchbox role', () => {
    render(<SearchBar onChange={vi.fn()} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('displays search icon', () => {
    const { container } = render(<SearchBar onChange={vi.fn()} />);
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('calls onChange with debounced value', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onChange={handleChange} debounceDelay={100} />);
    
    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');
    
    // Wait for debounce to complete
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('test');
    }, { timeout: 500 });
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    
    render(<SearchBar onChange={vi.fn()} />);
    
    const input = screen.getByRole('searchbox');
    await user.type(input, 'search query');
    
    await waitFor(() => {
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  it('does not show clear button when input is empty', () => {
    render(<SearchBar onChange={vi.fn()} />);
    
    const clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onChange={handleChange} />);
    
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    await user.type(input, 'test');
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });
    
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearButton);
    
    expect(input.value).toBe('');
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('syncs with controlled value', () => {
    const { rerender } = render(<SearchBar value="initial" onChange={vi.fn()} />);
    
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.value).toBe('initial');
    
    rerender(<SearchBar value="updated" onChange={vi.fn()} />);
    expect(input.value).toBe('updated');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SearchBar onChange={vi.fn()} className="custom-search" />
    );
    expect(container.firstChild as HTMLElement).toHaveClass('custom-search');
  });

  it('uses custom debounce delay', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onChange={handleChange} debounceDelay={100} />);
    
    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');
    
    // Wait for debounce to complete
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('test');
    }, { timeout: 500 });
  });
});
