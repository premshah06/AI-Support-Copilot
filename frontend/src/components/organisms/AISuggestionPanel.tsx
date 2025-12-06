import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Spinner } from '../atoms/Spinner';
import { Badge } from '../atoms/Badge';
import { Checkbox } from '../atoms/Checkbox';
import { Bot, Sparkles, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { AISuggestion } from '../../types';

interface AISuggestionPanelProps {
  suggestion: AISuggestion | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
  onApply: (editedReply: string, selectedActions: string[]) => void;
}

export const AISuggestionPanel = ({
  suggestion,
  loading,
  error,
  onGenerate,
  onApply,
}: AISuggestionPanelProps) => {
  const [editedReply, setEditedReply] = useState('');
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  // Update edited reply when suggestion changes
  useState(() => {
    if (suggestion) {
      setEditedReply(suggestion.suggested_reply);
      setSelectedActions(new Set(suggestion.suggested_actions));
    }
  });

  const handleActionToggle = (action: string) => {
    const newSelected = new Set(selectedActions);
    if (newSelected.has(action)) {
      newSelected.delete(action);
    } else {
      newSelected.add(action);
    }
    setSelectedActions(newSelected);
  };

  const handleApply = () => {
    onApply(editedReply, Array.from(selectedActions));
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Header with AI branding */}
      <div className="bg-accent/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 border-b border-border">
        <div className="bg-accent/20 rounded-lg p-2">
          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            AI Assistant
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">Intelligent suggestions powered by AI</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* No suggestion state */}
        {!suggestion && !loading && !error && (
          <div className="text-center py-6 sm:py-8">
            <div className="bg-accent/10 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-4">
              Get AI-powered suggestions for this ticket
            </p>
            <Button
              variant="primary"
              onClick={onGenerate}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Ask AI to Help
            </Button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-6 sm:py-8">
            <Spinner size="lg" className="mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              AI is analyzing the ticket...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Unable to generate suggestions
                </p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerate}
                  icon={<RefreshCw className="w-4 h-4" />}
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Suggestion content */}
        {suggestion && !loading && (
          <>
            {/* Summary */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                Summary
              </h4>
              <p className="text-xs sm:text-sm text-foreground bg-muted rounded-lg p-3 border border-border">
                {suggestion.summary}
              </p>
            </div>

            {/* Category and Priority */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                  Suggested Category
                </h4>
                <Badge variant="info" size="md">
                  {suggestion.category}
                </Badge>
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                  Suggested Priority
                </h4>
                <Badge 
                  variant={
                    suggestion.priority === 'critical' ? 'error' :
                    suggestion.priority === 'high' ? 'warning' :
                    'info'
                  } 
                  size="md"
                >
                  {suggestion.priority}
                </Badge>
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                Suggested Actions
              </h4>
              <div className="space-y-2 bg-muted rounded-lg p-3 border border-border">
                {suggestion.suggested_actions.map((action, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-2 cursor-pointer hover:bg-card p-2 rounded transition-colors"
                  >
                    <Checkbox
                      checked={selectedActions.has(action)}
                      onChange={() => handleActionToggle(action)}
                    />
                    <span className="text-xs sm:text-sm text-foreground flex-1">
                      {action}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Suggested Reply */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                Suggested Reply
              </h4>
              <textarea
                value={editedReply}
                onChange={(e) => setEditedReply(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="Edit the suggested reply..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editedReply.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="primary"
                onClick={handleApply}
                icon={<Send className="w-4 h-4" />}
                disabled={!editedReply.trim()}
                fullWidth
              >
                Apply & Send
              </Button>
              <Button
                variant="outline"
                onClick={onGenerate}
                icon={<RefreshCw className="w-4 h-4" />}
                className="sm:w-auto"
              >
                Regenerate
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
