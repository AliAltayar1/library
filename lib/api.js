// src/lib/api.js
import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   // withCredentials: true,  // لو تحتاج
// });

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

// 🔥 هنا نضيف الـ interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    let msg = "حدث خطأ غير متوقع";
    const data = error?.response?.data;

    if (!data) {
      error.message = msg;
      return Promise.reject(error);
    }

    // 1) detail
    if (typeof data.detail === "string") {
      error.message = data.detail;
      return Promise.reject(error);
    }

    // 2) non_field_errors
    if (Array.isArray(data.non_field_errors)) {
      error.message = data.non_field_errors[0];
      return Promise.reject(error);
    }

    // 3) لو backend رجع string
    if (typeof data === "string") {
      error.message = data;
      return Promise.reject(error);
    }

    // 4) أي object فيه key/value
    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const firstValue = data[firstKey];

      // array error
      if (Array.isArray(firstValue)) {
        error.message = firstValue[0];
        return Promise.reject(error);
      }

      // string error
      if (typeof firstValue === "string") {
        error.message = firstValue;
        return Promise.reject(error);
      }
    }

    // 5) fallback
    error.message = msg;
    return Promise.reject(error);
  }
);

export default api;
