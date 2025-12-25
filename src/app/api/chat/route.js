import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const modelMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join(" "),
    }));

    const result = streamText({
      model: openai("gpt-5-nano"),
      messages: [
        {
          role: "system",
          content:
            "You are a virtual assistant integrated into a library application. You only answer questions related to books, authors, literary genres, book summaries, literary history, reading recommendations, and related topics. Do not answer questions outside the domain of literature and books.",
        },
        ...modelMessages,
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response(`Failed to stream text ${error.message}`, {
      status: 500,
    });
  }
}
