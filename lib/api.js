import axios from "axios";
import { getToken } from "./getToken";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.withAuth) {
      const token = getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Token ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    let msg = "حدث خطأ غير متوقع";
    const data = error?.response?.data;

    if (!data) {
      error.message = msg;
      return Promise.reject(error);
    }

    if (typeof data.detail === "string") {
      error.message = data.detail;
      return Promise.reject(error);
    }

    if (Array.isArray(data.non_field_errors)) {
      error.message = data.non_field_errors[0];
      return Promise.reject(error);
    }

    if (typeof data === "string") {
      error.message = data;
      return Promise.reject(error);
    }

    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const firstValue = data[firstKey];

      if (Array.isArray(firstValue)) {
        error.message = firstValue[0];
        return Promise.reject(error);
      }

      if (typeof firstValue === "string") {
        error.message = firstValue;
        return Promise.reject(error);
      }
    }

    error.message = msg;
    return Promise.reject(error);
  }
);

export default api;
