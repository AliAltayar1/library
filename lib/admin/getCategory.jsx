import api from "../api";

export async function getCategory() {
  const res = await api.get(`/dashboard/category/`, {
    withAuth: true,
  });

  return res.data;
}
