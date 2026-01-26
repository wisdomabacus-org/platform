import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/lib/types/api.types';
import type { UpdateProfileDto, User } from '@/types/auth';

const USER_ENDPOINTS = {
  ME: '/users/me',
  UPDATE_PROFILE: '/users/me',
} as const;

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get(USER_ENDPOINTS.ME) as ApiResponse<User>;
    return response.data!;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileDto): Promise<{ user: User; message: string }> => {
    const response = await apiClient.patch(
      USER_ENDPOINTS.UPDATE_PROFILE,
      data
    ) as ApiResponse<{ message: string; data: User }>;

    return {
      user: response.data!.data,
      message: response.data!.message,
    };
  },
};
