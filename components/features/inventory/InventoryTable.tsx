"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StockLevelBar } from "@/components/features/inventory/StockLevelBar";
import { useInventoryStore } from "@/stores/inventory-store";
import { cn } from "@/lib/utils";

export function InventoryTable() {
  const { items } = useInventoryStore();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Reorder Threshold</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No inventory items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const isLow = item.quantity <= item.reorderThreshold;
              return (
                <TableRow
                  key={item.id}
                  className={cn(
                    isLow &&
                      "bg-red-50/50 dark:bg-red-900/5 hover:bg-red-50 dark:hover:bg-red-900/10"
                  )}
                >
                  <TableCell className="font-mono text-xs">
                    {item.sku}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StockLevelBar
                      quantity={item.quantity}
                      reorderThreshold={item.reorderThreshold}
                    />
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {item.reorderThreshold}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
