import api from "../api";
import { clearToken } from "../getToken";

export async function logout() {
  const res = await api.post(
    `/accounts/logout`,
    {},
    {
      withAuth: true,
    }
  );

  clearToken();

  return res.data;
}
