"use client";

import { useEffect } from "react";
import { useInventoryStore } from "@/stores/inventory-store";
import { InventoryTable } from "@/components/features/inventory/InventoryTable";
import { ReorderAlertBanner } from "@/components/features/inventory/ReorderAlertBanner";
import { AIReorderSuggestions } from "@/components/features/inventory/AIReorderSuggestions";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Package } from "lucide-react";

export default function InventoryPage() {
  const { items, isLoading, error, fetchInventory, getAlerts } =
    useInventoryStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const alertItems = getAlerts();
  const criticalCount = alertItems.filter((i) => i.quantity === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {isLoading ? (
        <LoadingState rows={6} type="list" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No inventory items"
          description="Connect your Monday.com inventory board to see items here."
        />
      ) : (
        <>
          <ReorderAlertBanner
            alertCount={alertItems.length}
            criticalCount={criticalCount}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <InventoryTable />
            </div>
            <div>
              <AIReorderSuggestions />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
