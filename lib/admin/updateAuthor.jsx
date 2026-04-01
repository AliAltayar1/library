import api from "../api";

export async function updateAuthor(id, name) {
  const res = await api.patch(
    `/dashboard/author/${id}/`,
    { name },
    { withAuth: true },
  );

  return res.data;
}
