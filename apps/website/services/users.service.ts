// services/users.service.ts
import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/lib/types/api.types";
import type { User, UpdateUserProfileData } from "@/types/auth";

export const usersService = {
    /**
     * Get current user profile
     * GET /users/me
     */
    getMe: async (): Promise<User> => {
        const response = await apiClient.get("/users/me") as ApiResponse<User>;
        return response.data!;
    },

    /**
     * Update user profile
     * PATCH /users/me
     */
    updateProfile: async (data: UpdateUserProfileData): Promise<User> => {
        const response = await apiClient.patch("/users/me", data) as ApiResponse<{ message: string; data: User }>;
        return response.data!.data;
    },
};
