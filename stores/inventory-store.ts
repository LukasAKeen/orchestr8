import { create } from "zustand";
import type { InventoryItem } from "@/types/monday";

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
}

interface InventoryActions {
  fetchInventory: () => Promise<void>;
  getAlerts: () => InventoryItem[];
}

export const useInventoryStore = create<InventoryState & InventoryActions>(
  (set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchInventory: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch("/api/monday/inventory");
        if (!res.ok) {
          throw new Error(
            `Failed to fetch inventory: ${res.status} ${res.statusText}`
          );
        }

        const items: InventoryItem[] = await res.json();
        set({ items, isLoading: false });
      } catch (err) {
        set({
          error:
            err instanceof Error ? err.message : "An unexpected error occurred",
          isLoading: false,
        });
      }
    },

    getAlerts: () => {
      const { items } = get();
      return items.filter((item) => item.quantity <= item.reorderThreshold);
    },
  })
);
