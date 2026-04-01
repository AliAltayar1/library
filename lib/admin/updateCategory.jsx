import api from "../api";

export async function updateCategory(id, name) {
  const res = await api.patch(
    `/dashboard/category/${id}/`,
    { name },
    { withAuth: true },
  );

  return res.data;
}
