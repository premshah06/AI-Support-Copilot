export interface Customer {
  id: number;
  name: string;
  email: string;
  segment: string;
  region: string;
  risk_score: number;
}

export interface TicketAction {
  id: number;
  ticket_id: number;
  actor_type: 'AI' | 'human';
  action_type: 'classification' | 'reply_suggested' | 'reply_sent';
  content: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  actions?: TicketAction[];
}

export interface KBArticle {
  id: number;
  title: string;
  body: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface AISuggestion {
  summary: string;
  category: string;
  priority: string;
  suggested_reply: string;
  suggested_actions: string[];
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
}

export interface FilterState {
  status: string[];
  priority: string[];
  category: string[];
  searchQuery: string;
}
