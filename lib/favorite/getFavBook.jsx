import api from "../api";

export async function getFavoritesBooks() {
  const token = localStorage.getItem("token");

  const res = await api.get(`/accounts/FavoriteBooksProfileView/`, {
    headers: { Authorization: `Token ${token}` },
  });

  return res.data;
}
