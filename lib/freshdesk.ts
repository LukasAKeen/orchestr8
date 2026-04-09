// ---------------------------------------------------------------------------
// Freshdesk REST API v2 Client
// ---------------------------------------------------------------------------

import type {
  FreshdeskTicket,
  FreshdeskConversation,
} from "@/types/freshdesk";

export class FreshdeskApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "FreshdeskApiError";
  }
}

export class FreshdeskClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(domain: string, apiKey: string) {
    this.baseUrl = `https://${domain}.freshdesk.com/api/v2`;

    // Freshdesk uses Basic Auth with the API key as username and "X" as password.
    const encoded = btoa(`${apiKey}:X`);
    this.headers = {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    };
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: { ...this.headers, ...(options.headers as object) },
    });

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }
      throw new FreshdeskApiError(
        `Freshdesk API error ${res.status} on ${options.method ?? "GET"} ${path}`,
        res.status,
        body,
      );
    }

    return res.json() as Promise<T>;
  }

  // -------------------------------------------------------------------------
  // Tickets
  // -------------------------------------------------------------------------

  /**
   * List tickets with optional query parameters.
   * @see https://developers.freshdesk.com/api/#list_all_tickets
   */
  async listTickets(
    params?: Record<string, string | number>,
  ): Promise<FreshdeskTicket[]> {
    const qs = params
      ? `?${new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)]),
        ).toString()}`
      : "";
    return this.request<FreshdeskTicket[]>(`/tickets${qs}`);
  }

  /** Fetch a single ticket by ID. */
  async getTicket(id: number): Promise<FreshdeskTicket> {
    return this.request<FreshdeskTicket>(`/tickets/${id}`);
  }

  /** Update a ticket (status, priority, assignment, etc.). */
  async updateTicket(
    id: number,
    data: Partial<FreshdeskTicket>,
  ): Promise<FreshdeskTicket> {
    return this.request<FreshdeskTicket>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /** Add a public reply to a ticket. */
  async replyToTicket(
    id: number,
    body: string,
  ): Promise<FreshdeskConversation> {
    return this.request<FreshdeskConversation>(`/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  }

  /** List conversation entries (replies + notes) for a ticket. */
  async listConversations(
    ticketId: number,
  ): Promise<FreshdeskConversation[]> {
    return this.request<FreshdeskConversation[]>(
      `/tickets/${ticketId}/conversations`,
    );
  }
}

// ---------------------------------------------------------------------------
// Singleton factory – reads from env vars
// ---------------------------------------------------------------------------

let _client: FreshdeskClient | null = null;

export function getFreshdeskClient(): FreshdeskClient {
  if (!_client) {
    const domain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;
    if (!domain || !apiKey) {
      throw new Error(
        "Missing FRESHDESK_DOMAIN or FRESHDESK_API_KEY environment variables.",
      );
    }
    _client = new FreshdeskClient(domain, apiKey);
  }
  return _client;
}
