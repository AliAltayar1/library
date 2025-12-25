import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const { text } = await generateText({
      model: openai("gpt-5-nano"),
      prompt,
    });

    return Response.json({ text });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "فشل في إنشاء النص" }, { status: 500 });
  }
}
