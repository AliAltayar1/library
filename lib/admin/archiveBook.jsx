import axios from "axios";
import api from "../api";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     Accept: "application/json",
//   },
// });

export async function archiveBook(id) {
  const token = localStorage.getItem("token");

  const res = await api.delete(`/dashboard/books/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });

  return res.data;
}
