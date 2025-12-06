import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Avatar component
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL of the avatar image */
  src?: string;
  /** Alt text for the avatar image */
  alt?: string;
  /** Name used to generate initials when image is unavailable */
  name?: string;
  /** Size of the avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Avatar component with image support and fallback to initials.
 * 
 * Displays a user or customer avatar with automatic fallback to initials
 * when an image is not available or fails to load. Initials are generated
 * from the first and last name.
 * 
 * @example
 * ```tsx
 * // Avatar with image
 * <Avatar src="/user.jpg" alt="John Doe" name="John Doe" />
 * 
 * // Avatar with initials fallback
 * <Avatar name="Jane Smith" size="lg" />
 * 
 * // Small avatar
 * <Avatar name="Bob" size="sm" />
 * ```
 * 
 * @component
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const sizeStyles = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    };

    const getInitials = (name?: string): string => {
      if (!name) return '?';
      
      const parts = name.trim().split(' ');
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
      }
      
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const baseStyles = 'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-muted text-muted-foreground font-medium select-none';

    const shouldShowImage = src && !imageError;

    return (
      <div
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], className)}
        {...props}
      >
        {shouldShowImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
