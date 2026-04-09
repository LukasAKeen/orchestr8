// ---------------------------------------------------------------------------
// Zod Validation Schemas for AI Outputs
// ---------------------------------------------------------------------------

import { z } from "zod";

/** Schema for a single triage result produced by AI. */
export const triageResultSchema = z.object({
  category: z.string(),
  priority: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
  suggestedAgentId: z.number().nullable(),
  reasoning: z.string(),
  tags: z.array(z.string()).max(10),
});

/** Schema for a single board suggestion. */
const boardSuggestionItemSchema = z.object({
  itemId: z.string(),
  action: z.enum(["update_status", "create_task", "add_note"]),
  newValue: z.string(),
  reasoning: z.string(),
});

/** Schema for an array of board suggestions returned by AI. */
export const boardSuggestionSchema = z.array(boardSuggestionItemSchema);

/** Schema for a single reorder suggestion. */
const reorderSuggestionItemSchema = z.object({
  itemId: z.string(),
  sku: z.string(),
  currentStock: z.number().int().nonnegative(),
  suggestedReorderQty: z.number().int().positive(),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  reasoning: z.string(),
});

/** Schema for an array of reorder suggestions returned by AI. */
export const reorderSuggestionSchema = z.array(reorderSuggestionItemSchema);

// ---------------------------------------------------------------------------
// Inferred types (useful when you want TS types derived from the schemas)
// ---------------------------------------------------------------------------

export type TriageResultParsed = z.infer<typeof triageResultSchema>;
export type BoardSuggestionParsed = z.infer<typeof boardSuggestionSchema>;
export type ReorderSuggestionParsed = z.infer<typeof reorderSuggestionSchema>;
