import api from "../api";

export async function updateActivity(id, data) {
  const { activity_name, title, image, description, is_active, is_visible } = data;

  const res = await api.patch(
    `/dashboard/libraryactivity/${id}/`,
    { activity_name, title, image, description, is_active, is_visible },
    { withAuth: true }
  );

  return res.data;
}
