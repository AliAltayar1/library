import api from "../api";

/**
 * GET /api/quotes/
 * Optional: ?name=<first|last|username>
 */
export async function getQuotes({ name } = {}) {
  const params = {};
  if (name) params.name = name;
  const res = await api.get("/api/quotes/", { params, withAuth: true });
  return res.data;
}
