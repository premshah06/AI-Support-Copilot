import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="An error occurred" />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders default title', () => {
    render(<ErrorState message="Error" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ErrorState title="Custom Error" message="Error message" />);
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('has alert role and aria-live', () => {
    const { container } = render(<ErrorState message="Error" />);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorState message="Error" onRetry={vi.fn()} />);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();
    
    render(<ErrorState message="Error" onRetry={handleRetry} />);
    await user.click(screen.getByRole('button', { name: /retry/i }));
    
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders dismiss button when onDismiss is provided', () => {
    render(<ErrorState message="Error" onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const handleDismiss = vi.fn();
    const user = userEvent.setup();
    
    render(<ErrorState message="Error" onDismiss={handleDismiss} />);
    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders go back button when onGoBack is provided', () => {
    render(<ErrorState message="Error" onGoBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('calls onGoBack when go back button is clicked', async () => {
    const handleGoBack = vi.fn();
    const user = userEvent.setup();
    
    render(<ErrorState message="Error" onGoBack={handleGoBack} />);
    await user.click(screen.getByRole('button', { name: /go back/i }));
    
    expect(handleGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders custom action button', () => {
    const customAction = {
      label: 'Custom Action',
      onClick: vi.fn(),
    };
    render(<ErrorState message="Error" customAction={customAction} />);
    expect(screen.getByRole('button', { name: /custom action/i })).toBeInTheDocument();
  });

  it('calls custom action onClick', async () => {
    const handleCustomAction = vi.fn();
    const user = userEvent.setup();
    
    const customAction = {
      label: 'Custom Action',
      onClick: handleCustomAction,
    };
    
    render(<ErrorState message="Error" customAction={customAction} />);
    await user.click(screen.getByRole('button', { name: /custom action/i }));
    
    expect(handleCustomAction).toHaveBeenCalledTimes(1);
  });

  it('renders details when provided', () => {
    render(<ErrorState message="Error" details="Detailed error information" />);
    expect(screen.getByText(/show details/i)).toBeInTheDocument();
  });

  it('applies error variant styling by default', () => {
    const { container } = render(<ErrorState message="Error" />);
    const errorState = container.firstChild as HTMLElement;
    expect(errorState).toHaveClass('bg-red-50');
  });

  it('applies warning variant styling', () => {
    const { container } = render(<ErrorState message="Warning" variant="warning" />);
    const errorState = container.firstChild as HTMLElement;
    expect(errorState).toHaveClass('bg-yellow-50');
  });

  it('applies info variant styling', () => {
    const { container } = render(<ErrorState message="Info" variant="info" />);
    const errorState = container.firstChild as HTMLElement;
    expect(errorState).toHaveClass('bg-blue-50');
  });

  it('applies small size styling', () => {
    const { container } = render(<ErrorState message="Error" size="sm" />);
    const errorState = container.firstChild as HTMLElement;
    expect(errorState).toHaveClass('p-4');
  });

  it('applies large size styling', () => {
    const { container } = render(<ErrorState message="Error" size="lg" />);
    const errorState = container.firstChild as HTMLElement;
    expect(errorState).toHaveClass('p-8');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ErrorState message="Error" className="custom-error" />
    );
    expect(container.firstChild as HTMLElement).toHaveClass('custom-error');
  });

  it('renders multiple recovery actions', () => {
    render(
      <ErrorState 
        message="Error" 
        onRetry={vi.fn()}
        onDismiss={vi.fn()}
        onGoBack={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });
});
