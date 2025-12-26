import api from "../api";

export async function getBorrowedBooks() {
  const res = await api.get(`/dashboard/borrow/`, {
    withAuth: true,
  });

  return res.data;
}
