import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

export async function profile() {
  const token = localStorage.getItem("token");

  const res = await api.get(`/accounts/profile`, {
    headers: { Authorization: `Token ${token}` },
  });

  return res.data;
}
