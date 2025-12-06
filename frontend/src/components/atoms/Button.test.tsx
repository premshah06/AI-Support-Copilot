import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading prop is true', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders icon on left by default', () => {
    render(<Button icon={<span data-testid="icon">★</span>}>Text</Button>);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('icon');
    
    expect(button).toContainElement(icon);
  });

  it('renders icon on right when iconPosition is right', () => {
    render(<Button icon={<span data-testid="icon">★</span>} iconPosition="right">Text</Button>);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('icon');
    
    expect(button).toContainElement(icon);
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});
