import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      model: openai("gpt-5-nano"),
      prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Failed to stream text", { status: 500 });
  }
}
