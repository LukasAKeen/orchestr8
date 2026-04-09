// ---------------------------------------------------------------------------
// Dashboard UI Types
// ---------------------------------------------------------------------------

export interface DashboardStats {
  openTickets: number;
  pendingTickets: number;
  resolvedToday: number;
  avgResponseTime: string;
  inventoryAlerts: number;
  boardTasksDue: number;
}

export interface ActivityItem {
  id: string;
  type:
    | "ticket_created"
    | "ticket_resolved"
    | "item_updated"
    | "inventory_alert"
    | "ai_triage";
  title: string;
  description: string;
  timestamp: string;
  source: "freshdesk" | "monday" | "ai";
}

export interface Alert {
  id: string;
  type: "low_stock" | "overdue_ticket" | "stale_task";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  actionUrl: string | null;
}
