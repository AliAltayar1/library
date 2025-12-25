import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

export async function resetPassword({
  old_password,
  new_password,
  confirm_password,
}) {
  const token = localStorage.getItem("token");
  console.log(old_password);
  console.log(new_password);
  console.log(confirm_password);

  try {
    const res = await api.post(
      `/accounts/change_password`,
      { old_password, new_password, confirm_password },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);

    const err = error?.response?.data;

    let message =
      err?.detail ||
      err?.error?.[0] ||
      err?.new_password?.[0] ||
      error.message ||
      "An error occurred";

    throw message;
  }
}
