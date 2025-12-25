import axios from "axios";
import api from "../api";

// const API = process.env.NEXT_PUBLIC_API_URL;

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     Accept: "application/json",
//   },
// });

export async function getBooks() {
  const token = localStorage.getItem("token");

  const res = await api.get(`/dashboard/books/`, {
    headers: { Authorization: `Token ${token}` },
  });

  return res.data;
}
