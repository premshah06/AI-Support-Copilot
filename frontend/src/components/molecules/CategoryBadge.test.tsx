import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBadge } from './CategoryBadge';

describe('CategoryBadge', () => {
  it('renders category name', () => {
    render(<CategoryBadge category="Bug" />);
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('renders null when category is null', () => {
    const { container } = render(<CategoryBadge category={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with custom size', () => {
    render(<CategoryBadge category="Feature" size="lg" />);
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CategoryBadge category="Support" className="custom-category" />
    );
    expect(container.querySelector('.custom-category')).toBeInTheDocument();
  });

  it('includes tag icon', () => {
    const { container } = render(<CategoryBadge category="Documentation" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
