import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="/test.jpg" alt="Test User" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test User');
  });

  it('renders initials when no src is provided', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders question mark when no name or src', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('falls back to initials when image fails to load', async () => {
    render(<Avatar src="/invalid.jpg" name="Jane Smith" />);
    const img = screen.getByRole('img');
    
    // Simulate image error
    img.dispatchEvent(new Event('error'));
    
    // Wait for state update
    expect(await screen.findByText('JS')).toBeInTheDocument();
  });

  it('applies small size class', () => {
    const { container } = render(<Avatar name="Test" size="sm" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('h-8', 'w-8');
  });

  it('applies large size class', () => {
    const { container } = render(<Avatar name="Test" size="lg" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('h-12', 'w-12');
  });
});
