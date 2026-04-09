import { generateObject } from "ai";
import { anthropic, TRIAGE_SYSTEM_PROMPT } from "@/lib/ai";
import { triageResultSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const { subject, description, tags } = await request.json();

    if (!subject || !description) {
      return Response.json(
        { error: "Missing required fields: subject, description." },
        { status: 400 },
      );
    }

    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-5-20250514"),
      system: TRIAGE_SYSTEM_PROMPT,
      prompt: [
        `Subject: ${subject}`,
        `Description: ${description}`,
        tags?.length ? `Tags: ${tags.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
      schema: triageResultSchema,
    });

    return Response.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
