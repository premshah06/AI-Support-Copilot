import React, { useEffect, useState, useCallback, memo } from 'react';
import { StatCard } from '../molecules/StatCard';
import { Ticket, AlertCircle, CheckCircle, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { getTickets } from '@/api/tickets';
import { Ticket as TicketType } from '@/types';
import { getUserFriendlyErrorMessage } from '@/lib/errorHandling';
import { Button } from '../atoms/Button';

interface TicketMetrics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResponseTime: number;
}

const calculateMetrics = (tickets: TicketType[]): TicketMetrics => {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  
  // Calculate average response time (simplified - using time since creation)
  const avgResponseTime = tickets.length > 0
    ? tickets.reduce((acc, ticket) => {
        const created = new Date(ticket.created_at).getTime();
        const updated = new Date(ticket.updated_at).getTime();
        return acc + (updated - created);
      }, 0) / tickets.length / (1000 * 60 * 60) // Convert to hours
    : 0;

  return {
    total,
    open,
    inProgress,
    resolved,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10, // Round to 1 decimal
  };
};

export const TicketMetrics: React.FC = memo(() => {
  const [metrics, setMetrics] = useState<TicketMetrics>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgResponseTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tickets = await getTickets();
      const calculatedMetrics = calculateMetrics(tickets);
      setMetrics(calculatedMetrics);
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      setError(errorObj.message);
      console.error('Failed to fetch ticket metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 transition-layout">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100">Failed to load metrics</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            icon={<RefreshCw className="w-4 h-4" />}
            className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 transition-layout">
      <StatCard
        label="Total"
        value={metrics.total}
        icon={<Ticket className="w-5 h-5" />}
        color="text-accent"
      />
      <StatCard
        label="Open"
        value={metrics.open}
        icon={<AlertCircle className="w-5 h-5" />}
        color="text-error"
      />
      <StatCard
        label="In Progress"
        value={metrics.inProgress}
        icon={<Clock className="w-5 h-5" />}
        color="text-warning"
      />
      <StatCard
        label="Resolved"
        value={metrics.resolved}
        icon={<CheckCircle className="w-5 h-5" />}
        color="text-success"
      />
      <StatCard
        label="Avg Time"
        value={`${metrics.avgResponseTime}h`}
        icon={<TrendingUp className="w-5 h-5" />}
        color="text-info"
      />
    </div>
  );
});

TicketMetrics.displayName = 'TicketMetrics';
