import api from "../api";

export async function deleteBookSummary(bookId, summaryId) {
  const res = await api.delete(
    `/dashboard/books/${bookId}/summaries/${summaryId}/`,
    { withAuth: true }
  );

  return res.data;
}
