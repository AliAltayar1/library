import api from "../api";

export async function rejectExtension(borrowId) {
  const res = await api.post(
    `/dashboard/borrow/${borrowId}/reject_extension/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
