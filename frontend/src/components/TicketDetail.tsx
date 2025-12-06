import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { getTicket, aiAssistTicket, sendTicketReply } from '../api/tickets';
import { Ticket, AISuggestion } from '../types';
import { DetailLayout } from './layouts/DetailLayout';
import { Button } from './atoms/Button';
import { Spinner } from './atoms/Spinner';
import {
  TicketDetailHeader,
  CustomerInfoCard,
  ActionTimeline,
  AISuggestionPanel,
  ReplyEditor,
} from './organisms';
import { useToast } from '../contexts/ToastContext';
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate';
import { getUserFriendlyErrorMessage } from '../lib/errorHandling';

interface TicketDetailProps {
  ticketId: number;
}

const TicketDetail = ({ ticketId }: TicketDetailProps) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTicket(ticketId);
      setTicket(data);
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      setError(errorObj.message);
      showToast(errorObj.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAISuggestion = async () => {
    try {
      setAiLoading(true);
      setAiError(null);
      const suggestion = await aiAssistTicket(ticketId);
      setAiSuggestion(suggestion);
      showToast('AI suggestions generated successfully', 'success');
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      setAiError(errorObj.message);
      showToast(errorObj.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplySuggestion = async (editedReply: string, selectedActions: string[]) => {
    if (!editedReply.trim()) {
      showToast('Reply text is required', 'error');
      return;
    }

    try {
      setSendingReply(true);
      await sendTicketReply(ticketId, {
        reply_text: editedReply,
        status_update: ticket?.status,
      });
      
      showToast('Reply sent successfully', 'success');
      setReplyText('');
      setAiSuggestion(null);
      
      // Reload ticket to get updated actions
      await loadTicket();
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      showToast(errorObj.message, 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      showToast('Reply text is required', 'error');
      return;
    }

    try {
      setSendingReply(true);
      await sendTicketReply(ticketId, {
        reply_text: replyText,
        status_update: ticket?.status,
      });
      
      showToast('Reply sent successfully', 'success');
      setReplyText('');
      
      // Reload ticket to get updated actions
      await loadTicket();
    } catch (err) {
      const errorObj = getUserFriendlyErrorMessage(err);
      showToast(errorObj.message, 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    // Optimistic update
    if (ticket) {
      setTicket({ ...ticket, title: newTitle });
      showToast('Title updated', 'success');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    // Optimistic update
    if (ticket) {
      setTicket({ ...ticket, status: newStatus });
      showToast(`Status changed to ${newStatus}`, 'success');
    }
  };

  const handleResolve = () => {
    handleStatusChange('resolved');
  };

  const handleClose = () => {
    handleStatusChange('closed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="bg-card rounded-lg shadow-md p-8 text-center border border-border">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {error ? 'Failed to Load Ticket' : 'Ticket Not Found'}
        </h3>
        <p className="text-muted-foreground mb-6">{error || 'The ticket you are looking for does not exist or has been deleted.'}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/tickets')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Tickets
          </Button>
          {error && (
            <Button variant="primary" onClick={loadTicket} icon={<RefreshCw className="w-4 h-4" />}>
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('/tickets')} icon={<ArrowLeft className="w-4 h-4" />}>
        <span className="hidden sm:inline">Back to Tickets</span>
        <span className="sm:hidden">Back</span>
      </Button>

      <DetailLayout
        leftColumn={
          <>
            {/* Ticket Header */}
            <TicketDetailHeader
              title={ticket.title}
              status={ticket.status}
              priority={ticket.priority}
              onTitleChange={handleTitleChange}
              onStatusChange={handleStatusChange}
              onResolve={handleResolve}
              onClose={handleClose}
            />

            {/* Ticket Description */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">Description</h3>
              <p className="text-xs sm:text-sm text-foreground whitespace-pre-wrap break-words">{ticket.description}</p>
            </div>

            {/* Customer Info */}
            {ticket.customer && <CustomerInfoCard customer={ticket.customer} />}

            {/* Action Timeline */}
            {ticket.actions && <ActionTimeline actions={ticket.actions} />}

            {/* Reply Editor */}
            <ReplyEditor
              value={replyText}
              onChange={setReplyText}
              onSend={handleSendReply}
              loading={sendingReply}
            />
          </>
        }
        rightColumn={
          <>
            {/* AI Suggestion Panel */}
            <AISuggestionPanel
              suggestion={aiSuggestion}
              loading={aiLoading}
              error={aiError}
              onGenerate={handleGenerateAISuggestion}
              onApply={handleApplySuggestion}
            />
          </>
        }
      />
    </div>
  );
};

export default TicketDetail;
