import { AISuggestion } from '../types';

interface AISuggestionPanelProps {
  suggestion: AISuggestion | null;
  replyText: string;
  onReplyChange: (value: string) => void;
  onApply: () => void;
  onDiscard: () => void;
}

const AISuggestionPanel = ({
  suggestion,
  replyText,
  onReplyChange,
  onApply,
  onDiscard,
}: AISuggestionPanelProps) => {
  if (!suggestion) {
    return (
      <div style={{ marginTop: '16px' }}>
        <p>Ask the AI copilot for a suggestion to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <h4>AI Summary</h4>
        <p>{suggestion.summary}</p>
      </div>
      <div>
        <strong>Suggested Category:</strong> {suggestion.category}
      </div>
      <div>
        <strong>Suggested Priority:</strong> {suggestion.priority}
      </div>
      <div>
        <strong>Suggested Actions:</strong>
        <ul>
          {suggestion.suggested_actions.map((action, index) => (
            <li key={`${action}-${index}`}>{action}</li>
          ))}
        </ul>
      </div>
      <div>
        <label>Suggested Reply</label>
        <textarea rows={6} value={replyText} onChange={(e) => onReplyChange(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="button" onClick={onApply}>
          Apply &amp; Send Reply
        </button>
        <button className="button secondary" onClick={onDiscard}>
          Discard
        </button>
      </div>
    </div>
  );
};

export default AISuggestionPanel;
