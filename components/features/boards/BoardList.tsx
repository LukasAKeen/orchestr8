"use client";

import { useRouter } from "next/navigation";
import { LayoutGrid, Columns } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useBoardStore } from "@/stores/board-store";
import type { MondayBoard } from "@/types/monday";

function BoardCard({ board }: { board: MondayBoard }) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md gap-0"
      onClick={() => router.push(`/boards/${board.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug">{board.name}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Columns className="h-3.5 w-3.5" />
              <span>
                {board.columns.length} column
                {board.columns.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BoardList() {
  const { boards } = useBoardStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}
