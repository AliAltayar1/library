import api from "../api";

/**
 * Fetches personalized book recommendations for the logged-in user.
 * @returns {{ source: string, count: number, results: object[] }}
 */
export async function getRecommendations() {
  const res = await api.get("/api/recommendations/me/", { withAuth: true });
  return res.data;
}
