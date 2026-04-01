import api from "../api";

export async function activateActivity(id) {
  const res = await api.post(
    `/dashboard/libraryactivity/${id}/activate/`,
    {},
    { withAuth: true }
  );

  return res.data;
}
