// src/services/api/client.ts
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { API_BASE_URL } from "../../utils/constants";
import { storage } from "../../utils/storage";
import type { ApiError } from "../../types/user";

import type { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiResponseError {
  message?: string;
  errors?: Record<string, string[]> | string[];
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh attempts to prevent infinite loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Helper function to check if URL is an auth endpoint
const isAuthEndpoint = (url: string): boolean => {
  const authPaths = [
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/refresh",
    "/api/v1/auth/forgot-password",
    "/api/v1/auth/reset-password",
  ];

  return authPaths.some((path) => url.includes(path));
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    console.error(
      `❌ API Error: ${error.response?.status} ${error.config?.url}`
    );

    // Handle 401 Unauthorized - but NOT for auth endpoints
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url || "") &&
      storage.hasStoredUser() // Only try refresh if user was previously logged in
    ) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        await apiClient.post("/api/v1/auth/refresh");
        console.log("🔄 Token refreshed successfully");

        processQueue(null);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        processQueue(refreshError);
        isRefreshing = false;

        // Clear stored user data
        storage.clearAuth();

        // Only redirect if we're in a browser environment and not already on login page
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    const data = error.response?.data as {
      message?: string;
      errors?: string[] | Record<string, string[]>;
    };

    let normalizedErrors: Record<string, string[]> | undefined;

    if (Array.isArray(data?.errors)) {
      normalizedErrors = { general: data.errors }; // wrap flat array under a key
    } else {
      normalizedErrors = data?.errors;
    }

    const apiError: ApiError = {
      success: false,
      message: data?.message || error.message || "An unexpected error occurred",
      errors: normalizedErrors,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
