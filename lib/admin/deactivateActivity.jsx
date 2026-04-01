import api from "../api";

export async function deactivateActivity(id) {
  const res = await api.post(
    `/dashboard/libraryactivity/${id}/deactivate/`,
    {},
    { withAuth: true }
  );

  return res.data;
}
