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

export async function getBooks(categoryQry, page = 1) {
  let url = `/api/books?page=${page}`;
  if (categoryQry) url += `&category=${categoryQry}`;
  const res = await api.get(url, { withAuth: true });
  return res.data;
}

export async function getBook(id) {
  const res = await api.get(`/api/books/${id}/`, { withAuth: true });
  return res.data;
}
