import axios from "axios";
import api from "../api";

// const API = process.env.NEXT_PUBLIC_API_URL;

export async function borrowBook(bookId) {
  const token = localStorage.getItem("token");

  const res = await api.post(
    `/api/books/${bookId}/borrow/`,
    {},
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return res.data;
}
