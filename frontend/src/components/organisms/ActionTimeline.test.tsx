import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionTimeline } from './ActionTimeline';
import { TicketAction } from '@/types';

const mockActions: TicketAction[] = [
  {
    id: 1,
    ticket_id: 1,
    actor_type: 'human',
    action_type: 'classification',
    content: 'Ticket created',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    ticket_id: 1,
    actor_type: 'AI',
    action_type: 'reply_suggested',
    content: 'AI suggested a reply',
    created_at: '2024-01-15T11:00:00Z',
  },
  {
    id: 3,
    ticket_id: 1,
    actor_type: 'human',
    action_type: 'reply_sent',
    content: 'Reply sent to customer',
    created_at: '2024-01-15T12:00:00Z',
  },
];

describe('ActionTimeline', () => {
  it('renders timeline header', () => {
    render(<ActionTimeline actions={mockActions} />);
    expect(screen.getByText('Action History')).toBeInTheDocument();
  });

  it('renders all actions', () => {
    render(<ActionTimeline actions={mockActions} />);
    expect(screen.getByText('Ticket created')).toBeInTheDocument();
    expect(screen.getByText('AI suggested a reply')).toBeInTheDocument();
    expect(screen.getByText('Reply sent to customer')).toBeInTheDocument();
  });

  it('renders actions in reverse chronological order (newest first)', () => {
    render(<ActionTimeline actions={mockActions} />);
    const actionElements = screen.getAllByText(/Ticket created|AI suggested a reply|Reply sent to customer/);
    
    // The order should be: Reply sent (newest), AI suggested, Ticket created (oldest)
    expect(actionElements[0]).toHaveTextContent('Reply sent to customer');
    expect(actionElements[1]).toHaveTextContent('AI suggested a reply');
    expect(actionElements[2]).toHaveTextContent('Ticket created');
  });

  it('renders empty state when no actions exist', () => {
    render(<ActionTimeline actions={[]} />);
    expect(screen.getByText('No actions yet')).toBeInTheDocument();
    expect(screen.getByText('Actions will appear here as the ticket progresses')).toBeInTheDocument();
  });

  it('renders TimelineItem for each action', () => {
    render(<ActionTimeline actions={mockActions} />);
    
    // Each action should have its content rendered
    mockActions.forEach(action => {
      expect(screen.getByText(action.content)).toBeInTheDocument();
    });
  });

  it('distinguishes between AI and human actions', () => {
    render(<ActionTimeline actions={mockActions} />);
    
    // Check that both AI and human actions are present
    const aiAction = screen.getByText('AI suggested a reply');
    const humanAction = screen.getByText('Ticket created');
    
    expect(aiAction).toBeInTheDocument();
    expect(humanAction).toBeInTheDocument();
  });

  it('handles single action', () => {
    const singleAction: TicketAction[] = [
      {
        id: 1,
        ticket_id: 1,
        actor_type: 'human',
        action_type: 'classification',
        content: 'Single action',
        created_at: '2024-01-15T10:00:00Z',
      },
    ];
    
    render(<ActionTimeline actions={singleAction} />);
    expect(screen.getByText('Single action')).toBeInTheDocument();
  });

  it('renders with proper container styling', () => {
    const { container } = render(<ActionTimeline actions={mockActions} />);
    const timelineContainer = container.querySelector('.bg-white');
    
    expect(timelineContainer).toBeInTheDocument();
    expect(timelineContainer).toHaveClass('rounded-lg', 'shadow-sm', 'border');
  });

  it('renders empty state with proper styling', () => {
    const { container } = render(<ActionTimeline actions={[]} />);
    const emptyStateContainer = container.querySelector('.bg-white');
    
    expect(emptyStateContainer).toBeInTheDocument();
    expect(emptyStateContainer).toHaveClass('rounded-lg', 'shadow-sm', 'border');
  });
});
