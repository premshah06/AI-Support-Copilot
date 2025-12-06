import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface DialogProps {
  isOpen?: boolean; // Support both 'open' and 'isOpen' for compatibility
  open?: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  open,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}) => {
  const dialogOpen = isOpen ?? open ?? false;
  const focusTrapRef = useFocusTrap<HTMLDivElement>(dialogOpen);
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialogOpen) {
        onClose();
      }
    };

    if (dialogOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [dialogOpen, onClose]);

  return (
    <AnimatePresence>
      {dialogOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={focusTrapRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full max-w-lg',
                'bg-white dark:bg-secondary',
                'rounded-lg shadow-xl',
                'max-h-[90vh] overflow-y-auto',
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'dialog-title' : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
                  {title && (
                    <h2
                      id="dialog-title"
                      className="text-xl font-semibold text-foreground"
                    >
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className={cn(
                        'p-2 rounded-lg',
                        'text-muted-foreground hover:text-foreground',
                        'hover:bg-muted',
                        'transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-accent',
                        !title && 'ml-auto'
                      )}
                      aria-label="Close dialog"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3',
        'pt-4 border-t border-border',
        className
      )}
    >
      {children}
    </div>
  );
};
