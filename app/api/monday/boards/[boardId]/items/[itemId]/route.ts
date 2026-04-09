import { updateItemColumn } from "@/lib/monday";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ boardId: string; itemId: string }> },
) {
  try {
    if (!process.env.MONDAY_API_TOKEN) {
      return Response.json(
        { error: "Missing MONDAY_API_TOKEN environment variable." },
        { status: 500 },
      );
    }

    const { boardId, itemId } = await params;
    const { columnId, value } = await request.json();

    if (!columnId || value === undefined) {
      return Response.json(
        { error: "Missing required fields: columnId, value." },
        { status: 400 },
      );
    }

    const result = await updateItemColumn(boardId, itemId, columnId, value);

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
