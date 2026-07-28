import api from "../api";

export async function getReservations() {
  const res = await api.get(`/dashboard/reservations/`, {
    withAuth: true,
  });

  return res.data;
}
