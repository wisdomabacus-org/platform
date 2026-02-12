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

// Custom error class for exam-related errors
export class ExamError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ExamError';
  }
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

    // Check if user is authenticated before calling the function
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new ExamError('Please login to start the exam', 'UNAUTHORIZED');
    }

    console.log('Starting exam with auth:', { 
      examId, 
      examType, 
      hasToken: !!session.access_token,
      tokenPreview: session.access_token?.substring(0, 20) + '...'
    });

    try {
      // Call Edge Function - supabase client automatically adds Authorization header
      const { data, error } = await supabase.functions.invoke('exam-start', {
        body: {
          exam_id: examId,
          exam_type: examType,
        },
      });

      console.log('exam-start response:', { data, error });

      if (error) {
        console.error('exam-start error:', error);
        
        // Handle specific error types
        if (error.message?.includes('CORS')) {
          throw new ExamError('Connection error. Please try again.', 'CORS_ERROR');
        }
        
        if (error.message?.includes('Failed to send')) {
          throw new ExamError('Network error. Please check your connection.', 'NETWORK_ERROR');
        }
        
        throw new ExamError(error.message || 'Failed to start exam', 'FUNCTION_ERROR');
      }

      if (!data?.success) {
        const errorMessage = data?.error || 'Failed to start exam';
        
        // Map specific error messages to user-friendly ones
        if (errorMessage.includes('already attempted') || errorMessage.includes('already submitted')) {
          throw new ExamError(
            'You have already completed this mock test. You can only attempt it once.',
            'ALREADY_ATTEMPTED'
          );
        }
        
        if (errorMessage.includes('not enrolled')) {
          throw new ExamError(
            'You are not enrolled in this competition. Please enroll first.',
            'NOT_ENROLLED'
          );
        }
        
        if (errorMessage.includes('grades')) {
          throw new ExamError(errorMessage, 'GRADE_MISMATCH');
        }
        
        if (errorMessage.includes('expired')) {
          throw new ExamError('Your session has expired. Please login again.', 'SESSION_EXPIRED');
        }
        
        if (errorMessage.includes('not started yet')) {
          throw new ExamError('The exam has not started yet. Please check the schedule.', 'EXAM_NOT_STARTED');
        }
        
        if (errorMessage.includes('window has closed')) {
          throw new ExamError('The exam window has closed. You can no longer start this exam.', 'EXAM_CLOSED');
        }
        
        throw new ExamError(errorMessage, 'START_FAILED');
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
    } catch (err) {
      // Re-throw ExamError as-is
      if (err instanceof ExamError) {
        throw err;
      }
      
      // Handle unexpected errors
      console.error('Unexpected error in startExam:', err);
      throw new ExamError(
        'An unexpected error occurred. Please try again.',
        'UNKNOWN_ERROR'
      );
    }
  },
};
