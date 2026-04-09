// ---------------------------------------------------------------------------
// Monday.com GraphQL API Client
// ---------------------------------------------------------------------------

import { GraphQLClient, gql } from "graphql-request";
import type {
  MondayBoard,
  MondayItem,
  MondayItemsPage,
  InventoryItem,
} from "@/types/monday";

// ---------------------------------------------------------------------------
// GraphQL Queries & Mutations
// ---------------------------------------------------------------------------

const LIST_BOARDS_QUERY = gql`
  query ListBoards {
    boards(limit: 50) {
      id
      name
      columns {
        id
        title
        type
      }
    }
  }
`;

const GET_BOARD_ITEMS_QUERY = gql`
  query GetBoardItems($boardId: [ID!]!, $cursor: String) {
    boards(ids: $boardId) {
      items_page(limit: 100, cursor: $cursor) {
        cursor
        items {
          id
          name
          column_values {
            id
            text
            value
            type
          }
          group {
            id
            title
          }
        }
      }
    }
  }
`;

const UPDATE_ITEM_COLUMN_MUTATION = gql`
  mutation UpdateColumn(
    $boardId: ID!
    $itemId: ID!
    $columnId: String!
    $value: JSON!
  ) {
    change_column_value(
      board_id: $boardId
      item_id: $itemId
      column_id: $columnId
      value: $value
    ) {
      id
    }
  }
`;

const CREATE_ITEM_MUTATION = gql`
  mutation CreateItem(
    $boardId: ID!
    $groupId: String!
    $name: String!
    $columnValues: JSON
  ) {
    create_item(
      board_id: $boardId
      group_id: $groupId
      item_name: $name
      column_values: $columnValues
    ) {
      id
      name
    }
  }
`;

// ---------------------------------------------------------------------------
// Client helpers
// ---------------------------------------------------------------------------

function getClient(): GraphQLClient {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    throw new Error("Missing MONDAY_API_TOKEN environment variable.");
  }
  return new GraphQLClient("https://api.monday.com/v2", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Fetch all boards the authenticated user can access. */
export async function listBoards(): Promise<MondayBoard[]> {
  const client = getClient();
  const data = await client.request<{ boards: MondayBoard[] }>(
    LIST_BOARDS_QUERY,
  );
  return data.boards;
}

/** Fetch a page of items from a board, optionally paginated via cursor. */
export async function getBoardItems(
  boardId: string,
  cursor?: string | null,
): Promise<MondayItemsPage> {
  const client = getClient();
  const data = await client.request<{
    boards: [{ items_page: MondayItemsPage }];
  }>(GET_BOARD_ITEMS_QUERY, {
    boardId: [boardId],
    cursor: cursor ?? null,
  });
  return data.boards[0].items_page;
}

/** Update a single column value on an item. */
export async function updateItemColumn(
  boardId: string,
  itemId: string,
  columnId: string,
  value: string,
): Promise<{ id: string }> {
  const client = getClient();
  const data = await client.request<{
    change_column_value: { id: string };
  }>(UPDATE_ITEM_COLUMN_MUTATION, { boardId, itemId, columnId, value });
  return data.change_column_value;
}

/** Create a new item on a board within a specific group. */
export async function createItem(
  boardId: string,
  groupId: string,
  name: string,
  columnValues?: Record<string, unknown>,
): Promise<{ id: string; name: string }> {
  const client = getClient();
  const data = await client.request<{
    create_item: { id: string; name: string };
  }>(CREATE_ITEM_MUTATION, {
    boardId,
    groupId,
    name,
    columnValues: columnValues ? JSON.stringify(columnValues) : undefined,
  });
  return data.create_item;
}

// ---------------------------------------------------------------------------
// Inventory helper
// ---------------------------------------------------------------------------

/**
 * Parse a raw Monday item into a typed `InventoryItem`.
 *
 * Expects columns titled: "SKU", "Quantity", "Reorder Threshold",
 * "Category", "Status", and "Last Updated". Column titles are matched
 * case-insensitively.
 */
export function parseInventoryItem(item: MondayItem): InventoryItem {
  const col = (title: string): string => {
    const found = item.column_values.find(
      (cv) => cv.id.toLowerCase() === title.toLowerCase() ||
        cv.text?.toLowerCase().includes(title.toLowerCase()),
    );
    return found?.text ?? "";
  };

  // Build a map by column id for more reliable lookups
  const colMap = new Map(
    item.column_values.map((cv) => [cv.id.toLowerCase(), cv.text]),
  );

  const findCol = (candidates: string[]): string => {
    for (const c of candidates) {
      const val = colMap.get(c.toLowerCase());
      if (val !== undefined) return val;
    }
    // Fallback: search by partial text in column ids
    for (const c of candidates) {
      for (const [id, text] of colMap) {
        if (id.includes(c.toLowerCase())) return text;
      }
    }
    return "";
  };

  return {
    id: item.id,
    name: item.name,
    sku: findCol(["sku"]),
    quantity: parseInt(findCol(["quantity", "qty", "stock"]), 10) || 0,
    reorderThreshold:
      parseInt(findCol(["reorder_threshold", "reorder", "threshold"]), 10) || 0,
    category: findCol(["category", "cat"]),
    status: findCol(["status"]),
    lastUpdated: findCol(["last_updated", "updated", "last_update"]),
  };
}
