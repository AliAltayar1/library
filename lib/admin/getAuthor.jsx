import api from "../api";

export async function getAuthor(filters = {}) {
  const params = {};
  if (filters.author) params.author = filters.author;

  const res = await api.get(`/dashboard/author/`, {
    withAuth: true,
    params,
  });

  return res.data;
}
