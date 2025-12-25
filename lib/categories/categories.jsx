import api from "../api";

export async function getCategories() {
  const res = await api.get(`/api/category/`);
  return res.data;
}
