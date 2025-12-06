import { useState } from 'react';
import { Button } from '../atoms/Button';
import { StatusBadge } from '../molecules/StatusBadge';
import { PriorityBadge } from '../molecules/PriorityBadge';
import { Edit2, Check, X, AlertCircle } from 'lucide-react';
import { z } from 'zod';

interface TicketDetailHeaderProps {
  title: string;
  status: string;
  priority: string;
  onTitleChange?: (newTitle: string) => void;
  onStatusChange?: (newStatus: string) => void;
  onResolve?: () => void;
  onClose?: () => void;
}

const titleSchema = z.string()
  .min(1, 'Title is required')
  .min(5, 'Title must be at least 5 characters')
  .max(200, 'Title must not exceed 200 characters');

export const TicketDetailHeader = ({
  title,
  status,
  priority,
  onTitleChange,
  onStatusChange,
  onResolve,
  onClose,
}: TicketDetailHeaderProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [titleError, setTitleError] = useState<string | undefined>();

  const handleSaveTitle = () => {
    // Validate title
    const result = titleSchema.safeParse(editedTitle.trim());
    
    if (!result.success) {
      setTitleError(result.error.issues[0].message);
      return;
    }

    if (onTitleChange) {
      onTitleChange(editedTitle.trim());
    }
    setTitleError(undefined);
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setTitleError(undefined);
    setIsEditingTitle(false);
  };

  const handleTitleChange = (newTitle: string) => {
    setEditedTitle(newTitle);
    // Clear error when user starts typing
    if (titleError) {
      setTitleError(undefined);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 space-y-4">
      {/* Title with edit capability */}
      <div className="flex items-start gap-2 sm:gap-3">
        {isEditingTitle ? (
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`flex-1 text-lg sm:text-2xl font-bold bg-muted border rounded px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
                  titleError
                    ? 'border-error focus:ring-error'
                    : 'border-border focus:ring-accent'
                }`}
                autoFocus
                maxLength={200}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                aria-invalid={!!titleError}
                aria-describedby={titleError ? 'title-error' : undefined}
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Check className="w-4 h-4" />}
                  onClick={handleSaveTitle}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X className="w-4 h-4" />}
                  onClick={handleCancelEdit}
                />
              </div>
            </div>
            {titleError && (
              <div
                id="title-error"
                className="flex items-start gap-2 text-sm text-error"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{titleError}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-start sm:items-center gap-2 sm:gap-3">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground break-words">{title}</h1>
            {onTitleChange && (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                aria-label="Edit title"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status, Priority, and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status as any} size="md" />
          <PriorityBadge priority={priority} size="md" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {status !== 'resolved' && onResolve && (
            <Button variant="primary" size="sm" onClick={onResolve}>
              Resolve
            </Button>
          )}
          {status !== 'closed' && onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
          {onStatusChange && (
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};
