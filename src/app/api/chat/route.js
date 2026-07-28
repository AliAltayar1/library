import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import axios from "axios";

const BASE_SYSTEM_PROMPT = `You are a virtual assistant integrated into a library application ("خير جليس"). You can see and analyze images that users send you - including book covers, pages, and any book-related images. You answer questions related to books, authors, literary genres, book summaries, literary history, reading recommendations, and related topics. When a user sends an image of a book cover or page, help them identify the book, describe what you see, and provide relevant information. Do not answer questions outside the domain of literature and books.

IMPORTANT RULE FOR RECOMMENDATIONS:
When a user asks for book recommendations (e.g., "رشح لي كتاب", "اقترح كتب", "recommend a book"), you MUST prioritize recommending books that exist in our library catalog provided below. Mention the book title, author, category, and a brief description based on the catalog data.`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Fetch active library catalog from backend
    let catalogContext =
      "\n\n--- CURRENT LIBRARY CATALOG ---\n(No catalog data available)";
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await axios.get(`${apiUrl}/api/books`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Accept: "application/json",
        },
      });
      const books = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];
      if (books.length > 0) {
        const catalogItems = books
          .map(
            (b) =>
              `- Title: "${b.title}" | Author: ${b.author?.name || "Unknown"} | Category: ${b.category?.name || "General"} | Available: ${b.is_avaiable ? "Yes" : "No"} | Description: ${b.description || "N/A"}`,
          )
          .join("\n");
        catalogContext = `\n\n--- CURRENT LIBRARY CATALOG ---\nHere are the books currently available in our library. Use these for your recommendations:\n${catalogItems}`;
      }
    } catch (catErr) {
      console.error(
        "Failed to fetch library catalog for AI context:",
        catErr.message,
      );
    }

    const fullSystemPrompt = BASE_SYSTEM_PROMPT + catalogContext;

    const modelMessages = messages.map((msg) => {
      const parts = msg.parts || [];
      const content = [];

      for (const part of parts) {
        if (part.type === "text" && part.text) {
          content.push({ type: "text", text: part.text });
        } else if (
          part.type === "file" &&
          part.mediaType?.startsWith("image/")
        ) {
          // Pass image as inline data for the AI SDK
          if (part.url?.startsWith("data:")) {
            // data URL — extract base64 and mime type
            const [header, base64Data] = part.url.split(",");
            const mimeType = header.match(/data:(.*?);/)?.[1] || part.mediaType;
            content.push({
              type: "image",
              image: base64Data,
              mimeType,
            });
          } else if (part.url) {
            content.push({
              type: "image",
              image: new URL(part.url),
            });
          }
        }
      }

      // If no content was extracted, add a fallback
      if (content.length === 0) {
        content.push({ type: "text", text: msg.content || "" });
      }

      return {
        role: msg.role,
        content:
          content.length === 1 && content[0].type === "text"
            ? content[0].text
            : content,
      };
    });

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "system",
          content: fullSystemPrompt,
        },
        ...modelMessages,
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(`Failed to stream text: ${error.message}`, {
      status: 500,
    });
  }
}
