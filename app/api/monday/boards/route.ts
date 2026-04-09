import { listBoards } from "@/lib/monday";

export async function GET() {
  try {
    if (!process.env.MONDAY_API_TOKEN) {
      return Response.json(
        { error: "Missing MONDAY_API_TOKEN environment variable." },
        { status: 500 },
      );
    }

    const boards = await listBoards();

    return Response.json(boards);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
