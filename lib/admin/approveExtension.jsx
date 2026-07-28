import api from "../api";

export async function approveExtension(borrowId) {
  const res = await api.post(
    `/dashboard/borrow/${borrowId}/approve_extension/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
