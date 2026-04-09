import { FreshdeskClient } from "@/lib/freshdesk";

export async function GET(
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
    const conversations = await client.listConversations(Number(id));

    return Response.json(conversations);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
