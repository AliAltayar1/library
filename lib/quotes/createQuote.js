import api from "../api";

/**
 * POST /api/quotes/
 * Body: { content: string }
 */
export async function createQuote(content) {
  const res = await api.post("/api/quotes/", { content }, { withAuth: true });
  return res.data;
}
