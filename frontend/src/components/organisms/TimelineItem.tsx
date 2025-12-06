import { useState } from 'react';
import { Tooltip } from '../atoms/Tooltip';
import { 
  Bot, 
  User, 
  MessageSquare, 
  CheckCircle, 
  Tag, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { TicketAction } from '../../types';
import { formatRelativeTime, formatAbsoluteTime } from '../../lib/formatters';

interface TimelineItemProps {
  action: TicketAction;
  isFirst: boolean;
  isLast: boolean;
}

// Map action types to icons and labels
const actionTypeConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  classification: {
    icon: <Tag className="w-4 h-4" />,
    label: 'Classified',
  },
  reply_suggested: {
    icon: <MessageSquare className="w-4 h-4" />,
    label: 'Suggested Reply',
  },
  reply_sent: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Reply Sent',
  },
};

export const TimelineItem = ({ action, isFirst, isLast }: TimelineItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAI = action.actor_type === 'AI';
  const config = actionTypeConfig[action.action_type] || {
    icon: <MessageSquare className="w-4 h-4" />,
    label: action.action_type,
  };

  // Determine colors based on actor type - lighter, more professional colors
  const nodeColor = isAI 
    ? 'bg-blue-500 border-blue-600' 
    : 'bg-gray-500 border-gray-600';
  const lineColor = isAI 
    ? 'bg-accent/30' 
    : 'bg-border';
  const iconColor = 'text-white';

  return (
    <div className="relative flex gap-3 sm:gap-4">
      {/* Timeline line and node */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        {/* Connecting line above (if not first) */}
        {!isFirst && (
          <div className={`absolute top-0 w-0.5 h-6 ${lineColor}`} style={{ top: '-24px' }} />
        )}
        
        {/* Timeline node */}
        <div className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${nodeColor}`}>
          {isAI ? (
            <Bot className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
          ) : (
            <User className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
          )}
        </div>
        
        {/* Connecting line below (if not last) */}
        {!isLast && (
          <div className={`absolute bottom-0 w-0.5 flex-1 ${lineColor}`} style={{ top: '40px', height: 'calc(100% - 16px)' }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 sm:pb-8 min-w-0">
        <div className="bg-muted rounded-lg border border-border p-3 sm:p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted-foreground">
                {config.icon}
              </span>
              <span className="font-medium text-sm sm:text-base text-foreground truncate">
                {config.label}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                by {isAI ? 'AI' : 'Agent'}
              </span>
            </div>
            
            {/* Timestamp with tooltip */}
            <Tooltip content={formatAbsoluteTime(action.created_at)}>
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {formatRelativeTime(action.created_at)}
              </span>
            </Tooltip>
          </div>

          {/* Content preview */}
          <div className="text-xs sm:text-sm text-foreground">
            {isExpanded ? (
              <div className="whitespace-pre-wrap break-words">{action.content}</div>
            ) : (
              <div className="line-clamp-2 break-words">{action.content}</div>
            )}
          </div>

          {/* Expand/collapse button for long content */}
          {action.content.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center gap-1 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Show less' : 'Show more'}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Show more
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
