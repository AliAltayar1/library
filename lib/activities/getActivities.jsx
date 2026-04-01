import api from "../api";

export async function getActivitiesForUser(withAuth = false) {
  const res = await api.get(`/api/activity/`, withAuth ? { withAuth: true } : {});

  return res.data;
}
