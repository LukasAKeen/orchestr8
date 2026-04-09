"use client";

import { useEffect } from "react";
import { useBoardStore } from "@/stores/board-store";
import { BoardList } from "@/components/features/boards/BoardList";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { LayoutGrid } from "lucide-react";

export default function BoardsPage() {
  const { boards, isLoading, error, fetchBoards } = useBoardStore();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Boards</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {isLoading ? (
        <LoadingState rows={6} type="cards" />
      ) : boards.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No boards found"
          description="Connect your Monday.com account and boards will appear here."
        />
      ) : (
        <BoardList />
      )}
    </div>
  );
}
