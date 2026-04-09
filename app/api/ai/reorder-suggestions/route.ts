import { generateObject } from "ai";
import { gateway, AI_MODEL, REORDER_SYSTEM_PROMPT } from "@/lib/ai";
import { reorderSuggestionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const { inventoryItems } = await request.json();

    if (!inventoryItems || !Array.isArray(inventoryItems)) {
      return Response.json(
        { error: "Missing or invalid 'inventoryItems' array in request body." },
        { status: 400 },
      );
    }

    const prompt = `Current Inventory:\n${JSON.stringify(inventoryItems, null, 2)}`;

    const { object } = await generateObject({
      model: gateway(AI_MODEL),
      system: REORDER_SYSTEM_PROMPT,
      prompt,
      schema: reorderSuggestionSchema,
    });

    return Response.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
