import api from "../api";

export async function getFavoritesBooks() {
  const res = await api.get(`/accounts/FavoriteBooksProfileView/`, {
    withAuth: true,
  });

  return res.data;
}
