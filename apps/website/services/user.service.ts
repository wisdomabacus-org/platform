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
      console.error('Profile update failed: Not authenticated', authError);
      throw new Error('Not authenticated');
    }

    // Map frontend data to database format
    const updateData = mapUserToDbProfileUpdate(data);

    // Check if all required fields are present to mark profile as complete
    // Note: studentGrade can be 0 (UKG), so we strictly check for undefined/null
    const isComplete = !!(
      data.parentName &&
      data.studentName &&
      (data.studentGrade !== undefined && data.studentGrade !== null) &&
      data.schoolName &&
      data.city &&
      data.state &&
      data.phone &&
      data.dateOfBirth
    );

    console.log('Updating profile for user:', authUser.id);
    console.log('Update data:', updateData);
    console.log('Is complete:', isComplete);

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
      console.error('Profile update error:', error);

      // Provide more helpful error messages based on error code
      if (error.code === '23514') {
        // Check constraint violation
        throw new Error('Invalid data: Please check that all fields have valid values (Grade should be between UKG and 12)');
      } else if (error.code === '42501') {
        // RLS policy violation
        throw new Error('Permission denied: You can only update your own profile');
      } else if (error.code === 'PGRST116') {
        // No rows returned - profile might not exist
        throw new Error('Profile not found. Please contact support.');
      }

      throw new Error(`Failed to update profile: ${error.message}`);
    }

    if (!profile) {
      console.error('Profile update returned no data');
      throw new Error('Failed to update profile: No data returned');
    }

    console.log('Profile updated successfully:', profile);

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
