import api from "../api";

export async function requestExtension(borrowId) {
  const res = await api.post(
    `/accounts/profileborrwoed/${borrowId}/extension_book/`,
    {},
    {
      withAuth: true,
    }
  );

  return res.data;
}
