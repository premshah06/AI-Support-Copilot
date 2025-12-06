import { Ticket, FilterState } from '@/types';

/**
 * Apply filters to a list of tickets
 * Returns only tickets that match ALL active filter criteria
 */
export const applyFilters = (tickets: Ticket[], filters: FilterState): Ticket[] => {
  return tickets.filter(ticket => {
    // Status filter
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(ticket.status);

    // Priority filter
    const matchesPriority =
      filters.priority.length === 0 || filters.priority.includes(ticket.priority);

    // Category filter
    const matchesCategory =
      filters.category.length === 0 ||
      filters.category.some(filterCat => {
        // Handle null/empty categories
        if (!filterCat) {
          return !ticket.category;
        }
        return ticket.category === filterCat;
      });

    // Search query filter (case-insensitive, searches title and description)
    const matchesSearch =
      !filters.searchQuery ||
      ticket.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

    // Ticket must match ALL active filters
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });
};
