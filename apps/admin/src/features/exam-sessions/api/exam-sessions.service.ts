
import { supabase } from '@/lib/supabase';
import { ExamSession, ExamSessionFilters } from '../types/exam-sessions.types';

export const examSessionsService = {
    getActiveSessions: async (filters: ExamSessionFilters = {}) => {
        const { status, page = 0, limit = 20 } = filters;

        // Use a simpler query if specific session monitoring is needed.
        // Joining through submissions to get titles.
        let query = supabase
            .from('exam_sessions')
            .select(`
                *,
                profile:profiles(student_name),
                submission:submissions(
                    competition:competitions(title),
                    mock_test:mock_tests(title)
                )
            `, { count: 'exact' });

        if (status && status !== 'active') {
            query = query.eq('status', status);
        } else {
            // Default active statuses
            query = query.filter('status', 'in', '("started","in_progress")');
        }

        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('start_time', { ascending: false })
            .range(from, to);

        if (error) {
            console.error(error);
            return { data: [], total: 0 };
        }

        const mapped = (data || []).map((s: any) => {
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
                status: s.status || 'active',
                isLocked: s.is_locked || false,
            } as ExamSession;
        });

        return {
            data: mapped,
            total: count || 0,
            page,
            limit
        };
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
