import api from "../api";

export async function getUsers() {
  const res = await api.get(`/dashboard/users/`, {
    withAuth: true,
  });

  return res.data;
}
