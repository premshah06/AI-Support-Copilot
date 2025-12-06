import { Ticket } from '@/types';

/**
 * Search tickets by query string (case-insensitive)
 * Searches in title and description fields
 */
export const searchTickets = (tickets: Ticket[], query: string): Ticket[] => {
  if (!query || query.trim() === '') {
    return tickets;
  }

  const lowerQuery = query.toLowerCase();

  return tickets.filter(ticket => {
    return (
      ticket.title.toLowerCase().includes(lowerQuery) ||
      ticket.description.toLowerCase().includes(lowerQuery)
    );
  });
};
