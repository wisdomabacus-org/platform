/**
 * Enrollments Service - Supabase Integration
 * 
 * Replaces the legacy Axios-based service with Supabase Edge Functions
 * and direct database queries.
 */

import { createClient } from '@/lib/supabase/client';
import { mapDbEnrollmentToEnrollment } from '@/lib/supabase/entity-mappers';
import type {
  Enrollment,
  CreateEnrollmentResponse,
  EnrollmentStatus,
} from '@/types/enrollment';

/**
 * Get Supabase client
 */
function getSupabaseClient() {
  return createClient();
}

export const enrollmentsService = {
  /**
   * Check if user is enrolled in a specific competition
   * Direct database query
   */
  checkStatus: async (competitionId: string): Promise<EnrollmentStatus> => {
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

      // Check if exam is active
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
      console.error('Error checking enrollment status:', error);
      return { isEnrolled: false };
    }
  },

  /**
   * Initiate enrollment (Create Payment & Order)
   * Uses the enroll-competition Edge Function
   */
  createEnrollment: async (
    competitionId: string
  ): Promise<CreateEnrollmentResponse> => {
    const supabase = getSupabaseClient();

    // Get current session for auth
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please login to enroll');
    }

    // Call Edge Function
    const { data, error } = await supabase.functions.invoke('enroll-competition', {
      body: { competition_id: competitionId },
    });

    if (error) {
      throw new Error(error.message || 'Failed to create enrollment');
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Enrollment failed');
    }

    // Map response to expected format (snake_case -> camelCase)
    const response = data.data;
    return {
      paymentId: response.payment_id,
      razorpayOrderId: response.razorpay_order_id,
      amount: response.amount,
      currency: response.currency,
      competitionTitle: response.competition_title,
      // Include razorpay key if needed
      razorpayKeyId: response.razorpay_key_id,
    };
  },

  /**
   * Get all my enrollments
   * Direct database query with joins
   */
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const supabase = getSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Fetch enrollments
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error.message);
      return [];
    }

    // Map to frontend type
    return (enrollments || []).map((enrollment): Enrollment => {
      const mapped = mapDbEnrollmentToEnrollment(enrollment);

      // The snapshots are already JSON, parse if needed
      const competitionSnapshot = typeof enrollment.competition_snapshot === 'string'
        ? JSON.parse(enrollment.competition_snapshot)
        : enrollment.competition_snapshot || {};

      const userSnapshot = typeof enrollment.user_snapshot === 'string'
        ? JSON.parse(enrollment.user_snapshot)
        : enrollment.user_snapshot || {};

      return {
        ...mapped,
        status: (mapped.status as Enrollment['status']) || 'pending',
        competitionSnapshot: {
          title: competitionSnapshot.title || '',
          examDate: competitionSnapshot.exam_date || competitionSnapshot.examDate || '',
          enrollmentFee: competitionSnapshot.enrollment_fee || competitionSnapshot.enrollmentFee || 0,
        },
        userSnapshot: {
          name: userSnapshot.name || '',
          email: userSnapshot.email || '',
          grade: userSnapshot.grade || 0,
        },
      };
    });
  },
};

// Extended response type that includes razorpayKeyId
declare module '@/types/enrollment' {
  interface CreateEnrollmentResponse {
    razorpayKeyId?: string;
  }
}
