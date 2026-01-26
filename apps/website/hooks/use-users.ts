// hooks/use-users.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import type { UpdateUserProfileData } from "@/types/auth";

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: (data: UpdateUserProfileData) => usersService.updateProfile(data),
        onSuccess: (updatedUser) => {
            console.log("Profile update successful, updated user:", updatedUser); // Debug log

            // Update auth store with new user data
            setUser(updatedUser);

            // Invalidate both user and auth queries
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            console.log("Mutation error:", error); // Debug log

            // Check if it's a validation error (400)
            // The axios interceptor extracts the error, so status is directly on error object
            const errorCode = error?.status;

            // Only show toast for non-validation errors (500, network errors, etc.)
            if (errorCode !== 400) {
                toast.error(error.message || "Failed to update profile. Please try again.");
            }
        },
    });
}