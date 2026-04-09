"use client";

import { useEffect } from "react";
import { useTicketStore } from "@/stores/ticket-store";
import { TicketList } from "@/components/features/tickets/TicketList";
import { TicketFilters } from "@/components/features/tickets/TicketFilters";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Ticket } from "lucide-react";

export default function TicketsPage() {
  const { tickets, isLoading, error, fetchTickets } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tickets</h1>
      </div>

      <TicketFilters />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {isLoading ? (
        <LoadingState rows={6} type="list" />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No tickets found"
          description="There are no tickets matching your current filters. Try adjusting your search or filter criteria."
        />
      ) : (
        <TicketList />
      )}
    </div>
  );
}
