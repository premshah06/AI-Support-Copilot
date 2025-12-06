/**
 * FormField Example Component
 * Demonstrates the validation animations in action
 */

import { useState } from 'react';
import { FormField } from './FormField';
import { Card, CardBody, CardHeader } from './Card';

export const FormFieldExample = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    // Clear error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    }

    if (!hasError) {
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Form Validation Demo</h2>
          <p className="text-sm text-muted-foreground">
            Try typing to see validation animations
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              placeholder="Enter your email"
              showValidation={true}
              validate={validateEmail}
              helpText="We'll never share your email"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              placeholder="Enter your password"
              showValidation={true}
              validate={(val) => val.length >= 8}
              helpText="Must be at least 8 characters"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              Submit
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
