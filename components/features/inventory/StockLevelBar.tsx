"use client";

import { cn } from "@/lib/utils";

interface StockLevelBarProps {
  quantity: number;
  reorderThreshold: number;
  className?: string;
}

export function StockLevelBar({
  quantity,
  reorderThreshold,
  className,
}: StockLevelBarProps) {
  const visualMax = reorderThreshold * 2;
  const percentage = Math.min((quantity / visualMax) * 100, 100);

  let barColor: string;
  if (quantity <= reorderThreshold) {
    barColor = "bg-red-500";
  } else if (quantity <= reorderThreshold * 2) {
    barColor = "bg-yellow-500";
  } else {
    barColor = "bg-green-500";
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {quantity}
      </span>
    </div>
  );
}
