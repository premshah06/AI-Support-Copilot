import React from 'react';
import { Card, CardHeader, CardBody } from './Card';
import { cn } from '@/lib/utils';

interface ChartWidgetProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  description,
  children,
  className,
  actions,
}) => {
  return (
    <div className={cn('p-5 rounded-xl border border-border bg-card h-full', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="ml-4">{actions}</div>}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
