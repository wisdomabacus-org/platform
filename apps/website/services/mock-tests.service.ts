/**
 * Mock Tests Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based service with direct Supabase queries.
 */

import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {
  mapDbMockTestToMockTest,
  type DbMockTestWithStatus,
} from '@/lib/supabase/entity-mappers';
import type { MockTest } from '@/types/mock-test';

/**
 * Get Supabase client
 */
function getSupabaseClient() {
  return createClient();
}

export const mockTestsService = {
  /**
   * Get all available mock tests
   * Returns grade-filtered tests for authenticated users, all published for anonymous
   */
  getAll: async (): Promise<MockTest[]> => {
    try {
      const supabase = getSupabaseClient();

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let query = supabase
        .from('mock_tests_with_status')
        .select('*')
        .eq('is_published', true)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      // If user is authenticated, filter by their grade
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('student_grade')
          .eq('id', user.id)
          .single();

        const userGrade = profile?.student_grade;
        if (userGrade) {
          query = query
            .lte('min_grade', userGrade)
            .gte('max_grade', userGrade);
        }
      }

      const { data: mockTests, error } = await query;

      if (error) {
        console.error('Error fetching mock tests:', error.message);
        return [];
      }

      return (mockTests || []).map((test) =>
        mapDbMockTestToMockTest(test as unknown as DbMockTestWithStatus)
      );
    } catch (error) {
      console.error('Failed to fetch mock tests:', error);
      return [];
    }
  },

  /**
   * Get single mock test details
   */
  getById: async (id: string): Promise<MockTest> => {
    const supabase = getSupabaseClient();

    const { data: mockTest, error } = await supabase
      .from('mock_tests_with_status')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error || !mockTest) {
      throw new Error(`Mock test not found: ${id}`);
    }

    return mapDbMockTestToMockTest(mockTest as unknown as DbMockTestWithStatus);
  },
};

// ==========================================
// Server-side functions for SSR/ISR
// ==========================================

/**
 * Server-side: Get all mock tests
 * Use this in Server Components
 */
export async function getAllMockTestsServer(): Promise<MockTest[]> {
  try {
    const supabase = await createServerClient();

    const { data: mockTests, error } = await supabase
      .from('mock_tests_with_status')
      .select('*')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return [];
    }

    return (mockTests || []).map((test) =>
      mapDbMockTestToMockTest(test as unknown as DbMockTestWithStatus)
    );
  } catch {
    return [];
  }
}

/**
 * Server-side: Get mock test by ID
 * Use this in Server Components
 */
export async function getMockTestByIdServer(id: string): Promise<MockTest | null> {
  try {
    const supabase = await createServerClient();

    const { data: mockTest, error } = await supabase
      .from('mock_tests_with_status')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error || !mockTest) {
      return null;
    }

    return mapDbMockTestToMockTest(mockTest as unknown as DbMockTestWithStatus);
  } catch {
    return null;
  }
}
