/**
 * Validation schemas using Zod
 * Provides type-safe validation for forms and user input
 */

import { z } from 'zod';

/**
 * Reply validation schema
 * Validates ticket reply text
 */
export const replySchema = z.object({
  reply_text: z
    .string()
    .min(1, 'Reply text is required')
    .min(10, 'Reply must be at least 10 characters')
    .max(5000, 'Reply must not exceed 5000 characters'),
  status_update: z
    .enum(['open', 'in_progress', 'resolved', 'closed'])
    .optional(),
});

export type ReplyFormData = z.infer<typeof replySchema>;

/**
 * Ticket update validation schema
 * Validates ticket title and description updates
 */
export const ticketUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    message: 'Please select a valid priority',
  }),
  category: z.string().optional(),
});

export type TicketUpdateFormData = z.infer<typeof ticketUpdateSchema>;

/**
 * Search query validation schema
 * Validates search input
 */
export const searchQuerySchema = z.object({
  query: z
    .string()
    .max(200, 'Search query must not exceed 200 characters')
    .optional(),
});

export type SearchQueryFormData = z.infer<typeof searchQuerySchema>;

/**
 * Customer info validation schema
 * Validates customer information
 */
export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  company: z
    .string()
    .max(100, 'Company name must not exceed 100 characters')
    .optional(),
  tier: z.enum(['free', 'pro', 'enterprise'], {
    message: 'Please select a valid tier',
  }),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

/**
 * Helper function to validate data against a schema
 * Returns validation result with typed errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Transform Zod errors into a simple object
  const errors: Record<string, string> = {};
  
  // Zod error structure: result.error.issues (not errors)
  if (result.error.issues) {
    result.error.issues.forEach((err) => {
      const path = err.path.join('.') || 'unknown';
      errors[path] = err.message;
    });
  }

  return { success: false, errors };
}

/**
 * Helper function to get a single field error
 */
export function getFieldError(
  errors: Record<string, string> | undefined,
  fieldName: string
): string | undefined {
  return errors?.[fieldName];
}
