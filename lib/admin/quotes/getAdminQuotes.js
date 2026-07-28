import api from "../../api";

/**
 * GET /dashboard/quotes/
 * Filters: ?status=pending|rejected|approved  &  ?name=<value>
 */
export async function adminGetQuotes({ status, name } = {}) {
  const params = {};
  if (status) params.status = status;
  if (name) params.name = name;

  const res = await api.get("/dashboard/quotes/", {
    params,
    withAuth: true,
  });
  return res.data;
}
