import { apiClient } from '@/shared/api/client';
import type { LoginRequest, LoginResponse, Admin } from '../types/auth.types';
import { ApiResponse } from '@/types/api.types';

export const authService = {
  /**
   * Admin login
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/admin/login',
      credentials
    );
    return response.data;
  },

  /**
   * Admin logout
   */
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response =
      await apiClient.post<ApiResponse<{ message: string }>>('/auth/admin/logout');
    return response.data;
  },

  /**
   * Get current admin profile/session
   */
  getProfile: async (): Promise<ApiResponse<Admin>> => {
    const response = await apiClient.get<ApiResponse<Admin>>('/auth/admin/profile');
    return response.data;
  },
};
