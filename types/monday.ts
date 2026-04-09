// ---------------------------------------------------------------------------
// Monday.com GraphQL API – Type Definitions
// ---------------------------------------------------------------------------

export interface MondayBoard {
  id: string;
  name: string;
  columns: MondayColumn[];
}

export interface MondayColumn {
  id: string;
  title: string;
  type: string; // "text" | "status" | "numbers" | "date" | "dropdown" | "color" | etc.
}

export interface MondayItem {
  id: string;
  name: string;
  column_values: MondayColumnValue[];
  group: {
    id: string;
    title: string;
  };
}

export interface MondayColumnValue {
  id: string;
  text: string;
  value: string | null; // Raw JSON string from Monday API
  type: string;
}

export interface MondayItemsPage {
  cursor: string | null;
  items: MondayItem[];
}

/**
 * Parsed inventory item derived from Monday.com column values.
 * Field names map to expected column titles in the inventory board.
 */
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderThreshold: number;
  category: string;
  status: string;
  lastUpdated: string;
}
