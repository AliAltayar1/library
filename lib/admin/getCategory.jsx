import api from "../api";

export async function getCategory(filters = {}) {
  const params = {};
  if (filters.category) params.category = filters.category;

  const res = await api.get(`/dashboard/category/`, {
    withAuth: true,
    params,
  });

  return res.data;
}
