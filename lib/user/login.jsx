import axios from "axios";
import api from "../api";

export async function login(userData) {
  const { username, password } = userData;
  console.log("first");

  const res = await api.post(`/accounts/login`, {
    username,
    password,
  });
  return res.data;
}
