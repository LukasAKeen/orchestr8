import { create } from "zustand";
import type { FreshdeskTicket } from "@/types/freshdesk";

interface TicketFilters {
  status: string;
  priority: string;
  search: string;
}

interface TicketState {
  tickets: FreshdeskTicket[];
  selectedTicketId: number | null;
  filters: TicketFilters;
  isLoading: boolean;
  error: string | null;
}

interface TicketActions {
  fetchTickets: () => Promise<void>;
  selectTicket: (id: number | null) => void;
  setFilter: (key: keyof TicketFilters, value: string) => void;
  clearFilters: () => void;
}

const initialFilters: TicketFilters = {
  status: "",
  priority: "",
  search: "",
};

export const useTicketStore = create<TicketState & TicketActions>((set, get) => ({
  tickets: [],
  selectedTicketId: null,
  filters: initialFilters,
  isLoading: false,
  error: null,

  fetchTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.search) params.set("search", filters.search);

      const qs = params.toString();
      const url = `/api/freshdesk/tickets${qs ? `?${qs}` : ""}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch tickets: ${res.status} ${res.statusText}`);
      }

      const tickets: FreshdeskTicket[] = await res.json();
      set({ tickets, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        isLoading: false,
      });
    }
  },

  selectTicket: (id) => set({ selectedTicketId: id }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  clearFilters: () => set({ filters: initialFilters }),
}));
