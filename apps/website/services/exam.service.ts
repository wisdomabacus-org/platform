/**
 * Exam Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based service with Supabase Edge Functions.
 */

import { createClient } from '@/lib/supabase/client';
import type { StartExamResponse } from '@/types/exam';

/**
 * Get Supabase client
 */
function getSupabaseClient() {
  return createClient();
}

export const examService = {
  /**
   * Start Exam Session (Redirects to Vite Portal)
   * Uses the exam-start Edge Function
   */
  startExam: async (
    examId: string,
    examType: 'competition' | 'mock-test'
  ): Promise<StartExamResponse> => {
    const supabase = getSupabaseClient();

    // Call Edge Function
    const { data, error } = await supabase.functions.invoke('exam-start', {
      body: {
        exam_id: examId,
        exam_type: examType,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to start exam');
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Failed to start exam');
    }

    // Map response to expected format
    const responseData = data.data;
    const examPortalUrl = process.env.NEXT_PUBLIC_EXAM_PORTAL_URL || 'http://localhost:5173';

    return {
      success: true,
      message: data.message || 'Exam started successfully',
      data: {
        examPortalUrl: `${examPortalUrl}?session=${responseData.session_token}`,
        examTitle: responseData.exam_title || responseData.examTitle,
        totalQuestions: responseData.total_questions || responseData.totalQuestions,
        durationMinutes: responseData.duration_minutes || responseData.durationMinutes,
      },
    };
  },
};
