import api from "../api";

export async function getActivities() {
  const res = await api.get(`/dashboard/libraryactivity/`, {
    withAuth: true,
  });

  return res.data;
}
