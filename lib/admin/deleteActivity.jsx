import api from "../api";

export async function deleteActivity(id) {
  const res = await api.delete(`/dashboard/libraryactivity/${id}/`, {
    withAuth: true,
  });

  return res.data;
}
