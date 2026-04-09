import { FreshdeskClient } from "@/lib/freshdesk";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const domain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;
    if (!domain || !apiKey) {
      return Response.json(
        { error: "Missing FRESHDESK_DOMAIN or FRESHDESK_API_KEY environment variables." },
        { status: 500 },
      );
    }

    const { id } = await params;
    const client = new FreshdeskClient(domain, apiKey);
    const { body } = await request.json();

    if (!body || typeof body !== "string") {
      return Response.json(
        { error: "Missing or invalid 'body' field in request." },
        { status: 400 },
      );
    }

    const conversation = await client.replyToTicket(Number(id), body);

    return Response.json(conversation, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
