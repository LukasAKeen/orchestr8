// ---------------------------------------------------------------------------
// Freshdesk API v2 – Type Definitions
// ---------------------------------------------------------------------------

/** Numeric status codes returned by the Freshdesk API. */
export enum TicketStatus {
  Open = 2,
  Pending = 3,
  Resolved = 4,
  Closed = 5,
}

/** Numeric priority codes returned by the Freshdesk API. */
export enum TicketPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}

/** Human-readable labels keyed by `TicketStatus`. */
export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.Open]: "Open",
  [TicketStatus.Pending]: "Pending",
  [TicketStatus.Resolved]: "Resolved",
  [TicketStatus.Closed]: "Closed",
};

/** Human-readable labels keyed by `TicketPriority`. */
export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  [TicketPriority.Low]: "Low",
  [TicketPriority.Medium]: "Medium",
  [TicketPriority.High]: "High",
  [TicketPriority.Urgent]: "Urgent",
};

/** A support ticket as returned by GET /api/v2/tickets/:id */
export interface FreshdeskTicket {
  id: number;
  subject: string;
  description: string;
  description_text: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: string | null;
  tags: string[];
  source: number;
  requester_id: number;
  responder_id: number | null;
  created_at: string;
  updated_at: string;
  due_by: string;
  custom_fields: Record<string, unknown>;
}

/** A single conversation entry (reply / note) on a ticket. */
export interface FreshdeskConversation {
  id: number;
  body: string;
  body_text: string;
  incoming: boolean;
  user_id: number;
  created_at: string;
}

/** A Freshdesk contact / requester. */
export interface FreshdeskContact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}
