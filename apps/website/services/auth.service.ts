import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/types/api.types";
import {
  RegisterResponse,
  User,
  VerifyEmailResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  LoginResponse,
} from "@/types/auth";
import Cookies from "js-cookie";

/**
 * Auth API endpoints
 */
const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  ME: "/auth/me",
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
} as const;

/**
 * Auth Service
 */
export const authService = {
  /**
   * Register with email and password
   */
  register: async (data: {
    email: string;
    password: string;
    referralCode?: string;
  }): Promise<RegisterResponse> => {
    // Interceptor returns ApiResponse directly
    const response = (await apiClient.post(
      AUTH_ENDPOINTS.REGISTER,
      data
    )) as ApiResponse<RegisterResponse>;
    return response.data!;
  },

  /**
   * Login with email and password
   */
  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    // Interceptor returns ApiResponse directly
    const response = (await apiClient.post(
      AUTH_ENDPOINTS.LOGIN,
      data
    )) as ApiResponse<{ message: string; data: User }>;

    // Backend returns: { success: true, data: { message: "...", data: User } }
    // After interceptor unwrap: { success: true, data: { message: "...", data: User } }
    // So we need: response.data.data (the User object)

    // Store CSRF token (it's set as cookie by backend, but we might need it)
    const user = response.data!.data;

    return {
      user,
    };
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    Cookies.remove("csrf_token");
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const response = (await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, {
      token,
    })) as ApiResponse<{ message: string }>;
    return response.data!;
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = (await apiClient.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, {
      email,
    })) as ApiResponse<{ message: string }>;
    return response.data!;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = (await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    })) as ApiResponse<{ message: string }>;
    return response.data!;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<ResetPasswordResponse> => {
    const response = (await apiClient.post(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      data
    )) as ApiResponse<{ message: string }>;
    return response.data!;
  },

  /**
   * ✅ UPDATED: Get current authenticated user from session
   */
  getMe: async (): Promise<User> => {
    const response = (await apiClient.get(AUTH_ENDPOINTS.ME)) as ApiResponse<{
      user: User;
    }>;
    return response.data!.user;
  },
  /**
   * Send OTP (phone auth)
   */
  sendOtp: async (phone: string): Promise<{ message: string }> => {
    const response = (await apiClient.post(AUTH_ENDPOINTS.SEND_OTP, {
      phone,
    })) as ApiResponse<{ message: string }>;
    return response.data!;
  },
};
