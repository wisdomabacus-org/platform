import { supabase } from '@/lib/supabase';
import { extractErrorMessage } from '@/lib/error-handler';

export interface MockTestAttempt {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  mockTestId: string;
  submissionId: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  percentage: number;
  timeTaken: number;
  startedAt: Date;
  submittedAt: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export const mockTestAttemptsService = {
  /**
   * Get all attempts for a specific mock test
   */
  getByMockTest: async (mockTestId: string, options?: { page?: number; limit?: number }) => {
    const page = options?.page || 0;
    const limit = options?.limit || 50;
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('user_mock_test_attempts')
      .select(`
        *,
        profiles!user_id(id, student_name, phone, email, uid),
        submissions!submission_id(
          id, 
          score, 
          total_questions, 
          correct_answers, 
          incorrect_answers, 
          unanswered, 
          time_taken,
          started_at,
          submitted_at,
          status
        )
      `, { count: 'exact' })
      .eq('mock_test_id', mockTestId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching mock test attempts:', error);
      throw new Error(extractErrorMessage(error));
    }

    // Map to a cleaner format
    const attempts: MockTestAttempt[] = (data || []).map((a: any) => {
      const submission = a.submissions || {};
      const totalQuestions = submission.total_questions || 0;
      const score = submission.score || 0;
      const totalMarks = totalQuestions; // Assuming 1 mark per question
      const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

      return {
        id: a.id,
        userId: a.user_id,
        userName: a.profiles?.student_name || a.profiles?.email || 'Unknown',
        userPhone: a.profiles?.phone || '—',
        userEmail: a.profiles?.email || '—',
        mockTestId: a.mock_test_id,
        submissionId: a.submission_id,
        score: score,
        totalMarks: totalMarks,
        correctAnswers: submission.correct_answers || 0,
        incorrectAnswers: submission.incorrect_answers || 0,
        unanswered: submission.unanswered || 0,
        percentage: percentage,
        timeTaken: submission.time_taken || 0,
        startedAt: new Date(submission.started_at || a.created_at),
        submittedAt: submission.submitted_at ? new Date(submission.submitted_at) : new Date(),
        status: submission.status || 'completed',
      };
    });

    return {
      data: attempts,
      total: count || 0,
      page,
      limit,
    };
  },

  /**
   * Get attempts by user
   */
  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_mock_test_attempts')
      .select(`
        *,
        mock_tests!mock_test_id(id, title, difficulty, total_questions),
        submissions!submission_id(
          id, 
          score, 
          total_questions, 
          correct_answers, 
          incorrect_answers, 
          time_taken,
          started_at,
          submitted_at,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user attempts:', error);
      throw new Error(extractErrorMessage(error));
    }

    return (data || []).map((a: any) => {
      const submission = a.submissions || {};
      const totalQuestions = submission.total_questions || 0;
      const score = submission.score || 0;
      const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

      return {
        id: a.id,
        userId: a.user_id,
        mockTestId: a.mock_test_id,
        mockTestTitle: a.mock_tests?.title || 'Unknown Test',
        mockTestDifficulty: a.mock_tests?.difficulty || 'Beginner',
        submissionId: a.submission_id,
        score: score,
        totalMarks: totalQuestions,
        correctAnswers: submission.correct_answers || 0,
        incorrectAnswers: submission.incorrect_answers || 0,
        unanswered: submission.unanswered || 0,
        percentage: percentage,
        timeTaken: submission.time_taken || 0,
        startedAt: new Date(submission.started_at || a.created_at),
        submittedAt: submission.submitted_at ? new Date(submission.submitted_at) : new Date(),
        status: submission.status || 'completed',
      };
    });
  },

  /**
   * Get attempt statistics for a mock test
   */
  getStats: async (mockTestId: string) => {
    const { data, error } = await supabase
      .from('user_mock_test_attempts')
      .select(`
        id,
        submissions!submission_id(score, total_questions, correct_answers, status)
      `)
      .eq('mock_test_id', mockTestId);

    if (error) {
      console.error('Error fetching attempt stats:', error);
      throw new Error(extractErrorMessage(error));
    }

    const attempts = data || [];
    const totalAttempts = attempts.length;
    
    if (totalAttempts === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        averagePercentage: 0,
        highestScore: 0,
        lowestScore: 0,
        completionRate: 0,
      };
    }

    const scores = attempts.map((a: any) => a.submissions?.score || 0);
    const totalQuestions = attempts[0]?.submissions?.total_questions || 1;
    
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalAttempts);
    const averagePercentage = Math.round((averageScore / totalQuestions) * 100);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    
    const completedAttempts = attempts.filter((a: any) => 
      a.submissions?.status === 'completed'
    ).length;
    const completionRate = Math.round((completedAttempts / totalAttempts) * 100);

    return {
      totalAttempts,
      averageScore,
      averagePercentage,
      highestScore,
      lowestScore,
      completionRate,
    };
  },

  /**
   * Check if a user has attempted a mock test
   */
  hasUserAttempted: async (userId: string, mockTestId: string) => {
    const { data, error } = await supabase
      .from('user_mock_test_attempts')
      .select('id')
      .eq('user_id', userId)
      .eq('mock_test_id', mockTestId)
      .maybeSingle();

    if (error) {
      console.error('Error checking attempt:', error);
      throw new Error(extractErrorMessage(error));
    }

    return !!data;
  },

  /**
   * Delete an attempt (use with caution)
   */
  delete: async (id: string) => {
    const { error } = await supabase
      .from('user_mock_test_attempts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting attempt:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
