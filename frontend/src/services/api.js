import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("campuslaunch_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      localStorage.removeItem("campuslaunch_token");
      localStorage.removeItem("campuslaunch_user");
    }

    return Promise.reject(error);
  }
);

export default api;