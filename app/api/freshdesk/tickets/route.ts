import { FreshdeskClient } from "@/lib/freshdesk";

export async function GET(request: Request) {
  try {
    const domain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;
    if (!domain || !apiKey) {
      return Response.json(
        { error: "Missing FRESHDESK_DOMAIN or FRESHDESK_API_KEY environment variables." },
        { status: 500 },
      );
    }

    const client = new FreshdeskClient(domain, apiKey);
    const { searchParams } = new URL(request.url);

    const params: Record<string, string | number> = {};
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const page = searchParams.get("page");

    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (page) params.page = page;

    const tickets = await client.listTickets(
      Object.keys(params).length > 0 ? params : undefined,
    );

    return Response.json(tickets);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const domain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;
    if (!domain || !apiKey) {
      return Response.json(
        { error: "Missing FRESHDESK_DOMAIN or FRESHDESK_API_KEY environment variables." },
        { status: 500 },
      );
    }

    const client = new FreshdeskClient(domain, apiKey);
    const body = await request.json();

    // Use the underlying request method via listTickets pattern —
    // the FreshdeskClient doesn't expose a createTicket method directly,
    // so we call the Freshdesk API through a POST to /tickets.
    const baseUrl = `https://${domain}.freshdesk.com/api/v2`;
    const encoded = btoa(`${apiKey}:X`);
    const res = await fetch(`${baseUrl}/tickets`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => res.text());
      return Response.json(
        { error: "Failed to create ticket", details: errorBody },
        { status: res.status },
      );
    }

    const ticket = await res.json();
    return Response.json(ticket, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
