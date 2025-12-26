import api from "../api";

export async function getAuthor() {
  const res = await api.get(`/dashboard/author/`, {
    withAuth: true,
  });

  return res.data;
}
