import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders open status', () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders in_progress status', () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders resolved status', () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders closed status', () => {
    render(<StatusBadge status="closed" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<StatusBadge status="open" size="lg" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatusBadge status="open" className="custom-status" />
    );
    expect(container.querySelector('.custom-status')).toBeInTheDocument();
  });

  it('includes icon for each status', () => {
    const { container: openContainer } = render(<StatusBadge status="open" />);
    const { container: resolvedContainer } = render(<StatusBadge status="resolved" />);
    
    expect(openContainer.querySelector('svg')).toBeInTheDocument();
    expect(resolvedContainer.querySelector('svg')).toBeInTheDocument();
  });
});
