import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { aiAssistTicket, getTicket, sendTicketReply } from '../api/tickets';
import { AISuggestion, Ticket } from '../types';
import AISuggestionPanel from './AISuggestionPanel';

interface TicketDetailProps {
  ticketId: number;
}

const TicketDetail = ({ ticketId }: TicketDetailProps) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const statusOptions = useMemo(() => ['open', 'in_progress', 'resolved'], []);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicket(ticketId);
        setTicket(data);
        setStatusUpdate(data.status);
      } catch (err) {
        setError('Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };
    loadTicket();
  }, [ticketId]);

  const handleAiAssist = async () => {
    try {
      setAiLoading(true);
      const suggestion = await aiAssistTicket(ticketId);
      setAiSuggestion(suggestion);
      setReplyText(suggestion.suggested_reply);
    } catch (err) {
      setActionMessage('Unable to fetch AI suggestion');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      setActionMessage('Reply text is required');
      return;
    }
    try {
      await sendTicketReply(ticketId, {
        reply_text: replyText,
        status_update: statusUpdate || undefined,
      });
      setActionMessage('Reply sent successfully');
      setReplyText('');
      setAiSuggestion(null);
      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
    } catch (err) {
      setActionMessage('Failed to send reply');
    }
  };

  if (loading) {
    return <div>Loading ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="card">
        <p>{error ?? 'Ticket not found'}</p>
        <button className="button secondary" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 2 }}>
          <button className="button secondary" onClick={() => navigate('/tickets')}>
            ← Back to Tickets
          </button>
          <h2>{ticket.title}</h2>
          <p>{ticket.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label>Status</label>
              <select
                value={statusUpdate}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  setStatusUpdate(event.target.value)
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Priority</label>
              <p style={{ fontWeight: 600 }}>{ticket.priority}</p>
            </div>
            <div>
              <label>Category</label>
              <p style={{ fontWeight: 600 }}>{ticket.category}</p>
            </div>
            <div>
              <label>Customer</label>
              <p style={{ fontWeight: 600 }}>{ticket.customer?.name ?? 'N/A'}</p>
            </div>
          </div>

          <section style={{ marginTop: '24px' }}>
            <h3>Action History</h3>
            {ticket.actions?.length ? (
              <ul>
                {ticket.actions?.map((action) => (
                  <li key={action.id}>
                    <strong>{action.actor_type}</strong> ({action.action_type}) –{' '}
                    {new Date(action.created_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No actions yet.</p>
            )}
          </section>
        </div>

        <div style={{ flex: 1 }}>
          <button className="button" onClick={handleAiAssist} disabled={aiLoading}>
            {aiLoading ? 'Thinking…' : 'Ask AI to help'}
          </button>

          {actionMessage && (
            <p style={{ marginTop: '12px', color: '#2563eb' }}>{actionMessage}</p>
          )}

          <AISuggestionPanel
            suggestion={aiSuggestion}
            replyText={replyText}
            onReplyChange={setReplyText}
            onApply={handleSendReply}
            onDiscard={() => {
              setAiSuggestion(null);
              setReplyText('');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
