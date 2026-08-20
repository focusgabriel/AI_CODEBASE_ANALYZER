import axios, {
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { PUBLIC_ROUTES } from "../constants";
import Logout from "../auth/Logout";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:5051/api/v1",
  withCredentials: true,
});

const tokenRefreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:5051/api/v1",
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = tokenRefreshClient
      .post("/refresh", {}, { withCredentials: true })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
}

// Endpoints that should never trigger a token refresh
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (!error.response || !window.navigator.onLine) {
      console.warn("Network disconnected. Preserving session.");
      return Promise.reject(error); // Do NOT log out here!
    }

    if (error.response.status === 401 && error.config.url.includes('/refresh-token')) {
      // Refresh token itself is expired or revoked -> Safe to log out
      Logout();
    }

    // Nothing to retry or refresh without a config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = AUTH_ENDPOINTS.some(
      (route) => originalRequest.url?.includes(route),
    );

    const shouldRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint;

    if (shouldRefresh) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();

        return api(originalRequest);
      } catch (refreshError) {
        // Another tab may have rotated the shared HttpOnly cookies first. Retry
        // once with the browser's latest cookies before ending the session.
        try {
          return await api(originalRequest);
        } catch {
          // The refresh token is genuinely unavailable, expired, or revoked.
        }

        const isAuthPage = PUBLIC_ROUTES.some(
          (route) =>
            window.location.pathname === route ||
            window.location.pathname.startsWith(route + "/"),
        );

        if (!isAuthPage) {
          window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
