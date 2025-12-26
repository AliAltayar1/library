import api from "../api";

export async function getBooks() {
  const res = await api.get(`/dashboard/books/`, {
    withAuth: true,
  });

  return res.data;
}
