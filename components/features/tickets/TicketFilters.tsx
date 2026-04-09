"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTicketStore } from "@/stores/ticket-store";

export function TicketFilters() {
  const { filters, setFilter, clearFilters, fetchTickets } = useTicketStore();

  const handleStatusChange = (value: string | null) => {
    setFilter("status", value ?? "");
    // Refetch after setting filter on next tick
    setTimeout(() => fetchTickets(), 0);
  };

  const handlePriorityChange = (value: string | null) => {
    setFilter("priority", value ?? "");
    setTimeout(() => fetchTickets(), 0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter("search", e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchTickets();
    }
  };

  const handleClear = () => {
    clearFilters();
    setTimeout(() => fetchTickets(), 0);
  };

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <Input
        placeholder="Search tickets..."
        value={filters.search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
        className="w-full sm:w-64"
      />

      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          <SelectItem value="2">Open</SelectItem>
          <SelectItem value="3">Pending</SelectItem>
          <SelectItem value="4">Resolved</SelectItem>
          <SelectItem value="5">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Priorities</SelectItem>
          <SelectItem value="1">Low</SelectItem>
          <SelectItem value="2">Medium</SelectItem>
          <SelectItem value="3">High</SelectItem>
          <SelectItem value="4">Urgent</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear} className="h-8">
          <X className="h-3.5 w-3.5 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
