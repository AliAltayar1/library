import api from "../api";

export async function verifyToken() {
  const res = await api.get(`/accounts/VerifyTokenAndRoleView`, {
    withAuth: true,
  });

  return res.data;
}
