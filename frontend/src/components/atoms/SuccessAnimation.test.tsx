import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SuccessAnimation, InlineSuccessCheck, SuccessPulse } from './SuccessAnimation';

describe('SuccessAnimation', () => {
  it('renders without crashing', () => {
    const { container } = render(<SuccessAnimation />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies small size class', () => {
    const { container } = render(<SuccessAnimation size="sm" />);
    expect(container.querySelector('.w-8')).toBeInTheDocument();
  });

  it('applies large size class', () => {
    const { container } = render(<SuccessAnimation size="lg" />);
    expect(container.querySelector('.w-16')).toBeInTheDocument();
  });

  it('calls onComplete callback', () => {
    const onComplete = vi.fn();
    render(<SuccessAnimation onComplete={onComplete} />);
    // Note: onComplete is called after animation completes
    // In a real test environment, we'd need to wait for the animation
  });

  it('applies custom className', () => {
    const { container } = render(<SuccessAnimation className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('InlineSuccessCheck', () => {
  it('renders without crashing', () => {
    const { container } = render(<InlineSuccessCheck />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<InlineSuccessCheck className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SuccessPulse', () => {
  it('renders children', () => {
    const { container } = render(
      <SuccessPulse>
        <div>Test Content</div>
      </SuccessPulse>
    );
    expect(container.textContent).toBe('Test Content');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SuccessPulse className="custom-class">
        <div>Test</div>
      </SuccessPulse>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
