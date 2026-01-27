import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth.service';
import { useAuthStore } from '../store/auth-store';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import type { LoginRequest } from '../types/auth.types';
import { toast } from 'sonner';

/**
 * Login mutation hook
 */
export function useLogin() {
  const navigate = useNavigate();
  const setAdmin = useAuthStore((state) => state.setAdmin);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAdmin(response.data);
        toast.success('Login successful!');
        navigate(ROUTES.DASHBOARD);
      }
    },
    onError: (error: any) => {
      // Check if error comes from our service wrapper (ApiResponse.error.message) or generic error
      const message = error?.message || 'Login failed';
      toast.error(message);
    },
  });
}

/**
 * Logout mutation hook
 */
export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      const message = error?.message || 'Logout failed';
      toast.error(message);
    },
  });
}

/**
 * Get admin profile/session
 */
export function useAdminProfile() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useQuery({
    queryKey: [QUERY_KEYS.AUTH, 'profile'],
    queryFn: async () => {
      const response = await authService.getProfile();
      return response.data;
    },
    staleTime: Infinity,
    retry: false,
    enabled: false,
    throwOnError: (error: any) => {
      // Supabase auth errors usually don't have status 401 in the same way axios does, 
      // but if we fail to get session, clearAuth is good.
      // However, we can just let it fail and handle in UI or useEffect.
      if (error?.message?.includes('No session') || error?.code === '401') {
        clearAuth();
      }
      return false;
    },
  });
}
