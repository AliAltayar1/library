import api from "../api";

export async function archiveBook(id) {
  const res = await api.delete(`/dashboard/books/${id}/`, {
    withAuth: true,
  });

  return res.data;
}
