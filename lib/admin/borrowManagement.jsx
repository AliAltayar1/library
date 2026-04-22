import api from "../api";

export async function getBorrowedManagement(filters = {}) {
  const params = {};
  if (filters.username) params.username = filters.username;
  if (filters.book_name) params.book_name = filters.book_name;

  const res = await api.get(`/dashboard/borrow/`, {
    withAuth: true,
    params,
  });

  return res.data;
}
