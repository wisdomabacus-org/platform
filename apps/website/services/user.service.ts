/**
 * User Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based service with direct Supabase queries.
 */

import { createClient } from '@/lib/supabase/client';
import {
  mapDbProfileToUser,
  mapUserToDbProfileUpdate,
} from '@/lib/supabase/entity-mappers';
import type { UpdateProfileDto, User } from '@/types/auth';

/**
 * Get Supabase client
 */
function getSupabaseClient() {
  return createClient();
}

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const supabase = getSupabaseClient();

    // Get authenticated user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      throw new Error('Not authenticated');
    }

    // Get profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error || !profile) {
      // Return minimal user if no profile exists
      return {
        id: authUser.id,
        uid: authUser.id,
        email: authUser.email,
        phone: authUser.phone,
        authProvider: 'email',
        isProfileComplete: false,
        createdAt: authUser.created_at,
        updatedAt: authUser.updated_at || authUser.created_at,
      };
    }

    return mapDbProfileToUser(profile);
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    data: UpdateProfileDto
  ): Promise<{ user: User; message: string }> => {
    const supabase = getSupabaseClient();

    // Get authenticated user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      throw new Error('Not authenticated');
    }

    // Map frontend data to database format
    const updateData = mapUserToDbProfileUpdate(data);

    // Check if all required fields are present to mark profile as complete
    const isComplete = !!(
      data.parentName &&
      data.studentName &&
      data.studentGrade &&
      data.schoolName &&
      data.city &&
      data.state &&
      data.phone &&
      data.dateOfBirth
    );

    // Update profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        is_profile_complete: isComplete,
      })
      .eq('id', authUser.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return {
      user: mapDbProfileToUser(profile),
      message: 'Profile updated successfully',
    };
  },
};

// Alias for backward compatibility
export const usersService = {
  /**
   * Get current user profile (alias for userService.getProfile)
   */
  getMe: userService.getProfile,

  /**
   * Update user profile (returns just the user)
   */
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const result = await userService.updateProfile(data);
    return result.user;
  },
};
