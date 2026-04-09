"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { AITriagePanel } from "@/components/features/tickets/AITriagePanel";
import { AIDraftReply } from "@/components/features/tickets/AIDraftReply";
import {
  type FreshdeskTicket,
  type FreshdeskConversation,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
} from "@/types/freshdesk";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<FreshdeskTicket | null>(null);
  const [conversations, setConversations] = useState<FreshdeskConversation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [ticketRes, convRes] = await Promise.all([
          fetch(`/api/freshdesk/tickets/${ticketId}`),
          fetch(`/api/freshdesk/tickets/${ticketId}/conversations`),
        ]);

        if (!ticketRes.ok) {
          throw new Error(
            `Failed to fetch ticket: ${ticketRes.status} ${ticketRes.statusText}`
          );
        }

        const ticketData: FreshdeskTicket = await ticketRes.json();
        setTicket(ticketData);

        if (convRes.ok) {
          const convData: FreshdeskConversation[] = await convRes.json();
          setConversations(convData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load ticket details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState rows={1} type="list" />
        <LoadingState rows={4} type="list" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/tickets")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Tickets
        </Button>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              {error ?? "Ticket not found."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/tickets")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="text-lg">{ticket.subject}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <StatusBadge status={TICKET_STATUS_LABELS[ticket.status]} />
                <StatusBadge status={TICKET_PRIORITY_LABELS[ticket.priority]} />
                {ticket.tags.map((tag) => (
                  <StatusBadge key={tag} status={tag} />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  Requester #{ticket.requester_id}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Created {formatDate(ticket.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Updated {formatDate(ticket.updated_at)}
                </span>
              </div>
              <Separator />
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: ticket.description }}
              />
            </CardContent>
          </Card>

          {/* Conversation Thread */}
          <Card className="gap-0">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm">
                Conversation ({conversations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[500px]">
                {conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4">
                    No conversation entries yet.
                  </p>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                conv.incoming ? "bg-blue-500" : "bg-green-500"
                              }`}
                            />
                            <span className="text-xs font-medium">
                              {conv.incoming ? "Customer" : "Agent"} (User #
                              {conv.user_id})
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(conv.created_at)}
                          </span>
                        </div>
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-sm"
                          dangerouslySetInnerHTML={{ __html: conv.body }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar - AI panels */}
        <div className="space-y-6">
          <AITriagePanel ticket={ticket} />
          <AIDraftReply
            ticketId={ticket.id}
            ticketSubject={ticket.subject}
            ticketDescription={ticket.description_text}
          />
        </div>
      </div>
    </div>
  );
}
