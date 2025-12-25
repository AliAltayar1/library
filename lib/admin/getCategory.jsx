import axios from "axios";
import api from "../api";

// const API = process.env.NEXT_PUBLIC_API_URL;

export async function getCategory() {
  const token = localStorage.getItem("token");

  const res = await api.get(`/dashboard/category/`, {
    headers: { Authorization: `Token ${token}` },
  });

  return res.data;
}
