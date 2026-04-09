import { create } from "zustand";
import type { DashboardStats, ActivityItem, Alert } from "@/types/dashboard";

interface DashboardState {
  stats: DashboardStats | null;
  recentActivity: ActivityItem[];
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set) => ({
    stats: null,
    recentActivity: [],
    alerts: [],
    isLoading: false,
    error: null,

    fetchDashboardData: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) {
          throw new Error(
            `Failed to fetch dashboard data: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        set({
          stats: data.stats ?? null,
          recentActivity: data.recentActivity ?? [],
          alerts: data.alerts ?? [],
          isLoading: false,
        });
      } catch (err) {
        set({
          error:
            err instanceof Error ? err.message : "An unexpected error occurred",
          isLoading: false,
        });
      }
    },
  })
);
