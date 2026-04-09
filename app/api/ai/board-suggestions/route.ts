import { generateObject } from "ai";
import { anthropic, BOARD_SUGGESTIONS_SYSTEM_PROMPT } from "@/lib/ai";
import { boardSuggestionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const { items, context } = await request.json();

    if (!items || !Array.isArray(items)) {
      return Response.json(
        { error: "Missing or invalid 'items' array in request body." },
        { status: 400 },
      );
    }

    const prompt = [
      `Board Items:\n${JSON.stringify(items, null, 2)}`,
      context ? `\nAdditional Context: ${context}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-5-20250514"),
      system: BOARD_SUGGESTIONS_SYSTEM_PROMPT,
      prompt,
      schema: boardSuggestionSchema,
    });

    return Response.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
