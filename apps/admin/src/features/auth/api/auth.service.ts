
import { supabase } from '@/lib/supabase';
import type { LoginRequest, LoginResponse, Admin } from '../types/auth.types';
import { AdminStatus } from '../types/auth.types';

// Mocking ApiResponse for now
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export const authService = {
  /**
   * Admin login with Role Check
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      // 2. Verify Admin Role in admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        // Not an admin, sign out immediately
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Access Restricted to Admins');
      }

      if (adminData.status !== 'active') {
        await supabase.auth.signOut();
        throw new Error('Account is suspended or inactive');
      }

      const admin: Admin = {
        id: adminData.id,
        username: adminData.username || authData.user.email || '', // fallback
        name: adminData.name || undefined,
        status: adminData.status as AdminStatus,
      };

      return { success: true, data: admin };

    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: { message: error.message } };
    }
  },

  /**
   * Admin logout
   */
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: { message: error.message } };
    }
    return { success: true, data: { message: 'Logged out' } };
  },

  /**
   * Get current admin profile/session
   */
  getProfile: async (): Promise<ApiResponse<Admin>> => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return { success: false, error: { message: 'No session' } };
    }

    // Verify against table again for security on refresh
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // If not found in admin_users, strictly speaking we should log them out, 
    // but for getProfile we just return error/null so the hook clears state.
    if (!adminData) {
      return { success: false, error: { message: 'Not an admin' } };
    }

    const admin: Admin = {
      id: adminData.id,
      username: adminData.username || session.user.email || '',
      name: adminData.name || undefined,
      status: adminData.status as AdminStatus,
    };

    return { success: true, data: admin };
  },
};
