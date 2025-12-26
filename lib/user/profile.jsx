import api from "../api";

export async function profile() {
  const res = await api.get(`/accounts/profile`, {
    withAuth: true,
  });

  return res.data;
}
