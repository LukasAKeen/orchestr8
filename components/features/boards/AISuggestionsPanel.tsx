"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AISuggestionCard } from "@/components/shared/AISuggestionCard";
import { useBoardStore } from "@/stores/board-store";
import type { BoardSuggestion } from "@/types/ai";

export function AISuggestionsPanel() {
  const { items, selectedBoardId, updateItemStatus } = useBoardStore();
  const [suggestions, setSuggestions] = useState<BoardSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleFetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setDismissed(new Set());
    try {
      const res = await fetch("/api/ai/board-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: selectedBoardId,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            group: item.group?.title,
            columnValues: item.column_values.map((cv) => ({
              id: cv.id,
              text: cv.text,
              type: cv.type,
            })),
          })),
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to get suggestions: ${res.status}`);
      }
      const data: BoardSuggestion[] = await res.json();
      setSuggestions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch suggestions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (suggestion: BoardSuggestion) => {
    if (!selectedBoardId || suggestion.action !== "update_status") return;
    // For update_status, apply the change
    await updateItemStatus(
      selectedBoardId,
      suggestion.itemId,
      "status",
      suggestion.newValue
    );
    setDismissed((prev) => new Set(prev).add(suggestion.itemId));
  };

  const handleReject = (suggestion: BoardSuggestion) => {
    setDismissed((prev) => new Set(prev).add(suggestion.itemId));
  };

  const visibleSuggestions = suggestions.filter(
    (s) => !dismissed.has(s.itemId)
  );

  const itemNameMap = new Map(items.map((i) => [i.id, i.name]));

  return (
    <Card className="gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <CardTitle className="text-sm">AI Suggestions</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFetchSuggestions}
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
                AI Suggest
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && <p className="text-sm text-destructive">{error}</p>}

        {visibleSuggestions.length === 0 && suggestions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            All suggestions have been addressed.
          </p>
        )}

        {visibleSuggestions.length === 0 && suggestions.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">
            Click &quot;AI Suggest&quot; to get board optimization suggestions.
          </p>
        )}

        {visibleSuggestions.map((suggestion) => (
          <AISuggestionCard
            key={suggestion.itemId}
            title={`${suggestion.action.replace(/_/g, " ")} — ${
              itemNameMap.get(suggestion.itemId) ?? suggestion.itemId
            }`}
            description={`Suggested: ${suggestion.newValue}`}
            reasoning={suggestion.reasoning}
            onAccept={() => handleAccept(suggestion)}
            onReject={() => handleReject(suggestion)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
