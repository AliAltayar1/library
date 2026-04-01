import api from "../api";

export async function getBookSummaries(bookId) {
  const res = await api.get(`/api/books/${bookId}/summaries/`);

  return res.data;
}
