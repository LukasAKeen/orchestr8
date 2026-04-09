"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  rows?: number;
  type?: "cards" | "list" | "table";
}

export function LoadingState({ rows = 4, type = "cards" }: LoadingStateProps) {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-lg" />
      ))}
    </div>
  );
}
