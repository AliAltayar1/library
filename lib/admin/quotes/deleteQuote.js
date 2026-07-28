import api from "../../api";

/**
 * DELETE /dashboard/quotes/:id/
 */
export async function deleteQuote(id) {
  const res = await api.delete(`/dashboard/quotes/${id}/`, {
    withAuth: true,
  });
  return res.data;
}
