import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

export async function getBorrowedBooks() {
  const token = localStorage.getItem("token");

  try {
    const res = await api.get(`/dashboard/borrow/`, {
      headers: { Authorization: `Token ${token}` },
    });

    return res.data;
  } catch (error) {
    console.log(
      error?.response?.data?.detail ||
        error?.message ||
        "Error while fetching Books"
    );

    throw new Error(
      error?.response?.data?.detail ||
        error?.message ||
        "Error while fetching Books"
    );
  }
}
