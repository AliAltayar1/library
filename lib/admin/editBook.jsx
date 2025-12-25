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

export async function editBookApi(bookData) {
  const token = localStorage.getItem("token");

  const {
    id,
    title,
    description,
    author_id,
    category_id,
    total_copies,
    pages,
    publication_year,
    isbn,
  } = bookData;

  const res = await api.patch(
    `/dashboard/books/${id}/`,
    {
      title,
      description,
      author_id,
      category_id,
      total_copies,
      pages,
      publication_year,
      isbn,
    },
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return res.data;
}
