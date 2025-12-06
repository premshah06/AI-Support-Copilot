import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartWidget } from '../molecules/ChartWidget';
import { getTickets } from '@/api/tickets';
import { Ticket } from '@/types';
import { format, subDays, startOfDay } from 'date-fns';
import { getUserFriendlyErrorMessage } from '@/lib/errorHandling';
import { Button } from '../atoms/Button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface TrendData {
  date: string;
  tickets: number;
}

const calculateVolumeTrend = (tickets: Ticket[], days: number = 7): TrendData[] => {
  const today = startOfDay(new Date());
  const dateMap: Record<string, number> = {};

  // Initialize all dates with 0
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'MMM dd');
    dateMap[dateStr] = 0;
  }

  // Count tickets created on each day
  tickets.forEach(ticket => {
    const createdDate = startOfDay(new Date(ticket.created_at));
    const dateStr = format(createdDate, 'MMM dd');
    if (dateStr in dateMap) {
      dateMap[dateStr]++;
    }
  });

  return Object.entries(dateMap).map(([date, tickets]) => ({
    date,
    tickets,
  }));
};

export const TicketVolumeTrendChart: React.FC = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tickets = await getTickets();
      const trend = calculateVolumeTrend(tickets);
      setData(trend);
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      setError(errorObj.message);
      console.error('Failed to fetch ticket volume trend:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ChartWidget title="Ticket Volume Trend">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading chart...</div>
        </div>
      </ChartWidget>
    );
  }

  if (error) {
    return (
      <ChartWidget title="Ticket Volume Trend">
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

  return (
    <ChartWidget 
      title="Ticket Volume Trend" 
      description="Number of tickets created over the last 7 days"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="tickets" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Tickets Created"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWidget>
  );
};
