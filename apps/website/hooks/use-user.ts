import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth-store';
import { AUTH_KEYS } from './use-auth';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      // Update user in store
      setUser(data.user);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      
      toast.success(data.message || 'Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};
