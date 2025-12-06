import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label and input', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
      />
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('displays required indicator when required is true', () => {
    const { container } = render(
      <FormField 
        label="Username" 
        name="username" 
        value="" 
        onChange={vi.fn()} 
        required 
      />
    );
    // Label component should show required indicator (asterisk)
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
    expect(label?.textContent).toContain('*');
  });

  it('calls onChange when input value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <FormField 
        label="Name" 
        name="name" 
        value="" 
        onChange={handleChange} 
      />
    );
    
    const input = screen.getByLabelText('Name');
    await user.type(input, 'John');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        error="Email is required" 
      />
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('applies error styling to input when error exists', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        error="Invalid email" 
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-red-500');
  });

  it('sets aria-invalid when error exists', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        error="Invalid email" 
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('displays help text when provided and no error', () => {
    render(
      <FormField 
        label="Password" 
        name="password" 
        value="" 
        onChange={vi.fn()} 
        helpText="Must be at least 8 characters" 
      />
    );
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('hides help text when error is present', () => {
    render(
      <FormField 
        label="Password" 
        name="password" 
        value="" 
        onChange={vi.fn()} 
        error="Password is required"
        helpText="Must be at least 8 characters" 
      />
    );
    expect(screen.queryByText('Must be at least 8 characters')).not.toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        placeholder="Enter your email" 
      />
    );
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('disables input when disabled is true', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        disabled 
      />
    );
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('supports different input types', () => {
    const { rerender } = render(
      <FormField 
        label="Email" 
        name="email" 
        type="email"
        value="" 
        onChange={vi.fn()} 
      />
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    
    rerender(
      <FormField 
        label="Password" 
        name="password" 
        type="password"
        value="" 
        onChange={vi.fn()} 
      />
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormField 
        label="Test" 
        name="test" 
        value="" 
        onChange={vi.fn()} 
        className="custom-field" 
      />
    );
    expect(container.firstChild as HTMLElement).toHaveClass('custom-field');
  });

  it('links error message with aria-describedby', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        error="Invalid email" 
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('displays error with alert role', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        error="Invalid email" 
      />
    );
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveTextContent('Invalid email');
  });

  it('shows success checkmark when showValidation is true and field is valid', () => {
    const { container } = render(
      <FormField 
        label="Email" 
        name="email" 
        value="test@example.com" 
        onChange={vi.fn()} 
        showValidation={true}
      />
    );
    // CheckCircle icon should be present
    const checkIcon = container.querySelector('.text-green-600, .text-green-400');
    expect(checkIcon).toBeInTheDocument();
  });

  it('does not show success checkmark when value is empty', () => {
    const { container } = render(
      <FormField 
        label="Email" 
        name="email" 
        value="" 
        onChange={vi.fn()} 
        showValidation={true}
      />
    );
    const checkIcon = container.querySelector('.text-green-600, .text-green-400');
    expect(checkIcon).not.toBeInTheDocument();
  });

  it('does not show success checkmark when there is an error', () => {
    const { container } = render(
      <FormField 
        label="Email" 
        name="email" 
        value="invalid" 
        onChange={vi.fn()} 
        showValidation={true}
        error="Invalid email format"
      />
    );
    const checkIcon = container.querySelector('.text-green-600, .text-green-400');
    expect(checkIcon).not.toBeInTheDocument();
  });

  it('uses custom validate function when provided', () => {
    const validateEmail = (value: string) => value.includes('@');
    
    // Test with valid email
    const { container: validContainer } = render(
      <FormField 
        label="Email" 
        name="email" 
        value="test@example.com" 
        onChange={vi.fn()} 
        showValidation={true}
        validate={validateEmail}
      />
    );
    
    // Should show checkmark for valid email
    let checkIcon = validContainer.querySelector('.text-green-600, .text-green-400');
    expect(checkIcon).toBeInTheDocument();
    
    // Test with invalid email (separate render)
    const { container: invalidContainer } = render(
      <FormField 
        label="Email2" 
        name="email2" 
        value="invalid" 
        onChange={vi.fn()} 
        showValidation={true}
        validate={validateEmail}
      />
    );
    
    // Should not show checkmark for invalid email
    checkIcon = invalidContainer.querySelector('.text-green-600, .text-green-400');
    expect(checkIcon).not.toBeInTheDocument();
  });

  it('applies green border styling when field is valid', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        value="test@example.com" 
        onChange={vi.fn()} 
        showValidation={true}
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-green-500');
  });
});
