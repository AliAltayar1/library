import api from "../api";

export async function getBooks(filters = {}) {
  const params = {};
  if (filters.author) params.author = filters.author;
  if (filters.category) params.category = filters.category;

  const res = await api.get(`/dashboard/books/`, {
    withAuth: true,
    params,
  });

  return res.data;
}
