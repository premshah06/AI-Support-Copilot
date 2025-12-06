import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketCard } from './TicketCard';
import { Ticket } from '@/types';

const mockTicket: Ticket = {
  id: 1,
  title: 'Test Ticket Title',
  description: 'This is a test ticket description that should be displayed in the card',
  status: 'open',
  priority: 'P2',
  category: 'bug',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  customer: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    segment: 'enterprise',
    region: 'US',
    risk_score: 0.5,
  },
};

describe('TicketCard', () => {
  it('renders ticket title', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    expect(screen.getByText('Test Ticket Title')).toBeInTheDocument();
  });

  it('renders ticket description in non-compact mode', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} compact={false} />);
    expect(screen.getByText(/This is a test ticket description/)).toBeInTheDocument();
  });

  it('does not render description in compact mode', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} compact={true} />);
    expect(screen.queryByText(/This is a test ticket description/)).not.toBeInTheDocument();
  });

  it('renders priority badge', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    expect(screen.getByText(/P2/)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    expect(screen.getByText(/open/i)).toBeInTheDocument();
  });

  it('renders category badge when category exists', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    expect(screen.getByText(/bug/i)).toBeInTheDocument();
  });

  it('does not render category badge when category is null', () => {
    const handleClick = vi.fn();
    const ticketWithoutCategory = { ...mockTicket, category: '' };
    render(<TicketCard ticket={ticketWithoutCategory} onClick={handleClick} />);
    expect(screen.queryByText(/bug/i)).not.toBeInTheDocument();
  });

  it('renders customer name when showCustomer is true', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} showCustomer={true} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render customer name when showCustomer is false', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} showCustomer={false} />);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders "No customer" when customer is undefined', () => {
    const handleClick = vi.fn();
    const ticketWithoutCustomer = { ...mockTicket, customer: undefined };
    render(<TicketCard ticket={ticketWithoutCustomer} onClick={handleClick} showCustomer={true} />);
    expect(screen.getByText('No customer')).toBeInTheDocument();
  });

  it('calls onClick with ticket id when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: /View ticket: Test Ticket Title/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(1);
  });

  it('calls onClick when Enter key is pressed', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    const card = screen.getByRole('button', { name: /View ticket: Test Ticket Title/i });
    card.focus();
    await user.keyboard('{Enter}');
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(1);
  });

  it('calls onClick when Space key is pressed', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    const card = screen.getByRole('button', { name: /View ticket: Test Ticket Title/i });
    card.focus();
    await user.keyboard(' ');
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(1);
  });

  it('applies custom className', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <TicketCard ticket={mockTicket} onClick={handleClick} className="custom-class" />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const handleClick = vi.fn();
    render(<TicketCard ticket={mockTicket} onClick={handleClick} />);
    const card = screen.getByRole('button', { name: /View ticket: Test Ticket Title/i });
    
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', 'View ticket: Test Ticket Title');
  });
});
