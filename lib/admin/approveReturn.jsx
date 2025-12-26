import api from "../api";

export async function approveReturn(approveId) {
  const res = await api.post(
    `/dashboard/borrow/${approveId}/approve_return/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
