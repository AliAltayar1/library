import api from "../api";

export async function profileBorrowed() {
  const res = await api.get(`/accounts/profileborrwoed`, {
    withAuth: true,
  });

  return res.data;
}
