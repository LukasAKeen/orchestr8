import { FreshdeskClient } from "@/lib/freshdesk";
import { getBoardItems, parseInventoryItem } from "@/lib/monday";
import { TicketStatus } from "@/types/freshdesk";
import type { DashboardStats } from "@/types/dashboard";

export async function GET() {
  try {
    const domain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;
    if (!domain || !apiKey) {
      return Response.json(
        { error: "Missing FRESHDESK_DOMAIN or FRESHDESK_API_KEY environment variables." },
        { status: 500 },
      );
    }

    if (!process.env.MONDAY_API_TOKEN) {
      return Response.json(
        { error: "Missing MONDAY_API_TOKEN environment variable." },
        { status: 500 },
      );
    }

    const inventoryBoardId = process.env.MONDAY_INVENTORY_BOARD_ID;
    if (!inventoryBoardId) {
      return Response.json(
        { error: "Missing MONDAY_INVENTORY_BOARD_ID environment variable." },
        { status: 500 },
      );
    }

    const client = new FreshdeskClient(domain, apiKey);

    // Fetch tickets and inventory in parallel
    const [tickets, inventoryPage] = await Promise.all([
      client.listTickets(),
      getBoardItems(inventoryBoardId),
    ]);

    // Count tickets by status
    const openTickets = tickets.filter(
      (t) => t.status === TicketStatus.Open,
    ).length;
    const pendingTickets = tickets.filter(
      (t) => t.status === TicketStatus.Pending,
    ).length;

    // Count tickets resolved today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const resolvedToday = tickets.filter(
      (t) =>
        t.status === TicketStatus.Resolved &&
        new Date(t.updated_at) >= todayStart,
    ).length;

    // Parse inventory items and count low-stock alerts
    const inventoryItems = inventoryPage.items.map(parseInventoryItem);
    const inventoryAlerts = inventoryItems.filter(
      (item) => item.quantity <= item.reorderThreshold,
    ).length;

    const stats: DashboardStats = {
      openTickets,
      pendingTickets,
      resolvedToday,
      avgResponseTime: "N/A", // Would require additional Freshdesk API data
      inventoryAlerts,
      boardTasksDue: 0, // Would require scanning board items for due dates
    };

    return Response.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
