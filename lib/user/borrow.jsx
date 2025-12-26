import api from "../api";

export async function borrowBook(bookId) {
  const token = localStorage.getItem("token");

  const res = await api.post(
    `/api/books/${bookId}/borrow/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
