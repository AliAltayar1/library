import api from "../api";

export async function register(userData) {
  const { username, password, password2, email, first_name, last_name } =
    userData;

  const res = await api.post(`/accounts/register`, {
    username,
    password,
    password2,
    email,
    first_name,
    last_name,
  });

  return res.data;
}
