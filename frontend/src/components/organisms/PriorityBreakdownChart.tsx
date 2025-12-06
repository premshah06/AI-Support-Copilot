import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartWidget } from '../molecules/ChartWidget';
import { getTickets } from '@/api/tickets';
import { Ticket } from '@/types';
import { getUserFriendlyErrorMessage } from '@/lib/errorHandling';
import { Button } from '../atoms/Button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface PriorityData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

const PRIORITY_COLORS: Record<string, string> = {
  P1: '#ef4444',    // red - critical
  P2: '#f97316',    // orange - high
  P3: '#eab308',    // yellow - medium
  P4: '#22c55e',    // green - low
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const PRIORITY_LABELS: Record<string, string> = {
  P1: 'P1 - Critical',
  P2: 'P2 - High',
  P3: 'P3 - Medium',
  P4: 'P4 - Low',
};

const calculatePriorityBreakdown = (tickets: Ticket[]): PriorityData[] => {
  const priorityCounts: Record<string, number> = {};

  tickets.forEach(ticket => {
    const priority = ticket.priority;
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
  });

  return Object.entries(priorityCounts)
    .map(([name, value]) => ({
      name: PRIORITY_LABELS[name] || name,
      value,
      color: PRIORITY_COLORS[name] || '#6b7280',
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value); // Sort by value descending
};

export const PriorityBreakdownChart: React.FC = memo(() => {
  const [data, setData] = useState<PriorityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tickets = await getTickets();
      const breakdown = calculatePriorityBreakdown(tickets);
      setData(breakdown);
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      setError(errorObj.message);
      console.error('Failed to fetch priority breakdown:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <ChartWidget title="Priority Breakdown">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading chart...</div>
        </div>
      </ChartWidget>
    );
  }

  if (error) {
    return (
      <ChartWidget title="Priority Breakdown">
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="text-center">
            <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Failed to load chart</p>
            <p className="text-xs text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Retry
            </Button>
          </div>
        </div>
      </ChartWidget>
    );
  }

  if (data.length === 0) {
    return (
      <ChartWidget title="Priority Breakdown">
        <div className="h-64 flex items-center justify-center text-gray-400">
          No ticket data available
        </div>
      </ChartWidget>
    );
  }

  return (
    <ChartWidget 
      title="Priority Breakdown" 
      description="Distribution of tickets by priority level"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWidget>
  );
});

PriorityBreakdownChart.displayName = 'PriorityBreakdownChart';
