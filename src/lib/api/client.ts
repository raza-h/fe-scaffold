import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export class NetworkError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "NetworkError";
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "/api"}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          return client(originalRequest);
        } catch {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }

      const apiError: ApiError = {
        message: (error.response?.data as { message?: string })?.message || error.message || "An error occurred",
        status: error.response?.status || 500,
        code: (error.response?.data as { code?: string })?.code,
        details: (error.response?.data as { details?: Record<string, unknown> })?.details,
      };

      throw new NetworkError(apiError);
    }
  );

  return client;
};

export const apiClient = createApiClient();

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};
