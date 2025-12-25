import api from "../api";

export async function removeFromFav(bookId) {
  const token = localStorage.getItem("token");

  const res = await api.post(
    `/api/books/${bookId}/unlike/`,
    {},
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return res.data;
}
