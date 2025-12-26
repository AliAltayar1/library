import api from "../api";

export async function getBorrowedManagement() {
  const res = await api.get(`/dashboard/borrow/`, {
    withAuth: true,
  });

  return res.data;
}
