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

export async function addBookApi(bookData) {
  const token = localStorage.getItem("token");

  const {
    title,
    description,
    total_copies,
    pages,
    publication_year,
    isbn,
    author_id,
    category_id,
  } = bookData;

  const res = await api.post(
    `/dashboard/books/`,
    {
      title,
      description,
      total_copies,
      pages,
      publication_year,
      isbn,
      author_id,
      category_id,
    },
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return res.data;
}
