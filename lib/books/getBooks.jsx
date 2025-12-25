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
  // try {
  const res = await api.get(url);
  return res.data;
  // } catch (error) {
  //   console.log(error?.message || "Error while fetching books");

  //   throw new Error(error?.message || "Error while fetching books");
  // }
}

export async function getBook(id) {
  const res = await api.get(`/api/books/${id}/`);
  return res.data;
}
