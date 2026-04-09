"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/stores/board-store";
import { BoardView } from "@/components/features/boards/BoardView";
import { AISuggestionsPanel } from "@/components/features/boards/AISuggestionsPanel";
import { LoadingState } from "@/components/shared/LoadingState";

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.boardId as string;

  const { boards, items, isLoading, error, fetchItems, selectBoard, fetchBoards } =
    useBoardStore();

  useEffect(() => {
    if (!boardId) return;
    selectBoard(boardId);

    // Ensure boards are loaded (for column definitions)
    if (boards.length === 0) {
      fetchBoards();
    }

    fetchItems(boardId);
  }, [boardId, selectBoard, fetchItems, fetchBoards, boards.length]);

  const currentBoard = boards.find((b) => b.id === boardId);

  if (isLoading && items.length === 0) {
    return (
      <div className="space-y-6">
        <LoadingState rows={1} type="list" />
        <LoadingState rows={6} type="list" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/boards")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {currentBoard?.name ?? `Board ${boardId}`}
        </h1>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {currentBoard ? (
            <BoardView board={currentBoard} />
          ) : (
            <LoadingState rows={4} type="list" />
          )}
        </div>
        <div>
          <AISuggestionsPanel />
        </div>
      </div>
    </div>
  );
}
