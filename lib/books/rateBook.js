import api from "../api";

/**
 * Rate a book (1–5).
 * POST /api/books/:bookId/rate/  →  { rating: number }
 */
export async function rateBook(bookId, rating) {
  const res = await api.post(
    `/api/books/${bookId}/rate/`,
    { rating },
    { withAuth: true }
  );

  return res.data;
}
