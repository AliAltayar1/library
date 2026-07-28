import api from "../api";

export async function getActivitiesForUser() {
  const res = await api.get(`/api/activity/`, { withAuth: true });

  return res.data;
}
