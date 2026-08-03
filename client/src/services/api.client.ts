import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for centralized error transformation
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Client Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);
