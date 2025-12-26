import api from "../api";

export async function unarchiveBook(id) {
  const res = await api.post(
    `/dashboard/books/${id}/restore/`,
    {},
    {
      withAuth: true, // 👈 هذا اللي يخلي الـ interceptor يضيف Token
    }
  );
  return res.data;
}
