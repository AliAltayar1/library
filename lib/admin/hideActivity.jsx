import api from "../api";

export async function hideActivity(activityId, userId) {
  const res = await api.post(
    `/dashboard/libraryactivity/${activityId}/hide/`,
    { user_id: userId },
    { withAuth: true }
  );

  return res.data;
}
