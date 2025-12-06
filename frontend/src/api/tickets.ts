import { apiClient } from './client';
import { AISuggestion, Ticket, TicketFilters, TicketAction } from '../types';

export const getTickets = async (filters?: TicketFilters): Promise<Ticket[]> => {
  const response = await apiClient.get<Ticket[]>('/tickets', { params: filters });
  return response.data;
};

export const getTicket = async (id: number): Promise<Ticket> => {
  const response = await apiClient.get<Ticket>(`/tickets/${id}`);
  return response.data;
};

export const aiAssistTicket = async (id: number): Promise<AISuggestion> => {
  const response = await apiClient.post<AISuggestion>(`/tickets/${id}/ai-assist`);
  return response.data;
};

export const sendTicketReply = async (
  id: number,
  payload: { reply_text: string; status_update?: string }
): Promise<TicketAction> => {
  const response = await apiClient.post<TicketAction>(`/tickets/${id}/reply`, payload);
  return response.data;
};
