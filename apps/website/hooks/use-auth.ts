/**
 * Auth Hooks - Supabase Integration
 * 
 * React hooks for authentication using Supabase.
 */

'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
  session: ["auth", "session"] as const,
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, logout: clearAuthState } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success(data.message || "Registration successful! Please check your email.");
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
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuthState();
      queryClient.clear();
      sessionStorage.clear();
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
      // Refresh user data after verification
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
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
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Password reset failed");
    },
  });

  // OTP mutations for phone auth
  const sendOtpMutation = useMutation({
    mutationFn: authService.sendOtp,
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send OTP");
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
    sendOtp: sendOtpMutation.mutateAsync,
    isLoading:
      registerMutation.isPending ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      verifyEmailMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resendVerificationMutation.isPending ||
      resetPasswordMutation.isPending ||
      sendOtpMutation.isPending,
  };
};

/**
 * Hook to fetch and sync current user from Supabase
 */
export const useCurrentUser = () => {
  const { setUser, setLoading, setInitialized, user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Query to fetch current user
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: async () => {
      try {
        return await authService.getMe();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Sync server state to store whenever data changes
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

  // Subscribe to Supabase auth state changes
  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Refetch user data when signed in or token refreshed
          queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
        } else if (event === 'SIGNED_OUT') {
          // Clear user data on sign out
          setUser(null);
          queryClient.clear();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, setUser]);

  return {
    user: data || user,
    isAuthenticated: !!data || isAuthenticated,
    isLoading,
    refetch,
  };
};
