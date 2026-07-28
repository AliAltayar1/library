import api from "../api";

export async function getUsers(filters = {}) {
  const params = {};
  if (filters.name) params.name = filters.name;

  const res = await api.get(`/dashboard/users/`, {
    withAuth: true,
    params,
  });

  return res.data;
}
