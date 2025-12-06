import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';
import { TrendingUp } from 'lucide-react';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Tickets" value={142} />);
    expect(screen.getByText('Total Tickets')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatCard label="Response Time" value="2.5 hrs" />);
    expect(screen.getByText('Response Time')).toBeInTheDocument();
    expect(screen.getByText('2.5 hrs')).toBeInTheDocument();
  });

  it('renders trend indicator with up direction', () => {
    render(
      <StatCard 
        label="Open Tickets" 
        value={23}
        trend={{ value: 12, direction: 'up' }}
      />
    );
    expect(screen.getByText('12%')).toBeInTheDocument();
  });

  it('renders trend indicator with down direction', () => {
    render(
      <StatCard 
        label="Resolved" 
        value={89}
        trend={{ value: 8, direction: 'down' }}
      />
    );
    expect(screen.getByText('8%')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <StatCard 
        label="Total" 
        value={100}
        icon={<TrendingUp data-testid="stat-icon" />}
      />
    );
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('applies custom color to icon', () => {
    const { container } = render(
      <StatCard 
        label="Total" 
        value={100}
        icon={<span>Icon</span>}
        color="text-success"
      />
    );
    const iconContainer = container.querySelector('.text-success');
    expect(iconContainer).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatCard 
        label="Test" 
        value={1}
        className="custom-stat"
      />
    );
    expect(container.firstChild as HTMLElement).toHaveClass('custom-stat');
  });

  it('renders without trend indicator', () => {
    render(<StatCard label="Total" value={100} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('displays absolute trend value', () => {
    render(
      <StatCard 
        label="Test" 
        value={50}
        trend={{ value: -15, direction: 'down' }}
      />
    );
    // Should display absolute value
    expect(screen.getByText('15%')).toBeInTheDocument();
  });
});
