import api from "../api";

export async function addToFav(bookId) {
  const token = localStorage.getItem("token");

  const res = await api.post(
    `/api/books/${bookId}/like/`,
    {},
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return res.data;
}
