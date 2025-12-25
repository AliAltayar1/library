import axios from "axios";
import api from "../api";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     Accept: "application/json",
//   },
// });

export async function unarchiveBook(id) {
  const token = localStorage.getItem("token");

  const res = await api.post(
    `/dashboard/books/${id}/restore/`,
    {},
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return res.data;
}
