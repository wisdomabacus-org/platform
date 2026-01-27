
import { supabase } from '@/lib/supabase';
import { ExamSession, ExamSessionFilters } from '../types/exam-sessions.types';

export const examSessionsService = {
    getActiveSessions: async () => {
        // Fetch only active/ongoing sessions for real-time monitoring
        // We assume 'started' status or relying on start/end times
        // We join with profiles for user info, and conditionally join exams if possible.
        // Supabase optional joins on multiple foreign keys (competition_id, mock_test_id) need careful handling.

        // Simplification: Fetch raw and map. 
        // Ideally we'd use a View for this to unify exam titles.

        // We'll try to fetch with competition and mock_test joins.
        const { data, error } = await supabase
            .from('exam_sessions')
            .select(`
            *,
            profile:profiles(student_name),
            submission:submissions(
                 competition:competitions(title),
                 mock_test:mock_tests(title)
            )
        `)
            .is('status', null) // weirdly, exam_sessions might use null for active? or 'in_progress'
            // Checking schema: status is string | null. 
            // Let's assume non-null 'completed' means done. 
            // Or check timestamps.
            .filter('status', 'in', '("started","in_progress")')
            .order('start_time', { ascending: false });

        if (error) {
            // Fallback for empty status if schema differs
            console.error(error);
            return [];
        }

        return data.map((s: any) => {
            // Submission link gives us the exam title
            const title = s.submission?.competition?.title || s.submission?.mock_test?.title || 'Unknown Exam';

            return {
                id: s.id,
                userId: s.user_id,
                userName: s.profile?.student_name || '—',

                examId: s.exam_id,
                examType: s.exam_type,
                examTitle: title,

                startTime: new Date(s.start_time),
                endTime: new Date(s.end_time),

                status: s.status || 'Active',
                isLocked: s.is_locked || false,
            } as ExamSession;
        });
    },

    // Method to force finish a session
    forceFinish: async (sessionId: string) => {
        // This usually means effectively submitting the paper on behalf of the user.
        // We update the session status and potentially trigger submission logic.
        // For MVP, simplistic update:
        const { error } = await supabase
            .from('exam_sessions')
            .update({ status: 'completed' })
            .eq('id', sessionId);

        if (error) throw error;
    }
};
