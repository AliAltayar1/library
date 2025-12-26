import api from "../api";

export async function returnBookRequest(bookId) {
  const res = await api.post(
    `/accounts/profileborrwoed/${bookId}/return_book/`,
    {},
    {
      withAuth: true,
    }
  );
  return res.data;
}
