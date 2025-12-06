import React, { memo, useCallback } from 'react';
import { Card } from '../molecules/Card';
import { StatusBadge } from '../molecules/StatusBadge';
import { PriorityBadge } from '../molecules/PriorityBadge';
import { CategoryBadge } from '../molecules/CategoryBadge';
import { Ticket } from '@/types';
import { formatRelativeTime, truncateText } from '@/lib/formatters';
import { User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticketId: number) => void;
  showCustomer?: boolean;
  compact?: boolean;
  className?: string;
}

export const TicketCard: React.FC<TicketCardProps> = memo(({
  ticket,
  onClick,
  showCustomer = true,
  compact = false,
  className,
}) => {
  const handleClick = useCallback(() => {
    onClick(ticket.id);
  }, [onClick, ticket.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className="h-full"
    >
      <article
        onClick={handleClick}
        className={cn(
          'h-full p-4 sm:p-5 rounded-lg sm:rounded-xl border border-border bg-card',
          'hover:border-accent hover:shadow-lg',
          'transition-all duration-200 cursor-pointer',
          'group',
          className
        )}
        role="button"
        tabIndex={0}
        aria-label={`View ticket: ${ticket.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Badges Row - Top */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
          <PriorityBadge priority={ticket.priority as any} size="sm" />
          <StatusBadge status={ticket.status as any} size="sm" />
          {ticket.category && <CategoryBadge category={ticket.category} size="sm" />}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {ticket.title}
        </h3>

        {/* Description Preview */}
        {!compact && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
            {truncateText(ticket.description, 120)}
          </p>
        )}

        {/* Footer: Customer and Timestamp */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 sm:pt-3 border-t border-border gap-2">
          {showCustomer && ticket.customer ? (
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="font-medium truncate">{ticket.customer.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>No customer</span>
            </div>
          )}

          <div className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="whitespace-nowrap">{formatRelativeTime(ticket.created_at)}</span>
          </div>
        </div>
      </article>
    </motion.div>
  );
});

TicketCard.displayName = 'TicketCard';
