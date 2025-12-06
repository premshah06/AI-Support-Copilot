import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies error validation state', () => {
    render(<Input validationState="error" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-error');
  });

  it('applies success validation state', () => {
    render(<Input validationState="success" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-success');
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Input fullWidth />);
    expect(screen.getByRole('textbox')).toHaveClass('w-full');
  });
});
