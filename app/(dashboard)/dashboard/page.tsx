"use client";

import { useEffect } from "react";
import { Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import {
  MessageSquare,
  RefreshCw,
  Package,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { MetricCard } from "@/components/shared/MetricCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ActivityItem } from "@/types/dashboard";

const ACTIVITY_ICONS: Record<ActivityItem["type"], React.ElementType> = {
  ticket_created: MessageSquare,
  ticket_resolved: CheckCircle,
  item_updated: LayoutGrid,
  inventory_alert: Package,
  ai_triage: Sparkles,
};

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function DashboardPage() {
  const { stats, recentActivity, alerts, isLoading, error, fetchDashboardData } =
    useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LoadingState rows={4} type="cards" />
        <LoadingState rows={3} type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Failed to load dashboard data: {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Open Tickets"
          value={stats?.openTickets ?? 0}
          icon={Ticket}
          subtitle="Requiring attention"
        />
        <MetricCard
          title="Pending"
          value={stats?.pendingTickets ?? 0}
          icon={Clock}
          subtitle="Awaiting response"
        />
        <MetricCard
          title="Resolved Today"
          value={stats?.resolvedToday ?? 0}
          icon={CheckCircle}
          subtitle="Closed this session"
        />
        <MetricCard
          title="Inventory Alerts"
          value={stats?.inventoryAlerts ?? 0}
          icon={AlertTriangle}
          subtitle="Items need reorder"
        />
      </div>

      {/* Two-column layout: Recent Activity + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - larger column */}
        <Card className="lg:col-span-2 gap-0">
          <CardHeader className="border-b pb-3">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">
                  No recent activity to display.
                </p>
              ) : (
                <div className="divide-y">
                  {recentActivity.map((activity) => {
                    const Icon = ACTIVITY_ICONS[activity.type] ?? MessageSquare;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-4"
                      >
                        <div className="rounded-full bg-muted p-2 mt-0.5">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {relativeTime(activity.timestamp)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Alerts - smaller column */}
        <Card className="gap-0">
          <CardHeader className="border-b pb-3">
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">
                  No active alerts.
                </p>
              ) : (
                <div className="divide-y">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={alert.severity} />
                        <span className="text-sm font-medium">
                          {alert.title}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
