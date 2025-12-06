import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartWidget } from './ChartWidget';

describe('ChartWidget', () => {
  it('renders title', () => {
    render(
      <ChartWidget title="Test Chart">
        <div>Chart content</div>
      </ChartWidget>
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <ChartWidget title="Chart">
        <div>Chart visualization</div>
      </ChartWidget>
    );
    expect(screen.getByText('Chart visualization')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ChartWidget title="Chart" description="Chart description">
        <div>Content</div>
      </ChartWidget>
    );
    expect(screen.getByText('Chart description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(
      <ChartWidget title="Chart">
        <div>Content</div>
      </ChartWidget>
    );
    expect(container.querySelector('.text-xs.text-gray-600')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <ChartWidget 
        title="Chart" 
        actions={<button>Export</button>}
      >
        <div>Content</div>
      </ChartWidget>
    );
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChartWidget title="Chart" className="custom-chart">
        <div>Content</div>
      </ChartWidget>
    );
    expect(container.firstChild as HTMLElement).toHaveClass('custom-chart');
  });

  it('renders with complete structure', () => {
    render(
      <ChartWidget 
        title="Sales Chart" 
        description="Monthly sales data"
        actions={<button>Download</button>}
      >
        <svg data-testid="chart-svg">
          <rect />
        </svg>
      </ChartWidget>
    );
    
    expect(screen.getByText('Sales Chart')).toBeInTheDocument();
    expect(screen.getByText('Monthly sales data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    expect(screen.getByTestId('chart-svg')).toBeInTheDocument();
  });
});
