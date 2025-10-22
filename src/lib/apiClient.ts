import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "/api";

let authToken: string | null = null;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearApiAuthToken();
    }
    return Promise.reject(error);
  }
);

export const setApiAuthToken = (token: string) => {
  authToken = token;
};

export const clearApiAuthToken = () => {
  authToken = null;
};

export const getApiBaseUrl = () => API_BASE_URL;
