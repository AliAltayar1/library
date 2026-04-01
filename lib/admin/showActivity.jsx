import api from "../api";

export async function showActivity(activityId, userId) {
  const res = await api.post(
    `/dashboard/libraryactivity/${activityId}/show/`,
    { user_id: userId },
    { withAuth: true }
  );

  return res.data;
}
