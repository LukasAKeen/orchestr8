import { getBoardItems, parseInventoryItem } from "@/lib/monday";

export async function GET() {
  try {
    if (!process.env.MONDAY_API_TOKEN) {
      return Response.json(
        { error: "Missing MONDAY_API_TOKEN environment variable." },
        { status: 500 },
      );
    }

    const boardId = process.env.MONDAY_INVENTORY_BOARD_ID;
    if (!boardId) {
      return Response.json(
        { error: "Missing MONDAY_INVENTORY_BOARD_ID environment variable." },
        { status: 500 },
      );
    }

    const itemsPage = await getBoardItems(boardId);
    const inventoryItems = itemsPage.items.map(parseInventoryItem);

    return Response.json(inventoryItems);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
