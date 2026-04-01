import api from "../api";

export async function addCategory(name) {
  const res = await api.post(
    `/dashboard/category/`,
    { name },
    { withAuth: true },
  );

  return res.data;
}
