import api from "../api";

export async function reserveBook(bookId) {
  const res = await api.post(
    `/api/books/${bookId}/reserve/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
