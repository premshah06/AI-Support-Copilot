import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../atoms/Badge';
import { AlertCircle, AlertTriangle, Info, Minus } from 'lucide-react';

type Priority = 'low' | 'medium' | 'high' | 'critical' | 'P1' | 'P2' | 'P3' | 'P4';

interface PriorityBadgeProps {
  priority: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const priorityConfig: Record<string, { variant: 'default' | 'success' | 'warning' | 'error' | 'info'; icon: React.ReactNode; label: string }> = {
  low: {
    variant: 'info',
    icon: <Minus className="w-3.5 h-3.5" />,
    label: 'Low',
  },
  medium: {
    variant: 'warning',
    icon: <Info className="w-3.5 h-3.5" />,
    label: 'Medium',
  },
  high: {
    variant: 'warning',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: 'High',
  },
  critical: {
    variant: 'error',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: 'Critical',
  },
  // Support backend P1-P4 format
  P1: {
    variant: 'error',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: 'P1 - Critical',
  },
  P2: {
    variant: 'warning',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: 'P2 - High',
  },
  P3: {
    variant: 'warning',
    icon: <Info className="w-3.5 h-3.5" />,
    label: 'P3 - Medium',
  },
  P4: {
    variant: 'info',
    icon: <Minus className="w-3.5 h-3.5" />,
    label: 'P4 - Low',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', className }) => {
  const config = priorityConfig[priority] || priorityConfig.medium; // Fallback to medium

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ display: 'inline-block' }}
    >
      <Badge variant={config.variant} size={size} icon={config.icon} className={className}>
        {config.label}
      </Badge>
    </motion.div>
  );
};
