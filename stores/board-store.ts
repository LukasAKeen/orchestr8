import { create } from "zustand";
import type { MondayBoard, MondayItem } from "@/types/monday";

interface BoardState {
  boards: MondayBoard[];
  selectedBoardId: string | null;
  items: MondayItem[];
  isLoading: boolean;
  error: string | null;
}

interface BoardActions {
  fetchBoards: () => Promise<void>;
  selectBoard: (id: string | null) => void;
  fetchItems: (boardId: string) => Promise<void>;
  updateItemStatus: (
    boardId: string,
    itemId: string,
    columnId: string,
    value: string
  ) => Promise<void>;
}

export const useBoardStore = create<BoardState & BoardActions>((set) => ({
  boards: [],
  selectedBoardId: null,
  items: [],
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/monday/boards");
      if (!res.ok) {
        throw new Error(`Failed to fetch boards: ${res.status} ${res.statusText}`);
      }

      const boards: MondayBoard[] = await res.json();
      set({ boards, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        isLoading: false,
      });
    }
  },

  selectBoard: (id) => set({ selectedBoardId: id, items: [] }),

  fetchItems: async (boardId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/monday/boards/${boardId}/items`);
      if (!res.ok) {
        throw new Error(`Failed to fetch items: ${res.status} ${res.statusText}`);
      }

      const items: MondayItem[] = await res.json();
      set({ items, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        isLoading: false,
      });
    }
  },

  updateItemStatus: async (boardId, itemId, columnId, value) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/monday/boards/${boardId}/items`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, columnId, value }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update item: ${res.status} ${res.statusText}`);
      }

      // Optimistically update the local item
      const updatedItem: MondayItem = await res.json();
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? updatedItem : item
        ),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  },
}));
