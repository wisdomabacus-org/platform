/**
 * Competitions Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based service with native Supabase queries.
 * Function signatures remain identical to prevent UI breakage.
 */

import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {
  mapDbCompetitionToCompetition,
  type DbCompetitionWithStatus,
  type DbCompetitionPrize,
  type DbCompetitionSyllabus,
} from '@/lib/supabase/entity-mappers';
import type {
  Competition,
  CompetitionResults,
  EnrollmentStatus,
  CompetitionListQuery,
} from '@/types/competition';

/**
 * Helper to get Supabase client (works on both client and server)
 */
function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: we need to handle this differently
    // For now, use the browser client pattern (will work with SSR)
    throw new Error('Use server-side methods for server components');
  }
  return createClient();
}

/**
 * Competitions Service - Supabase Native Implementation
 */
export const competitionsService = {
  // ==========================================
  // Public Endpoints
  // ==========================================

  /**
   * Get featured competition
   * Uses the competitions_with_status view and filters by is_featured
   */
  getFeatured: async (): Promise<Competition | null> => {
    try {
      const supabase = getSupabaseClient();

      // Get featured competition from view
      const { data: competition, error } = await supabase
        .from('competitions_with_status')
        .select('*')
        .eq('is_featured', true)
        .eq('is_published', true)
        .single();

      if (error || !competition || !competition.id) {
        console.warn('No featured competition found:', error?.message);
        return null;
      }

      const competitionId = competition.id;

      // Fetch syllabus and prizes
      const [syllabusResult, prizesResult] = await Promise.all([
        supabase
          .from('competition_syllabus')
          .select('*')
          .eq('competition_id', competitionId)
          .order('sort_order'),
        supabase
          .from('competition_prizes')
          .select('*')
          .eq('competition_id', competitionId)
          .order('rank'),
      ]);

      return mapDbCompetitionToCompetition(
        competition as unknown as DbCompetitionWithStatus,
        (syllabusResult.data || []) as DbCompetitionSyllabus[],
        (prizesResult.data || []) as DbCompetitionPrize[]
      );
    } catch (error) {
      console.warn('No featured competition found or error fetching:', error);
      return null;
    }
  },

  /**
   * Get all public competitions with filters
   * Uses the competitions_with_status view
   */
  getAllPublic: async (
    filters: Partial<CompetitionListQuery> = {}
  ): Promise<Competition[]> => {
    try {
      const supabase = getSupabaseClient();

      let query = supabase
        .from('competitions_with_status')
        .select('*')
        .eq('is_published', true);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.minGrade !== undefined) {
        query = query.gte('max_grade', filters.minGrade);
      }
      if (filters.maxGrade !== undefined) {
        query = query.lte('min_grade', filters.maxGrade);
      }
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by registration end date
      query = query.order('registration_end_date', { ascending: false });

      const { data: competitions, error } = await query;

      if (error) {
        console.error('Error fetching competitions:', error.message);
        return [];
      }

      // For list views, we don't need to fetch syllabus and prizes
      return (competitions || []).map((comp) =>
        mapDbCompetitionToCompetition(
          comp as unknown as DbCompetitionWithStatus,
          [],
          []
        )
      );
    } catch (error) {
      console.error('Failed to fetch competitions:', error);
      return [];
    }
  },

  /**
   * Get single competition details by ID or slug (public)
   */
  getById: async (idOrSlug: string): Promise<Competition> => {
    const supabase = getSupabaseClient();

    // First try to find by slug, then by id
    let { data: competition, error } = await supabase
      .from('competitions_with_status')
      .select('*')
      .eq('slug', idOrSlug)
      .eq('is_published', true)
      .single();

    // If not found by slug, try by id
    if (error || !competition) {
      const result = await supabase
        .from('competitions_with_status')
        .select('*')
        .eq('id', idOrSlug)
        .eq('is_published', true)
        .single();

      competition = result.data;
      error = result.error;
    }

    if (error || !competition || !competition.id) {
      throw new Error(`Competition not found: ${idOrSlug}`);
    }

    const competitionId = competition.id;

    // Fetch syllabus and prizes
    const [syllabusResult, prizesResult] = await Promise.all([
      supabase
        .from('competition_syllabus')
        .select('*')
        .eq('competition_id', competitionId)
        .order('sort_order'),
      supabase
        .from('competition_prizes')
        .select('*')
        .eq('competition_id', competitionId)
        .order('rank'),
    ]);

    return mapDbCompetitionToCompetition(
      competition as unknown as DbCompetitionWithStatus,
      (syllabusResult.data || []) as DbCompetitionSyllabus[],
      (prizesResult.data || []) as DbCompetitionPrize[]
    );
  },

  /**
   * Get competition results (public)
   * Uses the competition_leaderboard view
   */
  getResults: async (competitionId: string): Promise<CompetitionResults> => {
    const supabase = getSupabaseClient();

    // Get competition title
    const { data: competition } = await supabase
      .from('competitions')
      .select('title')
      .eq('id', competitionId)
      .single();

    // Get leaderboard from view
    const { data: leaderboard, error } = await supabase
      .from('competition_leaderboard')
      .select('*')
      .eq('competition_id', competitionId)
      .order('rank');

    if (error) {
      throw new Error(`Failed to fetch results: ${error.message}`);
    }

    return {
      competitionTitle: competition?.title || 'Unknown Competition',
      results: (leaderboard || []).map((entry) => ({
        rank: entry.rank ?? 0,
        studentName: entry.student_name ?? 'Anonymous',
        studentGrade: entry.student_grade ?? undefined,
        schoolName: entry.school_name ?? undefined,
        city: entry.city ?? undefined,
        score: entry.score ?? 0,
        timeTaken: entry.time_taken ?? undefined,
        submittedAt: entry.submitted_at ?? undefined,
      })),
    };
  },

  // ==========================================
  // Authenticated Endpoints
  // ==========================================

  /**
   * Get competitions for logged-in user (based on their grade/profile)
   */
  getMyCompetitions: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<Competition[]> => {
    const supabase = getSupabaseClient();

    // Get current user's profile for grade filtering
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Return public competitions if not authenticated
      return competitionsService.getAllPublic(params);
    }

    // Get user's grade from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('student_grade')
      .eq('id', user.id)
      .single();

    const userGrade = profile?.student_grade;

    // Build query
    let query = supabase
      .from('competitions_with_status')
      .select('*')
      .eq('is_published', true);

    // Filter by grade if available
    if (userGrade) {
      query = query.lte('min_grade', userGrade).gte('max_grade', userGrade);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    query = query.order('registration_end_date', { ascending: false });

    const { data: competitions, error } = await query;

    if (error) {
      console.error('Error fetching competitions:', error.message);
      return [];
    }

    return (competitions || []).map((comp) =>
      mapDbCompetitionToCompetition(
        comp as unknown as DbCompetitionWithStatus,
        [],
        []
      )
    );
  },

  /**
   * Check enrollment status for a competition
   */
  checkEnrollment: async (competitionId: string): Promise<EnrollmentStatus> => {
    try {
      const supabase = getSupabaseClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { isEnrolled: false };
      }

      // Check enrollment
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select('id, status, is_payment_confirmed')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
        .single();

      if (error || !enrollment) {
        return { isEnrolled: false };
      }

      // Check if they can start exam
      const { data: competition } = await supabase
        .from('competitions_with_status')
        .select('is_exam_active')
        .eq('id', competitionId)
        .single();

      return {
        isEnrolled: true,
        enrollmentId: enrollment.id,
        paymentStatus: enrollment.is_payment_confirmed ? 'COMPLETED' : 'PENDING',
        canStartExam:
          !!(enrollment.is_payment_confirmed && competition?.is_exam_active),
      };
    } catch (error) {
      return { isEnrolled: false };
    }
  },
};

// ==========================================
// Server-side functions for SSR/ISR
// ==========================================

/**
 * Server-side: Get featured competition
 * Use this in Server Components
 */
export async function getFeaturedCompetitionServer(): Promise<Competition | null> {
  try {
    const supabase = await createServerClient();

    const { data: competition, error } = await supabase
      .from('competitions_with_status')
      .select('*')
      .eq('is_featured', true)
      .eq('is_published', true)
      .single();

    if (error || !competition || !competition.id) {
      return null;
    }

    const competitionId = competition.id;

    const [syllabusResult, prizesResult] = await Promise.all([
      supabase
        .from('competition_syllabus')
        .select('*')
        .eq('competition_id', competitionId)
        .order('sort_order'),
      supabase
        .from('competition_prizes')
        .select('*')
        .eq('competition_id', competitionId)
        .order('rank'),
    ]);

    return mapDbCompetitionToCompetition(
      competition as unknown as DbCompetitionWithStatus,
      (syllabusResult.data || []) as DbCompetitionSyllabus[],
      (prizesResult.data || []) as DbCompetitionPrize[]
    );
  } catch {
    return null;
  }
}

/**
 * Server-side: Get all public competitions
 * Use this in Server Components
 */
export async function getAllPublicCompetitionsServer(
  filters: Partial<CompetitionListQuery> = {}
): Promise<Competition[]> {
  try {
    const supabase = await createServerClient();

    let query = supabase
      .from('competitions_with_status')
      .select('*')
      .eq('is_published', true);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    query = query.order('registration_end_date', { ascending: false });

    const { data: competitions, error } = await query;

    if (error) {
      return [];
    }

    return (competitions || []).map((comp) =>
      mapDbCompetitionToCompetition(
        comp as unknown as DbCompetitionWithStatus,
        [],
        []
      )
    );
  } catch {
    return [];
  }
}

/**
 * Server-side: Get competition by ID or slug
 * Use this in Server Components
 */
export async function getCompetitionByIdServer(
  idOrSlug: string
): Promise<Competition | null> {
  try {
    const supabase = await createServerClient();

    // First try by slug
    let { data: competition } = await supabase
      .from('competitions_with_status')
      .select('*')
      .eq('slug', idOrSlug)
      .eq('is_published', true)
      .single();

    // Then try by id
    if (!competition) {
      const result = await supabase
        .from('competitions_with_status')
        .select('*')
        .eq('id', idOrSlug)
        .eq('is_published', true)
        .single();
      competition = result.data;
    }

    if (!competition || !competition.id) {
      return null;
    }

    const compId = competition.id;

    const [syllabusResult, prizesResult] = await Promise.all([
      supabase
        .from('competition_syllabus')
        .select('*')
        .eq('competition_id', compId)
        .order('sort_order'),
      supabase
        .from('competition_prizes')
        .select('*')
        .eq('competition_id', compId)
        .order('rank'),
    ]);

    return mapDbCompetitionToCompetition(
      competition as unknown as DbCompetitionWithStatus,
      (syllabusResult.data || []) as DbCompetitionSyllabus[],
      (prizesResult.data || []) as DbCompetitionPrize[]
    );
  } catch {
    return null;
  }
}

/**
 * Server-side: Get competition results
 */
export async function getCompetitionResultsServer(
  competitionId: string
): Promise<CompetitionResults | null> {
  try {
    const supabase = await createServerClient();

    const { data: competition } = await supabase
      .from('competitions')
      .select('title')
      .eq('id', competitionId)
      .single();

    const { data: leaderboard, error } = await supabase
      .from('competition_leaderboard')
      .select('*')
      .eq('competition_id', competitionId)
      .order('rank');

    if (error) {
      return null;
    }

    return {
      competitionTitle: competition?.title || 'Unknown Competition',
      results: (leaderboard || []).map((entry) => ({
        rank: entry.rank ?? 0,
        studentName: entry.student_name ?? 'Anonymous',
        score: entry.score ?? 0,
        submittedAt: entry.submitted_at ?? '',
      })),
    };
  } catch {
    return null;
  }
}
