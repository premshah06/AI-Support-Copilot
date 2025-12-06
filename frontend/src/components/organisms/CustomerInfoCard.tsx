import { useState } from 'react';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { ChevronDown, ChevronUp, Mail, Building2, Shield } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerInfoCardProps {
  customer: Customer;
  defaultExpanded?: boolean;
}

export const CustomerInfoCard = ({ customer, defaultExpanded = true }: CustomerInfoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Determine tier badge variant
  const getTierVariant = (tier: string): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    const tierLower = tier?.toLowerCase() || '';
    if (tierLower === 'enterprise') return 'error';
    if (tierLower === 'pro') return 'warning';
    return 'info';
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 hover:bg-muted transition-colors"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse customer information' : 'Expand customer information'}
      >
        <Avatar name={customer.name} size="md" className="sm:w-12 sm:h-12" />
        <div className="flex-1 text-left min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{customer.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{customer.email}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 space-y-2 sm:space-y-3 border-t border-border pt-3 sm:pt-4">
          {/* Email */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground break-all">{customer.email}</span>
          </div>

          {/* Additional info from backend */}
          {customer.segment && (
            <div className="text-xs sm:text-sm">
              <span className="text-muted-foreground">Segment: </span>
              <span className="text-foreground font-medium">{customer.segment}</span>
            </div>
          )}

          {customer.region && (
            <div className="text-xs sm:text-sm">
              <span className="text-muted-foreground">Region: </span>
              <span className="text-foreground font-medium">{customer.region}</span>
            </div>
          )}

          {customer.risk_score !== undefined && (
            <div className="text-xs sm:text-sm">
              <span className="text-muted-foreground">Risk Score: </span>
              <span className={`font-medium ${
                customer.risk_score > 70 ? 'text-error' :
                customer.risk_score > 40 ? 'text-warning' :
                'text-success'
              }`}>
                {customer.risk_score}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
