import api from "../api";

export async function addSummary(bookId, summary) {
  const res = await api.post(
    `/api/books/${bookId}/summarize/`,
    { summary },
    { withAuth: true }
  );

  return res.data;
}
