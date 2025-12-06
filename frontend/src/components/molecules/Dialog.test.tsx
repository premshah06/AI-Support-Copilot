import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogFooter } from './Dialog';

describe('Dialog', () => {
  it('does not render when closed', () => {
    render(
      <Dialog open={false} onClose={vi.fn()}>
        <p>Dialog content</p>
      </Dialog>
    );
    expect(screen.queryByText('Dialog content')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <Dialog open={true} onClose={vi.fn()}>
        <p>Dialog content</p>
      </Dialog>
    );
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('supports isOpen prop for compatibility', () => {
    render(
      <Dialog isOpen={true} onClose={vi.fn()}>
        <p>Dialog content</p>
      </Dialog>
    );
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>
    );
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('has dialog role and aria-modal', () => {
    render(
      <Dialog open={true} onClose={vi.fn()}>
        <p>Content</p>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('links title with aria-labelledby', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
  });

  it('renders close button by default', () => {
    render(
      <Dialog open={true} onClose={vi.fn()}>
        <p>Content</p>
      </Dialog>
    );
    expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} showCloseButton={false}>
        <p>Content</p>
      </Dialog>
    );
    expect(screen.queryByRole('button', { name: /close dialog/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Dialog open={true} onClose={handleClose}>
        <p>Content</p>
      </Dialog>
    );
    
    await user.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    const { container } = render(
      <Dialog open={true} onClose={handleClose}>
        <p>Content</p>
      </Dialog>
    );
    
    const backdrop = container.querySelector('.backdrop-blur-sm');
    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not close when dialog content is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Dialog open={true} onClose={handleClose}>
        <p>Content</p>
      </Dialog>
    );
    
    await user.click(screen.getByText('Content'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} className="custom-dialog">
        <p>Content</p>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-dialog');
  });
});

describe('DialogFooter', () => {
  it('renders children', () => {
    render(
      <DialogFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </DialogFooter>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DialogFooter className="custom-footer">
        <button>Action</button>
      </DialogFooter>
    );
    expect(container.firstChild as HTMLElement).toHaveClass('custom-footer');
  });
});
