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
    const ticket = await client.getTicket(Number(id));

    return Response.json(ticket);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
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
    const body = await request.json();
    const ticket = await client.updateTicket(Number(id), body);

    return Response.json(ticket);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
