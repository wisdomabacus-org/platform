
import { supabase } from '@/lib/supabase';
import { Submission, SubmissionFilters, LeaderboardRow } from '../types/results.types';

export const resultsService = {
    // Existing methods for Competitions Results
    getCompetitions: async () => {
        // Fetch competitions to show status
        const { data, error } = await supabase
            .from('competitions')
            .select(`*, enrolled_count:enrollments(count)`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    getLeaderboard: async (competitionId: string): Promise<LeaderboardRow[]> => {
        const { data, error } = await supabase
            .from('submissions')
            .select(`
                id,
                score,
                rank,
                exam_snapshot,
                profile:profiles(student_name)
            `)
            .eq('competition_id', competitionId)
            .not('score', 'is', null)
            .order('score', { ascending: false });

        if (error) throw error;

        return data.map((entry: any, index: number) => ({
            id: entry.id,
            studentName: entry.profile?.student_name || 'Unknown',
            score: entry.score,
            rank: entry.rank || index + 1,
            grade: entry.exam_snapshot?.grade || 0,
        }));
    },

    publishResults: async (competitionId: string) => {
        const { data, error } = await supabase
            .from('competitions')
            .update({ status: 'completed' }) // MVP toggle
            .eq('id', competitionId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // New methods for Submissions Dashboard
    getAllSubmissions: async (filters: SubmissionFilters = {}) => {
        const { status, examType, dateRange, page = 0, limit = 10 } = filters;

        let query = supabase
            .from('submissions')
            .select(`
                *,
                profile:profiles(student_name),
                competition:competitions(title),
                mock_test:mock_tests(title)
            `, { count: 'exact' });

        if (status) {
            query = query.eq('status', status);
        }

        if (examType) {
            query = query.eq('exam_type', examType);
        }

        if (dateRange?.from) {
            query = query.gte('submitted_at', dateRange.from.toISOString());
        }
        if (dateRange?.to) {
            query = query.lte('submitted_at', dateRange.to.toISOString());
        }

        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('submitted_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return {
            data: (data || []).map((s: any) => ({
                id: s.id,
                userId: s.user_id,
                userName: s.profile?.student_name || '—',
                examType: s.exam_type,
                examId: s.competition_id || s.mock_test_id,
                examTitle: s.competition?.title || s.mock_test?.title || 'Unknown',
                score: s.score || 0,
                totalQuestions: s.total_questions || 0,
                timeTaken: s.time_taken || 0,
                status: s.status || 'unknown',
                submittedAt: s.submitted_at ? new Date(s.submitted_at) : new Date(s.created_at),
                startedAt: new Date(s.started_at),
            })) as Submission[],
            total: count || 0,
            page,
            limit
        };
    }
};
