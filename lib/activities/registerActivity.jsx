import api from "../api";

export async function registerActivity(id) {
  const res = await api.post(
    `/api/activity/${id}/register/`,
    {},
    { withAuth: true }
  );

  return res.data;
}
