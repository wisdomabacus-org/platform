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
        submissionId: data.submission_id,
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
};
