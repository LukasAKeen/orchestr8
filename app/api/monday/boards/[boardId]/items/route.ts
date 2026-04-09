import { getBoardItems, createItem } from "@/lib/monday";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  try {
    if (!process.env.MONDAY_API_TOKEN) {
      return Response.json(
        { error: "Missing MONDAY_API_TOKEN environment variable." },
        { status: 500 },
      );
    }

    const { boardId } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");

    const itemsPage = await getBoardItems(boardId, cursor);

    return Response.json(itemsPage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> },
) {
  try {
    if (!process.env.MONDAY_API_TOKEN) {
      return Response.json(
        { error: "Missing MONDAY_API_TOKEN environment variable." },
        { status: 500 },
      );
    }

    const { boardId } = await params;
    const { groupId, name, columnValues } = await request.json();

    if (!groupId || !name) {
      return Response.json(
        { error: "Missing required fields: groupId, name." },
        { status: 400 },
      );
    }

    const item = await createItem(boardId, groupId, name, columnValues);

    return Response.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
