import api from "../api";

export async function getAdminBookSummaries(bookId) {
  const res = await api.get(`/dashboard/books/${bookId}/summaries/`, {
    withAuth: true,
  });

  return res.data;
}
