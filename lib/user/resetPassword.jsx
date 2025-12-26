import api from "../api";

export async function resetPassword({
  old_password,
  new_password,
  confirm_password,
}) {
  const res = await api.post(
    `/accounts/change_password`,
    { old_password, new_password, confirm_password },
    {
      withAuth: true, // 👈 هذا اللي يخلي الـ interceptor يضيف Token
    }
  );

  return res.data;
}
