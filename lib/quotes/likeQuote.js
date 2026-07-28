import api from "../api";

/** POST /api/quotes/:id/like/ */
export async function likeQuote(id) {
  const res = await api.post(`/api/quotes/${id}/like/`, {}, { withAuth: true });
  return res.data;
}

/** POST /api/quotes/:id/unlike/ */
export async function unlikeQuote(id) {
  const res = await api.post(
    `/api/quotes/${id}/unlike/`,
    {},
    { withAuth: true },
  );
  return res.data;
}

/** GET /api/quotes/:id/likes_info/ */
export async function getLikesInfo(id) {
  const res = await api.get(`/api/quotes/${id}/likes_info/`, {
    withAuth: true,
  });
  return res.data;
}
