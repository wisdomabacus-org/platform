/**
 * Auth Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based auth service with native Supabase Auth.
 * Function signatures remain identical to prevent UI breakage.
 * 
 * @see https://supabase.com/docs/guides/auth
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { mapDbProfileToUser, type User } from '@/lib/supabase/entity-mappers';
import type {
  RegisterResponse,
  LoginResponse,
  VerifyEmailResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '@/types/auth';

/**
 * Get current Supabase client instance
 */
function getSupabaseClient() {
  return createClient();
}

/**
 * Auth Service - Supabase Native Implementation
 */
export const authService = {
  /**
   * Register with email and password
   * Creates a new Supabase auth user and triggers email verification
   */
  register: async (data: {
    email: string;
    password: string;
    referralCode?: string;
  }): Promise<RegisterResponse> => {
    const supabase = getSupabaseClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        // Store referral code in user metadata
        data: {
          referred_by_code: data.referralCode,
        },
        // Email confirmation required
        emailRedirectTo: `${window.location.origin}/verify`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // User created - email verification sent automatically by Supabase
    return {
      message: 'Registration successful! Please check your email to verify your account.',
      email: data.email,
    };
  },

  /**
   * Login with email and password
   * Authenticates user and establishes session
   */
  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const supabase = getSupabaseClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error('Login failed - no user returned');
    }

    // Fetch the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      // Profile might not exist yet for new users
      console.warn('Profile fetch error:', profileError.message);
    }

    // Map the profile to frontend User type, or create minimal user from auth
    const user: User = profile
      ? mapDbProfileToUser(profile)
      : {
        id: authData.user.id,
        uid: authData.user.id,
        email: authData.user.email,
        authProvider: 'email',
        isProfileComplete: false,
        createdAt: authData.user.created_at,
        updatedAt: authData.user.updated_at || authData.user.created_at,
      };

    return { user };
  },

  /**
   * Login with Google OAuth
   * Redirects to Google for authentication
   */
  loginWithGoogle: async (): Promise<void> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Logout
   * Signs out the user and clears the session
   */
  logout: async (): Promise<void> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Verify email with token (handled by Supabase automatically)
   * This is called after user clicks the email verification link
   */
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    // Supabase handles email verification automatically via the callback URL
    // The token verification happens when the user clicks the link
    // This method is kept for backward compatibility
    return {
      message: 'Email verification successful!',
    };
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Verification email sent! Please check your inbox.',
    };
  },

  /**
   * Request password reset
   * Sends a password reset email
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Password reset email sent! Please check your inbox.',
    };
  },

  /**
   * Reset password with new password
   * Called after user clicks the reset link and enters new password
   */
  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<ResetPasswordResponse> => {
    const supabase = getSupabaseClient();

    // The user should already be authenticated via the reset link
    // We just need to update the password
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Password reset successful! You can now login with your new password.',
    };
  },

  /**
   * Get current authenticated user from session
   */
  getMe: async (): Promise<User> => {
    const supabase = getSupabaseClient();

    // First get the authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      throw new Error('Not authenticated');
    }

    // Then fetch their profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // Fetch user enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('competition_id')
      .eq('user_id', authUser.id)
      .eq('status', 'confirmed')
      .eq('is_payment_confirmed', true);

    // Fetch user mock test attempts
    const { data: mockTestAttempts } = await supabase
      .from('user_mock_test_attempts')
      .select('mock_test_id')
      .eq('user_id', authUser.id);

    const enrolledCompetitions = enrollments?.map(e => e.competition_id) || [];
    const attemptedMockTests = mockTestAttempts?.map(m => m.mock_test_id) || [];

    if (profileError) {
      // Return minimal user if profile doesn't exist
      return {
        id: authUser.id,
        uid: authUser.id,
        email: authUser.email,
        phone: authUser.phone,
        authProvider: 'email',
        isProfileComplete: false,
        enrolledCompetitions,
        attemptedMockTests,
        createdAt: authUser.created_at,
        updatedAt: authUser.updated_at || authUser.created_at,
      };
    }

    const user = mapDbProfileToUser(profile);
    // Add enrollments and attempts to the user object
    return {
      ...user,
      enrolledCompetitions,
      attemptedMockTests,
    };
  },

  /**
   * Send OTP (phone auth)
   * Sends an OTP to the provided phone number
   */
  sendOtp: async (phone: string): Promise<{ message: string }> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'OTP sent successfully!',
    };
  },

  /**
   * Verify OTP and login
   */
  verifyOtp: async (data: {
    phone: string;
    token: string;
  }): Promise<LoginResponse> => {
    const supabase = getSupabaseClient();

    const { data: authData, error } = await supabase.auth.verifyOtp({
      phone: data.phone,
      token: data.token,
      type: 'sms',
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error('OTP verification failed');
    }

    // Fetch or create profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const user: User = profile
      ? mapDbProfileToUser(profile)
      : {
        id: authData.user.id,
        uid: authData.user.id,
        phone: authData.user.phone,
        authProvider: 'phone',
        isProfileComplete: false,
        createdAt: authData.user.created_at,
        updatedAt: authData.user.updated_at || authData.user.created_at,
      };

    return { user };
  },

  /**
   * Get current session (for internal use)
   */
  getSession: async () => {
    const supabase = getSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return session;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
    const supabase = getSupabaseClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};
