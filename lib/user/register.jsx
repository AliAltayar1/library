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

export async function register(userData) {
  const { username, password, password2, email, first_name, last_name } =
    userData;

  const res = await api.post(`/accounts/register`, {
    username,
    password,
    password2,
    email,
    first_name,
    last_name,
  });

  return res.data;
}
