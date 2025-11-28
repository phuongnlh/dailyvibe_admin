import axios from "axios";
import { Navigate } from "react-router-dom";
import { TokenService } from "./tokenManager";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/admin`,
  withCredentials: true,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
let isRefreshing = false;
let refreshSubscribers: any[] = [];

function subscribeTokenRefresh(callback: any) {
  refreshSubscribers.push(callback);
}

function onRefreshed(token: any) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: any) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await api.post("/refresh", {}, { withCredentials: true });
      const newToken = res.data.accessToken;

      TokenService.setAccessToken(newToken);
      isRefreshing = false;
      onRefreshed(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      isRefreshing = false;
      TokenService.clear();
      Navigate({ to: "/login", replace: true });
      return Promise.reject(err);
    }
  }
);

export default api;
