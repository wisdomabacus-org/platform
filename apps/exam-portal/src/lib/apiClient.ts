import { ApiResponse } from "@/types/api.types";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    || "http://localhost:8080/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const csrfToken = Cookies.get("csrf_token");
    if (
      csrfToken &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(
        config.method?.toUpperCase() || ""
      )
    ) {
      config.headers["x-csrf-token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const apiError = error.response.data;

      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          Cookies.remove("csrf_token");
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject({
        message:
          apiError?.error?.message || apiError?.message || "An error occurred",
        status: error.response.status,
        details: apiError?.error?.details,
      });
    } else if (error.request) {
      return Promise.reject({
        message: "No response from server. Please check your connection.",
        status: 0,
      });
    } else {
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        status: 0,
      });
    }
  }
);

export default apiClient;
