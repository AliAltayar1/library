import api from "../api";

export async function getActivityParticipants(id) {
  const res = await api.get(
    `/dashboard/libraryactivity/${id}/participants/`,
    { withAuth: true }
  );

  return res.data;
}
