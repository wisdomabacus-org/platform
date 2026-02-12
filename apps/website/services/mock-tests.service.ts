import { createClient } from '@/lib/supabase/client';

const getSupabaseClient = () => createClient();

export interface MockTestAttempt {
  id: string;
  mockTestId: string;
  submissionId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
}

export const mockTestsService = {
  /**
   * Check if the current user has attempted a mock test
   */
  checkAttempt: async (mockTestId: string): Promise<{ hasAttempted: boolean; attempt?: MockTestAttempt }> => {
    const supabase = getSupabaseClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { hasAttempted: false };
    }

    const { data, error } = await supabase
      .from('user_mock_test_attempts')
      .select(`
        id,
        mock_test_id,
        submission_id,
        submissions!submission_id(
          score,
          total_questions,
          submitted_at
        )
      `)
      .eq('user_id', user.id)
      .eq('mock_test_id', mockTestId)
      .maybeSingle();

    if (error) {
      console.error('Error checking mock test attempt:', error);
      return { hasAttempted: false };
    }

    if (!data) {
      return { hasAttempted: false };
    }

    const submission = data.submissions as any;
    const totalMarks = submission?.total_questions || 0;
    const score = submission?.score || 0;
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    return {
      hasAttempted: true,
      attempt: {
        id: data.id,
        mockTestId: data.mock_test_id,
        submissionId: data.submission_id || '',
        score: score,
        totalMarks: totalMarks,
        percentage: percentage,
        submittedAt: submission?.submitted_at,
      },
    };
  },

  /**
   * Get all mock test attempts for the current user
   */
  getUserAttempts: async (): Promise<MockTestAttempt[]> => {
    const supabase = getSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_mock_test_attempts')
      .select(`
        id,
        mock_test_id,
        submission_id,
        submissions!submission_id(
          score,
          total_questions,
          submitted_at
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user attempts:', error);
      return [];
    }

    return (data || []).map((item: any) => {
      const submission = item.submissions as any;
      const totalMarks = submission?.total_questions || 0;
      const score = submission?.score || 0;

      return {
        id: item.id,
        mockTestId: item.mock_test_id,
        submissionId: item.submission_id,
        score: score,
        totalMarks: totalMarks,
        percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
        submittedAt: submission?.submitted_at,
      };
    });
  },

  /**
   * Get all published mock tests (client-side)
   */
  getAll: async () => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mock tests:', error);
      return [];
    }

    return (data || []).map((test: any) => ({
      id: test.id,
      title: test.title,
      description: test.description || '',
      totalQuestions: test.total_questions || 0,
      totalMarks: test.total_questions || 0,
      duration: test.duration || 0,
      minGrade: test.min_grade || 0,
      maxGrade: test.max_grade || 12,
      difficulty: test.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard' | undefined,
      isPublished: test.is_published ?? false,
      isLocked: test.is_locked ?? false,
      isFree: !(test.is_locked ?? false),
      sortOrder: test.sort_order || 0,
      createdAt: test.created_at || new Date().toISOString(),
      updatedAt: test.updated_at || new Date().toISOString(),
    }));
  },

  /**
   * Get single mock test by ID (client-side)
   */
  getById: async (id: string) => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      throw new Error(`Mock test not found: ${id}`);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      totalQuestions: data.total_questions || 0,
      totalMarks: data.total_questions || 0,
      duration: data.duration || 0,
      minGrade: data.min_grade || 0,
      maxGrade: data.max_grade || 12,
      difficulty: data.difficulty?.toLowerCase() as 'easy' | 'medium' | 'hard' | undefined,
      isPublished: data.is_published ?? false,
      isLocked: data.is_locked ?? false,
      isFree: !(data.is_locked ?? false),
      sortOrder: data.sort_order || 0,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  },
};
