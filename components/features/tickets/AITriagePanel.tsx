"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AISuggestionCard } from "@/components/shared/AISuggestionCard";
import {
  TICKET_PRIORITY_LABELS,
  TicketPriority,
  type FreshdeskTicket,
} from "@/types/freshdesk";
import type { TriageResult } from "@/types/ai";

interface AITriagePanelProps {
  ticket: FreshdeskTicket;
}

export function AITriagePanel({ ticket }: AITriagePanelProps) {
  const [result, setResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTriage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: ticket.subject,
          description: ticket.description_text,
        }),
      });
      if (!res.ok) {
        throw new Error(`Triage failed: ${res.status} ${res.statusText}`);
      }
      const data: TriageResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Triage request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <CardTitle className="text-sm">AI Triage</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!result && !error && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriage}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Triage with AI
              </>
            )}
          </Button>
        )}

        {error && (
          <div className="space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={handleTriage}>
              Retry
            </Button>
          </div>
        )}

        {result && (
          <AISuggestionCard
            title="Triage Result"
            description={`Category: ${result.category}`}
            reasoning={result.reasoning}
          >
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={result.category} />
              <StatusBadge
                status={
                  TICKET_PRIORITY_LABELS[result.priority as TicketPriority] ??
                  `P${result.priority}`
                }
              />
              {result.tags.map((tag) => (
                <StatusBadge key={tag} status={tag} />
              ))}
            </div>
          </AISuggestionCard>
        )}
      </CardContent>
    </Card>
  );
}
