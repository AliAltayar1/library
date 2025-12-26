import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

export async function getBooks(categoryQry) {
  const url = categoryQry ? `/api/books?category=${categoryQry}` : `/api/books`;
  const res = await api.get(url);
  return res.data;
}

export async function getBook(id) {
  const res = await api.get(`/api/books/${id}/`);
  return res.data;
}
