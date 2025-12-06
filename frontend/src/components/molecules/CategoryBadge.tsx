import React from 'react';
import { Badge } from '../atoms/Badge';
import { Tag } from 'lucide-react';

interface CategoryBadgeProps {
  category: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md', className }) => {
  if (!category) {
    return null;
  }

  return (
    <Badge variant="default" size={size} icon={<Tag className="w-3.5 h-3.5" />} className={className}>
      {category}
    </Badge>
  );
};
