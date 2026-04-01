import api from "../api";

export async function deleteCategory(id) {
  const res = await api.delete(`/dashboard/category/${id}/`, {
    withAuth: true,
  });

  return res.data;
}
