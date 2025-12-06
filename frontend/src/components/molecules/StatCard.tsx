import React from 'react';
import { Card } from './Card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the StatCard component
 */
interface StatCardProps {
  /** Label describing the metric */
  label: string;
  /** The metric value to display */
  value: number | string;
  /** Optional trend indicator showing change direction and percentage */
  trend?: {
    /** Percentage change value */
    value: number;
    /** Direction of the trend */
    direction: 'up' | 'down';
  };
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Color class for the icon */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StatCard component for displaying key metrics with trend indicators.
 * 
 * Used on dashboards to show important statistics like ticket counts,
 * response times, and other KPIs. Supports trend indicators with up/down
 * arrows and percentage changes.
 * 
 * @example
 * ```tsx
 * // Basic stat card
 * <StatCard label="Total Tickets" value={142} />
 * 
 * // Stat card with trend
 * <StatCard 
 *   label="Open Tickets" 
 *   value={23}
 *   trend={{ value: 12, direction: 'up' }}
 * />
 * 
 * // Stat card with icon
 * <StatCard 
 *   label="Resolved" 
 *   value={89}
 *   icon={<CheckCircle />}
 *   color="text-success"
 * />
 * ```
 * 
 * @component
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon,
  color = 'text-accent',
  className,
}) => {
  const trendColor = trend?.direction === 'up' ? 'text-success' : 'text-error';
  const TrendIcon = trend?.direction === 'up' ? ArrowUp : ArrowDown;

  return (
    <div className={cn('p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors', className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        {icon && (
          <div className={cn('opacity-60', color)}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <div className={cn('flex items-center text-xs font-medium', trendColor)}>
            <TrendIcon className="w-3 h-3 mr-0.5" />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
