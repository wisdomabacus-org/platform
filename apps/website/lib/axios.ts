import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse } from './types/api.types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const csrfToken = Cookies.get('csrf_token');
    if (
      csrfToken &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
        config.method?.toUpperCase() || ''
      )
    ) {
      config.headers['x-csrf-token'] = csrfToken;
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
        if (typeof window !== 'undefined') {
          Cookies.remove('csrf_token');
          // Dispatch event to open auth modal if needed, or just let the app state handle it.
          // For now, avoiding hard redirect to /login page.
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      return Promise.reject({
        message: apiError?.error?.message || apiError?.message || 'An error occurred',
        status: error.response.status,
        details: apiError?.error?.details,
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
        status: 0,
      });
    } else {
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      });
    }
  }
);

export default apiClient;
