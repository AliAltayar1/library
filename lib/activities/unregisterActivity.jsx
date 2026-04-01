import api from "../api";

export async function unregisterActivity(id) {
  const res = await api.post(
    `/api/activity/${id}/unregister/`,
    {},
    { withAuth: true }
  );

  return res.data;
}
