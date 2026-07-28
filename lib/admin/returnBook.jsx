import api from "../api";

export async function returnBook(borrowId) {
  const res = await api.post(
    `/dashboard/borrow/${borrowId}/return_book/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
