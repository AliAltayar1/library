import api from "../api";

export async function removeFromFav(bookId) {
  const res = await api.post(
    `/api/books/${bookId}/unlike/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
