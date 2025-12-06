/**
 * Unit tests for validation utilities
 * Tests Zod schemas and validation helper functions
 */

import { describe, it, expect } from 'vitest';
import {
  replySchema,
  ticketUpdateSchema,
  searchQuerySchema,
  customerSchema,
  validateData,
  getFieldError,
  type ReplyFormData,
  type TicketUpdateFormData,
  type CustomerFormData,
} from './validation';

describe('replySchema', () => {
  it('should validate valid reply data', () => {
    const validData = {
      reply_text: 'This is a valid reply with enough characters',
      status_update: 'in_progress' as const,
    };

    const result = replySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty reply text', () => {
    const invalidData = {
      reply_text: '',
    };

    const result = replySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject reply text shorter than 10 characters', () => {
    const invalidData = {
      reply_text: 'Short',
    };

    const result = replySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject reply text longer than 5000 characters', () => {
    const invalidData = {
      reply_text: 'a'.repeat(5001),
    };

    const result = replySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept valid status updates', () => {
    const statuses = ['open', 'in_progress', 'resolved', 'closed'] as const;

    statuses.forEach((status) => {
      const data = {
        reply_text: 'Valid reply text here',
        status_update: status,
      };

      const result = replySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should allow optional status_update', () => {
    const data = {
      reply_text: 'Valid reply without status update',
    };

    const result = replySchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe('ticketUpdateSchema', () => {
  it('should validate valid ticket update data', () => {
    const validData = {
      title: 'Valid Ticket Title',
      description: 'This is a valid description with enough characters to pass validation',
      priority: 'high' as const,
      category: 'Technical',
    };

    const result = ticketUpdateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidData = {
      title: '',
      description: 'Valid description here with enough characters',
      priority: 'medium' as const,
    };

    const result = ticketUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject title shorter than 5 characters', () => {
    const invalidData = {
      title: 'Hi',
      description: 'Valid description here with enough characters',
      priority: 'medium' as const,
    };

    const result = ticketUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject title longer than 200 characters', () => {
    const invalidData = {
      title: 'a'.repeat(201),
      description: 'Valid description here with enough characters',
      priority: 'medium' as const,
    };

    const result = ticketUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject description shorter than 20 characters', () => {
    const invalidData = {
      title: 'Valid Title',
      description: 'Too short',
      priority: 'medium' as const,
    };

    const result = ticketUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject description longer than 2000 characters', () => {
    const invalidData = {
      title: 'Valid Title',
      description: 'a'.repeat(2001),
      priority: 'medium' as const,
    };

    const result = ticketUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept all valid priority values', () => {
    const priorities = ['low', 'medium', 'high', 'critical'] as const;

    priorities.forEach((priority) => {
      const data = {
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        priority,
      };

      const result = ticketUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid priority values', () => {
    const invalidData = {
      title: 'Valid Title',
      description: 'Valid description with enough characters',
      priority: 'urgent',
    };

    const result = ticketUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should allow optional category', () => {
    const data = {
      title: 'Valid Title',
      description: 'Valid description with enough characters',
      priority: 'medium' as const,
    };

    const result = ticketUpdateSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe('searchQuerySchema', () => {
  it('should validate valid search query', () => {
    const validData = {
      query: 'search term',
    };

    const result = searchQuerySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should allow empty query', () => {
    const data = {
      query: '',
    };

    const result = searchQuerySchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should allow optional query', () => {
    const data = {};

    const result = searchQuerySchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject query longer than 200 characters', () => {
    const invalidData = {
      query: 'a'.repeat(201),
    };

    const result = searchQuerySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('customerSchema', () => {
  it('should validate valid customer data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      tier: 'pro' as const,
    };

    const result = customerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalidData = {
      name: '',
      email: 'john@example.com',
      tier: 'free' as const,
    };

    const result = customerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject name shorter than 2 characters', () => {
    const invalidData = {
      name: 'J',
      email: 'john@example.com',
      tier: 'free' as const,
    };

    const result = customerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject name longer than 100 characters', () => {
    const invalidData = {
      name: 'a'.repeat(101),
      email: 'john@example.com',
      tier: 'free' as const,
    };

    const result = customerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email format', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email',
      tier: 'free' as const,
    };

    const result = customerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept valid email formats', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'user_name@example-domain.com',
    ];

    validEmails.forEach((email) => {
      const data = {
        name: 'John Doe',
        email,
        tier: 'free' as const,
      };

      const result = customerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should allow optional company', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      tier: 'free' as const,
    };

    const result = customerSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject company longer than 100 characters', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'a'.repeat(101),
      tier: 'free' as const,
    };

    const result = customerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept all valid tier values', () => {
    const tiers = ['free', 'pro', 'enterprise'] as const;

    tiers.forEach((tier) => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        tier,
      };

      const result = customerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid tier values', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      tier: 'premium',
    };

    const result = customerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('validateData', () => {
  it('should return success for valid data', () => {
    const data = {
      reply_text: 'This is a valid reply',
    };

    const result = validateData(replySchema, data);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reply_text).toBe('This is a valid reply');
    }
  });

  it('should return errors for invalid data', () => {
    const data = {
      reply_text: 'Short',
    };

    const result = validateData(replySchema, data);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    }
  });

  it('should transform Zod errors into simple object', () => {
    const data = {
      name: 'J',
      email: 'invalid-email',
      tier: 'free',
    };

    const result = validateData(customerSchema, data);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    }
  });

  it('should handle nested field paths', () => {
    const data = {
      title: '',
      description: 'Short',
      priority: 'invalid',
    };

    const result = validateData(ticketUpdateSchema, data);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    }
  });
});

describe('getFieldError', () => {
  it('should return error message for existing field', () => {
    const errors = {
      email: 'Invalid email format',
      password: 'Password too short',
    };

    expect(getFieldError(errors, 'email')).toBe('Invalid email format');
    expect(getFieldError(errors, 'password')).toBe('Password too short');
  });

  it('should return undefined for non-existing field', () => {
    const errors = {
      email: 'Invalid email format',
    };

    expect(getFieldError(errors, 'password')).toBeUndefined();
  });

  it('should return undefined when errors is undefined', () => {
    expect(getFieldError(undefined, 'email')).toBeUndefined();
  });

  it('should handle empty errors object', () => {
    const errors = {};

    expect(getFieldError(errors, 'email')).toBeUndefined();
  });
});
