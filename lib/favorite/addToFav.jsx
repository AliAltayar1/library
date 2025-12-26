import api from "../api";

export async function addToFav(bookId) {
  const res = await api.post(
    `/api/books/${bookId}/like/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
