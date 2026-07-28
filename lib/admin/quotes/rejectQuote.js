import api from "../../api";

/**
 * POST /dashboard/quotes/:id/reject/
 */
export async function rejectQuote(id) {
  const res = await api.post(
    `/dashboard/quotes/${id}/reject/`,
    {},
    { withAuth: true }
  );
  return res.data;
}
