import api from "../api";

export async function addActivity(data) {
  const { activity_name, title, image, description, is_active, is_visible } = data;

  const res = await api.post(
    `/dashboard/libraryactivity/`,
    { activity_name, title, image, description, is_active, is_visible },
    { withAuth: true }
  );

  return res.data;
}
