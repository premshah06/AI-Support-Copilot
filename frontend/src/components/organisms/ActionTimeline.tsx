import { motion, AnimatePresence } from 'framer-motion';
import { TimelineItem } from './TimelineItem';
import { TicketAction } from '../../types';
import { Clock } from 'lucide-react';

interface ActionTimelineProps {
  actions: TicketAction[];
}

export const ActionTimeline = ({ actions }: ActionTimelineProps) => {
  // Sort actions by created_at (newest first for display)
  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (actions.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 sm:p-8 text-center">
        <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm sm:text-base text-muted-foreground">No actions yet</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Actions will appear here as the ticket progresses
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        Action History
      </h3>
      
      <div className="space-y-0">
        <AnimatePresence mode="popLayout">
          {sortedActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.05 
              }}
            >
              <TimelineItem
                action={action}
                isFirst={index === 0}
                isLast={index === sortedActions.length - 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
