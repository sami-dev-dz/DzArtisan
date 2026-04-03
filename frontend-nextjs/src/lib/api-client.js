import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api/v1`,
  withCredentials: true, //Indespensable pour les cookies Sanctum
  headers: {
    Accept: "application/json",
    "content-type": "application/json",
  },
});

// Intercepteur global : redirige vers /login si session expirée
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
