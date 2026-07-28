import api from "../../api";

/**
 * POST /dashboard/quotes/:id/approve/
 */
export async function approveQuote(id) {
  const res = await api.post(
    `/dashboard/quotes/${id}/approve/`,
    {},
    { withAuth: true }
  );
  return res.data;
}
