"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTicketStore } from "@/stores/ticket-store";
import {
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
  type FreshdeskTicket,
} from "@/types/freshdesk";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TicketCard({ ticket }: { ticket: FreshdeskTicket }) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md gap-0"
      onClick={() => router.push(`/tickets/${ticket.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug line-clamp-2">
              {ticket.subject}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Requester #{ticket.requester_id}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={TICKET_STATUS_LABELS[ticket.status]} />
            <StatusBadge status={TICKET_PRIORITY_LABELS[ticket.priority]} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Created {formatDate(ticket.created_at)}
        </p>
      </CardContent>
    </Card>
  );
}

export function TicketList() {
  const { tickets } = useTicketStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
