import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets';
import { Ticket, FilterState } from '../types';
import { TicketCard } from './organisms/TicketCard';
import { Skeleton } from './atoms/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { FileQuestion, AlertCircle, RefreshCw } from 'lucide-react';
import { applyFilters } from '@/lib/filterUtils';
import { getUserFriendlyErrorMessage } from '@/lib/errorHandling';
import { Button } from './atoms/Button';

interface TicketListProps {
  filters: FilterState;
}

const TicketList = ({ filters }: TicketListProps) => {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets();
      setAllTickets(data);
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      setError(errorObj.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTicketClick = useCallback((ticketId: number) => {
    navigate(`/tickets/${ticketId}`);
  }, [navigate]);

  // Apply filters to tickets - memoized to avoid recalculation on every render
  const filteredTickets = useMemo(() => 
    applyFilters(allTickets, filters),
    [allTickets, filters]
  );

  // Loading State with Skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton height={220} className="rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800"
      >
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Failed to Load Tickets
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <Button
            variant="outline"
            onClick={loadTickets}
            icon={<RefreshCw className="w-4 h-4" />}
            className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  // Empty State
  if (filteredTickets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center justify-center p-16 bg-muted rounded-xl border-2 border-dashed border-border"
      >
        <FileQuestion className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No tickets found
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {allTickets.length === 0
            ? "There are no tickets yet. New tickets will appear here."
            : "No tickets match your current filters. Try adjusting your search criteria."}
        </p>
      </motion.div>
    );
  }

  // Ticket Grid with Stagger Animation
  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-muted-foreground" role="status" aria-live="polite">
          Showing {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4 transition-layout"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.03,
            },
          },
        }}
        role="list"
        aria-label="Ticket list"
      >
        <AnimatePresence mode="popLayout">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              layout
              role="listitem"
            >
              <TicketCard ticket={ticket} onClick={handleTicketClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TicketList;
