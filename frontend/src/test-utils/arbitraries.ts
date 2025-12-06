import fc from 'fast-check';
import { Ticket, Customer, TicketAction, AISuggestion } from '@/types';

// Ticket generator
export const ticketArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 500 }),
  status: fc.constantFrom('open', 'in_progress', 'resolved', 'closed'),
  priority: fc.constantFrom('low', 'medium', 'high', 'critical'),
  category: fc.option(fc.string(), { nil: null as any }),
  created_at: fc.integer({ min: Date.parse('2020-01-01'), max: Date.now() }).map(ts => new Date(ts).toISOString()),
  updated_at: fc.integer({ min: Date.parse('2020-01-01'), max: Date.now() }).map(ts => new Date(ts).toISOString()),
}) as fc.Arbitrary<Ticket>;

// Customer generator
export const customerArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  email: fc.emailAddress(),
  segment: fc.constantFrom('enterprise', 'mid-market', 'smb'),
  region: fc.constantFrom('us-east', 'us-west', 'eu', 'apac'),
  risk_score: fc.integer({ min: 0, max: 100 }),
}) as fc.Arbitrary<Customer>;

// Ticket Action generator
export const ticketActionArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  ticket_id: fc.integer({ min: 1 }),
  actor_type: fc.constantFrom('AI', 'human'),
  action_type: fc.constantFrom('classification', 'reply_suggested', 'reply_sent'),
  content: fc.string({ minLength: 10, maxLength: 200 }),
  created_at: fc.integer({ min: Date.parse('2020-01-01'), max: Date.now() }).map(ts => new Date(ts).toISOString()),
}) as fc.Arbitrary<TicketAction>;

// AI Suggestion generator
export const aiSuggestionArbitrary = fc.record({
  summary: fc.string({ minLength: 20, maxLength: 200 }).filter(s => s.trim().length > 0),
  category: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  priority: fc.constantFrom('low', 'medium', 'high', 'critical'),
  suggested_reply: fc.string({ minLength: 50, maxLength: 500 }).filter(s => s.trim().length > 0),
  suggested_actions: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }),
}) as fc.Arbitrary<AISuggestion>;
