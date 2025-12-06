import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select', () => {
  it('renders with options', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Select onChange={handleChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    
    await user.selectOptions(screen.getByRole('combobox'), '2');
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Select disabled>
        <option>Test</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies error validation state', () => {
    render(
      <Select validationState="error">
        <option>Test</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toHaveClass('border-error');
  });

  it('applies success validation state', () => {
    render(
      <Select validationState="success">
        <option>Test</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toHaveClass('border-success');
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(
      <Select fullWidth>
        <option>Test</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toHaveClass('w-full');
  });
});
