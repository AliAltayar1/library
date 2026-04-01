import api from "../api";

export async function addAuthor(name) {
  const res = await api.post(
    `/dashboard/author/`,
    { name },
    { withAuth: true },
  );

  return res.data;
}
