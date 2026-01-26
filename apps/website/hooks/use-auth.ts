import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, logout: clearAuthState } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success(data.message || "Registration successful! Please login.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      toast.success(data.message || "Login successful!");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuthState();
      Cookies.remove("csrf_token");
      queryClient.clear();
      sessionStorage.clear(); // ✅ Clear session storage
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (data) => {
      toast.success(data.message || "Email verified successfully!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Email verification failed");
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: authService.resendVerification,
    onSuccess: (data) => {
      toast.success(data.message || "Verification email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend verification email");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Request failed");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successful!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Password reset failed");
    },
  });

  return {
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    resendVerification: resendVerificationMutation.mutate,
    isLoading:
      registerMutation.isPending ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      verifyEmailMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resendVerificationMutation.isPending ||
      resetPasswordMutation.isPending,
  };
};

/**
 * ✅ UPDATED: Hook to fetch and sync current user from backend
 */
export const useCurrentUser = () => {
  const { setUser, setLoading, setInitialized, user, isAuthenticated } = useAuthStore();
  const hasCsrfToken = typeof window !== 'undefined' && !!Cookies.get('csrf_token');

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authService.getMe,
    enabled: hasCsrfToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // ✅ FIX: Sync server state to store whenever data changes
  useEffect(() => {
    if (data) {
      setUser(data);
      setInitialized(true);
    }
  }, [data, setUser, setInitialized]);

  useEffect(() => {
    if (error) {
      setUser(null);
      setInitialized(true);
    }
  }, [error, setUser, setInitialized]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return {
    user: data || user,
    isAuthenticated: !!data || isAuthenticated,
    isLoading,
    refetch,
  };
};

