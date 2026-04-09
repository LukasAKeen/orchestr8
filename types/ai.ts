// ---------------------------------------------------------------------------
// AI Response Types
// ---------------------------------------------------------------------------

/** Result of AI ticket triage – categorisation + priority assignment. */
export interface TriageResult {
  category: string;
  priority: 1 | 2 | 3 | 4;
  suggestedAgentId: number | null;
  reasoning: string;
  tags: string[];
}

/** AI-generated draft reply to a support ticket. */
export interface DraftReply {
  content: string;
  tone: string;
  confidence: number;
}

/** A single suggested change to a Monday.com board item. */
export interface BoardSuggestion {
  itemId: string;
  action: "update_status" | "create_task" | "add_note";
  newValue: string;
  reasoning: string;
}

/** A single inventory reorder suggestion produced by AI. */
export interface ReorderSuggestion {
  itemId: string;
  sku: string;
  currentStock: number;
  suggestedReorderQty: number;
  urgency: "low" | "medium" | "high" | "critical";
  reasoning: string;
}
