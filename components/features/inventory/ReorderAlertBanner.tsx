"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReorderAlertBannerProps {
  alertCount: number;
  criticalCount?: number;
}

export function ReorderAlertBanner({
  alertCount,
  criticalCount = 0,
}: ReorderAlertBannerProps) {
  if (alertCount === 0) return null;

  const isCritical = criticalCount > 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3",
        isCritical
          ? "border-red-300 bg-red-50 dark:border-red-800/50 dark:bg-red-900/10"
          : "border-yellow-300 bg-yellow-50 dark:border-yellow-800/50 dark:bg-yellow-900/10"
      )}
    >
      <AlertTriangle
        className={cn(
          "h-5 w-5 shrink-0",
          isCritical
            ? "text-red-600 dark:text-red-400"
            : "text-yellow-600 dark:text-yellow-400"
        )}
      />
      <div>
        <p
          className={cn(
            "text-sm font-medium",
            isCritical
              ? "text-red-800 dark:text-red-300"
              : "text-yellow-800 dark:text-yellow-300"
          )}
        >
          {alertCount} item{alertCount !== 1 ? "s" : ""} at or below reorder
          threshold
        </p>
        {criticalCount > 0 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
            {criticalCount} item{criticalCount !== 1 ? "s" : ""} critically low
            (zero stock)
          </p>
        )}
      </div>
    </div>
  );
}
