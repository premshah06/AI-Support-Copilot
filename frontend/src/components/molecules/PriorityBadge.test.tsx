import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge } from './PriorityBadge';

describe('PriorityBadge', () => {
  it('renders low priority', () => {
    render(<PriorityBadge priority="low" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('renders medium priority', () => {
    render(<PriorityBadge priority="medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders high priority', () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders critical priority', () => {
    render(<PriorityBadge priority="critical" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('renders P1 priority format', () => {
    render(<PriorityBadge priority="P1" />);
    expect(screen.getByText('P1 - Critical')).toBeInTheDocument();
  });

  it('renders P2 priority format', () => {
    render(<PriorityBadge priority="P2" />);
    expect(screen.getByText('P2 - High')).toBeInTheDocument();
  });

  it('renders P3 priority format', () => {
    render(<PriorityBadge priority="P3" />);
    expect(screen.getByText('P3 - Medium')).toBeInTheDocument();
  });

  it('renders P4 priority format', () => {
    render(<PriorityBadge priority="P4" />);
    expect(screen.getByText('P4 - Low')).toBeInTheDocument();
  });

  it('falls back to medium for unknown priority', () => {
    render(<PriorityBadge priority="unknown" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<PriorityBadge priority="high" size="lg" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PriorityBadge priority="high" className="custom-priority" />
    );
    expect(container.querySelector('.custom-priority')).toBeInTheDocument();
  });

  it('includes icon for each priority', () => {
    const { container: lowContainer } = render(<PriorityBadge priority="low" />);
    const { container: criticalContainer } = render(<PriorityBadge priority="critical" />);
    
    expect(lowContainer.querySelector('svg')).toBeInTheDocument();
    expect(criticalContainer.querySelector('svg')).toBeInTheDocument();
  });
});
