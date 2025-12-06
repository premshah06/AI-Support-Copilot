import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../atoms/Badge';
import { Circle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { statusPulseVariants, statusProgressVariants, statusSuccessVariants } from '@/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Status = 'open' | 'in_progress' | 'resolved' | 'closed';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<Status, { variant: 'default' | 'success' | 'warning' | 'error' | 'info'; icon: React.ReactNode; label: string }> = {
  open: {
    variant: 'info',
    icon: <Circle className="w-3.5 h-3.5" />,
    label: 'Open',
  },
  in_progress: {
    variant: 'warning',
    icon: <Clock className="w-3.5 h-3.5" />,
    label: 'In Progress',
  },
  resolved: {
    variant: 'success',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    label: 'Resolved',
  },
  closed: {
    variant: 'default',
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: 'Closed',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className }) => {
  const config = statusConfig[status];
  const prefersReducedMotion = useReducedMotion();

  // Get animated icon based on status
  const getAnimatedIcon = () => {
    // If user prefers reduced motion, return static icon
    if (prefersReducedMotion) {
      return config.icon;
    }

    switch (status) {
      case 'open':
        // Pulse animation for open status
        return (
          <motion.div
            variants={statusPulseVariants}
            animate="pulse"
            className="inline-flex items-center"
          >
            <Circle className="w-3.5 h-3.5" />
          </motion.div>
        );
      
      case 'in_progress':
        // Progress/rotation animation for in_progress status
        return (
          <motion.div
            variants={statusProgressVariants}
            animate="progress"
            className="inline-flex items-center"
          >
            <Clock className="w-3.5 h-3.5" />
          </motion.div>
        );
      
      case 'resolved':
        // Success checkmark animation for resolved status
        return (
          <motion.div
            variants={statusSuccessVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center"
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </motion.div>
        );
      
      case 'closed':
        // Static indicator for closed status
        return config.icon;
      
      default:
        return config.icon;
    }
  };

  return (
    <Badge variant={config.variant} size={size} icon={getAnimatedIcon()} className={className}>
      {config.label}
    </Badge>
  );
};
