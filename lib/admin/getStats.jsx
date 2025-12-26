import api from "../api";

export async function getStats() {
  const res = await api.get(`/dashboard/stats/`, {
    withAuth: true,
  });

  return res.data;
}
