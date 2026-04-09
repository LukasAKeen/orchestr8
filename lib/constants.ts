// ---------------------------------------------------------------------------
// Application Constants
// ---------------------------------------------------------------------------

/** Predefined categories used for ticket triage. */
export const TICKET_CATEGORIES: string[] = [
  "Billing",
  "Technical",
  "Feature Request",
  "Account",
  "Inventory",
  "Shipping",
  "General",
];

/** Tailwind color classes mapped to inventory urgency levels. */
export const INVENTORY_URGENCY_COLORS: Record<string, string> = {
  low: "text-green-600 bg-green-50 border-green-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  high: "text-orange-600 bg-orange-50 border-orange-200",
  critical: "text-red-600 bg-red-50 border-red-200",
};

/** Sidebar navigation items. `icon` corresponds to a lucide-react icon name. */
export const NAV_ITEMS: { label: string; href: string; icon: string }[] = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Tickets", href: "/tickets", icon: "Ticket" },
  { label: "Tasks Board", href: "/board", icon: "KanbanSquare" },
  { label: "Inventory", href: "/inventory", icon: "Package" },
  { label: "AI Triage", href: "/triage", icon: "BrainCircuit" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
