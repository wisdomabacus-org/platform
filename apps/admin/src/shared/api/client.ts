import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '@/config/constants';
import type { ApiError } from '@/types/api.types';
import Cookies from 'js-cookie';

/**
 * Axios instance configured for the backend API
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
});

/**
 * Request interceptor - adds CSRF token
 */
apiClient.interceptors.request.use((config) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
    const csrfToken = Cookies.get('csrf_token');
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
  }
  return config;
});

/**
 * Response interceptor - handles common errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Will be implemented in Phase 2
      console.error('Unauthorized - redirect to login');
    }

    return Promise.reject(error);
  }
);
