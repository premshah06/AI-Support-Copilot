import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label', () => {
  it('renders with children', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('does not show required indicator by default', () => {
    render(<Label>Email</Label>);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(<Label required>Password</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Test</Label>);
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });
});
