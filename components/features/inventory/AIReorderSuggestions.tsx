"use client";

import { useState } from "react";
import { Sparkles, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AISuggestionCard } from "@/components/shared/AISuggestionCard";
import { useInventoryStore } from "@/stores/inventory-store";
import type { ReorderSuggestion } from "@/types/ai";

export function AIReorderSuggestions() {
  const { items } = useInventoryStore();
  const [suggestions, setSuggestions] = useState<ReorderSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/reorder-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            reorderThreshold: item.reorderThreshold,
            category: item.category,
          })),
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`);
      }
      const data: ReorderSuggestion[] = await res.json();
      setSuggestions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get reorder suggestions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const itemNameMap = new Map(items.map((i) => [i.id, i.name]));

  return (
    <Card className="gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <CardTitle className="text-sm">AI Reorder Suggestions</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFetch}
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Get Suggestions
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && <p className="text-sm text-destructive">{error}</p>}

        {suggestions.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">
            Click &quot;Get Suggestions&quot; to receive AI-powered reorder
            recommendations.
          </p>
        )}

        {suggestions.map((suggestion) => (
          <AISuggestionCard
            key={suggestion.itemId}
            title={itemNameMap.get(suggestion.itemId) ?? suggestion.sku}
            description={`Reorder ${suggestion.suggestedReorderQty} units`}
            reasoning={suggestion.reasoning}
          >
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={suggestion.urgency} />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" />
                Current: {suggestion.currentStock} | Order:{" "}
                {suggestion.suggestedReorderQty}
              </span>
            </div>
          </AISuggestionCard>
        ))}
      </CardContent>
    </Card>
  );
}
