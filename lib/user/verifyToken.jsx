import axios from "axios";
import api from "../api";

// const API = process.env.NEXT_PUBLIC_API_URL;

export async function verifyToken() {
  const token = localStorage.getItem("token");

  const res = await api.get(`/accounts/VerifyTokenAndRoleView`, {
    headers: { Authorization: `Token ${token}` },
  });

  return res.data;
}
