import api from "../api";

export async function profileReturned() {
  const res = await api.get(`/accounts/Recoveredbooks/`, {
    withAuth: true,
  });

  return res.data;
}
