import api from "../api";

export async function updateProfile(data) {
  const res = await api.patch(`/accounts/profile`, data, {
    withAuth: true,
  });

  return res.data;
}
