import axios from "axios";
import api from "../api";

export async function login(userData) {
  const { identifier, password } = userData;

  console.log(identifier);
  console.log(password);

  const res = await api.post(`/accounts/login`, {
    identifier,
    password,
  });
  return res.data;
}
