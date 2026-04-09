import { streamText } from "ai";
import { anthropic, DRAFT_REPLY_SYSTEM_PROMPT } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { ticket, conversationHistory } = await request.json();

    if (!ticket) {
      return Response.json(
        { error: "Missing required field: ticket." },
        { status: 400 },
      );
    }

    const prompt = [
      `Ticket Subject: ${ticket.subject}`,
      `Ticket Description: ${ticket.description_text || ticket.description}`,
      `Status: ${ticket.status}`,
      `Priority: ${ticket.priority}`,
      conversationHistory?.length
        ? `\nConversation History:\n${conversationHistory
            .map(
              (c: { body_text?: string; body: string; incoming: boolean }) =>
                `[${c.incoming ? "Customer" : "Agent"}]: ${c.body_text || c.body}`,
            )
            .join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const result = streamText({
      model: anthropic("claude-sonnet-4-5-20250514"),
      system: DRAFT_REPLY_SYSTEM_PROMPT,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
