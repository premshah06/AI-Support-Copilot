import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Send, AlertCircle } from 'lucide-react';
import { replySchema } from '@/lib/validation';

interface ReplyEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
  placeholder?: string;
}

export const ReplyEditor = ({
  value,
  onChange,
  onSend,
  loading = false,
  placeholder = 'Type your reply...',
}: ReplyEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();
  const characterCount = value.length;
  const maxCharacters = 5000;
  const isOverLimit = characterCount > maxCharacters;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim() && !loading && !isOverLimit) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    // Validate before sending
    const result = replySchema.safeParse({ reply_text: value });
    
    if (!result.success) {
      const error = result.error.issues[0];
      setValidationError(error.message);
      return;
    }

    setValidationError(undefined);
    onSend();
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(undefined);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-4 sm:p-6">
        <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2">
          Reply
        </label>
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={6}
          className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 resize-none transition-colors ${
            validationError || isOverLimit
              ? 'border-error focus:ring-error'
              : isFocused
              ? 'border-accent focus:ring-accent'
              : 'border-border'
          }`}
          aria-invalid={!!validationError}
          aria-describedby={validationError ? 'reply-error' : undefined}
        />
        
        {/* Validation error */}
        {validationError && (
          <div
            id="reply-error"
            className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 mt-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}
        
        {/* Character count and hint */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            Press Ctrl+Enter to send
          </span>
          <span
            className={`text-xs font-medium ${
              isOverLimit
                ? 'text-error'
                : characterCount > maxCharacters * 0.9
                ? 'text-warning'
                : 'text-muted-foreground'
            }`}
          >
            {characterCount.toLocaleString()} / {maxCharacters.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action bar */}
      <div className="bg-muted px-4 py-3 flex items-center justify-end gap-2 border-t border-border">
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={!value.trim() || loading || isOverLimit}
          loading={loading}
          icon={<Send className="w-4 h-4" />}
        >
          {loading ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </div>
  );
};
