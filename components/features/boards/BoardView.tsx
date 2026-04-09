"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useBoardStore } from "@/stores/board-store";
import type { MondayItem, MondayBoard } from "@/types/monday";

const STATUS_OPTIONS = [
  "Working on it",
  "Done",
  "Stuck",
  "Not Started",
  "Pending Review",
];

interface BoardViewProps {
  board: MondayBoard;
}

export function BoardView({ board }: BoardViewProps) {
  const { items, updateItemStatus } = useBoardStore();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Find the status column from board columns
  const statusColumn = board.columns.find(
    (col) => col.type === "status" || col.title.toLowerCase().includes("status")
  );

  const handleStatusChange = async (item: MondayItem, newStatus: string) => {
    if (!statusColumn) return;
    setUpdatingItemId(item.id);
    try {
      await updateItemStatus(board.id, item.id, statusColumn.id, newStatus);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const getColumnValue = (item: MondayItem, columnId: string): string => {
    const cv = item.column_values.find((v) => v.id === columnId);
    return cv?.text ?? "";
  };

  // Show non-status columns as extra text columns
  const displayColumns = board.columns.filter(
    (col) => col.id !== statusColumn?.id
  );

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Status</TableHead>
            {displayColumns.slice(0, 3).map((col) => (
              <TableHead key={col.id}>{col.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3 + Math.min(displayColumns.length, 3)}
                className="text-center text-muted-foreground py-8"
              >
                No items in this board.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const currentStatus = statusColumn
                ? getColumnValue(item, statusColumn.id)
                : "";
              const isUpdating = updatingItemId === item.id;

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {item.group?.title ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            className="inline-flex items-center gap-1 focus:outline-none"
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <StatusBadge
                                  status={currentStatus || "Not Started"}
                                />
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              </>
                            )}
                          </button>
                        }
                      />
                      <DropdownMenuContent>
                        {STATUS_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={option}
                            onClick={() => handleStatusChange(item, option)}
                          >
                            {option}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {displayColumns.slice(0, 3).map((col) => (
                    <TableCell key={col.id}>
                      {getColumnValue(item, col.id) || "—"}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
