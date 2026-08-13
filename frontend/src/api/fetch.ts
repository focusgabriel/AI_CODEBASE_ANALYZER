import axios, {
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { PUBLIC_ROUTES } from "../constants";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const tokenRefreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Endpoints that should never trigger a token refresh
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

refreshClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

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
        await tokenRefreshClient.post("/refresh", {}, {
          withCredentials: true,
        });

        return refreshClient(originalRequest);
      } catch (refreshError) {
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

export default refreshClient;