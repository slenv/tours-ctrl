import axios from "axios";

import { VITE_API_URL } from "@/config/env";
import { useAuthStore } from "@/store/auth.store";
import { logoutAction } from "@/actions/auth.actions";
import { refresh } from "./auth.services";

const api = axios.create({ baseURL: VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // si no hay response, rechaza de frente
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const url = originalRequest.url;

    // evita refrescar en login o refresh
    const isAuthEndpoint = url.includes('auth/login') || url.includes('auth/refresh');

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const token = await refresh();
      if (token) {
        const { setToken } = useAuthStore.getState();
        setToken(token)
        return api(originalRequest);
      } else {
        await logoutAction();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
