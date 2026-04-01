import api from "../api";

export async function deleteAuthor(id) {
  const res = await api.delete(`/dashboard/author/${id}/`, {
    withAuth: true,
  });

  return res.data;
}
